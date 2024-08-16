"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middleware/authentication");
const authorizeCreator_1 = require("../middleware/authorizeCreator");
const authorizeAttendee_1 = require("../middleware/authorizeAttendee");
const event_controller_1 = require("../controllers/event.controller");
const validateBody_1 = require("../validators/validateBody");
const eventValidation_1 = require("../validators/eventValidation");
const router = express_1.default.Router();
router.post('/', authentication_1.authenticate, (0, validateBody_1.validateBody)(eventValidation_1.createEventSchema), event_controller_1.createEvent);
router.put('/:id', authentication_1.authenticate, authorizeCreator_1.authorizeCreator, (0, validateBody_1.validateBody)(eventValidation_1.updateEventSchema), event_controller_1.updateEvent);
router.delete('/:id', authentication_1.authenticate, authorizeCreator_1.authorizeCreator, event_controller_1.deleteEvent);
router.get('./:id', authentication_1.authenticate, authorizeAttendee_1.authorizeAttendee, event_controller_1.getEvent);
router.post('/:id/apply', authentication_1.authenticate, authorizeAttendee_1.authorizeAttendee, event_controller_1.applyToEvent);
exports.default = router;
