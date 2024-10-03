import { Router } from 'express';
import { createConcert, getConcert, getConcerts, removeConcert, updateConcert } from '../controllers/concert.js';
import { authMiddleware } from '../middlewares/index.js';
const concertRouter = Router();
concertRouter
    .get('/', getConcerts)
    .get('/:id', getConcert)
    .post('/', authMiddleware, createConcert)
    .put('/:id', authMiddleware, updateConcert)
    .delete('/:id', authMiddleware, removeConcert);
export default concertRouter;
