import { Box, Link } from '@mui/material';

export const Footer = () => {
    return (
        <Box sx = {{ display:'flex', width:'100%', justifyContent:'center', pb:'1rem', color:'rgba(0,0,0,.4)', fontSize:'1rem'}}>
            <Box>
                Copyright © 2025 zimu.slie.top&nbsp;&nbsp;&nbsp;<Link href="https://space.bilibili.com/42868541" target="_blank" rel="noreferrer" underline="none" color="textSecondary">※作者主页※</Link>
            </Box>
        </Box>
    );
}