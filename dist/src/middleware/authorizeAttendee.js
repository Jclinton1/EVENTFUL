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
exports.authorizeAttendee = void 0;
const event_1 = __importDefault(require("../models/event")); // Adjust the import path as needed
const authorizeAttendee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const eventId = req.params.id;
        const event = yield event_1.default.findById(eventId).populate('creator', 'name').populate('attendees', 'name');
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.creator.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && !event.attendees.some(attendee => { var _a; return attendee.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); })) {
            return res.status(403).json({ error: 'Not authorized to access this event' });
        }
        req.event = event;
        next();
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.authorizeAttendee = authorizeAttendee;
