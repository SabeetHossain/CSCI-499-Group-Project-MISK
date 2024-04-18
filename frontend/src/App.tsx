import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home_Page/Home";
import Register from "./pages/Register_Page/Register";
import Login from "./pages/Login_Page/Login";
import Subscribe from "./pages/Subscribe_Page/Subscribe";
import Profile from "./pages/Profile_Page/Profile";
import { useAuth } from "./useAuth"; // assuming you have a custom hook for authentication
        
import AdminSettingsPage from './pages/Admin_Settings_Page/AdminSettingsPage';
import { SnackbarProvider } from 'notistack';

function App() {
	return (
		<SnackbarProvider maxSnack={3}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="register" element={<Register />} />
				<Route path="login" element={<Login />} />
				<Route path="profile" element={<Profile />} />
				<Route path="subscribe" element={<Subscribe />} />

				<Route path="/admin_settings" element={<AdminSettingsPage />} />
			</Routes>
		</SnackbarProvider>
	);

}

export default App;
