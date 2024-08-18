'use client'

import React from 'react';
import { Spinner } from '@components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTriangleExclamation, faX } from '@fortawesome/free-solid-svg-icons';
import { type SubmitButtonState } from '@lib/types';

type SubmitButtonBaseProps = {
    children? :React.ReactNode,
    state?: SubmitButtonState,
    changeState?: React.Dispatch<React.SetStateAction<SubmitButtonState>>
}

type SubmitButtonWithStateProps = {
    children?:React.ReactNode,
    state: SubmitButtonState,
    changeState: React.Dispatch<React.SetStateAction<SubmitButtonState>>
}

type SubmitButtonProps = SubmitButtonBaseProps|SubmitButtonWithStateProps


export default function SubmitButton({children,state,changeState}:SubmitButtonProps) {
    let content:React.ReactNode = children||'Submit'

    switch(state) {
        case 'Processing':
            content = <Spinner/>
            break
        case 'Succeeded':
            content = <FontAwesomeIcon icon={faCheck} size='lg'/>
            changeState&&setTimeout(()=>{changeState('')},2000)
            break
        case 'Failed':
            content = <FontAwesomeIcon icon={faTriangleExclamation} size='lg'/>
            changeState&&setTimeout(()=>{changeState('')},2000)
            break
        default:
            content = content
            break
    }
  return (
     <button type='submit' className='Button_variant_1 min-h-[35px] h-[35px]' disabled={state === 'Processing'}>
       {content}
     </button>
  );
};
