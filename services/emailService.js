const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendTicketEmail = async (userEmail, ticketFilePath) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Your Event Ticket',
        text: 'Please find your event ticket attached.',
        attachments: [{ filename: 'ticket.pdf', path: ticketFilePath }],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Ticket email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

module.exports = { sendTicketEmail };
