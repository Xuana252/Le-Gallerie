"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCheck,
  faLessThanEqual,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import SubmitButton from "@components/Input/SubmitButton";
import React, { useEffect, useRef, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import validator from "validator";
import { SignUpCredentials, SubmitButtonState, UploadUser } from "@lib/types";
import { useRouter } from "next/navigation";
import { useSpring, animated, useTransition } from "@react-spring/web";
import { signUp } from "@server/accountActions";
import ImageInput from "@components/Input/ImageInput";
import { checkAuthRateLimit } from "@server/checkRateLimit";
import InputBox from "@components/Input/InputBox";
import { uploadImage } from "@lib/upload";
import toastError from "@components/Notification/Toaster";

const providerIcons: Record<string, any> = {
  github: faGithub,
  google: faGoogle,
};

export default function SignInForm({ providers }: { providers: string[] }) {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitButtonState>("");
  const [isSignUp, setIsSignUp] = useState(false);
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
  const [signInCredentials, setSignInCredentials] = useState({
    email: "",
    password: "",
  });

  const DesktopSliderAnimation = useSpring({
    transform: isSignUp ? "translateX(100%)" : "translateX(0%)",
    zIndex: 1,
    config: { duration: 400, easing: (t) => t * (2 - t) }, // Duration of the animation
  });
  // const MobileSliderAnimation = useSpring({
  //   height:'fit-content',
  //   animation: ,
  //   zIndex: 1,
  //   config: { duration: 400, easing: (t) => t * (2 - t) }, // Duration of the animation
  // });
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
      transform: isSignUp ? "translateY(-80%)" : "translateY(80%)",
      opacity: 0,
    },
    config: { duration: 500, easing: (t) => t * (2 - t) },
  });

  const alertError = (error: string[]) => {
    error.forEach(error=>toastError(error))
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
      image: {
        file: null,
        url: "",
      },
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

  const checkInvalidInput = () => {
    let invalidLog: string[] = [];
    const invalidInputs = Object.entries(isSignUp?signUpCredentials:signInCredentials)
      .filter(([key, value]) => {
        let isInvalid = false;
        let errorMessage = "";
        if (key === "image") return false; // Skip image field
        if (typeof value === "string") {
          if(value.trim()==="") {
              isInvalid = true;
          } else if (key === "email" && !validator.isEmail(value)) {
              errorMessage = "Invalid email";
              isInvalid = true;
          } else if (key === "password"&&value.length < 8) {
              errorMessage = "Password must be at least 8 letters long";
              isInvalid = true;
          } else if (key === "repeatedPassword" && value !== signUpCredentials.password) {
              errorMessage = "Repeated password does not match";
              isInvalid = true;
          }
        } else {
          return false;
        }
        if (isInvalid) {
          errorMessage!==''?invalidLog.push(errorMessage):'';
          return true
        }
        return value.trim() === ""; // Check for empty fields
      })
      .map(([key]) => key);
    invalidLog ? alertError(invalidLog) : "";
    return invalidInputs;
  };

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  const handleCredentialsSignIn = async () => {
    setSubmitState("Processing");
    const invalidInputs = checkInvalidInput();
    if (invalidInputs.length > 0) {
      handleInvalid(invalidInputs);
      setSubmitState("Failed");
      return
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
          alertError([response.error]);
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

  const handleSignUp = async () => {
    setSubmitState("Processing");
    const invalidInputs = checkInvalidInput();

    if (invalidInputs.length > 0) {
      handleInvalid(invalidInputs);
      setSubmitState("Failed");
      return;
    } else {
      const isRateLimited = await checkAuthRateLimit();
      if (isRateLimited) {
        setSubmitState("Failed");
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

  const handleImageChange = (image: { file: File | null; url: string }) => {
    setSignUpCredentials((s) => ({
      ...s,
      image,
    }));
  };

  const Slider = (
    <div className=" bg-gradient-to-t from-secondary-2/70 to-primary/70 backdrop-blur-sm py-5 flex flex-col items-center justify-center h-1/4 sm:h-full z-10 shadow-lg">
      <Link href={"/"} className="font-AppLogo text-7xl sm:inline-block hidden">
        AppLogo
      </Link>
      {isSignUp ? (
        <>
          <h1 className="text-2xl text-center">
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
          >
            email...
          </InputBox>
          <InputBox
            name="password"
            type="Password"
            value={signInCredentials.password}
            onTextChange={handleSignInCredentialsChange}
            styleVariant="Input_box_variant_2"
          >
            password...
          </InputBox>
        </div>
        {/* Add sign up logic later */}
        <SubmitButton state={submitState} changeState={setSubmitState}>
          Sign in
        </SubmitButton>
      </form>
      <Link href={'/forget-password'} className="underline hover:font-bold">Forget password</Link>
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
        className="flex flex-col w-full p-2 gap-4 items-center"
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
          >
            username...
          </InputBox>
          <InputBox
            styleVariant={"Input_box_variant_2"}
            name="email"
            value={signUpCredentials.email}
            onTextChange={handleSignUpCredentialsChange}
            type={"Input"}
          >
            email...
          </InputBox>
          <InputBox
            styleVariant={"Input_box_variant_2"}
            name="password"
            value={signUpCredentials.password}
            onTextChange={handleSignUpCredentialsChange}
            type={"Password"}
          >
            password...
          </InputBox>
          <InputBox
            styleVariant={"Input_box_variant_2"}
            name="repeatedPassword"
            value={signUpCredentials.repeatedPassword}
            onTextChange={handleSignUpCredentialsChange}
            type={"Password"}
          >
            password...
          </InputBox>
        </div>
        {/* Add sign up logic later */}

        <SubmitButton state={submitState} changeState={setSubmitState}>
          Sign up
        </SubmitButton>
        <div className="h-20 overflow-y-scroll no-scrollbar">
        </div>
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

        
        {mobileFormTransitions((style, item) =>
          item ? (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                width: "100%",
                height: "75%",
                top: 0,
              }}
              className="flex flex-col items-center justify-around gap-2 py-2 size-full "
            >
              {SignUpForm}
            </animated.div>
          ) : (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                width: "100%",
                height: "75%",
                top: 0,
              }}
              className="flex flex-col size-full items-center justify-center gap-4 "
            >
              {SignInForm}
            </animated.div>
          )
        )}
        <div className="w-full absolute bottom-0">{Slider}</div>
      </div>
    </>
  );
}
