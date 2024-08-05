import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
    Avatar,
    Button,
    Container,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { bgGradient } from '../constants/color';
import { server } from '../constants/config';
import { usernameValidator } from '../utils/validators';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';


const Login = () => {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const toggleLogin = () => {
        setIsLogin(!isLogin);
    }
    const name = useInputValidation("");
    const bio = useInputValidation("");
    const username = useInputValidation("", usernameValidator);
    const password = useStrongPassword();
    const avatar = useFileHandler("single");
    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name.value);
        formData.append('bio', bio.value);
        formData.append('username', username.value);
        formData.append('avatar', avatar.file);
        formData.append('password', password.value);

        try {
            const data = await axios.post(`${server}/api/v1/user/new`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch(userExists(data.user));
            toast.success(data?.data?.message || "User created successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error occurred");
        }
        window.location.href = '/';
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging In...");
        const config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const { data } = await axios.post(`${server}/api/v1/user/login`, {
                username: username.value,
                password: password.value,
            },
                config
            )
            dispatch(userExists(data.user));
            toast.success(data.message, {
                id: toastId,
              });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", {
                id: toastId,
            });
        }
        window.location.href = '/';
    }
    return (
        <div style={{
            background: bgGradient
        }}>
        <Container component={"main"} maxWidth="xs"
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Paper elevation={3}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {
                    isLogin ? (
                        <>
                            <Typography variant='h5'>
                                Login
                            </Typography>
                            <form style={{
                                width: '100%',
                                marginTop: '1rem'
                            }}
                            onSubmit={handleLogin}
                            >
                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    margin='normal'
                                    variant='outlined'
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    margin='normal'
                                    variant='outlined'
                                    value={password.value}
                                    onChange={password.changeHandler}
                                />

                                <Button
                                    sx={{ marginTop: '1rem' }}
                                    variant='contained'
                                    fullWidth
                                    color='primary'
                                    type='submit'
                                >
                                    Login
                                </Button>
                                <Typography textAlign={'center'} m={'1rem'}>
                                    OR
                                </Typography>
                                <Button

                                    variant='text'
                                    fullWidth
                                    onClick={toggleLogin}
                                >
                                    Register
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Typography variant='h5'>
                                Register
                            </Typography>
                            <form style={{
                                width: '100%',
                                marginTop: '1rem'
                            }}
                            onSubmit={handleRegister}
                            >
                                <Stack position={'relative'} width={'10rem'} margin={'auto'}>
                                    <Avatar sx={{
                                        width: '10rem',
                                        height: '10rem',
                                        objectFit: 'contain',
                                    }}
                                        src={avatar.preview}
                                    />
                                    {
                                        avatar.error && (
                                            <Typography color='error' m={'1rem'} variant='caption'>
                                                {avatar.error}
                                            </Typography>
                                        )
                                    }
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            color: 'white',
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            ":hover": {
                                                bgcolor: "rgba(0,0,0,0.7)",
                                            },
                                        }}
                                        component='label'
                                    >
                                        <>
                                            <CameraAltIcon />
                                            <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                                        </>
                                    </IconButton>
                                </Stack>

                                <TextField
                                    required
                                    fullWidth
                                    label="Name"
                                    margin='normal'
                                    value={name.value}
                                    onChange={name.changeHandler}
                                    variant='outlined'
                                />

                                <TextField
                                    required
                                    fullWidth
                                    label="Bio"
                                    margin='normal'
                                    variant='outlined'
                                    value={bio.value}
                                    onChange={bio.changeHandler}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    margin='normal'
                                    variant='outlined'
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />
                                {
                                    username.error && (
                                        <Typography color='error' variant='caption'>
                                            {username.error}
                                        </Typography>
                                    )
                                }
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    margin='normal'
                                    type='password'
                                    variant='outlined'
                                    value={password.value}
                                    onChange={password.changeHandler}
                                />
                                {
                                    password.error && (
                                        <Typography color='error' variant='caption'>
                                            {password.error}
                                        </Typography>
                                    )
                                }
                                <Button
                                    sx={{ marginTop: '1rem' }}
                                    variant='contained'
                                    color='primary'
                                    fullWidth
                                    type='submit'
                                >
                                    Register
                                </Button>
                                <Typography textAlign={'center'} m={'1rem'}>
                                    OR
                                </Typography>
                                <Button

                                    variant='text'
                                    fullWidth
                                    onClick={toggleLogin}
                                >
                                    Login
                                </Button>
                            </form>
                        </>
                    )
                }
            </Paper>
        </Container>
        </div>
    )
}

export default Login