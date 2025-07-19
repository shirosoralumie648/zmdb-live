import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Button,
    IconButton,
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
    CardActions,
    Switch,
    FormControlLabel,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    ArrowBack,
    Settings,
    Save,
    Restore,
    Security,
    Storage,
    Notifications,
    Api,
    Speed,
    Backup,
    Update,
    Info,
    Warning,
    Error,
    CheckCircle,
    ExpandMore,
    Download,
    Upload,
    Delete,
    Refresh
} from '@mui/icons-material';

export const SystemSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    
    // 系统配置状态
    const [systemConfig, setSystemConfig] = React.useState({
        // 基础设置
        siteName: 'ZMDB Live',
        siteDescription: '字幕管理系统',
        adminEmail: 'admin@example.com',
        
        // 功能开关
        enableRegistration: true,
        enableGuestAccess: false,
        enableNotifications: true,
        enableAutoBackup: true,
        
        // 性能设置
        maxUploadSize: 50, // MB
        sessionTimeout: 24, // 小时
        cacheExpiry: 60, // 分钟
        
        // API设置
        bilibiliCookie: '',
        enableBilibiliApi: true,
        apiRateLimit: 100, // 每分钟请求数
        
        // 存储设置
        databasePath: './db/zmdb.db',
        backupPath: './backups',
        tempPath: './temp',
        
        // 安全设置
        enableHttps: false,
        enableCors: true,
        jwtSecret: 'your-secret-key',
        passwordMinLength: 6
    });
    
    // 系统状态
    const [systemStatus, setSystemStatus] = React.useState({
        database: { status: 'healthy', message: '数据库连接正常' },
        storage: { status: 'healthy', message: '存储空间充足' },
        api: { status: 'healthy', message: 'API服务正常' },
        backup: { status: 'warning', message: '上次备份：2天前' }
    });
    
    // 对话框状态
    const [backupDialog, setBackupDialog] = React.useState(false);
    const [resetDialog, setResetDialog] = React.useState(false);

    const handleBack = () => {
        navigate('/admin');
    };

    const handleSaveConfig = async () => {
        setLoading(true);
        try {
            // 这里应该调用API保存配置
            // await SystemApi.saveConfig(systemConfig);
            setSuccess('系统配置保存成功！');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('保存配置失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    const handleBackupNow = async () => {
        setLoading(true);
        try {
            // 这里应该调用API执行备份
            // await SystemApi.createBackup();
            setSuccess('数据备份创建成功！');
            setBackupDialog(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('备份失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    const handleResetToDefaults = async () => {
        setLoading(true);
        try {
            // 重置为默认配置
            setSystemConfig({
                siteName: 'ZMDB Live',
                siteDescription: '字幕管理系统',
                adminEmail: 'admin@example.com',
                enableRegistration: true,
                enableGuestAccess: false,
                enableNotifications: true,
                enableAutoBackup: true,
                maxUploadSize: 50,
                sessionTimeout: 24,
                cacheExpiry: 60,
                bilibiliCookie: '',
                enableBilibiliApi: true,
                apiRateLimit: 100,
                databasePath: './db/zmdb.db',
                backupPath: './backups',
                tempPath: './temp',
                enableHttps: false,
                enableCors: true,
                jwtSecret: 'your-secret-key',
                passwordMinLength: 6
            });
            setSuccess('配置已重置为默认值！');
            setResetDialog(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('重置失败：' + (err.message || '未知错误'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy': return <CheckCircle color="success" />;
            case 'warning': return <Warning color="warning" />;
            case 'error': return <Error color="error" />;
            default: return <Info color="info" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'success';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
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
                    <Settings sx={{ mr: 1, color: '#43e97b' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        系统设置
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Backup />}
                        onClick={() => setBackupDialog(true)}
                    >
                        立即备份
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Restore />}
                        onClick={() => setResetDialog(true)}
                    >
                        重置默认
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveConfig}
                        disabled={loading}
                        sx={{
                            background: 'linear-gradient(45deg, #43e97b, #38f9d7)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #3dd470, #32e6c8)',
                            }
                        }}
                    >
                        保存配置
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

            {/* 系统状态概览 */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        系统状态概览
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.entries(systemStatus).map(([key, status]) => (
                            <Grid item xs={12} sm={6} md={3} key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                    {getStatusIcon(status.status)}
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                                            {key === 'database' ? '数据库' : 
                                             key === 'storage' ? '存储' :
                                             key === 'api' ? 'API服务' : '备份'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {status.message}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* 配置设置 */}
            <Grid container spacing={3}>
                {/* 基础设置 */}
                <Grid item xs={12} md={6}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">基础设置</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="站点名称"
                                    value={systemConfig.siteName}
                                    onChange={(e) => setSystemConfig({...systemConfig, siteName: e.target.value})}
                                    fullWidth
                                />
                                <TextField
                                    label="站点描述"
                                    value={systemConfig.siteDescription}
                                    onChange={(e) => setSystemConfig({...systemConfig, siteDescription: e.target.value})}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                                <TextField
                                    label="管理员邮箱"
                                    type="email"
                                    value={systemConfig.adminEmail}
                                    onChange={(e) => setSystemConfig({...systemConfig, adminEmail: e.target.value})}
                                    fullWidth
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* 功能开关 */}
                <Grid item xs={12} md={6}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">功能开关</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={systemConfig.enableRegistration}
                                            onChange={(e) => setSystemConfig({...systemConfig, enableRegistration: e.target.checked})}
                                        />
                                    }
                                    label="允许用户注册"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={systemConfig.enableGuestAccess}
                                            onChange={(e) => setSystemConfig({...systemConfig, enableGuestAccess: e.target.checked})}
                                        />
                                    }
                                    label="允许访客访问"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={systemConfig.enableNotifications}
                                            onChange={(e) => setSystemConfig({...systemConfig, enableNotifications: e.target.checked})}
                                        />
                                    }
                                    label="启用通知功能"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={systemConfig.enableAutoBackup}
                                            onChange={(e) => setSystemConfig({...systemConfig, enableAutoBackup: e.target.checked})}
                                        />
                                    }
                                    label="自动备份"
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* 性能设置 */}
                <Grid item xs={12} md={6}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">性能设置</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="最大上传大小 (MB)"
                                    type="number"
                                    value={systemConfig.maxUploadSize}
                                    onChange={(e) => setSystemConfig({...systemConfig, maxUploadSize: parseInt(e.target.value)})}
                                    fullWidth
                                />
                                <TextField
                                    label="会话超时时间 (小时)"
                                    type="number"
                                    value={systemConfig.sessionTimeout}
                                    onChange={(e) => setSystemConfig({...systemConfig, sessionTimeout: parseInt(e.target.value)})}
                                    fullWidth
                                />
                                <TextField
                                    label="缓存过期时间 (分钟)"
                                    type="number"
                                    value={systemConfig.cacheExpiry}
                                    onChange={(e) => setSystemConfig({...systemConfig, cacheExpiry: parseInt(e.target.value)})}
                                    fullWidth
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* API设置 */}
                <Grid item xs={12} md={6}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">API设置</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={systemConfig.enableBilibiliApi}
                                            onChange={(e) => setSystemConfig({...systemConfig, enableBilibiliApi: e.target.checked})}
                                        />
                                    }
                                    label="启用B站API"
                                />
                                <TextField
                                    label="B站Cookie"
                                    value={systemConfig.bilibiliCookie}
                                    onChange={(e) => setSystemConfig({...systemConfig, bilibiliCookie: e.target.value})}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder="请输入B站Cookie用于API调用"
                                />
                                <TextField
                                    label="API速率限制 (每分钟)"
                                    type="number"
                                    value={systemConfig.apiRateLimit}
                                    onChange={(e) => setSystemConfig({...systemConfig, apiRateLimit: parseInt(e.target.value)})}
                                    fullWidth
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* 安全设置 */}
                <Grid item xs={12}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">安全设置</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={systemConfig.enableHttps}
                                                onChange={(e) => setSystemConfig({...systemConfig, enableHttps: e.target.checked})}
                                            />
                                        }
                                        label="启用HTTPS"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={systemConfig.enableCors}
                                                onChange={(e) => setSystemConfig({...systemConfig, enableCors: e.target.checked})}
                                            />
                                        }
                                        label="启用CORS"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="密码最小长度"
                                        type="number"
                                        value={systemConfig.passwordMinLength}
                                        onChange={(e) => setSystemConfig({...systemConfig, passwordMinLength: parseInt(e.target.value)})}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="JWT密钥"
                                        value={systemConfig.jwtSecret}
                                        onChange={(e) => setSystemConfig({...systemConfig, jwtSecret: e.target.value})}
                                        fullWidth
                                        type="password"
                                        helperText="用于生成和验证JWT token的密钥"
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>

            {/* 备份对话框 */}
            <Dialog open={backupDialog} onClose={() => setBackupDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Backup sx={{ mr: 1 }} />
                        创建系统备份
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        确定要创建系统备份吗？备份将包含：
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon><Storage /></ListItemIcon>
                            <ListItemText primary="数据库文件" secondary="包含所有用户数据和配置" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Settings /></ListItemIcon>
                            <ListItemText primary="系统配置" secondary="当前的系统设置和参数" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Upload /></ListItemIcon>
                            <ListItemText primary="上传文件" secondary="用户上传的字幕和媒体文件" />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBackupDialog(false)}>取消</Button>
                    <Button onClick={handleBackupNow} variant="contained" disabled={loading}>
                        {loading ? '备份中...' : '开始备份'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 重置对话框 */}
            <Dialog open={resetDialog} onClose={() => setResetDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Warning sx={{ mr: 1, color: 'warning.main' }} />
                        重置为默认配置
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        此操作将重置所有系统配置为默认值，但不会影响用户数据。
                    </Alert>
                    <Typography variant="body1">
                        确定要重置系统配置吗？此操作无法撤销。
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetDialog(false)}>取消</Button>
                    <Button onClick={handleResetToDefaults} variant="contained" color="warning" disabled={loading}>
                        {loading ? '重置中...' : '确认重置'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
