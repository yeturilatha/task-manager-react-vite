const isProduction = import.meta.env.PROD

//  LOCAL STORAGE HELPERS
const getLocalTasks = () => {
  return JSON.parse(localStorage.getItem("tasks") || "[]")
}

const saveLocalTasks = (tasks: any[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

export const loginAPI = async (data: any) => {
  if (isProduction) {
    // PRODUCTION LOGIN (no MSW)
    if (data.username === "test" && data.password === "test123") {
      return { token: "fake-jwt-token" }
    }
    throw new Error("Login failed")
  }

  //  DEV / TEST (MSW)
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Login failed")

  return res.json()
}


export const getTasksAPI = async () => {
  if (isProduction) {
    return getLocalTasks()
  }

  const res = await fetch("/tasks")
  return res.json()
}

export const addTaskAPI = async (task: any) => {
  if (isProduction) {
    const tasks = getLocalTasks()
    const updated = [...tasks, task]
    saveLocalTasks(updated)
    return task
  }

  const res = await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })

  return res.json()
}

export const updateTaskAPI = async (task: any) => {
  if (isProduction) {
    const tasks = getLocalTasks()

    const updated = tasks.map((t: any) =>
      t.id === task.id ? task : t
    )

    saveLocalTasks(updated)
    return task
  }

  const res = await fetch(`/tasks/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })

  return res.json()
}


export const deleteTaskAPI = async (id: string) => {
  if (isProduction) {
    const tasks = getLocalTasks()

    const updated = tasks.filter((t: any) => t.id !== id)

    saveLocalTasks(updated)
    return
  }

  await fetch(`/tasks/${id}`, {
    method: "DELETE",
  })
}