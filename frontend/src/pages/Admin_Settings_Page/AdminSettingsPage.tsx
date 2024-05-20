//this page is unused the settings from this have basically merged into the profile page
//new routes have also been made besides the ones used for this page
import {
	Box,
	Card,
	FormControlLabel,
	FormGroup,
	Switch,
	Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { EMessageType } from '../../enums/message-type';
import { defaultValues } from './form';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useEffect } from 'react';
import { handleAxiosError } from '../../utils/handleAxiosError';

function AdminSettingsPage() {
	const { enqueueSnackbar } = useSnackbar();

	const { control, handleSubmit, formState, reset } = useForm({
		defaultValues,
	});

	useEffect(() => {
		axios.get('http://localhost:4000/settings').then((response) => {
			reset({ message_type: response.data.message_type });
		}, handleAxiosError);
	}, []);

	return (
		<>
			<Box
				sx={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Card
					variant="elevation"
					elevation={3}
					sx={{ width: '100%', maxWidth: '512px', padding: 3 }}
				>
					<Typography variant="h5" sx={{ textAlign: 'center' }}>
						Settings
					</Typography>

					<Box sx={{ marginTop: 5 }}>
						<form
							onSubmit={handleSubmit((values) =>
								axios
									.post(
										'http://localhost:4000/settings',
										values,
									)
									.then((response) => {
										enqueueSnackbar('Settings saved!', {
											variant: 'success',
										});
									}, handleAxiosError),
							)}
						>
							<FormGroup>
								<Controller
									control={control}
									name="message_type"
									render={({
										field: { value, onChange },
									}) => (
										<FormControlLabel
											control={
												<Switch
													value={EMessageType.EMAIL}
													checked={
														value ===
														EMessageType.EMAIL
													}
													onChange={({
														target: { value },
													}) => onChange(value)}
												/>
											}
											label="Send e-mails"
										/>
									)}
								/>
								<Controller
									control={control}
									name="message_type"
									render={({
										field: { value, onChange },
									}) => (
										<FormControlLabel
											control={
												<Switch
													value={EMessageType.SMS}
													checked={
														value ===
														EMessageType.SMS
													}
													onChange={({
														target: { value },
													}) => onChange(value)}
												/>
											}
											label="Send text messages (SMS)"
										/>
									)}
								/>
							</FormGroup>

							<Box
								sx={{
									marginTop: 3,
									display: 'flex',
									alignItems: 'end',
									justifyContent: 'end',
								}}
							>
								<LoadingButton
									type="submit"
									variant="contained"
									loading={formState.isSubmitting}
								>
									Save
								</LoadingButton>
							</Box>
						</form>
					</Box>
				</Card>
			</Box>
		</>
	);
}

export default AdminSettingsPage;
