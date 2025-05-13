import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

const AddBookPopup = () => {
  const dispatch= useDispatch();
  
  const [title,setTitle]=useState("");
  const [author,setAuthor]=useState("");
  const [quantity,setQuantity]=useState("");
  const [description,setDescription]=useState("");

  const handleAddBook=(e)=>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("title",title);
    formData.append("author",author);
    formData.append("quantity",quantity);
    formData.append("description",description);
    dispatch(addBook(formData));
  };
  
  return <>
    <div className='fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50'>
          <div className='w-full bg-white rounded-lg shadow-lg lg:w-1/2 2xl:w-1/3'>
          <div className='p-6'>
            <h3 className='text-xl font-bold mb-4'>Add book</h3>
            <form onSubmit={handleAddBook} >
              <div className='mb-4'>
                <label className="block text-gray-900 font-medium"htmlFor="">book title</label>
                <input type="text" name={title} onChange={(e)=>setTitle(e.target.value)} placeholder="books title" className='w-full px-4 py-2 border border-black rounded-md' required/>
              </div>

              <div className='mb-4'>
                <label className="block text-gray-900 font-medium"htmlFor="">book author</label>
                <input type="text" name={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="books title" className='w-full px-4 py-2 border border-black rounded-md' required/>
              </div>

              <div className='mb-4'>
                <label className="block text-gray-900 font-medium"htmlFor="">book quantity</label>
                <input type="number" name={quantity} onChange={(e)=>setQuantity(e.target.value)} placeholder="books title" className='w-full px-4 py-2 border border-black rounded-md' required/>
              </div>

              <div className='mb-4'>
                <label className="block text-gray-900 font-medium"htmlFor="">book Description</label>
                <textarea value={description}onChange={(e)=>setDescription(e.target.value)} placeholder="enter description" rows={4} className="w-full px-4 py-2 border border-black rounded-md"/>
              </div>

              <div className='flex justify-end epace-x-4'>
                <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300' type='button'
                onClick={()=>dispatch(toggleAddBookPopup())}>close</button>
                <button type="submit" className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 '>ADD</button>
              </div>
            </form>
          </div>
          
        </div>
        </div>
  </>;
};

export default AddBookPopup;
