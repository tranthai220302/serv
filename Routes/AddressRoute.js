import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { getLocationPopular, searchAddressHotel } from '../Controllers/AddressController.js';
const routerAddress = express.Router()

routerAddress.get('/popular', getLocationPopular);
routerAddress.get('/search', searchAddressHotel)
export default routerAddress;