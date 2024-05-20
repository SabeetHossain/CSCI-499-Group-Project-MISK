import { useState, useEffect } from 'react';
import { decodeJwt } from 'jose';

export const useAuth = () => {
	const [token, setToken] = useState<string | null>(null); // Initialize token state

	useEffect(() => {
		// Load token from localStorage on component mount
		const storedToken = localStorage.getItem('token');
		if (storedToken) {
			setToken(storedToken);
			// Perform the initial authentication check only when the component mounts
			console.log(
				'Stored token found',
				storedToken,
				'calling verifyToken',
			);
			verifyToken(storedToken);
		}
	}, []); // Empty dependency array ensures this effect runs only once on component mount

	const verifyToken = async (storedToken: string) => {
		try {
			const response = await fetch('http://localhost:4000/isUserAuth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: storedToken }),
			});

			console.log(
				'called /isUserAuth with body:',
				JSON.stringify({ token: storedToken }),
			);

			if (!response.ok) {
				throw new Error('Failed to fetch');
			}

			const json = await response.json();
			console.log('Got back response: ', JSON.stringify(json));

			if (json.authenticated) {
				console.log(
					'json.authenticated is true. Setting setIsLoggedIn(true)',
				);
			} else {
				setToken(null);
				console.log(
					'json.authenticated is FALSE. Setting setIsLoggedIn(FALSE)',
				);
			}

			return json;

			// Log storedToken to check its value
			// console.log("Finished running everything!!!")
			// console.log("Stored token:", storedToken, "type of storedToken: ", typeof(storedToken));
			// Pass the stored token to setAuthentication
			//setAuthentication(json.authenticated, storedToken);
		} catch (error) {
			setToken(null);
			console.error('Error verifying token:', error);
		}
	};

	const setAuthentication = (status: boolean, authToken: string | null):void => {
		console.log('Setting authentication status:', status, authToken);
		console.log(
			'Authentication status before:',
			status,
			'AuthToken:',
			authToken,
		);
		setToken(authToken);
		console.log(
			'Authentication status after setting:',
			status,
			'AuthToken:',
			authToken,
		);
	};

	return {
		isLoggedIn: !!token,
		setAuthentication,
		token,
		token_decoded: token
			? decodeJwt<{ userId: string; email: string }>(token)
			: null,
		verifyToken,
	};
	//where isLoggedin is a bool, setAuthentication is
};

//only verify token should be returned
