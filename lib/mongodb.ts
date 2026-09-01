import mongoose from "mongoose"

let cached = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectDB() {
    if (cached.conn) return cached.conn

    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
        throw new Error("Add MONGODB_URI to .env.local")
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((m) => m)
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB
