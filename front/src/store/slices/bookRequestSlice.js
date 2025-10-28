import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const appURL = import.meta.env.VITE_APP_URL;

const bookRequestSlice = createSlice({
  name: "bookRequest",
  initialState: {
    loading: false,
    error: null,
    message: null,
    requests: []
  },
  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setRequests, setLoading, setError } = bookRequestSlice.actions;

// Thunk for creating a book request
export const createBookRequest = (bookId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(
      `${appURL}/api/v1/book-requests/request/${bookId}`,
      {},
      { withCredentials: true }
    );
    toast.success(response.data.message);
    dispatch(setLoading(false));
  } catch (error) {
    const message = error.response?.data?.message || "Failed to reserve book";
    dispatch(setError(message));
    toast.error(message);
  }
};

export default bookRequestSlice.reducer;