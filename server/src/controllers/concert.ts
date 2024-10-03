import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Concert, User } from '../models/index.js';
import { CustomRequest } from '../interfaces/index.js';

export const createConcert = async (req: CustomRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const concert = new Concert(req.body);

        const user = await User.findOne({ email: req.email }).session(session);

        
        if (user) {
            if (!user.concertsCreated) {
                user.concertsCreated = [];
            }
            concert.createdBy = user?._id

            concert.email = (req.email as string)
            
            // @ts-ignore
            user.concertsCreated.push(concert._id);
            const response = await user.save({ session });
            
            const saveRes = await concert.save({session})
            await session.commitTransaction();
            session.endSession();

            res.status(201).json({ success: true, concert, message:"Concert created succesfully" });
        } else {
            res.status(404).json({ success: false, message: "Failed to authorize user" });
        }

    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        res.status(404).json({ success: false, msg: (err instanceof Error) ? err.message.split(':').pop() : 'Failed to list concert' });
    }
}

export const getConcerts = async (req: CustomRequest, res: Response) => {
    try {
        const concerts = await Concert.find();

        if (concerts) {
            res.status(201).json({ "success": true, concerts })
        } else {
            res.status(404).json({ "success": false, "message": "No concerts" });
        }

    } catch (err) {
        res.status(404).json({ success: false, msg: (err instanceof Error) ? err.message : 'Some error occurred' })
    }
}

export const getConcert = async (req: CustomRequest, res: Response) => {
    try {
        const concert = await Concert.findById(req.params.id);

        if (concert) {
            res.status(201).json({ "success": true, concert })
        } else {
            res.status(404).json({ "success": false, "message": "No concert" });
        }

    } catch (err) {
        res.status(404).json({ success: false, msg: (err instanceof Error) ? err.message : 'Some error occurred' })
    }
}

export const updateConcert = async (req: CustomRequest, res: Response) => {
    try {
        const id = req.params.id;
        let concert = await Concert.findById(id)
        if (concert) {
            concert = await Concert.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
            concert?.save()
                .then(() => { res.status(200).json({ "Success": true, "message": "concert updated successully", "concert": concert }) })
                .catch((err) => { res.status(404).json({ "Success": "false", "message": "Failed to save concert", "error": (err instanceof Error) ? err.message : 'Some error occurred' }) })
        }
        else {
            res.status(404).json({ "success": false, "message": "concert not found" })
        }

    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to update concert", err: err })
    }
}

export const removeConcert = async (req: CustomRequest, res: Response) => {
    try {
        const id = req.params.id;
        let concert = await Concert.findById(id)
        if (concert) {
            concert = await Concert.findByIdAndDelete(id)
            res.status(200).json({ "Success": true, "message": "concert deleted successfully", concert })
        }
        else {
            res.status(404).json({ "success": false, "message": "concert not found" })
        }
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to fetch concert" })
    }
}