import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
    Avatar,
    Chip,
    Alert,
    Fab,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    ArrowBack,
    Add,
    Edit,
    Delete,
    Person,
    Save,
    Cancel
} from '@mui/icons-material';
import AuthorApi from '../api/AuthorApi';
import OrganizationApi from '../api/OrganizationApi';

export const AuthorManagement = () => {
    const navigate = useNavigate();
    const [authors, setAuthors] = React.useState([]);
    const [organizations, setOrganizations] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [editingAuthor, setEditingAuthor] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '',
        uid: '',
        avatar: '',
        organizationId: ''
    });
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');

    // 加载作者列表
    const loadAuthors = async () => {
        setLoading(true);
        try {
            const data = await AuthorApi.findAll();
            setAuthors(data || []);
        } catch (err) {
            setError('加载作者列表失败：' + (err.message || '未知错误'));
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
        loadAuthors();
        loadOrganizations();
    }, []);

    const handleBack = () => {
        navigate('/admin');
    };

    const handleOpenDialog = (author = null) => {
        setEditingAuthor(author);
        setFormData({
            name: author?.name || '',
            uid: author?.uid || '',
            avatar: author?.avatar || '',
            organizationId: author?.organizationId || ''
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAuthor(null);
        setFormData({ name: '', uid: '', avatar: '', organizationId: '' });
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError('作者名称不能为空');
            return;
        }
        if (!formData.uid.trim()) {
            setError('B站UID不能为空');
            return;
        }
        if (!formData.organizationId) {
            setError('请选择所属组织');
            return;
        }

        setLoading(true);
        try {
            const saveData = {
                ...formData,
                uid: parseInt(formData.uid),
                organizationId: parseInt(formData.organizationId)
            };

            if (editingAuthor) {
                // 更新作者
                await AuthorApi.update(editingAuthor.id, saveData);
                setSuccess('作者更新成功！');
            } else {
                // 创建新作者
                await AuthorApi.create(saveData);
                setSuccess('作者创建成功！');
            }
            
            handleCloseDialog();
            loadAuthors();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('保存失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (author) => {
        if (!window.confirm(`确定要删除作者"${author.name}"吗？此操作不可撤销。`)) {
            return;
        }

        setLoading(true);
        try {
            await AuthorApi.delete(author.id);
            setSuccess('作者删除成功！');
            loadAuthors();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('删除失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Person sx={{ mr: 1, color: '#764ba2' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        作者管理
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(45deg, #764ba2, #667eea)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #6a4190, #5a6fd8)',
                        }
                    }}
                >
                    新建作者
                </Button>
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

            {/* 作者列表表格 */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>头像</TableCell>
                            <TableCell>作者名称</TableCell>
                            <TableCell>B站UID</TableCell>
                            <TableCell>所属组织</TableCell>
                            <TableCell>状态</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        暂无作者数据，点击"新建作者"开始创建
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            authors.map((author) => (
                                <TableRow key={author.id} hover>
                                    <TableCell>
                                        <Avatar
                                            src={author.avatar ? `//${author.avatar}@100w_100h.webp` : undefined}
                                            sx={{ width: 40, height: 40 }}
                                        >
                                            {author.name?.charAt(0)}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                            {author.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="primary" sx={{ fontFamily: 'monospace' }}>
                                            {author.uid}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {author.organization ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar
                                                    src={author.organization.avatar ? `//${author.organization.avatar}@60w_60h.webp` : undefined}
                                                    sx={{ width: 24, height: 24, mr: 1 }}
                                                >
                                                    {author.organization.name?.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2">
                                                    {author.organization.name}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                未知组织
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="正常"
                                            color="success"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="编辑">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(author)}
                                                sx={{ mr: 1 }}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="删除">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(author)}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 新建/编辑对话框 */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1 }} />
                        {editingAuthor ? '编辑作者' : '新建作者'}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            label="作者名称"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            sx={{ mb: 3 }}
                            placeholder="请输入作者名称"
                        />
                        <TextField
                            label="B站UID"
                            fullWidth
                            required
                            type="number"
                            value={formData.uid}
                            onChange={(e) => setFormData({...formData, uid: e.target.value})}
                            sx={{ mb: 3 }}
                            placeholder="请输入B站用户ID"
                            helperText="纯数字，可在B站个人主页URL中找到"
                        />
                        <FormControl fullWidth sx={{ mb: 3 }} required>
                            <InputLabel>所属组织</InputLabel>
                            <Select
                                value={formData.organizationId}
                                label="所属组织"
                                onChange={(e) => setFormData({...formData, organizationId: e.target.value})}
                            >
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
                            label="头像URL"
                            fullWidth
                            value={formData.avatar}
                            onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                            placeholder="请输入头像图片URL"
                            helperText="建议使用方形图片，支持相对路径"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleCloseDialog}
                        startIcon={<Cancel />}
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        startIcon={<Save />}
                        disabled={loading}
                        sx={{
                            background: 'linear-gradient(45deg, #764ba2, #667eea)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #6a4190, #5a6fd8)',
                            }
                        }}
                    >
                        {loading ? '保存中...' : '保存'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 浮动添加按钮 */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => handleOpenDialog()}
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    background: 'linear-gradient(45deg, #764ba2, #667eea)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #6a4190, #5a6fd8)',
                    }
                }}
            >
                <Add />
            </Fab>
        </Container>
    );
};
