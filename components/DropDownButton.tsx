'use client'
import React, { ReactNode, useState } from 'react';

type DropDownButtonProps = {
    children: ReactNode,
    dropDownList: ReactNode,
}
export default function DropDownButton({children, dropDownList}:DropDownButtonProps) {
    const [toggleDropDown,setToggleDropDown] = useState(false)
  return (
     <div className='relative'>
         <button className='Icon' onClick={()=>setToggleDropDown(t=>!t)}>
            {
                children
            }
         </button>
             { toggleDropDown&&
            <div className='absolute rounded-xl bg-slate-100  shadow-xl right-0  size-48 p-2'>
                {dropDownList}
            </div>
           }
     </div>
  );
};
