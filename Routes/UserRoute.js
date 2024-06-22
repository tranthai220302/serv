import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { changPass, deleteUser, get5HotelRevenueHigh, getCustomer, getInforAdmin, getUserById, revenueAdmin, revenueCurrentDate, updateUser } from '../Controllers/UserController.js';
const routerUser = express.Router()

routerUser.put('/update/:id', verifyjson, updateUser)
routerUser.get('/:id', verifyjson, getUserById)
routerUser.put('/changePass/:id', verifyjson, changPass)
routerUser.delete('/delete/:id', verifyjson, deleteUser)
routerUser.get('/admin/infor', verifyjson, getInforAdmin)
routerUser.get('/admin/hotelHigh', verifyjson, get5HotelRevenueHigh)
routerUser.get('/admin/revenue/currentDate', verifyjson, revenueCurrentDate)
routerUser.post('/admin/revenue', verifyjson, revenueAdmin)
routerUser.get('/list/customer', verifyjson, getCustomer)

export default routerUser;