import * as React from 'react';
import { useAuth } from "../../useAuth";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../global_components/Navbar';
// import { jwtDecode } from 'jwt-decode';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getLPTheme from '../Home_Page/getLPTheme';
import { PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';


interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

function News(){
    //added, authentication checks, and navbar. will edit more later

    const toggleColorMode = () => {
      setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };
  
    const toggleCustomTheme = () => {
      setShowCustomTheme((prev) => !prev);
    };
  


      //authentication related
  const navigate = useNavigate(); // Get the navigate function from useNavigate hook
  const [token, setToken] = useState(''); // Declare token state and setToken setter function
  const { setAuthentication } = useAuth(); // Get setAuthentication function from useAuth hook
  const { verifyToken } = useAuth(); // Get the isLoggedIn state from useAuth hook
  const { isLoggedIn } = useAuth(); // Get the isLoggedIn state from useAuth hook
  //css related
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
    //authentication check. if the user is not logged in for whatever reason redirects to login page. 
  async function loggedInCheck():Promise<void> {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      let data = await verifyToken(storedToken);
      if(!data['authenticated'] ){
        navigate('/login');
      }
    } else {
      navigate('/login')
    }
  }
  useEffect(() => {
    async function checkLoggedIn():Promise<void> {
      await loggedInCheck();
    };
    checkLoggedIn();
  })

    return (
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        <Navbar mode={mode} toggleColorMode={toggleColorMode}></Navbar>
        </ThemeProvider>
  );
} 
export default News;