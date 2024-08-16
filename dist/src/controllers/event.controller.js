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
exports.getEvent = exports.deleteEvent = exports.updateEvent = exports.applyToEvent = exports.createEvent = void 0;
const event_1 = __importDefault(require("../models/event"));
// Create event
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }
        const { title, description, date, location } = req.body;
        const event = new event_1.default({
            title,
            description,
            date,
            location,
            creator: req.user.id,
        });
        yield event.save();
        res.status(201).json(event);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.createEvent = createEvent;
// Apply to attend event
const applyToEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const event = req.event;
        if (event.attendees.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(400).json({ error: 'You are already attending this event' });
        }
        event.attendees.push((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        yield event.save();
        res.status(200).json(event);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.applyToEvent = applyToEvent;
// Update event
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const eventId = req.params.id; // Event ID from route params
        const { title, description, date, location } = req.body;
        const event = yield event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.creator.toString() !== ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id)) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        yield event.save();
        res.status(200).json(event);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.updateEvent = updateEvent;
// Delete event
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const eventId = req.params.id; // Event ID from route params
        const event = yield event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.creator.toString() !== ((_d = req.user) === null || _d === void 0 ? void 0 : _d.id)) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        yield event_1.default.findByIdAndDelete(eventId);
        res.status(200).json({ message: 'Event deleted' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.deleteEvent = deleteEvent;
// Get event
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const eventId = req.params.id; // Event ID from route params
        const event = yield event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (!event.attendees.includes((_e = req.user) === null || _e === void 0 ? void 0 : _e.id)) {
            return res.status(403).json({ error: 'Not authorized to access this event' });
        }
        res.status(200).json(event);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getEvent = getEvent;
