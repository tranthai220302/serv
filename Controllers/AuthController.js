import { 
    loginOwnerService,
    loginService, 
    registerService 
} from "../Models/Services/AuthService.js"

export const loginController = async(req, res, next) =>{
    try {
        const data = req.body;
        const token = await loginService(data.email, data.password)
        if (token instanceof Error) return next(token)
        return res.cookie('accessToken', token.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: 'www.harumi.store',
            path: "/",
        }).status(200).send(token.user)
    } catch (error) {
        next(error)
    }
}
export const registerController = async (req, res, next) =>{
    try {
        const data = req.body;
        console.log(data)
        const user = await registerService(data.email, data.password, data.confirmPassword);
        if (user instanceof Error) return next(user)
        return res.status(200).send(user)
    } catch (error) {
        next(error)
    }
}
export const logoutController = async(req, res, next) =>{
    try {
        return res.clearCookie( 'accessToken', {
            sameSite: "None",
            secure: true,
        }).status(200).send({
            message  : "Đăng xuất thành công!"
        })
    } catch (error) {
        next(error)
    }
}
export const loginOwnerController = async(req, res, next) =>{
    try {
        const data = req.body;
        const token = await loginOwnerService(data.email, data.password)
        console.log(token)
        if (token instanceof Error) return next(token)
        return res.cookie('accessToken', token.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: "/",
        }).status(200).send(token.user)
    } catch (error) {
        next(error)
    }
}

