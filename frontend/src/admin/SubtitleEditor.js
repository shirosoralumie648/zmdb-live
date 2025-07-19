import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Chip,
    Tooltip,
    Grid,
    Card,
    CardContent,
    InputAdornment,
    Divider,
    LinearProgress
} from '@mui/material';
import {
    ArrowBack,
    Search,
    Upload,
    Download,
    AccessTime,
    Edit,
    Save,
    Cancel,
    Subtitles,
    PlayArrow,
    Pause,
    SkipNext,
    SkipPrevious
} from '@mui/icons-material';
import SubtitleApi from '../api/SubtitleApi';
import ClipApi from '../api/ClipApi';

export const SubtitleEditor = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clipId = searchParams.get('clipId');
    
    const [clip, setClip] = React.useState(null);
    const [subtitles, setSubtitles] = React.useState([]);
    const [filteredSubtitles, setFilteredSubtitles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    
    // 上传对话框
    const [uploadDialog, setUploadDialog] = React.useState(false);
    const [uploadContent, setUploadContent] = React.useState('');
    
    // 时间偏移对话框
    const [offsetDialog, setOffsetDialog] = React.useState(false);
    const [offsetValue, setOffsetValue] = React.useState(0);
    
    // 字幕统计
    const [subtitleStats, setSubtitleStats] = React.useState({ size: 0 });

    // 加载剪辑信息
    const loadClip = async () => {
        if (!clipId) return;
        try {
            const data = await ClipApi.findById(clipId);
            setClip(data);
        } catch (err) {
            setError('加载剪辑信息失败：' + (err.message || '未知错误'));
        }
    };

    // 加载字幕列表
    const loadSubtitles = async (keyword = '') => {
        if (!clipId) return;
        setLoading(true);
        try {
            const data = await SubtitleApi.findByClipId(clipId, keyword);
            setSubtitles(data || []);
            setFilteredSubtitles(data || []);
            
            // 加载字幕统计
            const stats = await SubtitleApi.getSubtitleSize(clipId);
            setSubtitleStats(stats || { size: 0 });
        } catch (err) {
            setError('加载字幕失败：' + (err.message || '未知错误'));
            setSubtitles([]);
            setFilteredSubtitles([]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (clipId) {
            loadClip();
            loadSubtitles();
        }
    }, [clipId]);

    const handleBack = () => {
        navigate('/admin');
    };

    const handleSearch = () => {
        loadSubtitles(searchKeyword);
    };

    const handleUploadSubtitles = async () => {
        if (!uploadContent.trim()) {
            setError('请输入字幕内容');
            return;
        }

        setLoading(true);
        try {
            await SubtitleApi.uploadSubtitles(clipId, uploadContent);
            setSuccess('字幕上传成功！');
            setUploadDialog(false);
            setUploadContent('');
            loadSubtitles();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('上传失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadSrt = async () => {
        try {
            const srtContent = await SubtitleApi.downloadSrt(clipId);
            const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${clip?.title || 'subtitle'}.srt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setSuccess('字幕下载成功！');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('下载失败：' + (err.message || '未知错误'));
        }
    };

    const handleUpdateOffset = async () => {
        if (offsetValue === 0) {
            setError('偏移量不能为0');
            return;
        }

        setLoading(true);
        try {
            await SubtitleApi.updateOffset(clipId, offsetValue * 1000); // 转换为微秒
            setSuccess(`时间偏移调整成功！偏移量：${offsetValue}秒`);
            setOffsetDialog(false);
            setOffsetValue(0);
            loadSubtitles();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('偏移调整失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (microseconds) => {
        const totalSeconds = Math.floor(microseconds / 1000000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((microseconds % 1000000) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    };

    if (!clipId) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    缺少剪辑ID参数，请从剪辑列表中选择要编辑的字幕
                </Alert>
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
                    <Subtitles sx={{ mr: 1, color: '#4facfe' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 2 }}>
                        字幕编辑器
                    </Typography>
                    {clip && (
                        <Chip 
                            label={clip.title} 
                            color="primary" 
                            variant="outlined"
                            sx={{ maxWidth: 300 }}
                        />
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Upload />}
                        onClick={() => setUploadDialog(true)}
                    >
                        上传字幕
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleDownloadSrt}
                        disabled={subtitles.length === 0}
                    >
                        下载SRT
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<AccessTime />}
                        onClick={() => setOffsetDialog(true)}
                        disabled={subtitles.length === 0}
                    >
                        时间偏移
                    </Button>
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

            {/* 统计信息和搜索 */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                字幕统计
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {subtitleStats.size || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        字幕条数
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {filteredSubtitles.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        显示条数
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {clip?.author?.name || '-'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        作者
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {clip?.datetime?.split(' ')[0] || '-'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        日期
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                搜索字幕
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="输入关键词搜索字幕..."
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
                                helperText="支持通配符 * 和 + 搜索"
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 加载进度 */}
            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {/* 字幕列表 */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell width="80px">行号</TableCell>
                            <TableCell width="120px">开始时间</TableCell>
                            <TableCell width="120px">结束时间</TableCell>
                            <TableCell width="80px">时长</TableCell>
                            <TableCell>字幕内容</TableCell>
                            <TableCell width="100px" align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubtitles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        {loading ? '加载中...' : '暂无字幕数据，请上传字幕文件'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubtitles.map((subtitle) => (
                                <TableRow key={subtitle.lineId} hover>
                                    <TableCell>
                                        <Chip 
                                            label={subtitle.lineId} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {formatTime(subtitle.start)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {formatTime(subtitle.end)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {((subtitle.end - subtitle.start) / 1000000).toFixed(1)}s
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body2"
                                            sx={{ 
                                                maxWidth: 400,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                            dangerouslySetInnerHTML={{ 
                                                __html: subtitle.markedContent || subtitle.content 
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="编辑字幕">
                                            <IconButton size="small">
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上传字幕对话框 */}
            <Dialog 
                open={uploadDialog} 
                onClose={() => setUploadDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Upload sx={{ mr: 1 }} />
                        上传字幕文件
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            label="SRT字幕内容"
                            fullWidth
                            multiline
                            rows={12}
                            value={uploadContent}
                            onChange={(e) => setUploadContent(e.target.value)}
                            placeholder="请粘贴SRT格式的字幕内容..."
                            helperText="支持标准SRT格式，将自动解析时间轴和字幕内容"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setUploadDialog(false)}
                        startIcon={<Cancel />}
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleUploadSubtitles}
                        variant="contained"
                        startIcon={<Save />}
                        disabled={loading}
                        sx={{
                            background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #4099e9, #00d9fe)',
                            }
                        }}
                    >
                        {loading ? '上传中...' : '上传'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 时间偏移对话框 */}
            <Dialog 
                open={offsetDialog} 
                onClose={() => setOffsetDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ mr: 1 }} />
                        调整时间偏移
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            label="偏移量（秒）"
                            fullWidth
                            type="number"
                            value={offsetValue}
                            onChange={(e) => setOffsetValue(parseFloat(e.target.value) || 0)}
                            placeholder="输入偏移秒数"
                            helperText="正数：字幕延后；负数：字幕提前"
                            inputProps={{
                                step: 0.1,
                                min: -3600,
                                max: 3600
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setOffsetDialog(false)}
                        startIcon={<Cancel />}
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleUpdateOffset}
                        variant="contained"
                        startIcon={<Save />}
                        disabled={loading || offsetValue === 0}
                        sx={{
                            background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #4099e9, #00d9fe)',
                            }
                        }}
                    >
                        {loading ? '调整中...' : '应用偏移'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
