"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = getParam;
const AppError_1 = require("./AppError");
function getParam(req, key) {
    const value = req.params[key];
    if (typeof value !== "string") {
        throw new AppError_1.AppError(`Invalid or missing parameter: ${key}`, 400);
    }
    return value;
}
//# sourceMappingURL=getParam.js.map