import { Op } from "sequelize"
import createError from "../../ultis/createError.js"
import db from "../Entitys/index.js"

export const createQuestionService = async(data, id, hotelId)=>{
    try {
        const user = await db.user.findOne({
            where : {
                id
            },
            include : [
                {
                    model : db.customer,
                }
            ]
        })
        const question = await db.question.create({
            question : data.question,
            CustomerId : user.Customer.id,
            HotelId : hotelId
        })
        if(!question) return createError(400, 'Đặt câu hỏi không thành công!')
        return question;
    } catch (error) {
        return error;
    }
}
export const getQuestionByHotelService = async(id)=>{
    try {
        const question = await db.question.findAll({
            where : {
                HotelId : id
            },
            include : [
                {
                    model : db.feedBack,
                    where : {
                        id : {
                            [Op.not] : null
                        }
                    }
                },
                {
                    model : db.customer,
                    include : [{
                        model : db.user,
                        attributes : ['name', 'avatar']
                    }]
                }
            ]
        })
        return question;
    } catch (error) {
        return error;
    }
}