import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  // Set the token in a cookie
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    maxAge: 3600000, // 1 hour in milliseconds
    secure: process.env.NODE_ENV === 'development', // Only send over HTTPS in production
    sameSite: 'strict', // Prevents CSRF attacks
  });
};