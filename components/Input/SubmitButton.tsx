"use client";

import React from "react";
import { Spinner } from "@components/UI/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { SubmitButtonState } from "@enum/submitButtonState";

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  state?: SubmitButtonState;
  changeState?: React.Dispatch<React.SetStateAction<SubmitButtonState>>;
  style?: string;
  variant?:
    | "Button_variant_1"
    | "Button_variant_1_5"
    | "Button_variant_2"
    | "Button_variant_2_5";
};

export default function SubmitButton({
  children,
  state,
  changeState,
  style,
  variant = "Button_variant_1",
  ...rest
}: SubmitButtonProps) {
  let content: React.ReactNode = children || "Submit";

  switch (state) {
    case SubmitButtonState.PROCESSING:
      content = <Spinner />;
      break;
    case SubmitButtonState.SUCCESS:
      content = <FontAwesomeIcon icon={faCheck} size="lg" />;
      changeState &&
        setTimeout(() => {
          changeState(SubmitButtonState.IDLE);
        }, 2000);
      break;
    case SubmitButtonState.FAILED:
      content = <FontAwesomeIcon icon={faTriangleExclamation} size="lg" />;
      changeState &&
        setTimeout(() => {
          changeState(SubmitButtonState.IDLE);
        }, 2000);
      break;
    default:
      content = content;
      break;
  }
  return (
    <button
      type="submit"
      className={`${variant} min-h-[35px] h-[35px] ${style}`}
      disabled={state === "Processing"}
      {...rest}
    >
      {content}
    </button>
  );
}
