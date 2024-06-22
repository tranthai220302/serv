import { 
    deleteUserService,
    updateUserService,
    getUserByIdService,
    changPassService,
    getInforAdminService,
    get5HotelRevenueHighService,
    getCustomerService,
    revenueCurrentDateService,
    revenueAdminService

} from "../Models/Services/UserService.js";
import { Op } from "sequelize";
import createError from "../ultis/createError.js";

export const updateUser = async(req, res, next) =>{
    try {
        const data = req.body;
        const id = req.params.id;
        if(req.id == parseInt(id) || req.idRole === 4){
            const user = await updateUserService(data, id);
            if(user instanceof Error) return next(user)
            return res.status(200).send(user)
        } else return next(createError(400, 'Bạn không thể chỉnh sửa thông tin của người khác !'))
    } catch (error) {
        next(error)
    }
}   
export const changPass = async(req, res, next) =>{
    try {
        const data = req.body;
        const id = req.params.id;
        if(req.id != parseInt(id)) return createError(400, 'Bạn không thể đổi mật khẩu của người khác')
        const pass = await changPassService(data, id);
        if(pass instanceof Error) return next(pass);
        return res.status(200).send(pass)
    } catch (error) {
        next(error)
    }
}
export const deleteUser = async(req, res, next) =>{
    try {
        if(req.idRole !== 4 && req.id !== parseInt(req.params.id)) return next(createError(400, 'Bạn không thể xoá tài khoản của người khác!'))
        const id = req.params.id;
        const deleteUser = await deleteUserService(id);
        if(deleteUser === true) return res.status(200).send('Xoá user thành công!')
        return next(createError(400, "Xoá không thành công!"))
    } catch (error) {
        next(error)
    }
}


export const getUserById = async(req, res, next) =>{
    try {
        const user = await getUserByIdService(req.params.id);
        if(user instanceof Error) return next(user)
        return res.status(200).send(user)
    } catch (error) {
        next(error)
    }
}
export const getInforAdmin = async(req, res, next) =>{
    try {
        if(req.idRole !== 3) return next(createError(400, 'Bạn không có quyền này!'))
        const data = await getInforAdminService();
        if(data instanceof Error) return next(data);
        return res.status(200).send(data)
    } catch (error) {
        next(error);
    }
}
export const get5HotelRevenueHigh = async (req, res, next) =>{
    try {
        if(req.idRole !== 3) return next(createError(400, 'Bạn không có quyền này!'))
        const data = await get5HotelRevenueHighService();
        if(data instanceof Error) return next(data);
        return res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
export const revenueCurrentDate = async(req, res ,next)=>{
    try {
        if(req.idRole !== 3) return next(createError(400, 'Bạn không có quyền này!'))
        const data = await revenueCurrentDateService();
        if(data instanceof Error) return next(data);
        return res.status(200).send(data)
    } catch (error) {
        next(error)
    }
} 
export const revenueAdmin = async(req, res ,next)=>{
    try {
        if(req.idRole !== 3) return next(createError(400, 'Bạn không có quyền này!'))
        const data = await revenueAdminService(req.body.dateStart, req.body.dateEnd);
        if(data instanceof Error) return next(data);
        return res.status(200).send(data)
    } catch (error) {
        next(error)
    }
} 
export const getCustomer = async (req, res, next) =>{
    try {
        if(req.idRole !== 3) return next(createError(400, 'Bạn không có quyền này!'))
        const data = await getCustomerService();
        if(data instanceof Error) return next(data);
        return res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
