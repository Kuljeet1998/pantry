'use client'
import { Button } from '@mui/material'
import React from 'react'
import { Box } from "@mui/system";

const Unauthorized = () => {
    return (
        <Box 
            width="100%"
            height="100%"
            position="absolute"
            display="flex"
            flexDirection="column"
            justifyContent="center" 
            alignItems="center" 
            gap={2}
        ><h1 style={{fontFamily: "Times, Times New Roman, serif"}}>Unauthorized user</h1>
        <Button href="/" variant="contained">Login Page</Button>
        <p style={{position:"absolute", marginBottom:0, bottom:5, color:"grey", opacity:0.5}}>By Kuljeet Singh Bhengura</p>
        </Box>
    )
}

export default Unauthorized