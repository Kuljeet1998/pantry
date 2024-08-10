'use client'
import React from 'react'
import { UserAuth } from '../context/AuthContext';

const page = () => {
    const { user } = UserAuth();
    console.log(user)
    return (
        <div>
            {user ? (<div>
                ABOUT PAGE
            </div>) : (<p>UNAUTHORIZED ACCESS</p>)}
            
        </div>
    )
}

export default page