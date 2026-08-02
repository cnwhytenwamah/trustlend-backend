import { Server, Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { verifyAccessToken } from '../utils/jwt';
import { env } from '../config/env';
import { setIO } from './emitter';
import { messageService, assertParticipant } from '../services/message.service';

interface SocketAuthData {
  userId: string;
  role: string;
}

// Passing SocketAuthData as the 4th generic (SocketData) types
// socket.data correctly on every socket from this server, without
// needing a `declare module` augmentation (which conflicts with
// socket.io's own internal SocketData type if you try to redeclare
// `data` directly).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppServer = Server<any, any, any, SocketAuthData>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppSocket = Socket<any, any, any, SocketAuthData>;

/**
 * Called once from server.ts, after the HTTP server is created but before
 * it starts listening. Mirrors the REST API's auth: same JWT, same
 * verifyAccessToken — a socket connection is just another way to
 * authenticate as the same user.
 *
 * Client connects with:
 *   io(url, { auth: { token: accessToken } })
 */
export function initSockets(httpServer: HttpServer): AppServer {
  const io: AppServer = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Missing auth token'));

    try {
      const payload = verifyAccessToken(token);
      socket.data = { userId: payload.userId, role: payload.role };
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: AppSocket) => {
    const { userId } = socket.data;

    // Every socket for this user joins their personal room — lets
    // message.service.ts notify them regardless of which conversation
    // (if any) they currently have open, or how many tabs/devices they
    // have connected.
    socket.join(`user:${userId}`);

    socket.on('conversation:join', async (payload: { conversationId: string }, ack?: (res: unknown) => void) => {
      try {
        await assertParticipant(userId, payload.conversationId);
        socket.join(`conversation:${payload.conversationId}`);
        ack?.({ success: true });
      } catch (err) {
        ack?.({ success: false, message: err instanceof Error ? err.message : 'Failed to join' });
      }
    });

    socket.on('conversation:leave', (payload: { conversationId: string }) => {
      socket.leave(`conversation:${payload.conversationId}`);
    });

    socket.on(
      'message:send',
      async (payload: { conversationId: string; body: string }, ack?: (res: unknown) => void) => {
        try {
          const message = await messageService.sendMessage(userId, payload.conversationId, payload.body);
          ack?.({ success: true, data: message });
        } catch (err) {
          ack?.({ success: false, message: err instanceof Error ? err.message : 'Failed to send message' });
        }
      },
    );

    socket.on('conversation:read', async (payload: { conversationId: string }, ack?: (res: unknown) => void) => {
      try {
        await messageService.markConversationRead(userId, payload.conversationId);
        ack?.({ success: true });
      } catch (err) {
        ack?.({ success: false, message: err instanceof Error ? err.message : 'Failed to mark read' });
      }
    });

    // Typing indicators are relay-only — never persisted, just forwarded
    // to whoever else is currently in the conversation room.
    socket.on('typing:start', (payload: { conversationId: string }) => {
      socket.to(`conversation:${payload.conversationId}`).emit('typing:start', { userId, ...payload });
    });
    socket.on('typing:stop', (payload: { conversationId: string }) => {
      socket.to(`conversation:${payload.conversationId}`).emit('typing:stop', { userId, ...payload });
    });
  });

  setIO(io);
  return io;
}
