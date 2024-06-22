import createError from "../ultis/createError.js";
import { createFeedBackService,  deleteQuestionServices, updateFeedBackService } from "../Models/Services/FeedBackService.js";
export const createFeedBack = async(req, res, next) =>{
    try {
        if(req.idRole !== 2) return createError(400, 'Bạn không có quyền này!');
        const feedBack = await createFeedBackService(req.params.id, req.body.feedback);
        if(feedBack instanceof Error) return next(feedBack);
        res.status(200).send(feedBack)
    } catch (error) {
        next(error);
    }
}

export const updateFeedBack = async(req, res, next) =>{
    try {
        if(req.idRole !== 2) return createError(400, 'Bạn không có quyền này!');
        const feedBack = await updateFeedBackService(req.params.id, req.body.desc);
        if(feedBack instanceof Error) return next(feedBack); 
        res.status(200).send(feedBack)
    } catch (error) {
        next(error)
    }
}
export const deleteQuestion = async(req, res, next) =>{
    try {
        if(req.idRole !== 2 && req.idRole !== 3) return next(createError(400, 'Bạn không có quyền này!'))
        console.log(req.body)
        const message = await deleteQuestionServices(req.body.id);
        if(message instanceof Error) return next(message);
        return res.status(200).send(message)
    } catch (error) {
        next(error);
    }
}