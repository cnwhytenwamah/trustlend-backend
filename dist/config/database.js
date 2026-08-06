"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.connectDatabase = connectDatabase;
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
exports.sequelize = new sequelize_1.Sequelize(env_1.env.DB_NAME, env_1.env.DB_USER, env_1.env.DB_PASSWORD, {
    host: env_1.env.DB_HOST,
    port: env_1.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: env_1.env.DB_SSL
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
        : {},
    define: {
        underscored: true, // created_at / updated_at instead of createdAt / updatedAt
        timestamps: true,
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
async function connectDatabase() {
    try {
        await exports.sequelize.authenticate();
        console.log('PostgreSQL connection established');
    }
    catch (error) {
        console.error('Unable to connect to PostgreSQL:', error);
        process.exit(1);
    }
}
//# sourceMappingURL=database.js.map