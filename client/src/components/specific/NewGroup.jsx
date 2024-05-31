import React, { useState } from 'react'
import { Dialog, Stack, DialogTitle, TextField, Typography, Button } from '@mui/material'
import { sampleUsers } from "../../constants/sample"
import UserItem from '../shared/UserItem'
import { useInputValidation } from "6pp"
const NewGroup = () => {
  const groupName = useInputValidation("");

  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    // setMembers(prev => prev.map((user) => user.id === id ? { ...user, isAdded: !user.isAdded } : user))
    setSelectedMembers((prev) => prev.includes(id)
      ? prev.filter((currentElement) => currentElement !== id)
      : [...prev, id])
  };
  const submitHandler = () => { };
  const closeHandler = () => {};
  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={'2rem'}>
        <DialogTitle textAlign={'center'} variant='h4'>
          New Group
        </DialogTitle>
        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />
        <Typography variant="body1">
          Members
        </Typography>
        <Stack>
          {
            members.map((user) => (
              <UserItem user={user} key={user._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)} />
            ))
          }
        </Stack >
        <Stack direction={'row'} justifyContent={"space-evenly"}>
          <Button variant='outlined' color='error' size='large'>Cancel</Button>
          <Button variant="contained" size='large' onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup