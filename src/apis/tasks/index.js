const { instance } = require("..");

exports.addTasks = async (tasks) => {
  const res = await instance.post(`/reminder/bulk-create/`, tasks);
  return res.data;
};

exports.getMyTasks = async () => {
  const res = await instance.get("/reminder/");
  return res.data;
};

exports.getTasksByCategory = async (category) => {
  const res = await instance.get(`/reminder/by-category/${category}`);
  return res.data;
};
exports.markTasksAsDone = async (reminderIds) => {
  // tasks = [ "123","456"]
  const res = await instance.patch(`/reminder/done`, { reminderIds });
  return res.data;
};
exports.markUndoneTasks = async (reminderIds) => {
  const res = await instance.patch(`/reminder/undone`, { reminderIds });
  return res.data;
};
exports.bulkDeleteTasks = async (reminderIds) => {
  const res = await instance.put(`/reminder/bulkDelete`, { reminderIds });
  return res.data;
};
