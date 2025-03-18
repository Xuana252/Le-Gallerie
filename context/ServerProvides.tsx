"use server";

import { getProviders } from "next-auth/react";
import React from "react";
import AuthenticationForm from "@components/Authentication/AuthenticationForm";

export default async function ServerProviders() {
    let providers:string[] = []
    const response = await getProviders();
    if (response) {
      providers = Object.keys(response);
    }
    
    return(
       <AuthenticationForm providers={providers}/>
    )
}
