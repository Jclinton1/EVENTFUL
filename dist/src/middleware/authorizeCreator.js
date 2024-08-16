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
exports.authorizeCreator = void 0;
const event_1 = __importDefault(require("../models/event")); // Adjust the import path as needed
const authorizeCreator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.id; // Event ID passed as a route parameter
        const event = yield event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.creator.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        next();
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.authorizeCreator = authorizeCreator;
