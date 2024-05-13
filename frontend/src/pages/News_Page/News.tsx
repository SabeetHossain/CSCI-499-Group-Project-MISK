import * as React from 'react';
import { useAuth } from "../../useAuth";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../global_components/Navbar';
import { jwtDecode } from 'jwt-decode';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getLPTheme from '../Home_Page/getLPTheme';
import { PaletteMode } from '@mui/material';


function News(){
    //added, authentication checks, and navbar. will edit more later


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
        <Navbar></Navbar>
        </ThemeProvider>
  );
} 
export default News;