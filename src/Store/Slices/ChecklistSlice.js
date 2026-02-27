import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPayrollOpsTasks } from "../../Pages/PayrollOpsChecklist/PayrollChecklistService";

export const fetchPayrollOpsTasks = createAsyncThunk(
    'ChecklistSlice/fetchPayrollOpsTasks',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getPayrollOpsTasks();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    tasks: [],
    loading: false,
    error: null,
};

const ChecklistSlice = createSlice({
    name: "ChecklistSlice",
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload;
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action) => {
            const index = state.tasks.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload);
        },
        toggleTaskStatus: (state, action) => {
            const task = state.tasks.find(t => t.id === action.payload);
            if (task) {
                task.status = task.status === 'completed' ? 'pending' : 'completed';
            }
        },
        resetChecklistStore: () => initialState,
        clearTasks: (state) => {
            state.tasks = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayrollOpsTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayrollOpsTasks.fulfilled, (state, action) => {
                state.loading = false;
                // Set the fetched tasks into the store:
                state.tasks = action.payload;
            })
            .addCase(fetchPayrollOpsTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setTasks, addTask, updateTask, deleteTask, toggleTaskStatus, resetChecklistStore, clearTasks } = ChecklistSlice.actions;
export default ChecklistSlice.reducer;
