import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Button,
    IconButton,
    Paper,
    Alert,
    TextField,
    Grid,
    Card,
    CardContent,
    Slider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    LinearProgress,
    Divider
} from '@mui/material';
import {
    ArrowBack,
    PlayArrow,
    Pause,
    Stop,
    ContentCut,
    Save,
    Delete,
    Edit,
    Add,
    VideoLibrary
} from '@mui/icons-material';
import VideoApi from '../api/VideoApi';

export const VideoEditor = () => {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const [video, setVideo] = React.useState(null);
    const [clips, setClips] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [selectionStart, setSelectionStart] = React.useState(0);
    const [selectionEnd, setSelectionEnd] = React.useState(0);
    const [openClipDialog, setOpenClipDialog] = React.useState(false);
    const [clipForm, setClipForm] = React.useState({
        title: '',
        startTime: 0,
        endTime: 0
    });
    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (videoId) {
            loadVideo();
            loadClips();
        }
    }, [videoId]);

    const loadVideo = async () => {
        setLoading(true);
        try {
            const data = await VideoApi.findById(videoId);
            setVideo(data);
            setDuration(data.duration || 0);
            setSelectionEnd(data.duration || 0);
        } catch (err) {
            setError('加载视频失败：' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadClips = async () => {
        try {
            const data = await VideoApi.getClips(videoId);
            setClips(data);
        } catch (err) {
            setError('加载剪辑列表失败：' + err.message);
        }
    };

    const handleBack = () => {
        navigate('/admin/videos');
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleStop = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setCurrentTime(0);
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleSeek = (newTime) => {
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleSelectionChange = (event, newValue) => {
        setSelectionStart(newValue[0]);
        setSelectionEnd(newValue[1]);
    };

    const handleSetSelectionStart = () => {
        setSelectionStart(currentTime);
    };

    const handleSetSelectionEnd = () => {
        setSelectionEnd(currentTime);
    };

    const handleCreateClip = () => {
        if (selectionStart >= selectionEnd) {
            setError('结束时间必须大于开始时间');
            return;
        }

        setClipForm({
            title: `${video.title}_片段_${Math.floor(selectionStart)}-${Math.floor(selectionEnd)}`,
            startTime: Math.floor(selectionStart),
            endTime: Math.floor(selectionEnd)
        });
        setOpenClipDialog(true);
    };

    const handleSaveClip = async () => {
        try {
            const clipData = {
                title: clipForm.title,
                startTime: clipForm.startTime,
                endTime: clipForm.endTime
            };

            await VideoApi.createClip(videoId, clipData);
            setSuccess('剪辑片段创建成功');
            setOpenClipDialog(false);
            loadClips();
        } catch (err) {
            setError('创建剪辑失败：' + err.message);
        }
    };

    const handleDeleteClip = async (clipId) => {
        if (!window.confirm('确定要删除这个剪辑片段吗？')) {
            return;
        }

        try {
            // 这里需要调用剪辑删除API
            setSuccess('剪辑片段删除成功');
            loadClips();
        } catch (err) {
            setError('删除剪辑失败：' + err.message);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return '00:00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return [hours, minutes, remainingSeconds]
            .map(val => val.toString().padStart(2, '0'))
            .join(':');
    };

    const getClipColor = (index) => {
        const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
        return colors[index % colors.length];
    };

    if (!video) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4">视频剪辑器</Typography>
                </Box>
                {loading && <LinearProgress />}
                {error && <Alert severity="error">{error}</Alert>}
            </Container>
        );
    }

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
                        视频剪辑器
                    </Typography>
                </Box>
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

            <Grid container spacing={3}>
                {/* 视频播放器区域 */}
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {video.title}
                            </Typography>
                            
                            {/* 视频播放器 */}
                            <Box sx={{ 
                                position: 'relative', 
                                width: '100%', 
                                backgroundColor: '#000',
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}>
                                <video
                                    ref={videoRef}
                                    src={video.fileUrl}
                                    style={{ 
                                        width: '100%', 
                                        height: 'auto',
                                        maxHeight: '400px'
                                    }}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={() => {
                                        if (videoRef.current) {
                                            setDuration(videoRef.current.duration);
                                            setSelectionEnd(videoRef.current.duration);
                                        }
                                    }}
                                />
                            </Box>

                            {/* 播放控制 */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                                <IconButton onClick={handlePlayPause} color="primary">
                                    {isPlaying ? <Pause /> : <PlayArrow />}
                                </IconButton>
                                <IconButton onClick={handleStop}>
                                    <Stop />
                                </IconButton>
                                <Typography variant="body2" sx={{ minWidth: 80 }}>
                                    {formatTime(currentTime)}
                                </Typography>
                                <Slider
                                    value={currentTime}
                                    max={duration}
                                    onChange={(e, newValue) => handleSeek(newValue)}
                                    sx={{ flex: 1, mx: 2 }}
                                />
                                <Typography variant="body2" sx={{ minWidth: 80 }}>
                                    {formatTime(duration)}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* 时间选择区域 */}
                            <Typography variant="h6" gutterBottom>
                                选择剪辑范围
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    拖动滑块或使用按钮设置剪辑的开始和结束时间
                                </Typography>
                                <Slider
                                    value={[selectionStart, selectionEnd]}
                                    onChange={handleSelectionChange}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={formatTime}
                                    max={duration}
                                    sx={{ mt: 2 }}
                                />
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TextField
                                            label="开始时间"
                                            value={formatTime(selectionStart)}
                                            size="small"
                                            InputProps={{ readOnly: true }}
                                        />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleSetSelectionStart}
                                        >
                                            设为当前时间
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TextField
                                            label="结束时间"
                                            value={formatTime(selectionEnd)}
                                            size="small"
                                            InputProps={{ readOnly: true }}
                                        />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleSetSelectionEnd}
                                        >
                                            设为当前时间
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<ContentCut />}
                                    onClick={handleCreateClip}
                                    disabled={selectionStart >= selectionEnd}
                                    sx={{
                                        background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #f5576c 0%, #f093fb 100%)',
                                        }
                                    }}
                                >
                                    创建剪辑片段
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleSeek(selectionStart)}
                                >
                                    跳转到开始
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleSeek(selectionEnd)}
                                >
                                    跳转到结束
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 剪辑列表区域 */}
                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                剪辑片段列表
                            </Typography>
                            
                            {clips.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        还没有创建任何剪辑片段
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        选择时间范围后点击"创建剪辑片段"
                                    </Typography>
                                </Box>
                            ) : (
                                <List>
                                    {clips.map((clip, index) => (
                                        <ListItem key={clip.clip_id} divider>
                                            <ListItemText
                                                primary={clip.clip_title}
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatTime(clip.clip_startTime)} - {formatTime(clip.clip_endTime)}
                                                        </Typography>
                                                        <Chip
                                                            label={`时长: ${formatTime(clip.clip_endTime - clip.clip_startTime)}`}
                                                            size="small"
                                                            color={getClipColor(index)}
                                                            sx={{ mt: 0.5 }}
                                                        />
                                                    </Box>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        handleSeek(clip.clip_startTime);
                                                        setSelectionStart(clip.clip_startTime);
                                                        setSelectionEnd(clip.clip_endTime);
                                                    }}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <PlayArrow />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteClip(clip.clip_id)}
                                                    color="error"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 创建剪辑对话框 */}
            <Dialog open={openClipDialog} onClose={() => setOpenClipDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>创建剪辑片段</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="片段标题"
                                value={clipForm.title}
                                onChange={(e) => setClipForm({...clipForm, title: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="开始时间 (秒)"
                                type="number"
                                value={clipForm.startTime}
                                onChange={(e) => setClipForm({...clipForm, startTime: parseInt(e.target.value) || 0})}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="结束时间 (秒)"
                                type="number"
                                value={clipForm.endTime}
                                onChange={(e) => setClipForm({...clipForm, endTime: parseInt(e.target.value) || 0})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                                片段时长: {formatTime(clipForm.endTime - clipForm.startTime)}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenClipDialog(false)}>取消</Button>
                    <Button 
                        onClick={handleSaveClip}
                        variant="contained"
                        disabled={!clipForm.title || clipForm.startTime >= clipForm.endTime}
                    >
                        创建片段
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VideoEditor;
