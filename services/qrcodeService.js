const QRCode = require('qrcode');

const generateQRCode = async (text) => {
    try {
        const qrCode = await QRCode.toDataURL(text);
        return qrCode;
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw new Error('Failed to generate QR code');
    }
};

module.exports = { generateQRCode };
