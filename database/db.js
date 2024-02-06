import mongoose from "mongoose";


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "todo-practice"
        });
        console.log(`Connected with db at ${process.env.MONGO_URI} `)
    } catch (error) {
        console.log(error);
        console.log('error occurred to connect with')
    }
}
export default connectDb;