import nodemailer from 'nodemailer';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ' ',
        pass: ' '
    }
});

const sendNotification = async (to: string, message: string) => {
    await transporter.sendMail({
        from: '"Eventful" " "',
        to,
        subject: 'Event Reminder',
        text: message
    });
};

export default sendNotification;
