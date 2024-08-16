import express from 'express';
import { authenticate } from '../middleware/authentication';
import { authorizeCreator } from '../middleware/authorizeCreator';
import { authorizeAttendee } from '../middleware/authorizeAttendee';
import { validateQRCode } from '../middleware/validateQrCode';
import { createEvent, updateEvent, deleteEvent, getEvent, getAllEvents, applyToEvent, accessEventWithQRCode } from '../controllers/event.controller';
import { validateBody } from '../validators/validateBody';
import { createEventSchema, updateEventSchema } from '../validators/eventValidation';

const router = express.Router();

router.post('/', authenticate, validateBody(createEventSchema), createEvent);
router.put('/:id', authenticate, authorizeCreator, validateBody(updateEventSchema), updateEvent);
router.delete('/:id', authenticate, authorizeCreator, deleteEvent);
router.get('./:slug', authenticate, authorizeAttendee, getEvent)
router.get('/all', authenticate, getAllEvents);
router.post('/:id/apply', authenticate, authorizeAttendee, applyToEvent)
router.post('/:id/access', authenticate, validateQRCode, accessEventWithQRCode);


export default router;
