import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
    AppBar, 
    Link, 
    Toolbar, 
    Typography, 
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Chip,
    Badge
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    Settings,
    Notifications,
    Home,
    VideoLibrary
} from '@mui/icons-material';
import NotificationsApi from './api/NotificationsApi';

export const Header = () => {
    const [content, setContent] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationCount, setNotificationCount] = React.useState(0);
    const navigate = useNavigate();
    
    // 获取当前用户信息
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        handleMenuClose();
    };
    
    const handleSettings = () => {
        navigate('/settings');
        handleMenuClose();
    };

    // React.useEffect(() => {
    //     if (isLoggedIn) {
    //         const interval = setInterval(() => {
    //             NotificationsApi.find().then((json) => {
    //                 setContent(json.content || '');
    //                 setNotificationCount(json.count || 0);
    //             }).catch(() => {});
    //         }, 30000); // 30秒检查一次
    //         return () => clearInterval(interval);
    //     }
    // }, [isLoggedIn]);

    return (
        <React.Fragment>
            <AppBar 
                position='fixed' 
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <Toolbar sx={{ minHeight: '70px !important' }}>
                    {/* Logo和标题 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <VideoLibrary sx={{ mr: 1, fontSize: '2rem' }} />
                        <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                                fontWeight: 'bold',
                                letterSpacing: '0.5px'
                            }}
                        >
                            <Link 
                                component={RouterLink} 
                                color='inherit' 
                                underline='none' 
                                to='/' 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                            >
                                ZMDB Live
                            </Link>
                        </Typography>
                        <Chip 
                            label="字幕管理" 
                            size="small" 
                            sx={{ 
                                ml: 2, 
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontSize: '0.75rem'
                            }} 
                        />
                    </Box>

                    {/* 通知信息 */}
                    {content && (
                        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#FFE082',
                                    fontWeight: 'medium',
                                    animation: 'pulse 2s infinite'
                                }}
                            >
                                📢 {content}
                            </Typography>
                        </Box>
                    )}

                    {/* 用户操作区域 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isLoggedIn ? (
                            <>
                                {/* 通知图标 */}
                                <IconButton color="inherit">
                                    <Badge badgeContent={notificationCount} color="error">
                                        <Notifications />
                                    </Badge>
                                </IconButton>
                                
                                {/* 用户菜单 */}
                                <IconButton
                                    onClick={handleMenuOpen}
                                    color="inherit"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                                        <AccountCircle />
                                    </Avatar>
                                </IconButton>
                                
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        sx: {
                                            mt: 1,
                                            minWidth: 180,
                                            borderRadius: 2,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                                        }
                                    }}
                                >
                                    <MenuItem onClick={handleSettings}>
                                        <Settings sx={{ mr: 1 }} />
                                        设置
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Logout sx={{ mr: 1 }} />
                                        退出登录
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <IconButton 
                                color="inherit" 
                                onClick={() => navigate('/login')}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                <AccountCircle />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar sx={{ minHeight: '70px !important' }} /> {/** 避免AppBar压住下面的Box */}
        </React.Fragment>
    )
}