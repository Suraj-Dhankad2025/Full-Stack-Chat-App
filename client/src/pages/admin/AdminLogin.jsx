import React from 'react'
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
} from '@mui/material'
import { bgGradient } from '../../constants/color';
import { useInputValidation } from '6pp';
import { Navigate } from 'react-router-dom';

const isAdmin = true;
const AdminLogin = () => {
    const submitHandler = (e) => {
        e.preventDefault();
    }
    if(isAdmin){
        return <Navigate to='/admin/dashboard'/>
    }
    const secretKey = useInputValidation("");
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

                    <Typography variant='h5'>
                        Admin Login
                    </Typography>
                    <form style={{
                        width: '100%',
                        marginTop: '1rem'
                    }}
                        onSubmit={submitHandler}
                    >
                        <TextField
                            required
                            fullWidth
                            label="Secret Key"
                            margin='normal'
                            variant='outlined'
                            value={secretKey.value}
                            onChange={secretKey.changeHandler}
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

                    </form>

                </Paper>
            </Container>
        </div>
    )
}

export default AdminLogin