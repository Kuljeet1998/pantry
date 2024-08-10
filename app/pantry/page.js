'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box } from "@mui/system";
import { Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";
import dynamic from 'next/dynamic'
import { UserAuth } from "../context/AuthContext";

const UnauthorizedPage = dynamic(() => import('../unauthorized'), {
    ssr: false,
});


export default function Pantry() {

  const [inventory, setInventory] = useState([])
  const [open, setOpen]= useState(false)
  const [itemName, setItemName] = useState('')
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { user, logOut } = UserAuth();
  
  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updatePantry()
  }, [])


  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity + 1})
      }
      else {
        await setDoc(docRef, {quantity: 1})
      }
      await updatePantry()
      handleClose()
  }
    

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updatePantry()
  }

  const increaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    const {quantity} = docSnap.data()
    await setDoc(docRef, {quantity: quantity + 1})

    await updatePantry()
  }

  const handleSignOut = async () => {
    try {
        await logOut()
    } catch (error) {
        console.log(error)
    }

    }

  return (
    <div>
        {user ? (
        <Box>
        <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
    >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: "translate(-50%,-50%)" 
            }}
            width={400} 
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}>
              <Typography variant="h4">Add Item</Typography>
              <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                value={itemName}
                onChange={(e)=>{
                  setItemName(e.target.value)
                }}
                ></TextField>
                <Button variant="outlined" onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}>
                  +
                </Button>
              </Stack>
          </Box>
        </Modal>
      <Typography variant="h1">Pantry</Typography>
      <Button variant="contained" onClick={()=>{
        handleOpen()
      }}> Add New Item</Button>

      <Stack width="95%" height="50%" maxWidth="950px" spacing={2} overflow={'auto'} >
        {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
          > 
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Stack display="flex" direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" sx={ { borderRadius: 50 } } onClick={() => removeItem(name)}>
                -
              </Button>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {quantity}
              </Typography>
              <Button variant="contained" sx={ { borderRadius: 50 } } onClick={() => increaseQuantity(name)}>
                +
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
      <Button onClick={()=>{
        handleSignOut()
      }}>Sign Out</Button>
      
    </Box>
    <div style={{backgroundColor:"black" ,color:"white",textAlign:"center"}}>
        <span>By Kuljeet Singh Bhengura</span>
    </div>
    </Box>) : (<UnauthorizedPage></UnauthorizedPage>)}
    </div>
  );
}