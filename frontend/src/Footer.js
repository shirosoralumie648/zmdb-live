import { Box, Link } from '@mui/material';

export const Footer = () => {
    return (
        <Box sx = {{ display:'flex', width:'100%', justifyContent:'center', pb:'1rem', color:'rgba(0,0,0,.4)', fontSize:'1rem'}}>
            <Box>
                Copyright © 2022 zimu.live&nbsp;&nbsp;&nbsp;<Link href="https://afdian.net/a/zimulive" target="_blank" rel="noreferrer" underline="none" color="textSecondary">※爱发电※</Link>
            </Box>
        </Box>
    );
}