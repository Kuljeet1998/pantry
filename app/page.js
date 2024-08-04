'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box } from "@mui/system";
import { Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";
import { async } from "@firebase/util";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen]= useState(false)
  const [itemName, setItemName] = useState('')
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const uppdatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList);
    setData(inventoryList);
    return inventoryList;
  }
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await uppdatePantry();
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    getData();
  }, []);


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
      await uppdatePantry()
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
    await uppdatePantry()
  }

  const increaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    const {quantity} = docSnap.data()
    await setDoc(docRef, {quantity: quantity + 1})

    await uppdatePantry()
  }

  return (
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

      <Stack width="800px" height="500px" spacing={2} overflow={'auto'}>
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
    </Box>
  );
}
