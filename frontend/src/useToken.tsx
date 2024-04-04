import { useState } from 'react';




export default function useToken() {

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        if (tokenString) {
          const userToken = JSON.parse(tokenString);
          return userToken?.token;
        }
        return null; // or return an empty string as per your requirement
      }

      
  const [token, setToken] = useState();

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };


  return {
    setToken: saveToken,
    token
  }

}
