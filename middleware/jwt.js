import jwt from 'jsonwebtoken'
import createError from '../ultis/createError.js';
import dotenv from 'dotenv'
dotenv.config()
export const verifyjson = (req, res, next) =>{
    try {
        const token = req.cookies.accessToken;
        if(!token) return next(createError(200, 'Bạn cần phải đăng nhập!'))
        jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
            if(err){
                return next(err)
            }
            req.id = payload.id;
            req.idRole = payload.idRole
            next()
        });
    } catch (error) {
        next(error)
    }
}