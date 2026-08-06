"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
require("./models"); // ensures all models + associations are registered before sync
async function start() {
    await (0, database_1.connectDatabase)();
    // In development, sync() keeps the schema up to date without writing
    // migrations for every change. Once the schema stabilizes (or before
    // deploying), switch to `sequelize-cli` migrations and remove this.
    if (env_1.env.NODE_ENV === 'development') {
        await database_1.sequelize.sync({ alter: true });
        console.log('Database synced (dev mode)');
    }
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.PORT, () => {
        console.log(`TrustLend API listening on http://localhost:${env_1.env.PORT}`);
        console.log(`Health check: http://localhost:${env_1.env.PORT}/health`);
        console.log(`API base:     http://localhost:${env_1.env.PORT}/api/${env_1.env.API_VERSION}`);
    });
}
start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map