import React, { Fragment, useRef } from 'react'
import AppLayout from '../components/layout/Applayout'
import { IconButton, Stack } from '@mui/material';
import { grayColor } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import { orange } from '../constants/color';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessage } from '../constants/sample';
import MessageComponent from '../components/shared/MessageComponent';
const user = {
  _id:"owenflwenf",
  name:"SURAJ"
}
const Chat = () => {
  const containerRef = useRef(null);
  return (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={'border-box'}
        padding={'1rem'}
        spacing={'1rem'}
        bgcolor={grayColor}
        height={'90%'}
        sx={{
          overflowX: 'hidden',
          overflowY: "auto"
        }}
      >
      {
        sampleMessage.map((i) => (
          <MessageComponent key={i._id} message={i} user={user}/>
        ))
      }
      </Stack>
      <form style={{
        height: "10%",
      }}>
        <Stack direction={'row'} padding={'1rem'} position={'relative'} alignItems={'center'} >
          <IconButton sx={{
            position:'absolute',
            left:'1.5rem',
            rotate:"30deg"
          }}
          >
            <AttachFileIcon/>
          </IconButton>
          <InputBox placeholder='Type message here...'/>
          <IconButton type='submit' sx={{
            bgcolor:orange,
            color:"white",
            marginLeft:"1rem",
            padding:"0.5rem",
            "&:hover":{
              bgcolor:"error.dark",
            },

          }}>
            <SendIcon/>
          </IconButton>
        </Stack>
      </form>
      <FileMenu />
    </Fragment>
  )
}

export default AppLayout()(Chat);