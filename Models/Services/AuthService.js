import db from "../Entitys/index.js"
import { Op } from "sequelize"
import createError from "../../ultis/createError.js"
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const loginService = async (email, password) => {
    try {
        const checkEmail = await db.user.findOne({
            where: {
                [Op.and] : [
                    {email : email}
                ]
            },
            include : [
                {
                    model : db.teacher,
                    include : [
                        {
                            model : db.schoolClass
                        }
                    ]
                },
            ]
        });     
        if (!checkEmail) return createError(400, "Tài khoản không chính xác!");
        
        if (checkEmail.password) {
            const checkPass = await argon2.verify(checkEmail.password, password);
            if (!checkPass) return createError(400, "Mật khẩu không chính xác!");
        } else {
            return createError(400, "Đăng nhập không thành công");
        }
        delete checkEmail.dataValues.password 
        const token = jwt.sign({
            id: checkEmail.id,
            idRole : checkEmail.idRole,
        }, process.env.JWT_KEY);
        return {
            token,
            user : checkEmail
        };
        
    } catch (error) {
        return error;
    }
    
} 
export const registerService = async (email, password, confirmPassword) =>{
    try {
        const user = await db.user.findOne({
            where : {email}
        })
        if(user) return createError(400, "Email đã tồn tại!")
        if(password !== confirmPassword) return createError(400, 'Mật khẩu nhập lại không chính xác !')
        if(password.length <= 6) return createError(400, 'Mật khẩu phải lớn hơn 5 chữ !')
        const hassPass = await argon2.hash(password)
        const userRegister = await db.user.create({
            email,
            password : hassPass,
            idRole : 1
        })
        return userRegister;
    } catch (error) {
        return error;
    }
}
export const loginOwnerService = async (email, password) =>{
    try {
        const checkEmail = await db.user.findOne({
            where: {
                [Op.and] : [
                    {email : email},
                    {idRole : 2}
                ]
            },
            include : [
                {
                    model : db.address  
                },
                {
                    model : db.hotelOwner
                }
            ]
        });     
        if (!checkEmail) return createError(400, "Tài khoản không chính xác!");
        
        if (checkEmail.password) {
            const checkPass = await argon2.verify(checkEmail.password, password);
            if (!checkPass) return createError(400, "Mật khẩu không chính xác!");
        } else {
            return createError(400, "Đăng nhập không thành công");
        }
        delete checkEmail.dataValues.password 
        const token = jwt.sign({
            id: checkEmail.id,
            idRole : checkEmail.idRole,
        }, process.env.JWT_KEY);
        return {
            token,
            user : checkEmail
        };
    } catch (error) {
        return error;
    }
}
