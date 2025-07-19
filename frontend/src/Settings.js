import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Container,
    TextField,
    Button,
    Divider,
    Alert,
    Switch,
    FormControlLabel,
    Grid,
    Card,
    CardContent,
    IconButton,
    Avatar,
    Chip
} from '@mui/material';
import {
    ArrowBack,
    Person,
    Security,
    Notifications,
    Palette,
    Save,
    Edit
} from '@mui/icons-material';

export const Settings = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = React.useState({
        username: '',
        email: '',
        role: ''
    });
    const [settings, setSettings] = React.useState({
        notifications: true,
        autoSave: true,
        darkMode: false,
        language: 'zh-CN'
    });
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');

    // 模拟获取用户信息
    React.useEffect(() => {
        // 这里应该从API获取用户信息
        setUserInfo({
            username: 'shirosoralumie',
            email: '',
            role: 'admin'
        });
    }, []);

    const handleSaveSettings = () => {
        // 这里应该调用API保存设置
        setSuccess('设置已保存！');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    设置
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* 用户信息卡片 */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: 'fit-content' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: 'primary.main'
                                }}
                            >
                                <Person sx={{ fontSize: '2rem' }} />
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                                {userInfo.username}
                            </Typography>
                            <Chip
                                label={userInfo.role === 'admin' ? '管理员' : '普通用户'}
                                color={userInfo.role === 'admin' ? 'primary' : 'default'}
                                size="small"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* 设置面板 */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        {/* 个人信息设置 */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <Person sx={{ mr: 1 }} />
                                个人信息
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="用户名"
                                        value={userInfo.username}
                                        fullWidth
                                        disabled
                                        helperText="用户名不可修改"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="邮箱"
                                        type="email"
                                        value={userInfo.email}
                                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                                        fullWidth
                                        placeholder="请输入邮箱地址"
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* 系统设置 */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <Notifications sx={{ mr: 1 }} />
                                系统设置
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications}
                                                onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                                            />
                                        }
                                        label="启用通知"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.autoSave}
                                                onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                                            />
                                        }
                                        label="自动保存"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.darkMode}
                                                onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                                            />
                                        }
                                        label="深色模式"
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* 安全设置 */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <Security sx={{ mr: 1 }} />
                                安全设置
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        onClick={() => {
                                            // 这里可以打开修改密码对话框
                                            setError('修改密码功能待开发');
                                            setTimeout(() => setError(''), 3000);
                                        }}
                                    >
                                        修改密码
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* 消息提示 */}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* 保存按钮 */}
                        <Box sx={{ textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSaveSettings}
                                sx={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                                    }
                                }}
                            >
                                保存设置
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
