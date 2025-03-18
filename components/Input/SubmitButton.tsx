'use client'

import React from 'react';
import { Spinner } from '@components/UI/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTriangleExclamation, faX } from '@fortawesome/free-solid-svg-icons';
import { SubmitButtonState } from '@app/enum/submitButtonState';

type SubmitButtonBaseProps = {
    children? :React.ReactNode,
    state?: SubmitButtonState,
    changeState?: React.Dispatch<React.SetStateAction<SubmitButtonState>>,
    style?:string
}

type SubmitButtonWithStateProps = {
    children?:React.ReactNode,
    state: SubmitButtonState,
    changeState: React.Dispatch<React.SetStateAction<SubmitButtonState>>
    style?:string
}

type SubmitButtonProps = SubmitButtonBaseProps|SubmitButtonWithStateProps


export default function SubmitButton({children,state,changeState,style}:SubmitButtonProps) {
    let content:React.ReactNode = children||'Submit'

    switch(state) {
        case SubmitButtonState.PROCESSING:
            content = <Spinner/>
            break
        case SubmitButtonState.SUCCESS:
            content = <FontAwesomeIcon icon={faCheck} size='lg'/>
            changeState&&setTimeout(()=>{changeState(SubmitButtonState.IDLE)},2000)
            break
        case SubmitButtonState.FAILED:
            content = <FontAwesomeIcon icon={faTriangleExclamation} size='lg'/>
            changeState&&setTimeout(()=>{changeState(SubmitButtonState.IDLE)},2000)
            break
        default:
            content = content
            break
    }
  return (
     <button type='submit' className={`Button_variant_1 min-h-[35px] h-[35px] ${style}`} disabled={state === 'Processing'}>
       {content}
     </button>
  );
};
