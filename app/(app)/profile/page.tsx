import React from 'react'
import Image from 'next/image'
import Feed from '@components/Feed'

export default function MyProfile() {
  return (
    <section>
        <div className='flex size-fit gap-5 p-5 items-center'>
          <div className='rounded-full size-48 overflow-hidden relative'>
            <Image src={'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt={'profile picture'} width={0} height={0}  fill style={{objectFit:"cover"}} />
          </div>
          <div>
            <h1 className='text-4xl'>Username</h1>
            <br />
            <h2 className='text-xl'>User Bio</h2>
          </div>
        </div>
        <br />
        <h1 className="text-center text-xl ">See your posts</h1>
        <br />
        <Feed></Feed>
    </section>
  )
}

