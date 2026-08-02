import { Server } from 'socket.io';

/**
 * Thin indirection layer so message.service.ts can push real-time events
 * without importing socket.ts directly (which itself needs to import
 * message.service.ts to handle incoming socket events — a straight
 * import in both directions would be circular).
 *
 * socket.ts calls setIO() once at startup; everything else just calls
 * emitToUser/emitToConversation without needing to know whether sockets
 * are even initialized yet (no-ops safely if called before/without setIO).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ioInstance: Server<any, any, any, any> | null = null;

export function setIO(io: Server<any, any, any, any>): void {
  ioInstance = io;
}

export function emitToUser(userId: string, event: string, payload: unknown): void {
  ioInstance?.to(`user:${userId}`).emit(event, payload);
}

export function emitToConversation(conversationId: string, event: string, payload: unknown): void {
  ioInstance?.to(`conversation:${conversationId}`).emit(event, payload);
}
