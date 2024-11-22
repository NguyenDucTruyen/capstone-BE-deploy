import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = `mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.0`

async function connect() {
    try {
        await mongoose.connect(uri, {
            dbName: process.env.DB_NAME
        });
        console.log("Connect successfully!!!");
    } catch (error) {
        console.log(error);

        console.log("Connect failure!!!");
    }
}
export default { connect };