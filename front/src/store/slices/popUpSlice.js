import { createSlice } from "@reduxjs/toolkit";

const popupSlice =createSlice({
    name:"popup",
    initialState:{
        settingPopup:false,
        addBookPopup:false,
        readBookPopup:false,
        recordBookPopup:false,
        returnBookPopup:false,
        addNewAdminPopup:false,
    },
    reducers:{
        toggleSettingPopup(state){//flip
            state.settingPopup=!state.settingPopup
        },
        toggleAddBookPopup(state){//flip
            state.addBookPopup=!state.addBookPopup
        },
        togglereadBookPopup(state){//flip
            state.readBookPopup=!state.readBookPopup
        },
        togglerecordBookPopup(state){//flip
            state.recordBookPopup=!state.recordBookPopup
        },
        togglereturnBookPopup(state){//flip
            state.returnBookPopup=!state.returnBookPopup
        },
        toggleAddNewAdminPopup(state){//flip
            state.addNewAdminPopup=!state.addNewAdminPopup
        },
        closeAllPopup(state){
            state.settingPopup=false;
            state.addBookPopup=false;
            state.readBookPopup=false;
            state.recordBookPopup=false;
            state.returnBookPopup=false;
            state.addNewAdminPopup=false;

        },
    },
});
export const{
    closeAllPopup,
    toggleAddBookPopup,
    toggleSettingPopup,
    toggleAddNewAdminPopup,
    togglereadBookPopup,
    togglerecordBookPopup,
    togglereturnBookPopup}=popupSlice.actions;

export default popupSlice.reducer;
