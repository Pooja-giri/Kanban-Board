import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createTaskApi,
  deleteTaskApi,
  getTasks,
  updateTaskApi,
} from "../../services/taskService";

/*
  GET ALL TASKS
*/
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      return await getTasks();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  CREATE TASK
*/
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      return await createTaskApi(taskData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  UPDATE TASK
*/
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, ...taskData }, { rejectWithValue }) => {
    try {
      return await updateTaskApi(id, taskData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
  DELETE TASK
*/
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteTaskApi(taskId);

      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  hasLoaded: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH TASKS
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
  state.loading = false;
  state.tasks = action.payload;
  state.hasLoaded = true;
})
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE TASK
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE TASK
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE TASK
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;

        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearTaskError,
} = taskSlice.actions;

export default taskSlice.reducer;
