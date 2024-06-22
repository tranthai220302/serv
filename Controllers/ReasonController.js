import { createReasonService, getReasonByDateService, getReasonTeacherService, getReasonsService } from "../Models/Services/ReasonService.js";

export const createReason = async(req, res, next) =>{
    try {
        const reason = await createReasonService(req.body, req.id);
        if(reason instanceof Error) return next(reason);
        return res.status(200).send(reason);
    } catch (error) {
        next(error);
    }
}

export const getReasonTeacher = async(req, res, next) => {
    try {
        const reasons = await getReasonTeacherService(req.id);
        if(reasons instanceof Error) return next(reasons);
        return res.status(200).send(reasons);
    } catch (error) {
        next(error);
    }
}

export const getReasonByDate= async(req, res, next) => {
    try {
        const reasons = await getReasonByDateService(req.query.date);
        if(reasons instanceof Error) return next(reasons);
        return res.status(200).send(reasons);
    } catch (error) {
        next(error);
    }
}
export const getReasons = async(req, res, next)=>{
    try {
        const reasons = await getReasonsService(req.params.isConfirm);
        if(reasons instanceof Error) return next(reasons);
        return res.status(200).send(reasons);
    } catch (error) {
        next(error);
    }
}