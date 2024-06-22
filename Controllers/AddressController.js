import { getLocationPopularService, searchAdressHotelService } from "../Models/Services/AddressService.js";

export const getLocationPopular = async(req, res, next) =>{
    try {
        const location = await getLocationPopularService();
        if(location instanceof Error) return next(location);
        return res.status(200).send(location)
    } catch (error) {
        next(error);
    }
}
export const searchAddressHotel = async(req, res, next) =>{
    try {
        const found = await searchAdressHotelService(req.query.name);
        return res.status(200).send(found)
    } catch (error) {
        
    }
}