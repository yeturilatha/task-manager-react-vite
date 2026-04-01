import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";



type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
};

type TaskState = {
  tasks: Task[];
};

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },

    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) state.tasks[index] = action.payload;
    },
    setTasks: (state, action) => {
  state.tasks = action.payload;
},

    toggleStatus: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.status =
          task.status === "pending" ? "completed" : "pending";
      }
    },

   
  },
});

export const {
  addTask,
  deleteTask,
  updateTask,
  toggleStatus,
  setTasks,
} = taskSlice.actions;

export default taskSlice.reducer;