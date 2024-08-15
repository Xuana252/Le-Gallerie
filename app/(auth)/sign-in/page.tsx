"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import SubmitButton from "@components/SubmitButton";
import React, { useEffect, useRef, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import validator from "validator";
import { SubmitButtonState } from "@lib/types";
import { useRouter } from "next/navigation";
import Loader from "@components/Loader";

const providerIcons: Record<string, any> = {
  github: faGithub,
  google: faGoogle,
};

export default function SingIn() {
  const router = useRouter();
  const imageInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitButtonState>("");
  const [imageInputVisibility, setImageInputVisibility] =
    useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading,setIsLoading] = useState(true)
  const [providers, setProviders] = useState<string[]>([]);
  const [signUpCredentials, setSignUpCredentials] = useState({
    email: "",
    username: "",
    password: "",
    repeatedPassword: "",
    image: "",
  });
  const [signInCredentials, setSignInCredentials] = useState({
    email: "",
    password: "",
  });

  const alertError = (error: string) => {
    setError(error);
    setTimeout(() => setError(""), 1500);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("Theme");
    if (storedTheme !== null) {
      document.body.className = storedTheme;
    }
  }, []);

  useEffect(() => {
    setSignInCredentials({
      email: "",
      password: "",
    });
    setSignUpCredentials({
      email: "",
      username: "",
      password: "",
      repeatedPassword: "",
      image: "",
    });
  }, [isSignUp]);

  const handleSignUpCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.target.classList.remove("Invalid_input");
    const { name, value } = e.target;
    setSignUpCredentials((c) => ({ ...c, [name]: value }));
  };
  const handleSignInCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.target.classList.remove("Invalid_input");
    const { name, value } = e.target;
    setSignInCredentials((c) => ({ ...c, [name]: value }));
  };

  const fetchProviders = async () => {
    try {
      const response = await getProviders();
      if (response) {
        setProviders(Object.keys(response));
        setIsLoading(false)
      }
    } catch (error) {
      console.log("failed to fetch for providers");
    }
  };
  useEffect(() => {
    fetchProviders();
  }, []);

  const handleInvalid = (names: string[]) => {
    names.forEach((name) => {
      console.log(name);
      // Get all elements with the given name
      const invalidInputs = document.getElementsByName(name);
      // Loop through NodeList and handle each input
      invalidInputs.forEach((input) => {
        if (input instanceof HTMLInputElement) {
          input.classList.add("Invalid_input");
        }
      });
    });
  };
  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("Processing");
    const invalidInputs = Object.entries(signInCredentials)
      .filter(([key, value]) => {
        if (key === "image") return false; // Skip image field
        if (key === "email") return !validator.isEmail(value); // Validate email format
        return value.trim() === ""; // Check for empty fields
      })
      .map(([key]) => key);

    if (invalidInputs.length > 0) {
      handleInvalid(invalidInputs);
      setSubmitState("Failed");
    } else {
      try {
        const response = await signIn("credentials", {
          email: signInCredentials.email,
          password: signInCredentials.password,
          redirect: false,
        });
        if (response?.error) {
          setSubmitState("Failed");
          console.log(response.error);
          alertError(response.error);
        } else if (response?.ok) {
          setSubmitState("Succeeded");
          setTimeout(() => router.push("/"));
        }
      } catch (error) {
        console.log(error);
        setSubmitState("Failed");
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("Processing");
    const invalidInputs = Object.entries(signUpCredentials)
      .filter(([key, value]) => {
        if (key === "image") return false; // Skip image field
        if (key === "email") return !validator.isEmail(value);
        if (key === "repeatedPassword")
          return value !== signUpCredentials.password; // Validate email format
        return value.trim() === ""; // Check for empty fields
      })
      .map(([key]) => key);

    if (invalidInputs.length > 0) {
      handleInvalid(invalidInputs);
      setSubmitState("Failed");
    } else {
      try {
        const response = await fetch("api/users/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signUpCredentials),
        });
        const data = await response.json();
        if (response.ok) {
          setSubmitState("Succeeded");
          setTimeout(() => {
            signIn("credentials", {
              email: signUpCredentials.email,
              password: signUpCredentials.password,
              callbackUrl: "/",
            });
          }, 1000);
        } else {
          setSubmitState("Failed");
          console.log(data.message);
          alertError(data.message);
        }
      } catch (error) {
        setSubmitState("Failed");
        console.log(error);
      }
    }
  };

  const handleImageChange = () => {
    setSignUpCredentials((s) => ({
      ...s,
      image: imageInput.current ? imageInput.current.value : "",
    }));
    setImageInputVisibility(false);
  };

  const handleImageError = () => {
    setSignUpCredentials((s) => ({ ...s, image: "" }));
  };

  const Slider = <div className="size-full bg-orange-300"></div>;
  return (
    <div className="Form overflow-hidden h-[70%] relative">
      <Link
        href={"/"}
        className={`absolute top-[10px] ${
          isSignUp ? "left-[10px]" : "right-[10px]"
        }`}
      >
        Skip for now
      </Link>
      {/* sign-up form */}
      {isSignUp ? (
        <div className="flex flex-col items-center justify-around gap-2">
          <form
            onSubmit={handleSignUp}
            className="flex flex-col p-2 gap-4 items-center"
          >
            <div className=" flex flex-col items-center gap-4">
              <div
                className="size-28 bg-primary rounded-full relative overflow-hidden border-accent text-7xl"
                onClick={() => {
                  setImageInputVisibility(true);
                }}
              >
                {signUpCredentials.image ? (
                  <img
                    src={signUpCredentials.image}
                    alt="sign up image"
                    style={{ objectFit: "cover" }}
                    onError={handleImageError}
                    className="size-full"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    size="xl"
                    className="size-full mt-2"
                  />
                )}
              </div>
              {imageInputVisibility && (
                <div className="Input_box_variant_1">
                  <input
                    ref={imageInput}
                    name="image"
                    placeholder="Image URL..."
                    className="pl-2 outline-none bg-transparent placeholder:text-inherit"
                  />{" "}
                  <div className="p-1" onClick={handleImageChange}>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </div>
              )}
              <h1 className="text-medium">
                {signUpCredentials.image
                  ? "Looking good there"
                  : "Add Profile picture"}
              </h1>
            </div>
            <input
              className="Input_box_variant_2"
              name="username"
              type="text"
              placeholder="username..."
              value={signUpCredentials.username}
              onChange={handleSignUpCredentialsChange}
            />
            <input
              className="Input_box_variant_2"
              name="email"
              type="text"
              placeholder="email..."
              value={signUpCredentials.email}
              onChange={handleSignUpCredentialsChange}
            />
            <input
              className="Input_box_variant_2"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="password..."
              value={signUpCredentials.password}
              onChange={handleSignUpCredentialsChange}
            />
            <input
              className="Input_box_variant_2"
              name="repeatedPassword"
              type="password"
              autoComplete="new-password"
              placeholder="password..."
              value={signUpCredentials.repeatedPassword}
              onChange={handleSignUpCredentialsChange}
            />
            {/* Add sign up logic later */}

            <SubmitButton state={submitState} changeState={setSubmitState}>
              Sign up
            </SubmitButton>
            {error && <div>{error}</div>}
          </form>
          <h1 className="text-lg">
            Already had an account?{" "}
            <span
              className="cursor-pointer font-bold"
              onClick={() => setIsSignUp(false)}
            >
              Sign In here
            </span>
          </h1>
        </div>
      ) : (
        Slider
      )}

      {/* sign-in form */}
      {!isSignUp ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <form
            onSubmit={handleCredentialsSignIn}
            className="flex flex-col p-2 gap-6 items-center"
          >
            <input
              className="Input_box_variant_2"
              name="email"
              type="text"
              placeholder="email..."
              value={signInCredentials.email}
              onChange={handleSignInCredentialsChange}
            />
            <input
              className="Input_box_variant_2"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="password..."
              value={signInCredentials.password}
              onChange={handleSignInCredentialsChange}
            />
            {/* Add sign up logic later */}
            <SubmitButton state={submitState} changeState={setSubmitState}>
              Sign in
            </SubmitButton>
            {error && <div>{error}</div>}
          </form>

          {/* Ask for sign up */}
          <h1 className="text-lg">
            Don't have an account?{" "}
            <span
              className="cursor-pointer font-bold"
              onClick={() => setIsSignUp(true)}
            >
              Sign up here
            </span>
          </h1>
          <h1>or</h1>
          {/* other Sign in methods */}<div>
            
            {isLoading?<Loader></Loader>:<ul className="flex flex-col gap-2">
              {providers.map((provider) => {
                if (provider !== "credentials")
                  return (
                    <li
                      key={provider}
                      className="Button_variant_1 rounded-lg px-4 py-2 cursor-pointer flex gap-3"
                      onClick={() => handleSignIn(provider)}
                    >
                      {"Sign in with "}
                      <FontAwesomeIcon icon={providerIcons[provider]} size="lg" />
                    </li>
                  );
              })}
            </ul>}
          </div>
        </div>
      ) : (
        Slider
      )}
    </div>
  );
}
