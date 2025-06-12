import { createSlice, createAction } from "@reduxjs/toolkit";



const popupSlice =createSlice({
    name:"popup",
    initialState:{
        settingPopup:false,
        addBookPopup:false,
        readBookPopup:false,
        recordBookPopup:false,
        returnBookPopup:false,
        addNewAdminPopup:false,
        bookManagementOpen: false,
        usersComponentOpen: false,
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
        toggleBookManagement: (state) => {
            state.bookManagementOpen = !state.bookManagementOpen;
          },
        toggleUsersComponent: (state) => {
            state.usersComponentOpen = !state.usersComponentOpen;
          },
        closeAllPopup(state){
            state.settingPopup=false;
            state.addBookPopup=false;
            state.readBookPopup=false;
            state.recordBookPopup=false;
            state.returnBookPopup=false;
            state.addNewAdminPopup=false;

        },
        resetPopups: (state) => {
            state.bookManagementOpen = false;
            state.addNewAdminPopup = false;
            state.usersComponentOpen = false;
            state.settingPopup = false;
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
    togglereturnBookPopup,
    toggleBookManagement,
    toggleUsersComponent}=popupSlice.actions;

export const resetPopups = createAction('popup/resetPopups');

export default popupSlice.reducer;
