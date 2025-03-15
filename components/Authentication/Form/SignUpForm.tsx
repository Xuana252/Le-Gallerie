import { signUp } from "@actions/accountActions";
import { checkAuthRateLimit } from "@actions/checkRateLimit";
import { SubmitButtonState } from "@app/enum/submitButtonState";
import ImageInput from "@components/Input/ImageInput";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import {
  alertError,
  checkInvalidInput,
  handleInvalid,
} from "@lib/Authentication/Auth";
import { SignUpCredentials } from "@lib/types";
import { uploadImage } from "@lib/upload";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

export default function SignUpForm() {
  const [submitState, setSubmitState] = useState<SubmitButtonState>(SubmitButtonState.IDLE);
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

  const handleSignUpCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.target.classList.remove("Invalid_input");
    const { name, value } = e.target;
    setSignUpCredentials((c) => ({ ...c, [name]: value }));
  };

  const handleSignUp = async () => {
    setSubmitState(SubmitButtonState.PROCESSING);
    const invalidInputs = checkInvalidInput(signUpCredentials);

    if (invalidInputs.length > 0) {
      handleInvalid(invalidInputs);
      setSubmitState(SubmitButtonState.FAILED);
      return;
    } else {
      const isRateLimited = await checkAuthRateLimit();
      if (isRateLimited) {
        setSubmitState(SubmitButtonState.FAILED);
        alertError(["Sign up limit exceeded please return in an hour"]);
        console.log("Sign up limit exceeded please return in an hour");
        return;
      }
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
          alertError(response.message);
        }
      } catch (error) {
        setSubmitState(SubmitButtonState.FAILED);
        console.log(error);
      }
    }
  };

  const handleImageChange = (image: { file: File | null; url: string }) => {
    setSignUpCredentials((s) => ({
      ...s,
      image,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center size-full">
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent default form submission
            handleSignUp(); // Manually handle sign-in
          }
        }}
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form behavior
          handleSignUp(); // Call the sign-in logic
        }}
        className="flex flex-col w-full p-2 gap-4 items-center justify-center"
      >
        <ImageInput
          type="ProfileImage"
          image={signUpCredentials.image.url}
          setImage={handleImageChange}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 items-center">
          <InputBox
            styleVariant={"Input_box_variant_2"}
            name="username"
            value={signUpCredentials.username}
            onTextChange={handleSignUpCredentialsChange}
            type={"Input"}
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
          Sign up
        </SubmitButton>
      </form>
    </div>
  );
}
