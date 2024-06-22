import createError from "../../ultis/createError.js"
import db from "../Entitys/index.js"
export const createCategoryService = async(name, img)=>{
    try {
        const checkName = await db.category.findOne({
            where : {
                name
            }
        })
        console.log(checkName)
        if(checkName) return createError(400, 'Danh mục này đã tồn tại!')
        const category = await db.category.create({name, img})
        if(!category) return createError(400, 'Thêm danh mục khong thành công!')
        return category;
    } catch (error) {
        next(error)
    }
}
export const getCategorysService = async()=>{
    try {
        const category = await db.category.findAll();
        const numRoom = [];
        for(let i = 0; i < category.length; i++){
            const numItem = await db.room.count({
                where : {
                    CategoryId : category[i].id
                }
            })
            numRoom.push(numItem);
        }
        if(category.length === 0) return createError(400, 'Không tìm thấy các loại phòng!');
        return {
            data : category,
            numRoom
        };
    } catch (error) {
        return(error)
    }
}
export const deleteCategoryService = async(id)=>{
    try {
        console.log(id)
        const category = await db.category.findByPk(id)
        if(!category) return createError(400, 'Không tìm thấy danh mục!')
        const delete_category = await db.category.destroy({
            where:{id}
        })
        if(delete_category == 0) return createError(400, 'Xoá không thành công!')
        return{
            status: true,
            message: 'Xó dnh mục thành công!'
        }
    } catch (error) {
        return(error)
    }
}
export const updateCategoryService = async(id, name, desc, img)=>{
    try {
        const category = await db.category.findByPk(id)
        if(!category) return createError(400, 'Không tìm thấy danh mục!')
        const update = await db.category.update({
            name,
            desc,
            img
        },{where : {id}})
        if(update[0] === 0) return createError(400, 'Chỉnh sửa không thành công!')
        return{
            status: true,
            message: 'Chỉnh sửa thành công!'
        }
    } catch (error) {
        return(error)
    }
}

