import { createSlice } from "@reduxjs/toolkit";
import axios from"axios"
import { toggleAddBookPopup } from "./popUpSlice";
import { toast } from "react-toastify";
const bookSlice=createSlice({
    name:"book",
    initialState:{
        loading:false,
        error:null,
        message:null,
        books:[],
    },
    reducers:{
        fetchBooksRequest(state){
            state.loading=true;
            state.error=null;
            state.message=null;
        },
        fetchBooksSuccess(state,action){
            state.loading=false;
            state.books=action.payload;
        },
        fetchBooksFailed(state,action){
            state.loading=false;
            state.error=action.payload;
            state.message=null;
        },
        addBookRequest(state){
            state.loading=true;
            state.error=null;
            state.message=null;
        },
        addBookSuccess(state,action){
            state.loading=false;
            state.message=action.payload
        },
        addBookFailed(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        resetBookSlice(state){
            state.error=null;
            state.message=null;
            state.loading=false;
        },
        // New reducers for delete book
        deleteBookRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
          },
          deleteBookSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
          },
          deleteBookFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
          }
    }
})

export const fetchAllBooks =()=>async(dispatch)=>{
    dispatch(bookSlice.actions.fetchBooksRequest());
    await axios.get("http://localhost:4000/api/v1/book/all",{withCredentials:true})
    .then(res=>{
        dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books))
    }).catch(err=>{
        const errorMessage = err.response?.data?.message || "Network error. Please try again.";
        dispatch(bookSlice.actions.fetchBooksFailed(errorMessage));
    });
};

export const addBook =(data)=>async(dispatch)=>{
    dispatch(bookSlice.actions.addBookRequest());
    await axios.post("http://localhost:4000/api/v1/book/admin/add",data,
        {withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })
    .then(res=>{
        dispatch(bookSlice.actions.addBookSuccess(res.data.message))
        toast.success(res.data.message);
        dispatch(toggleAddBookPopup());
    }).catch(err=>{
        dispatch(bookSlice.actions.addBookFailed(err.response.data.message));
    });
};

// New action creator for delete book
export const deleteBook = (bookId) => async (dispatch) => {
    dispatch(bookSlice.actions.deleteBookRequest());
    await axios.delete(`http://localhost:4000/api/v1/book/delete/${bookId}`, {
      withCredentials: true
    })
    .then(res => {
      dispatch(bookSlice.actions.deleteBookSuccess(res.data.message));
      toast.success(res.data.message);
      dispatch(fetchAllBooks()); // Refresh book list
    })
    .catch(err => {
      dispatch(bookSlice.actions.deleteBookFailed(err.response.data.message));
      toast.error(err.response.data.message);
    });
  };

export const resetBookSlice=()=>(dispatch)=>{
    dispatch(bookSlice.actions.resetBookSlice());
}

export default bookSlice.reducer;
