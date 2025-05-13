import React from 'react'
import { useDispatch } from 'react-redux'
import { returnBook } from '../store/slices/borrowSlice';
import { togglereturnBookPopup } from '../store/slices/popUpSlice';

const ReturnBookPopup = ({bookId,email}) => {
  const dispatch =useDispatch();
  const handleReturnBook=(e)=>{
    e.preventDefault();
    dispatch(returnBook(email,bookId));
    dispatch(togglereturnBookPopup());

  };
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50'>
          <div className='w-full bg-white rounded-lg shadow-lg lg:w-1/2 2xl:w-1/3'>
          <div className='p-6'>
            <h3 className='text-xl font-bold mb-4'>return book</h3>
            <form onSubmit={handleReturnBook} >

              <div className='mb-4'>
                <label className="block text-gray-900 font-medium"htmlFor="">User Email</label>
                <input 
                  type="email" 
                  defaultValue={email} 
                  placeholder="Borrower's email" 
                  className='w-full px-4 py-2 border border-black rounded-md' 
                  required 
                  disabled/>
              </div>

              <div className='flex justify-end epace-x-4'>
                <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300' type='button'
                onClick={()=>dispatch(togglereturnBookPopup())}>close</button>
                <button type='submit' className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 '>Return</button>
              </div>

            </form>
          </div>
          
        </div>
        </div>
  )
}

export default ReturnBookPopup
