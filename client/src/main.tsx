import React from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

import App from './App.tsx';

const theme = createTheme({
	palette: {
		mode: 'light', // or 'dark'
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#9c27b0',
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</React.StrictMode>
);
