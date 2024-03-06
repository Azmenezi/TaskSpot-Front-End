const { instance } = require("..");

exports.addTasks = async (tasks) => {
  const res = await instance.post(`/reminder/bulk-create/`, tasks);
  return res.data;
};
