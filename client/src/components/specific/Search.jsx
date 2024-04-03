import React, { useState } from 'react'
import { Dialog, Stack, TextField, DialogTitle, InputAdornment, List, ListItem, ListItemText } from '@mui/material'
import { useInputValidation } from '6pp'
import {Search as SearchIcon} from '@mui/icons-material';
import UserItem from '../shared/UserItem';
import { sampleUsers } from '../../constants/sample';

const Search = () => {
  const search = useInputValidation("");
  const addFriendHandler = (id) => {
    console.log(id)
  }
  const [users, setUsers] = useState(sampleUsers);
  let isLoadingSendFriendRequest = false;
  return (
    <Dialog open>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={'center'}>Find People</DialogTitle>
        <TextField label="" onChange={search.changeHandler} value={search.value} variant='outlined' size='small' InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}/>
        <List>
          {
            users.map((user) => (
              <UserItem user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest}/>
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search