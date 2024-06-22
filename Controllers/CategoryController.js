import createError from "../ultis/createError.js"
import { 
    createCategoryService, deleteCategoryService, getCategorysService, updateCategoryService 
} from "../Models/Services/CategoryService.js";
import c from "config";
export const createCategory = async(req, res, next)=>{
    try {
        console.log(req.idRole)
        if(req.idRole !==2 && req.idRole !== 4) return next(createError(400, 'Bạn không có quyền này!'))
        const name = req.body.name;
        const category = await createCategoryService(name, req.body.img);
        if(category instanceof Error) return next(category);
        res.status(200).send(category);
    } catch (error) {
        next(error)
    }
}
export const getCategorys = async(req, res, next)=>{
    try {
        const categorys = await getCategorysService();
        if(categorys instanceof Error) return next(categorys);
        res.status(200).send(categorys)
    } catch (error) {
        next(error)
    }
}
export const deleteCategory = async(req, res, next)=>{
    try {
        if(req.idRole !==2 && req.idRole !== 4) return next(createError(400, 'Bạn không có quyền này!'))
        const id = req.params.idCategory;
        const delete_category = await deleteCategoryService(id);
        if(delete_category instanceof Error) return next(delete_category);
        res.status(200).send(delete_category)
    } catch (error) {
        next(error)
    }
}
export const updateCategory = async(req, res, next)=>{
    try {
        if(req.idRole !==2 && req.idRole !== 4) return next(createError(400, 'Bạn không có quyền này!'))
        const id = req.params.idCategory;
        const delete_category = await updateCategoryService(id, req.body.name, req.body.desc, req.body.img);
        if(delete_category instanceof Error) return next(delete_category);
        res.status(200).send(delete_category)
    } catch (error) {
        next(error)
    }
}

