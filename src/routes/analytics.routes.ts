import express from 'express';
import { getEventAnalytics, getCreatorAnalytics } from '../controllers/analytics.controller';

const router = express.Router();

router.get('/events/:eventId', getEventAnalytics);
router.get('/creators/:creatorId', getCreatorAnalytics);

export default router;
