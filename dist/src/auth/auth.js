"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const users_1 = __importDefault(require("../models/users"));
const jwt = require('jsonwebtoken');
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'your_jwt_secret');
            const user = yield users_1.default.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ error: 'Not authorized, user not found' });
            }
            req.user = user;
            next();
        }
        catch (err) {
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
});
exports.protect = protect;
