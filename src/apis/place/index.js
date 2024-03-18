const { instance } = require("..");

exports.getNearbyPlaces = async (userLocation, userRadius) => {
  const res = await instance.put("/place/nearby", { userLocation, userRadius });
  return res.data;
};
