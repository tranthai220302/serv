import { Op } from "sequelize";
import createError from "../../ultis/createError.js"
import db from "../Entitys/index.js"
export const getCategoryItemService = async(id)=>{
    try {
        const category = await db.categoryItem.findAll({
            include : [
                {
                    model : db.item,
                    include : [
                        {
                            model : db.room,
                            as : 'Room',
                            attributes : ['name'],
                            where : {
                                HotelId : id
                            }
                        }
                    ]
                }
            ]
        })
        if(category.length == 0) return createError(400, 'Không tìm thấy tiện nghi');
        return category
    } catch (error) {
        return error
    }
}
export const getItemByCategoryService = async(id) =>{
    try {
        const data = await db.item.findAll({
            include : [
                {
                    model : db.categoryItem,
                    where : {
                        id : id
                    }
                }
            ]
        })
        return data;
    } catch (error) {
        return error;
    }
}
export const getItemByCategorysService = async()=>{
    try {
        const category = await db.categoryItem.findAll({
            where : {
                id : {
                    [Op.not] : 1
                }
            },
            include : [
                {
                    model : db.item,
                }
            ]
        })
        if(category.length == 0) return createError(400, 'Không tìm thấy tiện nghi');
        return category
    } catch (error) {
        return error
    }
}


