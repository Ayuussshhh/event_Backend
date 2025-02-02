import nodemailer from 'nodemailer';

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send ticket email
export const sendTicketEmail = (email, event) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Your Ticket for ${event.name}`,
    text: `Thank you for purchasing a ticket for ${event.name} on ${event.date}.`,
    html: `<p>Thank you for purchasing a ticket for <strong>${event.name}</strong> on ${event.date}.</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log('Email sent: ' + info.response);
  });
};