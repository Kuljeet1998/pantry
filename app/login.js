'use client'
import React from "react";
import { UserAuth } from "./context/AuthContext";
import { ClientRedirect } from "./utils/utils";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@mui/material";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";

const Login = () => {
    const { user, googleSignIn, logOut } = UserAuth();
    
    const handleSignIn = async () => {
       try{
        await googleSignIn()
       } catch (error) {
        console.log(error)
        }
    } 

    const handleSignOut = async () => {
        try {
            await logOut()
        } catch (error) {
            console.log(error)
        }

    }
    // eslint-disable-next-line
    let [over,setOver]=useState(false); 

    let buttonstyle={
        border: 0,
        width: 100,
        height: 100,
        backgroundColor:"#F5FFFA",
        borderRadius:100,
    }

    if(over){
        buttonstyle.cursor="pointer";
    }
    

	return (
        <div>
            {!user ? (
            <div>
            <div style={{display:"flex", height:"100vh", minHeight:"628px"}}>
                <div style={{displahy:"flex",alignItems:"center",justifyContent:"center" , height:"100%", width:"50%", alignContent:"center", backgroundColor:"#FFEFD5"}}>
                
                    <center>
                        <h1 style={{color:"#4B0082", fontFamily:"Apple Chancery, cursive", fontSize:"3.5em"}}>Welcome to Your Pantry</h1><br /><br />
                        <h2 style={{color:"#7B68EE", fontFamily:"Gill Sans, sans-serif", fontSize:"1.8em"}}>Please login with your google account to continue</h2><br></br><br />
                        <Button style={buttonstyle}
                            onMouseOver={()=>setOver(true)} 
                            onMouseOut={()=>setOver(false)}
                            onClick={handleSignIn}
                            type="submit">
                                <FcGoogle size={100}/>
                        </Button>  
                    </center>
                    
                </div>
                <div style={{width:"50%"}}>
                <Image
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: '100%' }}
                src="https://honeybuilthome.com/wp-content/uploads/2021/01/diy-pantry-labels-honey-built-home.png"
                alt="new"
                />
                </div>
            </div>
            <div style={{backgroundColor:"black" ,color:"white"}}>
                <span style={{textAlign:"left"}}>By Kuljeet Singh Bhengura</span>
            </div>
            </div>
            ) : (
                    ClientRedirect('/pantry')
                )}
            
        </div>
	)
}
export default Login
