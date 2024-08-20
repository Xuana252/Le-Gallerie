"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import SubmitButton from "@components/Input/SubmitButton";
import React, { useEffect, useRef, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import validator from "validator";
import { SubmitButtonState } from "@lib/types";
import { useRouter } from "next/navigation";
import { useSpring, animated, useTransition } from "@react-spring/web";
import { signUp } from "@server/accountActions";
import ImageInput from "@components/Input/ImageInput";

const providerIcons: Record<string, any> = {
  github: faGithub,
  google: faGoogle,
};

export default function SignInForm({ providers }: { providers: string[] }) {
  const router = useRouter();
  const imageInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitButtonState>("");
  const [isSignUp, setIsSignUp] = useState(false);
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

  const DesktopSliderAnimation = useSpring({
    transform: isSignUp ? "translateX(100%)" : "translateX(0%)",
    zIndex: 1,
    config: { duration: 400, easing: (t) => t * (2 - t) }, // Duration of the animation
  });
  const MobileSliderAnimation = useSpring({
    transform: isSignUp ? "translateY(100%)" : "translateY(0%)",
    zIndex: 1,
    config: { duration: 400, easing: (t) => t * (2 - t) }, // Duration of the animation
  });
  const textTransitions = useTransition(isSignUp, {
    from: { transform: "translateY(-100px)" },
    enter: { transform: "translateY(0px)" },
    leave: { transform: "translateY(-100px)" },
    config: { duration: 500, easing: (t) => t * (2 - t) },
  });
  const desktopFormTransitions = useTransition(isSignUp, {
    from: {
      transform: isSignUp ? "translateX(50%)" : "translateX(-50%)",
      opacity: 0,
    },
    enter: { transform: "translateX(0px)", opacity: 1 },
    leave: {
      transform: isSignUp ? "translateX(-60%)" : "translateX(60%)",
      opacity: 0,
    },
    config: { duration: 500, easing: (t) => t * (2 - t) },
  });
  const mobileFormTransitions = useTransition(isSignUp, {
    from: {
      transform: isSignUp ? "translateY(50%)" : "translateY(-50%)",
      opacity: 0,
    },
    enter: { transform: "translateY(0px)", opacity: 1 },
    leave: {
      transform: isSignUp ? "translateY(-60%)" : "translateY(60%)",
      opacity: 0,
    },
    config: { duration: 500, easing: (t) => t * (2 - t) },
  });

  const alertError = (error: string) => {
    setError(error);
    setTimeout(() => setError(""), 1500);
  };

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
        const response = await signUp(signUpCredentials)
        if (response.status) {
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
          console.log(response.message);
          alertError(response.message);
        }
      } catch (error) {
        setSubmitState("Failed");
        console.log(error);
      }
    }
  };

  const handleImageChange = (image:string) => {
    setSignUpCredentials((s) => ({
      ...s,
      image: image,
    }));
  };

  const Slider = (
    <div className=" size-full bg-secondary-2 py-5 flex flex-col items-center justify-center">
          <Link href={"/"} className="font-AppLogo text-7xl">
            AppLogo
          </Link>
      {isSignUp ? (
        <>
          <h1 className="text-2xl text-center">
            <br />
            Already had an account? <br />
            <span
              className="cursor-pointer font-bold hover:underline"
              onClick={() => setIsSignUp(false)}
            >
              Sign In here
            </span>
          </h1>
        </>
      ) : (
        <>
          <h1 className="text-2xl  text-center">
            <br />
            Don't have an account? <br />
            <span
              className="cursor-pointer font-bold hover:underline"
              onClick={() => setIsSignUp(true)}
            >
              Sign up here
            </span>
          </h1>
        </>
      )}
    </div>
  );

  const SignInForm = (
    <>
      <form
        onSubmit={handleCredentialsSignIn}
        className="flex flex-col w-full p-2 gap-6 items-center"
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
    </>
  );

  const SignUpForm = (
    <>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col w-full p-2 gap-4 items-center"
      >
        <ImageInput type='ProfileImage' image={signUpCredentials.image} setImage={handleImageChange}/>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col items-center">
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
        </div>
        {/* Add sign up logic later */}

        <SubmitButton state={submitState} changeState={setSubmitState}>
          Sign up
        </SubmitButton>
        {error && <div>{error}</div>}
      </form>
    </>
  );

  return (
    <>
      {/* Desktop view */}
      <div className="Sign_In_Form_Desktop">
        {textTransitions((style, item) => (
          <animated.div
            style={{
              ...style,
              position: "absolute",
              top: "10px",
              left: item ? "20px" : "auto",
              right: item ? "auto" : "20px",
              zIndex: 10,
            }}
          >
            <Link href={"/"} className={`text-xl hover:font-bold z-10`}>
              skip for now
            </Link>
          </animated.div>
        ))}
        <animated.div style={DesktopSliderAnimation}>{Slider}</animated.div>
        {desktopFormTransitions((style, item) =>
          item ? (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                left: "0px",
                width: "50%",
                height: "100%",
              }}
              className="flex flex-col items-center justify-around gap-2 py-2 size-full"
            >
              {SignUpForm}
            </animated.div>
          ) : (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                right: "0px",
                width: "50%",
                height: "100%",
              }}
              className="flex flex-col size-full items-center justify-center gap-4"
            >
              {SignInForm}
            </animated.div>
          )
        )}
      </div>

      {/* Mobile view */}
      <div className=" Sign_In_Form_Mobile">
        {textTransitions((style, item) => (
          <animated.div
            style={{
              ...style,
              position: "absolute",
              top: "10px",
              left: item ? "20px" : "auto",
              right: item ? "auto" : "20px",
              zIndex: 10,
            }}
          >
            <Link href={"/"} className={`text-xl hover:font-bold z-10`}>
              skip for now
            </Link>
          </animated.div>
        ))}

        <animated.div style={MobileSliderAnimation}>{Slider}</animated.div>
        {mobileFormTransitions((style, item) =>
          item ? (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                width: "100%",
                height: "50%",
                top: 0,
              }}
               className="flex flex-col items-center justify-around gap-2 py-2 size-full"
            >
              {SignUpForm}
            </animated.div>
          ) : (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                width: "100%",
                height: "50%",
                bottom: 0,
              }}
              className="flex flex-col size-full items-center justify-center gap-4"
            >
              {SignInForm}
            </animated.div>
          )
        )}
      </div>
    </>
  );
}
