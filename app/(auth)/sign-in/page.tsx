"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const providerIcons: Record<string, any> = {
  github: faGithub,
  google: faGoogle,
};

export default function SingIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [signUpCredentials, setSignUpCredentials] = useState({
    email: "",
    username: "",
    password: "",
    image: "",
  });
  const [signInCredentials, setSignInCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setSignInCredentials({
      email: "",
      password: "",
    });
    setSignUpCredentials({
      email: "",
      username: "",
      password: "",
      image: "https://cdn.usdairy.com/optimize/getmedia/b5108b6f-59c3-4cc4-b1d5-4b9b0d1e0c54/swiss.jpg.jpg.aspx?format=webp",
    });
  }, [isSignUp]);

  const handleSignUpCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSignUpCredentials((c) => ({ ...c, [name]: value }));
  };
  const handleSignInCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSignInCredentials((c) => ({ ...c, [name]: value }));
  };

  const fetchProviders = async () => {
    try {
      const response = await getProviders();
      if (response) {
        setProviders(Object.keys(response));
      }
    } catch (error) {
      console.log("failed to fetch for providers");
    }
  };
  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  const handleCredentialsSignIn = () => {
    signIn("credentials", {
      email: signInCredentials.email,
      password: signInCredentials.password,
      callbackUrl: "/",
    });
  };

  const handleSignUp = async () => {
    alert(JSON.stringify(signUpCredentials))
    try {
      const response = await fetch("api/users/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          signUpCredentials,
        ),
      });

      if (response.ok) {
        const data = await response.json();
        signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: "/",
        });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Slider = <div className="size-full bg-orange-300"></div>;
  return (
    <div className="Form overflow-hidden h-[70%] text-xl relative">
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
        <div  className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col p-2 gap-4 items-center">
            <div className="my-4 flex flex-col items-center gap-4">
              <div className="size-28 bg-white rounded-full relative overflow-hidden border-black border-2 pt-2">
                {signUpCredentials.image ? (
                  <Image
                    src={signUpCredentials.image}
                    alt="sign up image"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    size="xl"
                    className="size-full"
                  />
                )}
              </div>
              <h1 className="text-medium">Add Profile picture</h1>
            </div>
            <input
              className="Input_box_variant_1"
              name="username"
              type="text"
              placeholder="type your username here..."
              value={signUpCredentials.username}
              onChange={handleSignUpCredentialsChange}
            />
            <input
              className="Input_box_variant_1"
              name="email"
              type="email"
              placeholder="type your email here..."
              value={signUpCredentials.email}
              onChange={handleSignUpCredentialsChange}
            />
            <input
              className="Input_box_variant_1"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="add a password..."
              value={signUpCredentials.password}
              onChange={handleSignUpCredentialsChange}
            />
            <input
              className="Input_box_variant_1"
              name="repeatedPassword"
              type="password"
              autoComplete="new-password"
              placeholder="one more time..."
            />
            {/* Add sign up logic later */}
            <button className="Button" onClick={handleSignUp}>
              Sign up
            </button>
          </div>
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
        <div  className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col p-2 gap-6 items-center">
            <input
              className="Input_box_variant_1"
              name="email"
              type="text"
              placeholder="type your email here..."
              value={signInCredentials.email}
              onChange={handleSignInCredentialsChange}
            />
            <input
              className="Input_box_variant_1"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="and the password..."
              value={signInCredentials.password}
              onChange={handleSignInCredentialsChange}
            />
            {/* Add sign up logic later */}
            <button onClick={handleCredentialsSignIn} className="Button">
              Sign in
            </button>
          </div>

          {/* Ask for sign up */}
          <h1>
            Don't have an account?{" "}
            <span
              className="cursor-pointer font-bold"
              onClick={() => setIsSignUp(true)}
            >
              Sign up here
            </span>
          </h1>
          <h1>or</h1>
          {/* other Sign in methods */}
          <ul>
            {providers.map((provider) => {
              if (provider !== "credentials")
                return (
                  <li key={provider}
                    className="Button cursor-pointer"
                    onClick={() => handleSignIn(provider)}
                  >
                    <FontAwesomeIcon icon={providerIcons[provider]} /> Sign in
                    with {provider}
                  </li>
                );
            })}
          </ul>
        </div>
      ) : (
        Slider
      )}
    </div>
  );
}
