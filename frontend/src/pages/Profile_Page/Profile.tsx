//react imports
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//jwt token decoding
import { jwtDecode } from 'jwt-decode';
//backend imports
import { useAuth } from "../../useAuth";
//frontend components
import Navbar from '../../global_components/Navbar';
//material ui imports for css and related imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {PaletteMode } from '@mui/material';
import getLPTheme from '../Home_Page/getLPTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { CircularProgress } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
//toastify for toasts
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

/*
Todo:
  -add more documentation
  -delete account (change it so that pressing delete opens a dialog box, that will ask if you are sure. if yes delete, if no exit.)
  -the logged in use effect might need to be changed cause its always active.
*/

function Profile(){
  const navigate = useNavigate(); // Get the navigate function from useNavigate hook
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  //form related
  const [username, setUsername] = React.useState<string>("");
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  //notifications related
  const [phoneSubscribed, setPhoneSubscribed] = React.useState<boolean>(false);
  const [emailSubscribed, setEmailSubscribed] = React.useState<boolean>(false);
  //authentication related
  const [token, setToken] = useState<string>(''); // Declare token state and setToken setter function
  const { setAuthentication } = useAuth(); // Get setAuthentication function from useAuth hook
  const { verifyToken } = useAuth(); // Get the isLoggedIn state from useAuth hook
  const { isLoggedIn } = useAuth(); // Get the isLoggedIn state from useAuth hook
  //css related
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState<boolean>(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  function toggleColorMode():void{
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  interface JwtPayload {
    userId: string;
  }

  interface UserInfo {
    username: string;
    email: string;
    phonesubbed: boolean;
    emailsubbed: boolean;
  }
  /*
    Phone notification implementation might not be functional. all this will do is change the value between
    true and false in our database. Matt has contacted the company that we are using for the SMS implementation
    which I think is called Twilio so if they respond with some solution in a reasonable time this will work. 
  */
  async function updatePhoneNotifs():Promise<void>{
    try{
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const decodedToken= jwtDecode(token as string) as JwtPayload;
      const userId = parseInt(decodedToken.userId);
      //because a useeffect is always setting phoneSubscribed each time it change I will need to have the backend change it first.
      //than if(response is ok setPhoneSubscribed to the opposite of what it was.)
      const body = {phoneSubscribed};
        console.log("user id in update phone")
        console.log(userId)
        console.log('body: '+body);
        const response = await fetch(`http://localhost:4000/users/phone/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          if(phoneSubscribed === true)
            {
              setPhoneSubscribed(false);
            }
          else
          {
            setPhoneSubscribed(true);
          }
          const data = await response.json();
          console.log(response.json);
          console.log('contents of data.message: '+data.message);
          console.log('contents of value: '+ data.value);
          const messageData = data.message;
          const valueData = data.value;
          showToast(messageData, valueData);
        }
        // else{
        //   const data = await response.json();
        //   console.log('contents of data.message: '+data.message);
        //   console.log('contents of value: '+ data.value);
        //   console.error('Failed to update:', data.message);
        //   const messageData = data.message;
        //   const valueData = data.value;
        //   showToast(messageData, valueData);
        // }
      }
       catch (err){
        console.error((err as Error).message);
      }
    };

    async function updateEmailNotifs():Promise<void>{
      try{
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const decodedToken= jwtDecode(token as string) as JwtPayload;
        const userId = parseInt(decodedToken.userId);
        const body = {emailSubscribed};
          console.log("user id in update phone")
          console.log(userId)
          console.log('body: '+body);
          const response = await fetch(`http://localhost:4000/users/email/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(body)
          });
          if (response.ok) {
            if(emailSubscribed === true)
              {
                setEmailSubscribed(false);
              }
            else
            {
              setEmailSubscribed(true);
            }
            const data = await response.json();
            console.log(response.json);
            console.log('contents of data.message: '+data.message);
            console.log('contents of value: '+ data.value);
            const messageData = data.message;
            const valueData = data.value;
            showToast(messageData, valueData);
          }
          // else{
          //   const data = await response.json();
          //   console.log('contents of data.message: '+data.message);
          //   console.log('contents of value: '+ data.value);
          //   console.error('Failed to update:', data.message);
          //   const messageData = data.message;
          //   const valueData = data.value;
          //   showToast(messageData, valueData);
          // }
        }
         catch (err){
          console.error((err as Error).message);
        }
      };
  

  function clearFields():void {
    setUsername('');
    setCurrentPassword('');
    setNewPassword('');
    setEmail('');
  };

  function showToast(data:string, value:string):void
  {
    if(value === 'success')
    {
      toast.success(data);
    }
    else if(value === 'warning')
    {
      toast.warning(data);
    }
    else if(value === 'info')
    {
      toast.info(data);
    }
    else if(value === 'error')
    {
      toast.error(data);
    } 
  }

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

/*this one is used to fetch data from backend. rerenders everytime username, email, etc change. this includes when the clear button 
  is pressed but is better than infinite rerenders, especially when debugging using console.log
*/  
  useEffect(() => {
    async function fetchUserInfo():Promise<void> {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const decodedToken= jwtDecode(token as string) as JwtPayload;
        const userId = parseInt(decodedToken.userId);
        const response = await fetch(`http://localhost:4000/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          console.log('below is userData');
          console.log(userData);
          setUserInfo(userData[0]);
          console.log('below is userInfo');
          console.log(userInfo);
          setPhoneSubscribed(userData[0].phonesubbed);
          console.log('phone subscribed '+phoneSubscribed)
          setEmailSubscribed(userData[0].emailsubbed);
          console.log('email subscribed '+emailSubscribed);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  },[username, email, currentPassword, newPassword, phoneSubscribed, emailSubscribed]); 




  useEffect(() => {
    async function checkLoggedIn():Promise<void> {
      await loggedInCheck();
    };
    checkLoggedIn();
  })

  async function handleDelete():Promise<void> {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const decodedToken= jwtDecode(token as string) as JwtPayload;
      const userId = parseInt(decodedToken.userId);
      try{
        const response = await fetch(`http://localhost:4000/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          showToast('success', 'Account successfully deleted');
          localStorage.removeItem("token");
        }
        else{
          console.error('Error deleting user:');
          showToast('error', 'Account could not be deleted');
        }
      }catch(error) {
        console.error('Error fetching user info:', error);
      }
    


  }

  const handleSubmitChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const decodedToken= jwtDecode(token as string) as JwtPayload;
      const userId = parseInt(decodedToken.userId);
      const body = {username, currentPassword, newPassword, email};
      console.log("user id in handle submit")
      console.log(userId)
      console.log(body);
      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        
        const data = await response.json();
        // console.log(response.json);
        console.log('contents of data.message: '+data.message);
        console.log('contents of value: '+ data.value);
        console.log("profile update Response:", data);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        console.log('Token stored in localStorage:', data.token);
        //modify
        setAuthentication(data.authenticated, data.token); //store token and use verify instead
        const messageData = data.message;
        const valueData = data.value;
        showToast(messageData, valueData);
      }
      else{
        const data = await response.json();
        console.log('contents of data.message: '+data.message);
        console.log('contents of value: '+ data.value);
        console.error('Failed to update:', data.message);
        const messageData = data.message;
        const valueData = data.value;
        showToast(messageData, valueData);
      }
      clearFields();
    }
     catch (err){
      console.error((err as Error).message);
    }
  };


  
  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline/>
      <Navbar mode={mode} toggleColorMode={toggleColorMode}></Navbar>
      <Grid container sx={{ bgcolor: 'background.default' }}>
      <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Grid item xs={12} md={11}sx={{ height: '100%', bgcolor: 'background.default'  }}>
        <Typography color="text.primary" component = "div" variant="h3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 12}}>
          Profile Settings
          <ManageAccountsIcon sx={{ fontSize: 'inherit', ml: '5px'}} />
        </Typography>
      </Grid>
      <Grid  item xs={12} md={11}sx={{ height: '100%', bgcolor: 'background.default' }}>
        {userInfo ? (
          <Box sx={{
            bgcolor: 'background.default', ml:5, mr:5, p: 3, textAlign:'center'}}>
            {/* <Typography  color="text.secondary"  variant="h6" sx={{ mb: 2 }}>User Info</Typography> */}
            <Typography   color="text.secondary"sx={{  mb: 1 }}>Username: {userInfo.username}</Typography>
            <Typography   color="text.secondary" sx={{  mb: 1 }}>Email: {userInfo.email}</Typography>
            <Divider    color="text.secondary"sx={{ backgroundColor: '#fff', my: 2 }} />
          </Box>
        ) : (
          <Box sx={{ bgcolor: 'background.default', textAlign: 'center', fontStyle: 'italic' }}>
            <CircularProgress color="inherit" />
            <Typography color="text.secondary">Loading user information...</Typography>
          </Box>
        )}
      </Grid>
      <Grid  item xs={12} md={11}sx={{ height: '100%', bgcolor: 'background.default' }}>
          <Box sx={{
            bgcolor: 'background.default', ml:5, mr:5, p: 3, textAlign:'center'}}>
            <Typography color="text.primary" variant='h4' sx={{alignItems: 'center'}}>About Subscribing to tickers</Typography>
            {/* <Typography  color="text.secondary"  variant="h6" sx={{ mb: 2 }}>User Info</Typography> */}
            <Typography   color="text.secondary"sx={{  mb: 1 }}>If you would like to subscribe to a ticker follow these steps:</Typography>
            <Typography   color="text.secondary"sx={{  mb: 1 }}>Press on the MISK logo or the subscribe tab to go to the landing page. Type in your desired ticker in the begin your journey area and press the search button. You will be redirected to another page, where you can subscribe by pressing the subscribe button</Typography>
            <Divider    color="text.secondary"sx={{ backgroundColor: '#fff', my: 2 }} />
          </Box>
      </Grid>
      <Grid item xs={12} md={11} sx={{ height: '100%', bgcolor: 'background.default'}}>
        <Box  component="form" onSubmit={handleSubmitChanges}
          sx={{
            // alignItems: cenre
            bgcolor: 'background.default',
            ml:5, mr:5, p: 3, textAlign:'center'}}
          noValidate
          autoComplete="off">
          <Typography color="text.primary" variant='h4' sx={{alignItems: 'center'}}>Update Credentials</Typography>
          <Grid container spacing={2} sx={{bgcolor: 'background.default'}}>
            <Grid item xs={12}>
              <TextField
                autoComplete="username"
                name="username"
                id="username"
                label="Username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sx={{bgcolor: 'background.default'}}>
              <TextField
                id="currentpassword"
                label="Current Password"
                name="currentpassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sx={{bgcolor: 'background.default'}}>
              <TextField
                id="newpassword"
                label="New Password"
                name="newpassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sx={{bgcolor: 'background.default'}}>
              <TextField
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor:'#006400 !important'}}
          >
            Update Profile
          </Button>
          <Button
            onClick={clearFields}
            variant="contained"

            sx={{ml:3, mt: 3, mb: 2, backgroundColor:'#ff0000 !important'}}
          >
            Cancel
          </Button>
          <Divider color="text.secondary"sx={{ backgroundColor: '#fff', my: 2 }} />
      </Box>
      {/* <Box sx={{bgcolor: 'background.default'}}></Box> */}
      </Grid>
      <Grid item xs={12} md={11} sx={{height: '100%', bgcolor: 'background.default', textAlign:'center'}}>
        <Box sx={{bgcolor: 'background.default',ml:5, mr:5, p: 3, textAlign:'center'}}>
        <Typography color="text.primary" variant='h4' sx={{alignItems: 'center'}}>Notification Settings</Typography>
        <Typography color="text.secondary"sx={{  mb: 1 }}>If you want emails or text messages with news and sentiment analysis on the tickers you have subscribed to, press the switches below to toggle notifications on or off. </Typography>
        <Box sx={{ 
          mt:2,
          display: 'flex', 
          justifyContent: 'center',  
          }}>
          <Switch 
          checked={phoneSubscribed}
          onChange={updatePhoneNotifs}
          />
          <Typography color="text.secondary" sx={{ ml: 1 }}>Enable Phone Notifications</Typography>  
        </Box>
        <Box sx={{ 
          mt: 2,
          display: 'flex', 
          justifyContent: 'center',  
          }}>
          <Switch
            checked={emailSubscribed}
            onChange={updateEmailNotifs}
          />
          <Typography color="text.secondary" sx={{ ml: 1 }}>Enable Email Notifications</Typography>  
        </Box>
          <Divider color="text.secondary"sx={{ backgroundColor: '#fff', my: 2 }} />
        </Box>
      </Grid>
      <Grid item xs={12} md={11} sx={{ height: '100%', bgcolor: 'background.default', textAlign:'center'}}>
      <Typography color="text.primary" variant='h4' sx={{alignItems: 'center'}}>Delete Account</Typography>
      <Typography color="text.secondary"sx={{  mb: 1 }}>If you delete your account, all information will be lost and the changes CANNOT be undone</Typography>
      <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ml:3, mt: 3, mb: 2, backgroundColor:'#ff0000 !important'}}
          >
            Delete
          </Button>
      </Grid>

    
    </Grid>
  </ThemeProvider>
);
};

export default Profile;

