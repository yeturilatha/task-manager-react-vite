import { http, HttpResponse } from "msw";

// 🔥 LOAD FROM LOCALSTORAGE
let tasks: any[] = JSON.parse(localStorage.getItem("tasks") || "[]");

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const handlers = [
  // LOGIN
  http.post("http://localhost:5173/login", async ({ request }) => {
    const body: any = await request.json();

    if (body.username === "test" && body.password === "test123") {
      return HttpResponse.json({ token: "fake-jwt-token" });
    }

    return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }),

  // GET TASKS
  http.get("http://localhost:5173/tasks", () => {
    return HttpResponse.json(tasks);
  }),

  // ADD TASK
  http.post("http://localhost:5173/tasks", async ({ request }) => {
    const newTask: any = await request.json();

    tasks.push(newTask);
    saveTasks(); // ✅ persist

    return HttpResponse.json(newTask);
  }),

  // UPDATE TASK
  http.put("http://localhost:5173/tasks/:id", async ({ params, request }) => {
    const updated: any = await request.json();

    tasks = tasks.map((t) =>
      t.id === params.id ? updated : t
    );

    saveTasks(); // ✅ persist

    return HttpResponse.json(updated);
  }),

  // DELETE TASK
  http.delete("http://localhost:5173/tasks/:id", ({ params }) => {
    tasks = tasks.filter((t) => t.id !== params.id);

    saveTasks(); // ✅ persist

    return HttpResponse.json({ success: true });
  }),
];