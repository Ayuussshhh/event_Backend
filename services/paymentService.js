const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentSession = async (amount) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Event Ticket' },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: process.env.BASE_URL + '/success',
            cancel_url: process.env.BASE_URL + '/cancel',
        });
        return session.url;
    } catch (err) {
        console.error('Stripe Payment Error:', err.message);
        throw new Error('Payment session creation failed');
    }
};

module.exports = { createPaymentSession };
