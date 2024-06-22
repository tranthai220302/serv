import express from 'express'
import { 
    categoryRating,
    checkReview,
    createReview, deleteReview, getReviewsByHotel
} from '../Controllers/ReviewController.js';
import { verifyjson } from '../middleware/jwt.js';

const routerReview = express.Router()
routerReview.post('/create',verifyjson, createReview)
routerReview.get('/list/:id', getReviewsByHotel)
routerReview.delete('/delete/:id', verifyjson, deleteReview)
routerReview.get('/category', categoryRating)
routerReview.post('/check', verifyjson, checkReview)
export default routerReview;