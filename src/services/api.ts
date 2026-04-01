export const loginAPI = async (data: any) => {
  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 🔥 REQUIRED
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
};

export const getTasksAPI = async () => {
  const res = await fetch("/tasks");
  return res.json();
};

export const addTaskAPI = async (task: any) => {
  const res = await fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return res.json();
};

export const updateTaskAPI = async (task: any) => {
  const res = await fetch(`/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return res.json();
};
export const deleteTaskAPI = async (id: string) => {
  await fetch(`/tasks/${id}`, {
    method: "DELETE",
  });
};