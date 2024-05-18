import { useState, useEffect } from "react";

interface DecodedToken {
	userId: string;
	// include other properties as needed
  }
  
  export const useAuth = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false); //not logged in initially
	const [token, setToken] = useState<string | null>(null); //initialize token state
	const [token_decoded, setTokenDecoded] = useState<DecodedToken | null>(null); //initialize decoded token state with type
  
	useEffect(() => {
	  //load token from localStorage on component mount
	  const storedToken = localStorage.getItem("token");
	  if (storedToken) {
		//perform the initial authentication check only when the component mounts
		console.log("Stored token found", storedToken, "calling verifyToken")
		verifyToken(storedToken);
	  }
	}, []); //this empty dependency array ensures this effect runs only once on component mount
  
	const verifyToken = async (storedToken: string) => {
	  try {
		const response = await fetch('http://localhost:4000/isUserAuth', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ token: storedToken })
		});
  
		console.log("called /isUserAuth with body:", JSON.stringify({ token: storedToken }))
  
		if (!response.ok) {
		  throw new Error('Failed to fetch');
		}
  
		const json = await response.json();
		console.log("Got back response: ", JSON.stringify(json))
  
		if (json.authenticated) {
		  console.log("json.authenticated is true. Setting setIsLoggedIn(true)")
  
		  setIsLoggedIn(true);
		  setTokenDecoded(json.token_decoded); // set decoded token
		} else {
		  setIsLoggedIn(false);
		  console.log("json.authenticated is FALSE. Setting setIsLoggedIn(FALSE)")
		}
  
		return json
  
	  } catch (error) {
		console.error("Error verifying token:", error);
	  }
	};
  
	const setAuthentication = (status: boolean, authToken: string | null) => {
	  console.log("Setting authentication status:", status, authToken);
	  console.log("Authentication status before:", status, "AuthToken:", authToken);
	  setIsLoggedIn(status);
	  setToken(authToken);
	  console.log("Authentication status after setting:", status, "AuthToken:", authToken);
  
	};
  
	return { isLoggedIn, setAuthentication, token, verifyToken, token_decoded }; // include token_decoded in the returned object
  };
  