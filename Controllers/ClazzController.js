import { getListClazzService } from "../Models/Services/ClazzController.js";

export const getListClazz = async(req, res, next)=>{
    try {
        const list = await getListClazzService();
        if(list instanceof Error) return next(list);
        return res.status(200).send(list);
    } catch (error) {
        next(error);
    }
}