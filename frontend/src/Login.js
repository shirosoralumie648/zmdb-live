import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from './api/AuthApi';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Alert, 
    Paper,
    Container,
    Tab,
    Tabs,
    InputAdornment,
    IconButton,
    Fade,
    Divider
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    Person, 
    Lock, 
    Email,
    LoginOutlined,
    PersonAddOutlined
} from '@mui/icons-material';

export const Login = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError('');
        setSuccess('');
        setUsername('');
        setPassword('');
        setEmail('');
        setConfirmPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const res = await AuthApi.login(username, password);
            if (res.token) {
                localStorage.setItem('token', res.token);
                setSuccess('登录成功！正在跳转...');
                setTimeout(() => navigate('/'), 1000);
            } else {
                setError('登录失败，请稍后尝试！');
            }
        } catch (ex) {
            setError(ex.message || '登录失败');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // 验证密码确认
        if (password !== confirmPassword) {
            setError('两次输入的密码不一致');
            setLoading(false);
            return;
        }
        
        try {
            const res = await AuthApi.register(username, password, email);
            if (res.token) {
                localStorage.setItem('token', res.token);
                setSuccess('注册成功！正在跳转...');
                setTimeout(() => navigate('/'), 1000);
            } else {
                setError('注册失败，请稍后尝试！');
            }
        } catch (ex) {
            setError(ex.message || '注册失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 4
                }}
            >
                <Fade in={true} timeout={800}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            width: '100%',
                            maxWidth: 450
                        }}
                    >
                        {/* 标题 */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                ZMDB Live
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                专业的视频字幕管理平台
                            </Typography>
                        </Box>

                        {/* 选项卡 */}
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{ mb: 3 }}
                        >
                            <Tab
                                icon={<LoginOutlined />}
                                label="登录"
                                iconPosition="start"
                            />
                            <Tab
                                icon={<PersonAddOutlined />}
                                label="注册"
                                iconPosition="start"
                            />
                        </Tabs>

                        {/* 登录表单 */}
                        {tabValue === 0 && (
                            <Fade in={tabValue === 0} timeout={300}>
                                <Box component="form" onSubmit={handleLogin}>
                                    <TextField
                                        label="用户名"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="密码"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 3 }}
                                    />
                                    
                                    {error && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {error}
                                        </Alert>
                                    )}
                                    
                                    {success && (
                                        <Alert severity="success" sx={{ mb: 2 }}>
                                            {success}
                                        </Alert>
                                    )}
                                    
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            py: 1.5,
                                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                                            }
                                        }}
                                    >
                                        {loading ? '登录中...' : '登录'}
                                    </Button>
                                </Box>
                            </Fade>
                        )}

                        {/* 注册表单 */}
                        {tabValue === 1 && (
                            <Fade in={tabValue === 1} timeout={300}>
                                <Box component="form" onSubmit={handleRegister}>
                                    <TextField
                                        label="用户名"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        helperText="至少3个字符"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <TextField
                                        label="邮箱（可选）"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <TextField
                                        label="密码"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        helperText="至少6个字符"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <TextField
                                        label="确认密码"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 3 }}
                                    />
                                    
                                    {error && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {error}
                                        </Alert>
                                    )}
                                    
                                    {success && (
                                        <Alert severity="success" sx={{ mb: 2 }}>
                                            {success}
                                        </Alert>
                                    )}
                                    
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            py: 1.5,
                                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                                            }
                                        }}
                                    >
                                        {loading ? '注册中...' : '注册'}
                                    </Button>
                                </Box>
                            </Fade>
                        )}

                        <Divider sx={{ my: 3 }} />
                        
                        <Typography variant="body2" color="text.secondary" align="center">
                            © 2024 ZMDB Live - 字幕管理系统
                        </Typography>
                    </Paper>
                </Fade>
            </Box>
        </Container>
    );
};
