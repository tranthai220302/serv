import { categoryRatingServices, checkReviewService, createReviewService, deleteReviewService, getReviewsByHotelService,  updateReviewService } from "../Models/Services/ReviewService.js";
import createError from "../ultis/createError.js";

export const deleteReview = async(req, res, next) =>{
    try {
        const id = req.params.id;
        const delete_review = await deleteReviewService(id, req.id);
        if(delete_review instanceof Error) return next(delete_review);
        res.status(200).send(delete_review);
    } catch (error) {
        next(error);
    }
} 


export const createReview= async (req, res, next) =>{
    try {
        const data = req.body;
        const review = await createReviewService(data, req.id);
        if(review instanceof Error) return next(review);
        res.status(200).send(review);
    } catch (error) {
        next(error);
    }
} 
export const updateReview = async (req, res, next) =>{
    try {
        const idReview = req.params.id;
        const data = req.body;
        const review = await updateReviewService(idReview, data.desc, data.num_star, req.id);
        if(review instanceof Error) return next(review)
        res.status(200).send(review);
    } catch (error) {
        next(error)
    }
}

export const getReviewsByHotel = async(req, res, next) =>{
    try {
        const reviews = await getReviewsByHotelService(req.params.id, req.query.page, 3);
        if(reviews instanceof Error) return next(reviews);
        return res.status(200).send(reviews);
    } catch (error) {
        next(error)
    }
}
export const categoryRating = async(req, res, next) =>{
    try {
        const category = await categoryRatingServices();
        return res.status(200).send(category)
    } catch (error) {
        next(error)
    }
}
export const checkReview = async(req, res, next) =>{
    try {
        const data = req.body;
        const check = await checkReviewService(data, req.id);
        if(check instanceof Error) return next(check);
        return res.status(200).send(check)
    } catch (error) {
        next(error)
    }
}
