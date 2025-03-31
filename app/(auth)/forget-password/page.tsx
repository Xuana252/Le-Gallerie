"use client";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import toastError from "@components/Notification/Toaster";
import {
  changeUserPassword,
  sendVerificationCode,
} from "@actions/accountActions";
import { checkVerifyRateLimit } from "@actions/checkRateLimit";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { SubmitButtonState } from "@enum/submitButtonState";
import { signOut } from "@node_modules/next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitButtonState>(SubmitButtonState.IDLE);
  const [isTimeout, setIsTimeout] = useState(false);
  const [verificationCodeText, setVerificationCodeText] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [count, setCount] = useState(15);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailToVerify, setEmailToVerify] = useState("");
  const [userId, setUserId] = useState("");

  const countDownRef = useRef<NodeJS.Timeout | null>(null);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    const isRateLimited = await checkVerifyRateLimit();

    if (isRateLimited) {
      toastError(
        "Verify rate limit exceeded. Please wait 1 minute before next attempt"
      );
      return;
    }

    if (!userId) {
      toastError("User has not been verified");
      return;
    }

    if (
      newPassword.trim() === "" ||
      newPasswordRepeat.trim() === "" ||
      verificationCodeText.trim() === ""
    ) {
      toastError("Please fill all the field to proceed");
      return;
    }

    if (newPassword !== newPasswordRepeat) {
      toastError("The passwords you typed doesn't match");
      return;
    }

    if (newPassword.length < 8 && newPasswordRepeat.length < 8) {
      toastError("Password must be at least 8 letters long");
      return;
    }

    if (verificationCodeText.trim() !== verificationCode.trim()) {
      toastError("Invalid verification code. Please check again");
      return;
    }

    try {
      setSubmitState(SubmitButtonState.PROCESSING);
      const response = await changeUserPassword(userId, newPassword.trim());
      if (response) {
        setSubmitState(SubmitButtonState.SUCCESS);
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000);
      } else {
        throw new Error("failed to change password");
      }
    } catch (error) {
      setSubmitState(SubmitButtonState.FAILED);
      toastError("failed to change password. Please try again later");
      console.log(error);
    }
  };

  const handleSendVerification = async () => {
    if (!emailToVerify) {
      toastError("No email to verify");
      return;
    }
    setIsTimeout(true);
    countDownRef.current = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);
    try {
      const response = await sendVerificationCode(emailToVerify);

      if(response) {
        setVerificationCode(response.code.toString().trim())
        setUserId(response.id.toString().trim())
      } else {
        toastError("Account with that email doesn't exist");
      }
    } catch (error) {
      console.log("Failed to send verification", error);
    }
  };

  const handleEmailTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailToVerify(e.target.value);
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCodeText(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleNewPasswordRepeatChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPasswordRepeat(e.target.value);
  };

  useEffect(() => {
    if (count <= 0) {
      // Clear the interval when count reaches 0
      if (countDownRef.current) {
        clearInterval(countDownRef.current);
        countDownRef.current = null;
      }
      setIsTimeout(false);
      setCount(15); // Optional: disable timeout when countdown ends
    }
  }, [count]);

  return (
    <section className="min-h-screen w-screen flex items-center justify-center overflow-y-scroll no-scrollbar">
      <div className="bg-secondary-1 h-fit w-full sm:max-w-[50%] rounded-lg p-4 m-4 text-accent flex flex-col items-center gap-10">
        <h1 className="font-bold text-3xl bg-primary/50 p-2 rounded-md text-left w-full">
          Reset password
        </h1>
        <p className="italic text-base sm:text-lg">
          Type your account's email address in the text box below and proceed to
          verify your account. <br /> We will send an email with the
          verification code to the address you type to verify it's you <br />{" "}
          Use the code provided to confirm your identity and proceed to change your password
        </p>
        <div className="flex flex-row gap-4 w-full">
          <InputBox
            type="Input"
            value={emailToVerify}
            onTextChange={handleEmailTextChange}
          >
            Email
          </InputBox>
          <button
            className="Button_variant_1"
            onClick={handleSendVerification}
            disabled={isTimeout}
          >
            {isTimeout ? `${count}s` : "Verify"}
          </button>
        </div>
        <form
          onSubmit={handleChangePassword}
          className="text-accent flex flex-col gap-4 w-full"
        >
          <InputBox
            type="Input"
            value={verificationCodeText}
            onTextChange={handleVerificationCodeChange}
            name="verification"
          >
            verification code
          </InputBox>
          <InputBox
            type="Password"
            value={newPassword}
            onTextChange={handleNewPasswordChange}
            name="new password"
          >
            password
          </InputBox>
          <InputBox
            type="Password"
            value={newPasswordRepeat}
            onTextChange={handleNewPasswordRepeatChange}
            name="new password repeat"
          >
            repeat password
          </InputBox>
          <div className=" ml-auto flex flex-row gap-2 items-center">
            <button className="Button_variant_2" onClick={(e)=>{
              e.preventDefault();
              router.back()
            }}>Back</button>
            <SubmitButton state={submitState} changeState={setSubmitState}>
              Change password
            </SubmitButton>
          </div>
        </form>
      </div>
    </section>
  );
}
