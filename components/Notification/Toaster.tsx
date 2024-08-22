'use client'
import { toast } from "sonner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faQuestion, faTriangleExclamation, faX } from '@fortawesome/free-solid-svg-icons';

export default function toastError(error:string) {
    toast.custom((t)=> 
        <div className="Toast_item">
            <FontAwesomeIcon icon={faTriangleExclamation} className="size-8 text-xl"/>
            <p className="grow text-md">{error}</p>
            <FontAwesomeIcon icon={faX} onClick={()=>toast.dismiss(t)}/>

    </div>
    )
}

export async function confirm(confirmMessage:string): Promise<boolean> {
    return new Promise((resolve) => {
        const toastId = toast.custom((t) => (
          <div className="Toast_item">
            <FontAwesomeIcon icon={faQuestion} className="size-8 text-lg" />
            <p className="grow text-md">{confirmMessage}</p>
            <button
              onClick={() => {
                toast.dismiss(t);
                resolve(true); // User confirmed
              }}
            >
              <FontAwesomeIcon icon={faCheck} className="rounded-full size-5 p-1 hover:bg-primary hover:text-accent" />
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                resolve(false); // User declined
              }}
            >
              <FontAwesomeIcon icon={faX} className="rounded-full size-5 p-1 hover:bg-primary hover:text-accent" />
            </button>
          </div>
        ));
    
        setTimeout(() => {
              toast.dismiss(toastId);
              resolve(false); // Consider the action as "cancelled" if it times out
            }, 5000); // Adjust the timeout as needed
        // Optionally, you can handle toast removal manually if needed
        // For example, to ensure the toast is removed if not dismissed by user interaction
        // setTimeout(() => {
        //   toast.dismiss(toastId);
        //   resolve(false); // Consider the action as "cancelled" if it times out
        // }, 10000); // Adjust the timeout as needed
      });
}