"use client";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import toastError from "@components/Notification/Toaster";
import { SubmitButtonState } from "@lib/types";
import { changeUserPassword, sendVerificationCode } from "@actions/accountActions";
import { checkVerifyRateLimit } from "@actions/checkRateLimit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function ChangePassword() {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitState, setSubmitState] = useState<SubmitButtonState>("");
  const [isTimeout, setIsTimeout] = useState(false);
  const [verificationCodeText, setVerificationCodeText] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [count, setCount] = useState(15);
  const [verificationCode, setVerificationCode] = useState("");

  const countDownRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendVerification = async () => {
    if (!session?.user.id||!session.user.email) return;
    setIsTimeout(true);
    countDownRef.current = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);

    try {
      const response = await sendVerificationCode(session?.user.email);
      response?setVerificationCode(response.code.toString().trim()):"";
    } catch (error) {
      console.log("Failed to send verification");
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user.id) return;

    const isRateLimited = await checkVerifyRateLimit();

    if (isRateLimited) {
      toastError(
        "Verify rate limit exceeded. Please wait 1 minute before next attempt"
      );
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
      setSubmitState("Processing")
      const response = await changeUserPassword(session.user.id, newPassword.trim())
      if(response) {
        setSubmitState("Succeeded")
        setTimeout(()=>{router.push('/sign-in')},1000)
      } else {
        throw new Error('failed to change password')
      }
    } catch (error) {
      setSubmitState("Failed")
      toastError('failed to change password. Please try again later')
      console.log(error)
    }
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
    <section className="flex flex-col gap-4">
      <div className=" bg-secondary-1/70 rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-primary font-bold text-2xl bg-accent/30 rounded-md px-2 py-1">
          Verification
        </h1>
        <div className="text-accent flex flex-col p-2 gap-4">
          <h1 className="text-base text-accent/50">
            We will send a verification code to your email. Use that code to
            proceed
          </h1>
          <div className="flex flex-row gap-2 items-center">
            <h1 className="font-bold text-xl">Email</h1>
            <div className="Input_box_variant_1">
              <span className="px-2">
                {session?.user.email || "user@gmail.com"}
              </span>
            </div>
          </div>
          <button
            className="Button_variant_1 ml-auto"
            onClick={handleSendVerification}
            disabled={isTimeout}
          >
            {isTimeout ? `${count}s` : "Send verification"}
          </button>
        </div>
      </div>
      <div className=" bg-secondary-1/70 rounded-lg p-4 flex flex-col gap-4">
        <h1 className="text-primary font-bold text-2xl bg-accent/30 rounded-md px-2 py-1">
          Change password
        </h1>
        <form
          onSubmit={handleChangePassword}
          className="text-accent flex flex-col p-2 gap-4"
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
          <div className="items ml-auto">
            <SubmitButton state={submitState} changeState={setSubmitState}>
              Change password
            </SubmitButton>
          </div>
        </form>
      </div>
    </section>
  );
}
