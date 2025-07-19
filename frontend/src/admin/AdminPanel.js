import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Avatar,
    Chip
} from '@mui/material';
import {
    ArrowBack,
    Business,
    Person,
    Subtitles,
    VideoLibrary,
    Settings,
    Analytics
} from '@mui/icons-material';

export const AdminPanel = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    const adminCards = [
        {
            title: '组织管理',
            description: '创建、编辑和管理组织信息',
            icon: <Business sx={{ fontSize: '3rem', color: '#667eea' }} />,
            path: '/admin/organizations',
            color: '#667eea'
        },
        {
            title: '作者管理',
            description: '管理直播作者信息和关联组织',
            icon: <Person sx={{ fontSize: '3rem', color: '#764ba2' }} />,
            path: '/admin/authors',
            color: '#764ba2'
        },
        {
            title: '剪辑管理',
            description: '管理视频剪辑和相关操作',
            icon: <VideoLibrary sx={{ fontSize: '3rem', color: '#f093fb' }} />,
            path: '/admin/clips',
            color: '#f093fb'
        },
        {
            title: '字幕管理',
            description: '编辑和管理字幕内容',
            icon: <Subtitles sx={{ fontSize: '3rem', color: '#4facfe' }} />,
            path: '/admin/subtitles',
            color: '#4facfe'
        },
        {
            title: '系统设置',
            description: '系统配置和参数管理',
            icon: <Settings sx={{ fontSize: '3rem', color: '#43e97b' }} />,
            path: '/admin/system',
            color: '#43e97b'
        },
        {
            title: '数据统计',
            description: '查看系统使用统计和分析',
            icon: <Analytics sx={{ fontSize: '3rem', color: '#fa709a' }} />,
            path: '/admin/analytics',
            color: '#fa709a'
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 2 }}>
                    管理员面板
                </Typography>
                <Chip
                    label="管理员专用"
                    color="primary"
                    size="small"
                    sx={{ 
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: 'white'
                    }}
                />
            </Box>

            {/* 管理功能卡片网格 */}
            <Grid container spacing={3}>
                {adminCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                },
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                            onClick={() => navigate(card.path)}
                        >
                            <CardContent sx={{ 
                                flexGrow: 1, 
                                textAlign: 'center',
                                pt: 4
                            }}>
                                <Box sx={{ mb: 2 }}>
                                    {card.icon}
                                </Box>
                                <Typography 
                                    variant="h6" 
                                    component="h2" 
                                    gutterBottom
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {card.title}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ minHeight: '40px' }}
                                >
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        background: `linear-gradient(45deg, ${card.color}, ${card.color}dd)`,
                                        '&:hover': {
                                            background: `linear-gradient(45deg, ${card.color}dd, ${card.color}bb)`,
                                        },
                                        borderRadius: 2,
                                        px: 3
                                    }}
                                >
                                    进入管理
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 快速统计信息 */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    系统概览
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Card sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                -
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                组织数量
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                -
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                作者数量
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                -
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                剪辑数量
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                -
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                字幕数量
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};
