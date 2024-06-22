
import { createQuestionService, getQuestionByHotelService } from "../Models/Services/QuestionService.js";

export const creatQueston = async(req, res, next) =>{
    try {
        const question = await createQuestionService(req.body, req.id, req.params.id);
        if(question instanceof Error) return next(question);
        return res.status(200).send(question);
    } catch (error) {
        next(error);
    }
}
export const getQuestionByHotel = async(req, res, next) =>{
    try {
        const question = await getQuestionByHotelService(req.params.id);
        if(question instanceof Error) return next(question);
        return res.status(200).send(question);
    } catch (error) {
        next(error);
    }
}