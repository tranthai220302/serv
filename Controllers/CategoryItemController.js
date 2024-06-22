import { getCategoryItemService, getItemByCategoryService, getItemByCategorysService } from "../Models/Services/CategoryItemService.js";
import createError from "../ultis/createError.js"
export const getCategoryItem = async(req, res, next)=>{
    try {
        const category = await getCategoryItemService(req.params.id);
        if(category instanceof Error) return next(category);
        res.status(200).send(category);
    } catch (error) {
        next(error)
    }
}
export const getItemByCategory = async(req, res, next)=>{
    try {
        const category = await getItemByCategoryService(req.params.id);
        if(category instanceof Error) return next(category);
        res.status(200).send(category);
    } catch (error) {
        next(error)
    }
}
export const getItemByCategorys = async(req, res, next)=>{
    try {
        const category = await getItemByCategorysService();
        if(category instanceof Error) return next(category);
        res.status(200).send(category);
    } catch (error) {
        next(error)
    }
}


