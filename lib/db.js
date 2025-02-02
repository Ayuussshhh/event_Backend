import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI) {
            console.error('Error: MONGODB_URI is not defined in .env file.');
            return;
        }

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection error:', error);
        process.exit(1); // Optional: Exit the process if the connection fails
    }
};
