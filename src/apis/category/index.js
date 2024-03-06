const { instance } = require("..");

exports.getCategories = async () => {
  const res = await instance.get("/category/");
  return res.data;
};
