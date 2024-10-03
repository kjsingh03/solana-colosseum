import jwt from 'jsonwebtoken'
import { Request, Response } from 'express';
import { User } from '../models/index.js';
import * as Web3 from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

const jwtSecret = process.env.JWT_SECRET ?? '';

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (email) {
            let user = await User.findOne({ email })            
            if (user) {
                var token = jwt.sign({ email }, jwtSecret);
                user.token = token;
                user.save()
                    .then(async () => { res.status(201).json({ "success": true, "message": "User logged in successfully", user }) })
                    .catch((err: any) => { res.status(404).json({ "success": false, "message": "Failed to login", "error": err.message }) })
            }
            else {
                user = new User(req.body);

                var token = jwt.sign({ email }, jwtSecret);
                user.token = token;

                const mnemonic = bip39.generateMnemonic();

                const seed = await bip39.mnemonicToSeed(mnemonic);

                const seedBuffer = Buffer.from(seed).toString('hex');
                const path44Change = `m/44'/501'/0'/0'`;
                const derivedSeed = derivePath(path44Change, seedBuffer).key;

                const ownerKey = Web3.Keypair.fromSeed(derivedSeed).publicKey.toBase58();

                user.walletAddress = ownerKey;

                user.save()
                    .then(async () => { res.status(201).json({ "success": true, "message": "User created successfully", user, mnemonic, ownerKey }) })
                    .catch((err: any) => { res.status(404).json({ "success": false, "message": "Failed to signup", "error": err.message }) })
            }
        } else {
            res.status(404).json({ "success": false, "message": "Please enter email" })
        }

    } catch (error) {
        res.status(404).json({ "success": false, "message": error instanceof Error ? error.message : 'Failed to authenticate' })
    }
}

export const googleLogout = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (email) {
            let user = await User.findOne({ email })
            if (user) {
                user.token = '';
                user.save()
                    .then(async () => {
                        res.status(201).json({ "success": true, "message": "User logged out successfully", user })
                    })
                    .catch((err: any) => { res.status(201).json({ "success": false, "message": "Failed to logout", "error": err.message }) })
            }
            else {
                res.status(404).json({ "success": false, "message": "User Not found" })
            }
        } else {
            res.status(404).json({ "success": false, "message": "Please enter email" })
        }

    } catch (error) {
        res.status(404).json({ "success": false, "message": error instanceof Error ? error.message : 'Failed to authenticate' })
    }
}