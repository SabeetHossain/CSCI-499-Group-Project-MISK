import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export function handleAxiosError(error: unknown) {
	if (axios.isAxiosError(error)) {
		enqueueSnackbar(
			'Error: ' + error.response?.data.error || error.message,
			{
				variant: 'error',
			},
		);
	}
}
