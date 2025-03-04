import { alpha } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function Hero() {
	const navigate = useNavigate();
	const [ticker, setTicker] = useState('');

	return (
		<Box
			id="hero"
			sx={(theme) => ({
				width: '100%',
				backgroundImage:
					theme.palette.mode === 'light'
						? 'linear-gradient(180deg, #CEE5FD, #FFF)'
						: `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
				backgroundSize: '100% 20%',
				backgroundRepeat: 'no-repeat',
			})}
		>
			<Container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					pt: { xs: 14, sm: 20 },
					pb: { xs: 8, sm: 12 },
				}}
			>
				<Stack
					spacing={2}
					useFlexGap
					sx={{ width: { xs: '100%', sm: '70%' } }}
				>
					<Typography
						variant="h1"
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							alignSelf: 'center',
							textAlign: 'center',
							fontSize: 'clamp(3.5rem, 10vw, 4rem)',
						}}
					>
						Begin Your&nbsp;
						<Typography
							component="span"
							variant="h1"
							sx={{
								fontSize: 'clamp(3rem, 10vw, 4rem)',
								color: (theme) =>
									theme.palette.mode === 'light'
										? 'primary.main'
										: 'primary.light',
							}}
						>
							Journey
						</Typography>
					</Typography>
					<Typography
						textAlign="center"
						color="text.secondary"
						sx={{
							alignSelf: 'center',
							width: { sm: '100%', md: '80%' },
						}}
					>
						Explore our cutting-edge dashboard, just search for any
						ticker of your choosing and we'll provide you will all
						the relevant news surrounding your input! Elevate your
						experience with top-tier features and services.
					</Typography>

					<Stack
						component="form"
						direction={{ xs: 'column', sm: 'row' }}
						alignSelf="center"
						spacing={1}
						useFlexGap
						sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
						onSubmit={(event) => {
							event.preventDefault();
							ticker && navigate('/ticker/' + ticker);
						}}
					>
						<TextField
							id="outlined-basic"
							hiddenLabel
							size="small"
							variant="outlined"
							aria-label="Enter a Ticker!"
							placeholder="Your Ticker"
							inputProps={{
								autocomplete: 'off',
								ariaLabel: 'Enter your email address',
							}}
							value={ticker}
							onChange={({ target: { value } }) =>
								setTicker(value)
							}
						/>

						<Button
							type="submit"
							variant="contained"
							color="primary"
						>
							Search for a Ticker
						</Button>
					</Stack>

					<Typography
						variant="caption"
						textAlign="center"
						sx={{ opacity: 0.8 }}
					>
						By clicking &quot;Search for a Ticker&quot; you agree to
						our&nbsp;
						<Link to="#" color="primary">
							Terms & Conditions
						</Link>
						.
					</Typography>
				</Stack>

				<Box
					id="image"
					sx={(theme) => ({
						mt: { xs: 8, sm: 10 },
						alignSelf: 'center',
						height: { xs: 200, sm: 700 },
						width: '100%',
						backgroundImage:
							theme.palette.mode === 'light'
								? 'url("/static/images/templates/templates-images/hero-light.png")'
								: 'url("/static/images/templates/templates-images/hero-dark.png")',
						backgroundSize: 'cover',
						borderRadius: '10px',
						outline: '1px solid',
						outlineColor:
							theme.palette.mode === 'light'
								? alpha('#BFCCD9', 0.5)
								: alpha('#9CCCFC', 0.1),
						boxShadow:
							theme.palette.mode === 'light'
								? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
								: `0 0 24px 12px ${alpha('#033363', 0.2)}`,
					})}
				/>
			</Container>
		</Box>
	);
}
