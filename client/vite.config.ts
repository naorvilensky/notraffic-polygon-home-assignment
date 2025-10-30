import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@interfaces': path.resolve(__dirname, './src/interfaces'),
			'@utils': path.resolve(__dirname, './src/utils'),
		},
	},
});
