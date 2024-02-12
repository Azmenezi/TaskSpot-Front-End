const { instance } = require("..");

exports.login = async (userInfo) => {
  const res = await instance.post("/auth/login", userInfo);
  return res.data;
};
exports.register = async (userInfo) => {
  const res = await instance.post("/auth/register", userInfo);
  return res.data;
};

exports.checkUsername = async (username) => {
  const res = await instance.put(`/auth/username`, { username });
  return res.data;
};
