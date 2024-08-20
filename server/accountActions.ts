'use server'

import { User } from "@lib/types";

export const signUp = async (user:{}) => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/users/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json()
    if(response.ok) {
        return {status:true,message:'account created'}
    }
    return {status:false,message:data.message}
    
}

export const updateUser = async (user:User) => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/users/${user._id}`,{
        method:'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(user)
      })
    if(response.ok)
        return true
    return false
}

export const fetchUserWithId = async (user:string) => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/users/${user}`)
    const data = await response.json()
    return data
}