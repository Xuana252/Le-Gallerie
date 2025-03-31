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

import { SignUpCredentials, UploadUser } from "@lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useSpring, animated, useTransition } from "@react-spring/web";
import { signUp } from "@actions/accountActions";
import ImageInput from "@components/Input/ImageInput";
import { checkAuthRateLimit } from "@actions/checkRateLimit";
import InputBox from "@components/Input/InputBox";
import { uploadImage } from "@lib/upload";
import toastError from "@components/Notification/Toaster";
import SignUpForm from "./Form/SignUpForm";
import SignInForm from "./Form/SignInForm";

const providerIcons: Record<string, any> = {
  github: faGithub,
  google: faGoogle,
};

export default function AuthenticationForm({
  providers,
}: {
  providers: string[];
}) {
  const searchParams= useSearchParams()
  const signUp = searchParams.get('signUp') === "true"
  const [isSignUp, setIsSignUp] = useState(signUp);

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
             
            >
              {<SignUpForm />}
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
           
            >
              {<SignInForm providers={providers} />}
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
             
            >
              {<SignUpForm />}
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
             
            >
              {<SignInForm providers={providers} />}
            </animated.div>
          )
        )}
        <div className="w-full absolute bottom-0">{Slider}</div>
      </div>
    </>
  );
}
