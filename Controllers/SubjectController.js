import { getSubjectsService } from "../Models/Services/SubjectService.js";

export const getSubjects = async(req, res, next) => {
    try {
        const subjects = await getSubjectsService();
        if(subjects instanceof Error) return next(subjects);
        return res.status(200).send(subjects);
    } catch (error) {
        next(error);
    }
}