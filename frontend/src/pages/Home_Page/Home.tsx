// import React from "react";
// //import Logo from "../../assets/Logo.png"; //requires es6 imports to use, compiles after i made changes to tsconfig adding in es6.
// import { Link } from "react-router-dom";
// import "./Home.css";

// // function Home() {
// //   return (
// //       <div className="home-page">
// //         <h1>MISK</h1>
// //         <p> All your stocks, cryptocurrency, and related news conveniently in one place to unlock your financial potential! </p>
// //         <div className="home-signin-buttons">
// //           <Link to="/Login" className="home-signin-button"> Sign In </Link>
// //           <Link to="/Register" className="home-signup-button"> Sign Up </Link>
// //           <Link to= "/Subscribe" className="ticker-subscribe-button"> Subscribe </Link>          
// //         </div>
// //       </div>
// //   );
// // };

// // export default Home;



import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import LogoCollection from './components/LogoCollection';
import Highlights from './components/Highlights';
import Pricing from './components/Pricing';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

import getLPTheme from './getLPTheme';

// ROUTES
// import Home from './pages/Home_Page/Home';
// import Register from './pages/Register_Page/Register';
// import Login from './pages/Login_Page/Login';
// import Subscribe from './pages/Subscribe_Page/Subscribe';
// import Profile from './pages/Profile_Page/Profile';

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

export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };


  
  
  return (

    
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>

        {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Register" element={<Register />} />
          <Route path="Login" element={<Login />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="Subscribe" element={<Subscribe />} />
        </Routes> */}



      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />

      <nav className = "navbar">
        {/* <Link to='/'>Home</Link> */}
        <Link to='/Login'>Login</Link>
        <Link to='/Register'>Register</Link>
        <Link to='/Subscribe'>Subscribe</Link>
      </nav>


      <Box sx={{ bgcolor: 'background.default' }}>
        <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
      <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      />
    </ThemeProvider>
  );
}