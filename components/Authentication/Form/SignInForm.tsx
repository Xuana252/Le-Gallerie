import { SubmitButtonState } from "@enum/submitButtonState";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import toastError from "@components/Notification/Toaster";
import { checkInvalidInput, handleInvalid } from "@lib/Authentication/Auth";
import { faGithub, faGoogle } from "@node_modules/@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const providerIcons: Record<string, any> = {
  github: faGithub,
  google: faGoogle,
};

export default function SignInForm({ providers }: { providers: string[] }) {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitButtonState>(SubmitButtonState.IDLE);
  const [signInCredentials, setSignInCredentials] = useState({
    email: "",
    password: "",
  });
  const handleSignInCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.target.classList.remove("Invalid_input");
    const { name, value } = e.target;
    setSignInCredentials((c) => ({ ...c, [name]: value }));
  };

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  const handleCredentialsSignIn = async () => {
    setSubmitState(SubmitButtonState.PROCESSING);
    const invalidInputs = checkInvalidInput(signInCredentials);
    if (invalidInputs.length > 0) {
      handleInvalid(invalidInputs);
      setSubmitState(SubmitButtonState.FAILED);
      return;
    } else {
      try {
        const response = await signIn("credentials", {
          email: signInCredentials.email,
          password: signInCredentials.password,
          redirect: false,
        });
        if (response?.error) {
          setSubmitState(SubmitButtonState.FAILED);
          console.log(response.error);
          toastError(response.error);
        } else if (response?.ok) {
          setSubmitState(SubmitButtonState.SUCCESS);
          setTimeout(() => router.push("/"));
        }
      } catch (error) {
        console.log(error);
        setSubmitState(SubmitButtonState.FAILED);
      }
    }
  };



  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2 size-full">
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent default form submission
            handleCredentialsSignIn(); // Manually handle sign-in
          }
        }}
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form behavior
          handleCredentialsSignIn(); // Call the sign-in logic
        }}
        className="flex flex-col w-full p-2 gap-6 items-center"
      >
        <div className="grid grid-cols-1">
          <InputBox
            name="email"
            type="Input"
            value={signInCredentials.email}
            onTextChange={handleSignInCredentialsChange}
            styleVariant="Input_box_variant_2"
          ></InputBox>
          <InputBox
            name="password"
            type="Password"
            value={signInCredentials.password}
            onTextChange={handleSignInCredentialsChange}
            styleVariant="Input_box_variant_2"
          ></InputBox>
        </div>
        {/* Add sign up logic later */}
        <SubmitButton state={submitState} changeState={setSubmitState}>
          Sign in
        </SubmitButton>
      </form>
      <Link href={"/forget-password"} className="underline hover:font-bold">
        Forget password
      </Link>
      {/* Ask for sign up */}
      <h1>or</h1>
      {/* other Sign in methods */}
      <div>
        <ul className="flex flex-col gap-2">
          {providers.map((provider) => {
            if (provider !== "credentials")
              return (
                <li
                  key={provider}
                  className="Button_variant_1 cursor-pointer flex gap-3"
                  onClick={() => handleSignIn(provider)}
                >
                  {"Sign in with "}
                  <FontAwesomeIcon icon={providerIcons[provider]} size="lg" />
                </li>
              );
          })}
        </ul>
      </div>
    </div>
  );
}
