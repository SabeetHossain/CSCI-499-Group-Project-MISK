import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
// import handleLogout  from "../pages/Home_Page/components/AppAppBar.js";

// const pages = ['Products', 'Pricing', 'Blog'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

//todo:css 

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

/*
Navbar Todo:
weird issue where touching blank black areas redirect to login
nothing else i think
*/
  async function handleLogout():Promise<void>  {
    localStorage.removeItem("token");
    // Call the logout route on the client side
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        // Navigate to the login page or any other desired page after logout
        console.log("RESPONSE WAS OKAY")
        navigate('/home');
        //window.location.reload();

      } else {
        // Handle logout error
        console.error('Logout failed');
      }
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
  };

  return (
    <AppBar position="static" sx={{ backgroundColor:'#000000' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 1,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#00a34e',
              textDecoration: 'none',
            }}
          >
            MISK
          </Typography>
          <MenuItem sx={{ py: '6px', px: '12px' }} component="a" href="/login">
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/news"
            sx={{
              mr: 1,
              display: { xs: 'none', md: 'flex' },
              fontSize: '0.875rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            NEWS
          </Typography>
          </MenuItem>
          <MenuItem sx={{ py: '6px', px: '12px' }} component="a" href="/login">
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/login"
            sx={{
              mr: 1,
              display: { xs: 'none', md: 'flex' },
              fontSize: '0.875rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            DASHBOARD
          </Typography>
          </MenuItem>
          <MenuItem sx={{ py: '6px', px: '12px' }} component="a" href="/login">
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/subscribe"
            sx={{
              mr: 1,
              display: { xs: 'none', md: 'flex' },
              fontSize: '0.875rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            TICKERS
          </Typography>
          </MenuItem>
          <MenuItem sx={{ py: '6px', px: '12px' }} component="a" href="/login">
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/profile"
            sx={{
              mr: 100,
              display: { xs: 'none', md: 'flex' },
              fontSize: '0.875rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            PROFILE
          </Typography>
          </MenuItem>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleLogout} sx={{ p: 0 }}>
                <Typography sx={{
              mr: 1,
              display: { xs: 'none', md: 'flex' },
              fontSize: '0.875rem',
              color: 'red',
              textDecoration: 'none',
            }}>LOGOUT<PowerSettingsNewIcon></PowerSettingsNewIcon></Typography>
                
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
