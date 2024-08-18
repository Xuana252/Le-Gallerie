"use server";

import { getProviders } from "next-auth/react";
import React from "react";
import SignInForm from "@components/Forms/SignInForm";

export default async function ServerProviders() {
    let providers:string[] = []
    const response = await getProviders();
    if (response) {
      providers = Object.keys(response);
    }
    
    return(
       <SignInForm providers={providers}/>
    )
}
