type Args = { ticker: string; userId: string };

function useSubscribeUserTicker() {
	return {
		async subscribe({ ticker, userId }: Args):Promise<void> {
			try {
				const response = await fetch(
					`http://localhost:4000/users/${userId}/ticker`,
					{
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ tickers: ticker }),
					},
				);

				if (response.ok) {
					console.log('Stock ticker updated successfully!');
					window.location.assign('/');
				} else {
					console.error(
						'Error updating stock ticker:',
						response.statusText,
					);
					// maybe display an error message directly to the user sometime
				}
			} catch (err) {
				console.error((err as Error).message); // other errors (e.g., network issues, unexpected responses).
			}
		},
	};
}

export default useSubscribeUserTicker;
