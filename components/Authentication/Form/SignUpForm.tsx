import {
  checkExistingEmail,
  sendVerificationCode,
  signUp,
} from "@actions/accountActions";
import { checkAuthRateLimit } from "@actions/checkRateLimit";
import { SubmitButtonState } from "@enum/submitButtonState";
import ImageInput from "@components/Input/ImageInput";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import {
  alertError,
  checkInvalidInput,
  handleInvalid,
} from "@lib/Authentication/Auth";
import { SignUpCredentials, UploadImage } from "@lib/types";
import { uploadImage } from "@lib/upload";
import { signIn } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

export default function SignUpForm() {
  const [submitState, setSubmitState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );
  const [signUpCredentials, setSignUpCredentials] = useState<SignUpCredentials>(
    {
      email: "",
      username: "",
      password: "",
      repeatedPassword: "",
      image: {
        file: null,
        url: "",
      },
    }
  );

  const [isVerifying, setIsVerifying] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [verificationCodeText, setVerificationCodeText] = useState("");
  const [count, setCount] = useState(15);
  const [verificationCode, setVerificationCode] = useState("");

  const countDownRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignUpCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.target.classList.remove("Invalid_input");
    const { name, value } = e.target;
    setSignUpCredentials((c) => ({ ...c, [name]: value }));
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setVerificationCodeText(value);
  };

  const handleSendVerification = async () => {
    setIsTimeout(true);
    countDownRef.current = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);
    try {
      if (!signUpCredentials.email) {
        alertError(["No email to verify"]);
        setSubmitState(SubmitButtonState.FAILED);
        setCount(0);
        return;
      }
      const response = await sendVerificationCode(signUpCredentials.email);
      setVerificationCode(response?.code.toString().trim());
    } catch (error) {}
  };

  const handleSignUp = async () => {
    const isRateLimited = await checkAuthRateLimit();
    if (isRateLimited) {
      setSubmitState(SubmitButtonState.FAILED);
      alertError(["Sign up limit exceeded please return in an hour"]);
      return;
    }
    if (verificationCodeText.trim() !== verificationCode.trim()) {
      setSubmitState(SubmitButtonState.FAILED);
      alertError(["Invalid verification code. Please check again"]);
      return;
    }

    setSubmitState(SubmitButtonState.PROCESSING);
    try {
      let imageUrl = "";
      if (signUpCredentials.image.file && signUpCredentials.image.url) {
        imageUrl = await uploadImage(signUpCredentials.image.file);
      }
      const newUser = {
        email: signUpCredentials.email,
        username: signUpCredentials.username,
        password: signUpCredentials.password,
        image: imageUrl,
      };
      const response = await signUp(newUser);
      if (response.status) {
        setSubmitState(SubmitButtonState.SUCCESS);
        setTimeout(() => {
          signIn("credentials", {
            email: signUpCredentials.email,
            password: signUpCredentials.password,
            callbackUrl: "/",
          });
        }, 1000);
      } else {
        setSubmitState(SubmitButtonState.FAILED);
        console.log(response.message);
        alertError([response.message]);
      }
    } catch (error: any) {
      setSubmitState(SubmitButtonState.FAILED);
      alertError([error.message]);
      console.log(error);
    }
  };

  const handleVerifyEmail = async () => {
    setSubmitState(SubmitButtonState.PROCESSING);
    const invalidInputs = checkInvalidInput(signUpCredentials);

    if (invalidInputs.length > 0) {
      handleInvalid(invalidInputs);
      setSubmitState(SubmitButtonState.FAILED);
      return;
    } else {
      try {
        const existingEmail = await checkExistingEmail(signUpCredentials.email);

        setIsVerifying(!existingEmail);
        if (existingEmail) {
          setSubmitState(SubmitButtonState.FAILED);
          alertError(["Email already exists"]);
          return;
        } else {
          setIsVerifying(true);
          handleSendVerification();
        }
        setSubmitState(SubmitButtonState.IDLE);
      } catch (error) {
        setSubmitState(SubmitButtonState.FAILED);
        console.log(error);
      }
    }
  };

  const handleImageChange = (image: UploadImage[]) => {
    setSignUpCredentials((s) => ({
      ...s,
      image: image[0]
        ? image[0]
        : {
            file: null,
            url: "",
          },
    }));
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
    <div className="flex flex-col items-center justify-center size-full">
      {isVerifying ? (
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent default form submission
              handleSignUp(); // Manually handle sign-up
            }
          }}
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form behavior
            handleSignUp(); // Call the sign-up logic
          }}
          className="flex flex-col items-center p-4 gap-2"
        >
          <div className="text-center">
            <span className="text-lg font-bold">
              We sent a verification code to{" "}
              <b>
                <i>{signUpCredentials.email}</i>
              </b>
            </span>
            <br />
            Please check your inbox and enter the code to verify your account.
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <span>
              <i>Didn't get any code?</i>
            </span>
            <button
              className="Button_variant_1_5"
              onClick={handleSendVerification}
              disabled={isTimeout}
            >
              {" "}
              {isTimeout ? `${count}s` : "Resend"}
            </button>
          </div>
          <InputBox
            styleVariant={"Input_box_variant_2"}
            value={verificationCodeText}
            type="Input"
            onTextChange={handleVerificationCodeChange}
            maxLength={6}
          >
            Enter code
          </InputBox>
          <SubmitButton state={submitState} changeState={setSubmitState}>
            Submit Code
          </SubmitButton>
        </form>
      ) : (
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent default form submission
              handleVerifyEmail(); // Manually handle sign-up
            }
          }}
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form behavior
            handleVerifyEmail(); // Call the sign-up logic
          }}
          className="flex flex-col w-full p-2 gap-4 items-center justify-center"
        >
          <ImageInput
            type="ProfileImage"
            image={signUpCredentials.image.url ? [signUpCredentials.image] : []}
            setImage={handleImageChange}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 items-center">
            <InputBox
              styleVariant={"Input_box_variant_2"}
              name="username"
              value={signUpCredentials.username}
              onTextChange={handleSignUpCredentialsChange}
              type={"Input"}
              maxLength={16}
            ></InputBox>
            <InputBox
              styleVariant={"Input_box_variant_2"}
              name="email"
              value={signUpCredentials.email}
              onTextChange={handleSignUpCredentialsChange}
              type={"Input"}
            ></InputBox>
            <InputBox
              styleVariant={"Input_box_variant_2"}
              name="password"
              value={signUpCredentials.password}
              onTextChange={handleSignUpCredentialsChange}
              type={"Password"}
            ></InputBox>
            <InputBox
              styleVariant={"Input_box_variant_2"}
              name="repeatedPassword"
              value={signUpCredentials.repeatedPassword}
              onTextChange={handleSignUpCredentialsChange}
              type={"Password"}
            ></InputBox>
          </div>
          {/* Add sign up logic later */}

          <SubmitButton state={submitState} changeState={setSubmitState}>
            Verify Email
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
