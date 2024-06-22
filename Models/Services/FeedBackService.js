import { Op, where } from "sequelize";
import createError from "../../ultis/createError.js";
import db from "../Entitys/index.js";
export const createFeedBackService = async(idQuestion, feedback) =>{
    try {
        console.log(idQuestion, feedback)
        const createFeedBack = await db.feedBack.create({
            QuestionId : idQuestion,
            feedback
        });
        if(!createFeedBack) return createError(400, 'Phản hồi không thành công!');
        return {
            message : 'Phản hồi thành công!',
            feedBack : createFeedBack
        }
    } catch (error) {
        return error;
    }
}

export const updateFeedBackService = async(id, desc) =>{
    try {
        const updateFeedBack = await db.feedBack.update({
            desc
        },{
            where : {id}
        })
        if(updateFeedBack[0] === 0) return createError(400, 'Chỉnh sửa không thành công!');
        return {
            message : 'Chỉnh sửa thành công!'
        }
    } catch (error) {
        
    }
}
export const deleteQuestionServices = async(id) =>{
    try {
        await db.question.destroy({
            where : {
                id : {
                    [Op.in] : id
                }
            }
        })
        return {
            messgae : "Đã xoá thành công!"
        }
    } catch (error) {
        return(error);
    }
}