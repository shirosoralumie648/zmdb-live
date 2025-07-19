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
    Tooltip
} from '@mui/material';
import {
    ArrowBack,
    Add,
    Edit,
    Delete,
    Business,
    Save,
    Cancel
} from '@mui/icons-material';
import OrganizationApi from '../api/OrganizationApi';

export const OrganizationManagement = () => {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [editingOrg, setEditingOrg] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '',
        avatar: '',
        description: ''
    });
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');

    // 加载组织列表
    const loadOrganizations = async () => {
        setLoading(true);
        try {
            const data = await OrganizationApi.findAll();
            setOrganizations(data || []);
        } catch (err) {
            setError('加载组织列表失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadOrganizations();
    }, []);

    const handleBack = () => {
        navigate('/admin');
    };

    const handleOpenDialog = (org = null) => {
        setEditingOrg(org);
        setFormData({
            name: org?.name || '',
            avatar: org?.avatar || '',
            description: org?.description || ''
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingOrg(null);
        setFormData({ name: '', avatar: '', description: '' });
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError('组织名称不能为空');
            return;
        }

        setLoading(true);
        try {
            if (editingOrg) {
                // 更新组织
                await OrganizationApi.update(editingOrg.id, formData);
                setSuccess('组织更新成功！');
            } else {
                // 创建新组织
                await OrganizationApi.create(formData);
                setSuccess('组织创建成功！');
            }
            
            handleCloseDialog();
            loadOrganizations();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('保存失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (org) => {
        if (!window.confirm(`确定要删除组织"${org.name}"吗？此操作不可撤销。`)) {
            return;
        }

        setLoading(true);
        try {
            await OrganizationApi.delete(org.id);
            setSuccess('组织删除成功！');
            loadOrganizations();
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
                    <Business sx={{ mr: 1, color: '#667eea' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        组织管理
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                        }
                    }}
                >
                    新建组织
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

            {/* 组织列表表格 */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>头像</TableCell>
                            <TableCell>组织名称</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell>状态</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {organizations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        暂无组织数据，点击"新建组织"开始创建
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            organizations.map((org) => (
                                <TableRow key={org.id} hover>
                                    <TableCell>
                                        <Avatar
                                            src={org.avatar ? `//${org.avatar}@100w_100h.webp` : undefined}
                                            sx={{ width: 40, height: 40 }}
                                        >
                                            {org.name?.charAt(0)}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                            {org.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {org.description || '暂无描述'}
                                        </Typography>
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
                                                onClick={() => handleOpenDialog(org)}
                                                sx={{ mr: 1 }}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="删除">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(org)}
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
                        <Business sx={{ mr: 1 }} />
                        {editingOrg ? '编辑组织' : '新建组织'}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            label="组织名称"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            sx={{ mb: 3 }}
                            placeholder="请输入组织名称"
                        />
                        <TextField
                            label="头像URL"
                            fullWidth
                            value={formData.avatar}
                            onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                            sx={{ mb: 3 }}
                            placeholder="请输入头像图片URL"
                            helperText="建议使用方形图片，支持相对路径"
                        />
                        <TextField
                            label="组织描述"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="请输入组织描述信息"
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
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
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
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                    }
                }}
            >
                <Add />
            </Fab>
        </Container>
    );
};
