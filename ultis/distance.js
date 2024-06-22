import axios from "axios";
import geolib from 'geolib'
import createError from "./createError.js";
const nominatimApiUrl = 'https://nominatim.openstreetmap.org/search';

const getLocationCoordinates = async (locationName) => {
  try {
    const response = await axios.get(nominatimApiUrl, {
      params: {
        q: locationName,
        format: 'json',
      },
    });

    if (response.data.length > 0) {
      const location = response.data[0];
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } else {
      return createError(400, `${location} là địa chỉ không chính xác!`)
    }
  } catch (error) {
    return createError(400, `${location} địa chỉ không chính xác!`);
  }
};

export const distance = async(location1, location2) =>{
    try {
        let c1 =await getLocationCoordinates(location1);
        let c2 =await getLocationCoordinates(location2);
        if(c1 instanceof Error ) return c1;
        if(c2 instanceof Error) return c2;
        const kc = geolib.getDistance(c1, c2)
        return kc;
    } catch (error) {
        return createError(400, 'Địa chỉ không chính xác!')
    }
}
