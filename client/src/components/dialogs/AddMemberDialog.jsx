import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { setIsAddMember } from '../../redux/reducers/misc'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ chatId }) => {
    const dispatch = useDispatch();
    const {isAddMember} = useSelector((state) => state.misc);
    const {isLoading, data, isError, error} = useAvailableFriendsQuery(chatId);

    
    const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation); 

    const [selectedMembers, setSelectedMembers] = useState([]);
  
    const selectMemberHandler = (id) => {
        // setMembers(prev => prev.map((user) => user.id === id ? { ...user, isAdded: !user.isAdded } : user))
        setSelectedMembers((prev) => prev.includes(id)
            ? prev.filter((currentElement) => currentElement !== id)
            : [...prev, id])
    };
    
    const addMemberSubmitHandler = () => {
        addMembers("Adding members...", {members:selectedMembers, chatId });
        closeHandler();
    }
    const closeHandler = () => {
        dispatch(setIsAddMember(false));
    }
    useErrors([{isError, error}]);
    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={'center'}> Add Member</DialogTitle>
                <Stack spacing={'1rem'}>
                    {
                        isLoading ? (<Skeleton/>): (
                            data?.friends?.length > 0 ?
                            data?.friends?.map(i =>
                            (<UserItem
                                key={i._id}
                                user={i}
                                handler={selectMemberHandler}
                                isAdded={selectedMembers.includes(i._id)}
                            />
                            )) :
                            <Typography textAlign={'center'}>No friends</Typography>
                        )
                    }
                </Stack>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-evenly'}>
                    <Button color="error" onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button
                        onClick={addMemberSubmitHandler}
                        variant="contained"
                        disabled={isLoadingAddMembers}
                    >
                        Submit Changes
                    </Button>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog