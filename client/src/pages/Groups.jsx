import React from 'react'
import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material'
import { sampleUsers } from '../constants/sample'
const Groups = () => {
  const selectMemberHandler = ()=>{

  }
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>
          New Group
        </DialogTitle>
        <Stack>
          {
            sampleUsers.map((user) => (
              <UserItem user={user} key={user._id} handler={selectMemberHandler}  />
            ))
          }
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default Groups