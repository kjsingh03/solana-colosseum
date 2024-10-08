import { Router } from 'express';
import { googleLogin, googleLogout } from '../controllers/auth.js';
const userRouter = Router();
userRouter
    .post('/google', googleLogin)
    .delete('/google', googleLogout);
export default userRouter;
