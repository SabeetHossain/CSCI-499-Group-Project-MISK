import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from '../pages/Home_Page/components/ToggleColorMode';
import { useAuth } from '../useAuth';

const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

//copy and paste of appappbar from the home components with some slight modification
function Navbar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const navigate = useNavigate(); // Get the navigate function from useNavigate hook
  const { isLoggedIn } = useAuth(); // Get the isLoggedIn state from useAuth hook

  const handleLogout = ():void => {
    localStorage.removeItem("token");
    window.location.reload();
    // Call the logout route on the client side
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        console.log("RESPONSE WAS OKAY")
        // Navigate to the login page or any other desired page after logout
        navigate('/');
        //window.location.reload();
      } else {
        // Handle logout error
        console.error('Logout failed');
      }
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
    //navigate('/');
  };

  const toggleDrawer = (newOpen: boolean) => ():void => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string):void => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  //when a navbar tab like profile or subscribe is clicked, links to the respective page. subscribe functionality is on the landing page so subscribe redirects to the landing page. 
  //the misk logo also leads to the landing page
  function linkTo(pagename:string):void{
    navigate(`/${pagename}`);
  } 
 
  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
             variant="regular"
             sx={(theme) => ({
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               flexShrink: 0,
               borderRadius: '999px',
               bgcolor:
                 theme.palette.mode === 'light'
                   ? 'rgba(255, 255, 255, 0.4)'
                   : 'rgba(0, 0, 0, 0.4)',
               backdropFilter: 'blur(24px)',
               maxHeight: 40,
               border: '1px solid',
               borderColor: 'divider',
               boxShadow:
                 theme.palette.mode === 'light'
                   ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                   : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
             })}
           >
             <Box
               sx={{
                 flexGrow: 1,
                 display: 'flex',
                 alignItems: 'center',
                 ml: '-18px',
                 px: 0,
               }}
             >
               <img
                onClick={() => linkTo('')}

                 src={
                   //'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg'
                 //"https://i.imgur.com/DD0zLbT.png"
                 //"https://i.imgur.com/7ZSu12A.png"
                 "https://i.imgur.com/RgMvco0.png"
                 }
                 style={logoStyle}
                 alt="logo of MISK"
               />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem
                  onClick={() => linkTo('profile')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Profile
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => linkTo('')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Subscribe
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
            <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            {isLoggedIn && 
                <Button color="primary" variant="text" size="small" onClick={handleLogout}>
                  Logout
                </Button>
            }
            {!isLoggedIn && 
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button color="primary" variant="text" size="small">
                    Sign in
                  </Button>
                </Link>
            }
            {!isLoggedIn && 
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button color="primary" variant="contained" size="small">
                    Sign up
                  </Button>
                </Link>
              }
              </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                  <MenuItem onClick={() => scrollToSection('features')}>
                    Features
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('testimonials')}>
                    Testimonials
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('highlights')}>
                    Highlights
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('pricing')}>
                    Pricing
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('faq')}>FAQ</MenuItem>
                  <Divider />


              <MenuItem>
                  {isLoggedIn && 
                <Button color="primary" variant="text" size="small" onClick={handleLogout}>
                  Logout
                </Button>
              }
              </MenuItem>
              <MenuItem>
              {!isLoggedIn && 
                    <Link to="/register" style={{ textDecoration: 'none', width: '100%' }}>
                      <Button color="primary" variant="contained" fullWidth>
                        Sign up
                      </Button>
                    </Link>
                    }
                  </MenuItem>
                  <MenuItem>
                  {!isLoggedIn && 
                    <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
                      <Button color="primary" variant="outlined" fullWidth >
                        Sign in
                      </Button>
                    </Link>
                    }
                  </MenuItem> 
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default Navbar;