import Express from 'express';
import userRouter from './routers/index.js';
import cors from 'cors';
import mongoose from 'mongoose';
const PORT = process.env.PORT;
const app = Express();
(async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDb connected and DB host: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log("Error in connecting database", error);
    }
})();
app.use(cors())
    .use(Express.json())
    .use('/auth', userRouter);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
