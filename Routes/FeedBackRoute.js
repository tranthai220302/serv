import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { createFeedBack, deleteQuestion, updateFeedBack } from '../Controllers/FeedBackController.js';
const routerFeedBack = express.Router()
routerFeedBack.post('/create/:id',verifyjson, createFeedBack);
routerFeedBack.post('/delete',verifyjson, deleteQuestion);
routerFeedBack.put('/update/:id',verifyjson, updateFeedBack)
export default routerFeedBack;