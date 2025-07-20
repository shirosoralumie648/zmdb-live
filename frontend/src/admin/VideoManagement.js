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
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress
} from '@mui/material';
import {
    ArrowBack,
    VideoLibrary,
    Add,
    Edit,
    Delete,
    Search,
    FilterList,
    PlayArrow,
    ContentCut,
    Upload,
    Visibility
} from '@mui/icons-material';
import VideoApi from '../api/VideoApi';
import OrganizationApi from '../api/OrganizationApi';
import AuthorApi from '../api/AuthorApi';

export const VideoManagement = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = React.useState([]);
    const [organizations, setOrganizations] = React.useState([]);
    const [authors, setAuthors] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [selectedOrg, setSelectedOrg] = React.useState('');
    const [selectedAuthor, setSelectedAuthor] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [openDialog, setOpenDialog] = React.useState(false);
    const [editingVideo, setEditingVideo] = React.useState(null);
    const [videoForm, setVideoForm] = React.useState({
        title: '',
        description: '',
        authorId: '',
        duration: '',
        fileUrl: '',
        coverUrl: '',
        type: 1
    });

    React.useEffect(() => {
        loadOrganizations();
        loadVideos();
    }, []);

    React.useEffect(() => {
        if (selectedOrg) {
            loadAuthorsByOrg(selectedOrg);
            loadVideosByOrg(selectedOrg);
        }
    }, [selectedOrg]);

    React.useEffect(() => {
        if (selectedAuthor) {
            loadVideosByAuthor(selectedAuthor);
        }
    }, [selectedAuthor]);

    const loadOrganizations = async () => {
        try {
            const data = await OrganizationApi.findAll();
            setOrganizations(data);
        } catch (err) {
            setError('加载组织列表失败：' + err.message);
        }
    };

    const loadAuthorsByOrg = async (orgId) => {
        try {
            const data = await AuthorApi.findByOrganizationId(orgId);
            setAuthors(data);
        } catch (err) {
            setError('加载作者列表失败：' + err.message);
        }
    };

    const loadVideos = async () => {
        setLoading(true);
        try {
            const data = await VideoApi.findAll();
            setVideos(data);
        } catch (err) {
            setError('加载视频列表失败：' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadVideosByOrg = async (orgId) => {
        setLoading(true);
        try {
            const data = await VideoApi.findByOrganizationId(orgId);
            setVideos(data);
        } catch (err) {
            setError('加载组织视频失败：' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadVideosByAuthor = async (authorId) => {
        setLoading(true);
        try {
            const data = await VideoApi.findByAuthorId(authorId);
            setVideos(data);
        } catch (err) {
            setError('加载作者视频失败：' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin');
    };

    const handleAddVideo = () => {
        setEditingVideo(null);
        setVideoForm({
            title: '',
            description: '',
            authorId: selectedAuthor || '',
            duration: '',
            fileUrl: '',
            coverUrl: '',
            type: 1
        });
        setOpenDialog(true);
    };

    const handleEditVideo = (video) => {
        setEditingVideo(video);
        setVideoForm({
            title: video.title,
            description: video.description || '',
            authorId: video.authorId,
            duration: VideoApi.formatDuration(video.duration),
            fileUrl: video.fileUrl,
            coverUrl: video.coverUrl || '',
            type: video.type
        });
        setOpenDialog(true);
    };

    const handleDeleteVideo = async (video) => {
        if (!window.confirm(`确定要删除视频"${video.title}"吗？`)) {
            return;
        }

        try {
            await VideoApi.delete(video.id);
            setSuccess('视频删除成功');
            if (selectedAuthor) {
                loadVideosByAuthor(selectedAuthor);
            } else if (selectedOrg) {
                loadVideosByOrg(selectedOrg);
            } else {
                loadVideos();
            }
        } catch (err) {
            setError('删除视频失败：' + err.message);
        }
    };

    const handleSaveVideo = async () => {
        try {
            const videoData = {
                ...videoForm,
                duration: VideoApi.parseDuration(videoForm.duration),
                authorId: parseInt(videoForm.authorId),
                type: parseInt(videoForm.type)
            };

            if (editingVideo) {
                await VideoApi.update(editingVideo.id, videoData);
                setSuccess('视频更新成功');
            } else {
                await VideoApi.create(videoData);
                setSuccess('视频创建成功');
            }

            setOpenDialog(false);
            if (selectedAuthor) {
                loadVideosByAuthor(selectedAuthor);
            } else if (selectedOrg) {
                loadVideosByOrg(selectedOrg);
            } else {
                loadVideos();
            }
        } catch (err) {
            setError('保存视频失败：' + err.message);
        }
    };

    const handleCreateClip = (video) => {
        navigate(`/admin/video-editor/${video.id}`);
    };

    const handleViewClips = (video) => {
        navigate(`/admin/clips?videoId=${video.id}`);
    };

    const formatDate = (datetime) => {
        if (!datetime) return '-';
        const date = new Date(datetime);
        return date.toLocaleDateString('zh-CN');
    };

    const formatTime = (datetime) => {
        if (!datetime) return '-';
        const date = new Date(datetime);
        return date.toLocaleTimeString('zh-CN');
    };

    const filteredVideos = videos.filter(video =>
        !searchKeyword || video.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

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
                        视频管理
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddVideo}
                    sx={{
                        background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #f5576c 0%, #f093fb 100%)',
                        }
                    }}
                >
                    添加视频
                </Button>
            </Box>

            {/* 消息提示 */}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
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
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                筛选条件
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>选择组织</InputLabel>
                                <Select
                                    value={selectedOrg}
                                    label="选择组织"
                                    onChange={(e) => {
                                        setSelectedOrg(e.target.value);
                                        setSelectedAuthor('');
                                    }}
                                >
                                    <MenuItem value="">全部组织</MenuItem>
                                    {organizations.map((org) => (
                                        <MenuItem key={org.id} value={org.id}>
                                            {org.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>选择作者</InputLabel>
                                <Select
                                    value={selectedAuthor}
                                    label="选择作者"
                                    onChange={(e) => setSelectedAuthor(e.target.value)}
                                    disabled={!selectedOrg}
                                >
                                    <MenuItem value="">全部作者</MenuItem>
                                    {authors.map((author) => (
                                        <MenuItem key={author.id} value={author.id}>
                                            {author.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                placeholder="搜索视频标题..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
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
                                1. 首先选择组织和作者来筛选视频列表
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                2. 点击"添加视频"上传新的完整视频文件
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                3. 点击"剪辑"按钮可以从完整视频中创建片段
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                4. 点击"查看片段"可以查看该视频的所有剪辑片段
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 加载进度 */}
            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {/* 视频列表表格 */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>封面</TableCell>
                            <TableCell>标题</TableCell>
                            <TableCell>时长</TableCell>
                            <TableCell>上传时间</TableCell>
                            <TableCell>作者</TableCell>
                            <TableCell>类型</TableCell>
                            <TableCell>文件大小</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVideos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        {loading ? '加载中...' : '暂无视频数据'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredVideos.map((video) => {
                                const typeInfo = VideoApi.getTypeLabel(video.type);
                                return (
                                    <TableRow key={video.id} hover>
                                        <TableCell>
                                            <Avatar
                                                src={video.coverUrl}
                                                variant="rounded"
                                                sx={{ width: 80, height: 45 }}
                                            >
                                                <VideoLibrary />
                                            </Avatar>
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
                                                {video.title}
                                            </Typography>
                                            {video.description && (
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary"
                                                    sx={{ 
                                                        maxWidth: 300,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {video.description}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {VideoApi.formatDuration(video.duration)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(video.uploadTime)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatTime(video.uploadTime)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {video.author && (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        src={video.author.avatar}
                                                        sx={{ width: 24, height: 24, mr: 1 }}
                                                    >
                                                        {video.author.name?.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {video.author.name}
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
                                        <TableCell>
                                            <Typography variant="body2">
                                                {VideoApi.formatFileSize(video.fileSize)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="剪辑视频">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleCreateClip(video)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <ContentCut />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="查看片段">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewClips(video)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="编辑">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditVideo(video)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="删除">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteVideo(video)}
                                                    color="error"
                                                >
                                                    <Delete />
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

            {/* 视频编辑对话框 */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingVideo ? '编辑视频' : '添加视频'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="视频标题"
                                value={videoForm.title}
                                onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="视频描述"
                                value={videoForm.description}
                                onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>作者</InputLabel>
                                <Select
                                    value={videoForm.authorId}
                                    label="作者"
                                    onChange={(e) => setVideoForm({...videoForm, authorId: e.target.value})}
                                >
                                    {authors.map((author) => (
                                        <MenuItem key={author.id} value={author.id}>
                                            {author.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="视频时长 (HH:MM:SS)"
                                value={videoForm.duration}
                                onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                                placeholder="00:10:30"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="视频文件URL"
                                value={videoForm.fileUrl}
                                onChange={(e) => setVideoForm({...videoForm, fileUrl: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="封面图片URL"
                                value={videoForm.coverUrl}
                                onChange={(e) => setVideoForm({...videoForm, coverUrl: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>视频类型</InputLabel>
                                <Select
                                    value={videoForm.type}
                                    label="视频类型"
                                    onChange={(e) => setVideoForm({...videoForm, type: e.target.value})}
                                >
                                    <MenuItem value={1}>本地视频</MenuItem>
                                    <MenuItem value={2}>B站视频</MenuItem>
                                    <MenuItem value={3}>直播录像</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>取消</Button>
                    <Button 
                        onClick={handleSaveVideo}
                        variant="contained"
                        disabled={!videoForm.title || !videoForm.authorId || !videoForm.fileUrl}
                    >
                        保存
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VideoManagement;
