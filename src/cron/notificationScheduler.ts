import cron from 'node-cron';
import Event from '../models/event';
import User from '../models/users';
import sendNotification from '../utils/notificationService'; // Adjust path as needed

// Schedule a cron job to run daily
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find events that are scheduled for tomorrow
    const events = await Event.find({
        date: { $gte: tomorrow, $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) },
    });

    for (const event of events) {
        const users = await User.find({
            'reminders.events.eventId': event._id,
            'reminders.events.reminderDaysBefore': event.reminderDaysBefore
        });

        users.forEach(user => {
            sendNotification(user.email, `Reminder: ${event.title} is tomorrow.`);
        });
    }
});
