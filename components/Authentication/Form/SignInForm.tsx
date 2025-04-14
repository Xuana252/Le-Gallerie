import { SubmitButtonState } from "@enum/submitButtonState";
import InputBox from "@components/Input/InputBox";
import SubmitButton from "@components/Input/SubmitButton";
import toastError from "@components/Notification/Toaster";
import { checkInvalidInput, handleInvalid } from "@lib/Authentication/Auth";
import {
  faFacebook,
  faGithub,
  faGoogle,
} from "@node_modules/@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const providerIcons: Record<string, any> = {
  github: faGithub,
  google: faGoogle,
  facebook: faFacebook,
};
export default function SignInForm() {
  const router = useRouter();
  const [providers, setProviders] = useState<any[]>([]);
  const [submitState, setSubmitState] = useState<SubmitButtonState>(
    SubmitButtonState.IDLE
  );
  const [signInCredentials, setSignInCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();

      if (res) {
        // Filter out any invalid or missing providers
        setProviders(Object.values(res));
      }
    };

    fetchProviders();
  }, []);

  const handleSignInCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.target.classList?.remove("Invalid_input");
    const { name, value } = e.target;
    setSignInCredentials((c) => ({ ...c, [name]: value }));
  };

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/home" });
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
          setTimeout(() => router.push("/home"));
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
            e.preventDefault(); 
            handleCredentialsSignIn(); 
          }
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleCredentialsSignIn(); 
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
      <h1>or sign in with</h1>
      {/* other Sign in methods */}
      <div>
        <ul className="flex flex-wrap gap-2">
          {providers?.map((provider) => {
            if (provider.id !== "credentials")
              return (
                <li
                  key={provider.id}
                  className="grow min-w-[40%] Button_variant_1_5 cursor-pointer flex gap-3 items-center justify-center"
                  onClick={() => handleSignIn(provider.id)}
                >
                  {provider.name}
                  <FontAwesomeIcon icon={providerIcons[provider.id]} size="lg" />
                </li>
              );
          })}
        </ul>
      </div>
    </div>
  );
}
