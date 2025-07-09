import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from './api/AuthApi';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

export const Login = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await AuthApi.login(username, password);
            if (res.token) {
                localStorage.setItem('token', res.token);
                navigate('/');
            } else {
                setError('登录失败，请稍后尝试！');
            }
        } catch (ex) {
            setError(ex.message || '登录失败');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>登录</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="用户名"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="密码"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
                <Button type="submit" variant="contained" color="primary" fullWidth>登录</Button>
            </form>
        </Box>
    );
};
