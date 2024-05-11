import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../useAuth';


function Settings_Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  return (
    <AppBar position="sticky" sx={{ backgroundColor:'#000000'}}>
      <Container maxWidth="xs">
        <Toolbar disableGutters sx={{ flexDirection: 'column' }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#user_info"
            sx={{
              mt: 10,
              mr: 1,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            User Info
          </Typography>
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
            Update Credentials
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
            Email/Text Notifications 
          </Typography>
          </MenuItem>
         </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Settings_Navbar;
