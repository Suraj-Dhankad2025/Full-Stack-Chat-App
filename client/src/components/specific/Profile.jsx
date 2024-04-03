import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import moment from 'moment'
import { Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material'
const Profile = () => {
    return (
        <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
            <Avatar
                sx={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    marginBottom: "1rem",
                    border: "5px solid white"
                }}
            />
            <ProfileCard heading={"Bio"} text={"aoindwoed"} />
            <ProfileCard heading={"Username"} text={"suraj_dhankad"} Icon={<UserNameIcon />} />
            <ProfileCard heading={"Name"} text={"Suraj Dhankad"} Icon={<FaceIcon />} />
            <ProfileCard heading={"Joined"} text={moment('2024-03-22T00:00:00.000Z').fromNow()} Icon={<CalendarIcon />} />
        </Stack>
    )
}

const ProfileCard = ({ text, Icon, heading }) =>
(
    <Stack spacing={"1rem"} direction={"row"} alignItems={"center"} color={"white"} textAlign={"center"}>
        {Icon && Icon}
        <Stack spacing={"0.5rem"} direction={"column"}>
            <Typography variant='body1'>
                {text}
            </Typography>
            <Typography color={"gray"} variant='caption'>
                {heading}
            </Typography>
        </Stack>

    </Stack>
)


export default Profile