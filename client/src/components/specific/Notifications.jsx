import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useErrors } from '../../hooks/hook'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { setIsNotification } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'

const Notifications = () => {
  
  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);
  const {isLoading, data, error, isError} = useGetNotificationsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    try {
      const res = await acceptRequest({ requestId: _id, accept });
      if(res.data?.success){
        console.log('Socket use');
        toast.success(res.data.message);
      } else {
        toast.error(res.data?.error || 'Something went wrong');
      }
    } catch (error) {
        toast.error(error.message || 'Something went wrong');
        console.log(error);
    }
  }
  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{error, isError}])

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>
          Notifications
        </DialogTitle>
        {isLoading ? <Skeleton/>:
        <>
          {
            data?.allRequests.length > 0 ? (
              data?.allRequests?.map((i) =>
                <NotificationItem
                  sender={i.sender}
                  _id={i._id}
                  handler={friendRequestHandler} />)
            ) : (<Typography textAlign={"center"}>0 notifications</Typography>)
          }
        </>
        }
      </Stack>
    </Dialog>
  )
}


const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
        <Avatar />
        <Typography variant='body1' sx={{
          flexGrow: 1,
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: '100%',
        }}>
          {`${name} send you a friend request`}
        </Typography>
        <Stack direction={{
          xs:'column',
          sm:'row'
        }}>
          <Button onClick={()=>handler({_id, accept:true})}>Accept</Button>
          <Button color="error" onClick={()=>handler({_id, accept:false})}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  )
})
export default Notifications