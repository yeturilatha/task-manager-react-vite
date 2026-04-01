import { useDispatch, useSelector } from "react-redux";
import {
  setTasks, 
  addTask,
  deleteTask,
  updateTask,
  toggleStatus,
} from "../features/tasks/taskSlice";
import { useState, useEffect } from "react";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

import {
  addTaskAPI,
  deleteTaskAPI,
  updateTaskAPI,
  getTasksAPI,
} from "../services/api";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  //  FIXED: Load tasks ONLY ONCE (no duplication)
  useEffect(() => {
    const loadTasks = async () => {
      const data = await getTasksAPI();
      dispatch(setTasks(data)); 
    };

    loadTasks();
  }, [dispatch]);

  // Add / Update
  const handleAddOrUpdate = async () => {
    if (!title) return;

    if (editId) {
      const updated = {
        id: editId,
        title,
        description,
        status: "pending",
      };

      await updateTaskAPI(updated);
      dispatch(updateTask(updated));
      setEditId(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title,
        description,
        status: "pending",
      };

      const saved = await addTaskAPI(newTask);
      dispatch(addTask(saved));
    }

    setTitle("");
    setDescription("");
  };

  const handleDelete = async (id: string) => {
    await deleteTaskAPI(id);
    dispatch(deleteTask(id));
  };

  const handleEdit = (task: any) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditId(task.id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Task Manager</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-4">

        {/* FORM */}
        <div className="bg-white p-3 rounded shadow mb-4 flex flex-col sm:flex-row gap-2">
          <input
            placeholder="Title"
            className="border p-2 flex-1 rounded text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Description"
            className="border p-2 flex-1 rounded text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleAddOrUpdate}
            className="bg-blue-600 text-white px-3 rounded text-sm"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* TASK LIST */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400 text-sm">
              No tasks available
            </p>
          ) : (
            tasks.map((task: any) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded shadow flex flex-col sm:flex-row justify-between items-center"
              >
                <div>
                  <h3
                    className={`font-semibold ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-gray-600 text-sm">
                    {task.description}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => dispatch(toggleStatus(task.id))}
                    className={`px-2 py-1 text-xs text-white rounded ${
                      task.status === "pending"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {task.status === "pending" ? "Done" : "Undo"}
                  </button>

                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;