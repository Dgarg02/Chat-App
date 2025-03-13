import mongoes from "mongoose"

export const connectDB = async () =>{
    try {
        const conn = await mongoes.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection error:`, error)
    }
};