// import React, { Fragment, useState } from "react";
// import { Link } from "react-router-dom";
// import "./Profile.css";

// function Profile() {

// return (
//   <>
//     <h1>MISK</h1>
//     <div>welcome to the profile page</div>
//   </>
// );
// }

// export default Profile;


import React, { useState, useEffect } from 'react';

const Profile = () => {

  interface UserInfo {
    username: string;
    email: string;
    // Add other properties as needed
  }
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await fetch('http://localhost:4000/user-info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []); // Fetch user info once when the component mounts

  return (
    <div>
      <h2>User Profile</h2>
      {userInfo ? (
        <div>
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.email}</p>
          {/* Display other user information */}
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default Profile;



