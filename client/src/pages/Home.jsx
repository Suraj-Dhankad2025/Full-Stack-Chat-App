import React from 'react'
import AppLayout from '../components/layout/Applayout' 
import { Box, Typography } from '@mui/material';
import { grayColor } from '../constants/color';

const Home = () => {
  return (
    <Box bgcolor={grayColor} height={"100%"}>
    <Typography padding={"2rem"} textAlign={"center"} variant='h5'>
      Select a friend to chat
    </Typography>
    </Box>
  )
}

export default AppLayout()(Home);