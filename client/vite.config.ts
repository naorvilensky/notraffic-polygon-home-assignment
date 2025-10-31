import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, 'src'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@interfaces': path.resolve(__dirname, 'src/interfaces'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@api': path.resolve(__dirname, 'src/api'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './vitest.setup.ts',
		include: ['tests/**/*.test.{ts,tsx}'],
	},
});
