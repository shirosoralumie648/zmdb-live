import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    Alert,
    Tooltip,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import {
    ArrowBack,
    VideoLibrary,
    Subtitles,
    Edit,
    Delete,
    Search,
    FilterList,
    PlayArrow
} from '@mui/icons-material';
import ClipApi from '../api/ClipApi';
import OrganizationApi from '../api/OrganizationApi';

export const ClipManagement = () => {
    const navigate = useNavigate();
    const [clips, setClips] = React.useState([]);
    const [organizations, setOrganizations] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [selectedOrg, setSelectedOrg] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');

    // 加载剪辑列表
    const loadClips = async () => {
        setLoading(true);
        try {
            let data = [];
            if (selectedOrg) {
                data = await ClipApi.findByOrganizationId(selectedOrg, searchKeyword);
            } else {
                // 这里需要一个获取所有剪辑的API，暂时使用空数组
                data = [];
            }
            setClips(data || []);
        } catch (err) {
            setError('加载剪辑列表失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    // 加载组织列表
    const loadOrganizations = async () => {
        try {
            const data = await OrganizationApi.findAll();
            setOrganizations(data || []);
        } catch (err) {
            console.error('加载组织列表失败:', err);
        }
    };

    React.useEffect(() => {
        loadOrganizations();
    }, []);

    React.useEffect(() => {
        if (selectedOrg) {
            loadClips();
        } else {
            setClips([]);
        }
    }, [selectedOrg, searchKeyword]);

    const handleBack = () => {
        navigate('/admin');
    };

    const handleEditSubtitle = (clip) => {
        navigate(`/admin/subtitles?clipId=${clip.id}`);
    };

    const handleSearch = () => {
        loadClips();
    };

    const formatDate = (datetime) => {
        if (!datetime) return '-';
        const [date, time] = datetime.split(' ');
        return date;
    };

    const formatTime = (datetime) => {
        if (!datetime) return '-';
        const [date, time] = datetime.split(' ');
        return time;
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 0: return { label: '待解析', color: 'default' };
            case 1: return { label: 'B站', color: 'primary' };
            case 2: return { label: '解析中', color: 'warning' };
            case 3: return { label: '本地源', color: 'success' };
            case 4: return { label: '直播中', color: 'error' };
            default: return { label: '未知', color: 'default' };
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <VideoLibrary sx={{ mr: 1, color: '#f093fb' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        剪辑管理
                    </Typography>
                </Box>
            </Box>

            {/* 消息提示 */}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* 筛选和搜索 */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                筛选条件
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>选择组织</InputLabel>
                                <Select
                                    value={selectedOrg}
                                    label="选择组织"
                                    onChange={(e) => setSelectedOrg(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>请选择组织</em>
                                    </MenuItem>
                                    {organizations.map((org) => (
                                        <MenuItem key={org.id} value={org.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar
                                                    src={org.avatar ? `//${org.avatar}@60w_60h.webp` : undefined}
                                                    sx={{ width: 24, height: 24, mr: 1 }}
                                                >
                                                    {org.name?.charAt(0)}
                                                </Avatar>
                                                {org.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                placeholder="搜索剪辑标题..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleSearch}>
                                                <Search />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                使用说明
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                1. 首先选择一个组织来查看该组织下的所有剪辑
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                2. 可以通过搜索框按标题搜索特定的剪辑
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                3. 点击"编辑字幕"按钮可以进入字幕编辑器
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                4. 字幕编辑器支持上传、下载、搜索和时间偏移调整
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 剪辑列表表格 */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>封面</TableCell>
                            <TableCell>标题</TableCell>
                            <TableCell>日期</TableCell>
                            <TableCell>时间</TableCell>
                            <TableCell>作者</TableCell>
                            <TableCell>类型</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!selectedOrg ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        请先选择一个组织来查看剪辑列表
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : clips.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        {loading ? '加载中...' : '该组织暂无剪辑数据'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            clips.map((clip) => {
                                const typeInfo = getTypeLabel(clip.type);
                                return (
                                    <TableRow key={clip.id} hover>
                                        <TableCell>
                                            <Avatar
                                                src={clip.cover ? `//${clip.cover}@120w_60h.webp` : undefined}
                                                variant="rounded"
                                                sx={{ width: 80, height: 45 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography 
                                                variant="subtitle2" 
                                                sx={{ 
                                                    fontWeight: 'medium',
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {clip.shownTitle || clip.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(clip.datetime)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatTime(clip.datetime)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {clip.author && (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        src={clip.author.avatar ? `//${clip.author.avatar}@60w_60h.webp` : undefined}
                                                        sx={{ width: 24, height: 24, mr: 1 }}
                                                    >
                                                        {clip.author.name?.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {clip.author.name}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={typeInfo.label}
                                                color={typeInfo.color}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="编辑字幕">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditSubtitle(clip)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <Subtitles />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="播放">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => window.open(clip.redirectUrl, '_blank')}
                                                    disabled={!clip.redirectUrl}
                                                >
                                                    <PlayArrow />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
