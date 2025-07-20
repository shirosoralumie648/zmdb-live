import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    IconButton,
    Grid,
    Card,
    CardContent,
    Paper,
    Alert,
    Chip,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from '@mui/material';
import {
    ArrowBack,
    Analytics,
    TrendingUp,
    TrendingDown,
    People,
    VideoLibrary,
    Subtitles,
    Business,
    DateRange,
    Download,
    Refresh,
    BarChart,
    PieChart,
    Timeline,
    Storage,
    Speed,
    Visibility,
    ThumbUp,
    Star,
    AccessTime
} from '@mui/icons-material';
import StatisticsApi from '../api/StatisticsApi';

export const DataAnalytics = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [timeRange, setTimeRange] = React.useState('30'); // 30天
    
    // 统计数据状态
    const [statistics, setStatistics] = React.useState({
        overview: {
            totalOrganizations: 0,
            totalAuthors: 0,
            totalClips: 0,
            totalSubtitles: 0,
            totalUsers: 0,
            storageUsed: 0
        },
        trends: {
            clipsGrowth: 0,
            subtitlesGrowth: 0,
            authorsGrowth: 0,
            organizationsGrowth: 0
        },
        topOrganizations: [],
        topAuthors: [],
        recentActivity: [],
        clipsByType: [],
        subtitleStats: {
            avgLength: 0,
            totalDuration: 0,
            languageDistribution: []
        }
    });

    const handleBack = () => {
        navigate('/admin');
    };

    const loadStatistics = async () => {
        setLoading(true);
        try {
            // 并行加载所有统计数据
            const [overview, trends, topOrgs, topAuthors, activities, clipsByType, subtitleStats] = await Promise.all([
                StatisticsApi.getOverviewStats(),
                StatisticsApi.getTrends(parseInt(timeRange)),
                StatisticsApi.getTopOrganizations(5),
                StatisticsApi.getTopAuthors(5),
                StatisticsApi.getRecentActivity(5),
                StatisticsApi.getClipsByType(),
                StatisticsApi.getSubtitleStats()
            ]);

            const realStatistics = {
                overview: overview.data || {
                    totalOrganizations: 0,
                    totalAuthors: 0,
                    totalClips: 0,
                    totalSubtitles: 0,
                    totalUsers: 0,
                    storageUsed: 0
                },
                trends: trends.data || {
                    clipsGrowth: 0,
                    subtitlesGrowth: 0,
                    authorsGrowth: 0,
                    organizationsGrowth: 0
                },
                topOrganizations: topOrgs.data || [],
                topAuthors: topAuthors.data || [],
                recentActivity: activities.data || [],
                clipsByType: clipsByType.data || [],
                subtitleStats: subtitleStats.data || {
                    avgLength: 0,
                    totalDuration: 0,
                    languageDistribution: []
                }
            };

            setStatistics(realStatistics);
        } catch (err) {
            console.error('API调用失败:', err);
            setError('加载统计数据失败：' + (err.message || '网络错误，请检查后端服务'));
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadStatistics();
    }, [timeRange]);

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}小时${mins}分钟`;
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'clip': return <VideoLibrary color="primary" />;
            case 'subtitle': return <Subtitles color="secondary" />;
            case 'organization': return <Business color="success" />;
            case 'author': return <People color="warning" />;
            default: return <Analytics />;
        }
    };

    const getTrendIcon = (growth) => {
        return growth >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <LinearProgress />
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    正在加载数据统计...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Analytics sx={{ mr: 1, color: '#43e97b' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        数据分析
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>时间范围</InputLabel>
                        <Select
                            value={timeRange}
                            label="时间范围"
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <MenuItem value="7">最近7天</MenuItem>
                            <MenuItem value="30">最近30天</MenuItem>
                            <MenuItem value="90">最近90天</MenuItem>
                            <MenuItem value="365">最近一年</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadStatistics}
                    >
                        刷新
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        sx={{
                            background: 'linear-gradient(45deg, #43e97b, #38f9d7)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #3dd470, #32e6c8)',
                            }
                        }}
                    >
                        导出报告
                    </Button>
                </Box>
            </Box>

            {/* 错误提示 */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* 概览统计卡片 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ textAlign: 'center', p: 2, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                        <Business sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {statistics.overview.totalOrganizations}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            组织数量
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            {getTrendIcon(statistics.trends.organizationsGrowth)}
                            <Typography variant="caption" sx={{ ml: 0.5, color: 'white' }}>
                                {statistics.trends.organizationsGrowth > 0 ? '+' : ''}{statistics.trends.organizationsGrowth}%
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ textAlign: 'center', p: 2, background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                        <People sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {statistics.overview.totalAuthors}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            作者数量
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            {getTrendIcon(statistics.trends.authorsGrowth)}
                            <Typography variant="caption" sx={{ ml: 0.5, color: 'white' }}>
                                {statistics.trends.authorsGrowth > 0 ? '+' : ''}{statistics.trends.authorsGrowth}%
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ textAlign: 'center', p: 2, background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                        <VideoLibrary sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {statistics.overview.totalClips}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            剪辑数量
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            {getTrendIcon(statistics.trends.clipsGrowth)}
                            <Typography variant="caption" sx={{ ml: 0.5, color: 'white' }}>
                                {statistics.trends.clipsGrowth > 0 ? '+' : ''}{statistics.trends.clipsGrowth}%
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ textAlign: 'center', p: 2, background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
                        <Subtitles sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {statistics.overview.totalSubtitles}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            字幕数量
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            {getTrendIcon(statistics.trends.subtitlesGrowth)}
                            <Typography variant="caption" sx={{ ml: 0.5, color: 'white' }}>
                                {statistics.trends.subtitlesGrowth > 0 ? '+' : ''}{statistics.trends.subtitlesGrowth}%
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ textAlign: 'center', p: 2, background: 'linear-gradient(135deg, #fa709a, #fee140)' }}>
                        <Storage sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {statistics.overview.storageUsed}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            存储使用(GB)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            <Speed sx={{ color: 'white', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ ml: 0.5, color: 'white' }}>
                                75% 已使用
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ textAlign: 'center', p: 2, background: 'linear-gradient(135deg, #a8edea, #fed6e3)' }}>
                        <People sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {statistics.overview.totalUsers}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            用户数量
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            <Visibility sx={{ color: 'white', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ ml: 0.5, color: 'white' }}>
                                活跃用户
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* 热门组织 */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <BarChart sx={{ mr: 1 }} />
                                热门组织
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>组织名称</TableCell>
                                            <TableCell align="right">剪辑数</TableCell>
                                            <TableCell align="right">字幕数</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {statistics.topOrganizations.map((org, index) => (
                                            <TableRow key={org.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Chip 
                                                            label={index + 1} 
                                                            size="small" 
                                                            sx={{ mr: 1, minWidth: 24 }}
                                                            color={index < 3 ? 'primary' : 'default'}
                                                        />
                                                        {org.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{org.clipCount}</TableCell>
                                                <TableCell align="right">{org.subtitleCount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 热门作者 */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <Star sx={{ mr: 1 }} />
                                热门作者
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>作者</TableCell>
                                            <TableCell align="right">剪辑数</TableCell>
                                            <TableCell align="right">观看数</TableCell>
                                            <TableCell align="right">评分</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {statistics.topAuthors.map((author, index) => (
                                            <TableRow key={author.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Chip 
                                                            label={index + 1} 
                                                            size="small" 
                                                            sx={{ mr: 1, minWidth: 24 }}
                                                            color={index < 3 ? 'primary' : 'default'}
                                                        />
                                                        <Avatar 
                                                            src={author.avatar} 
                                                            sx={{ width: 24, height: 24, mr: 1 }}
                                                        />
                                                        {author.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{author.clipCount}</TableCell>
                                                <TableCell align="right">{formatNumber(author.totalViews)}</TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Star sx={{ fontSize: 16, color: 'gold', mr: 0.5 }} />
                                                        {author.avgRating}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 剪辑类型分布 */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <PieChart sx={{ mr: 1 }} />
                                剪辑类型分布
                            </Typography>
                            {statistics.clipsByType.map((item, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">{item.type}</Typography>
                                        <Typography variant="body2">{item.count} ({item.percentage}%)</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={item.percentage} 
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 字幕统计 */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <Timeline sx={{ mr: 1 }} />
                                字幕统计
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">平均长度</Typography>
                                    <Typography variant="h6">{statistics.subtitleStats.avgLength} 行</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">总时长</Typography>
                                    <Typography variant="h6">{formatDuration(statistics.subtitleStats.totalDuration)}</Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" gutterBottom>语言分布</Typography>
                            {statistics.subtitleStats.languageDistribution.map((lang, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2">{lang.language}</Typography>
                                        <Typography variant="body2">{lang.count} ({lang.percentage}%)</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={lang.percentage} 
                                        sx={{ height: 6, borderRadius: 3 }}
                                    />
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 最近活动 */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime sx={{ mr: 1 }} />
                                最近活动
                            </Typography>
                            <List>
                                {statistics.recentActivity.map((activity, index) => (
                                    <ListItem key={index} divider={index < statistics.recentActivity.length - 1}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                {getActivityIcon(activity.type)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1">{activity.action}</Typography>
                                                    <Chip label={activity.title} size="small" variant="outlined" />
                                                </Box>
                                            }
                                            secondary={`${activity.author} • ${activity.time}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};
