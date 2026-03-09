import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
			babel: {
				plugins: ['@emotion/babel-plugin'],
			},
		}),
	],
	resolve: {
		alias: {
			'components': '/src/components',
			'pages': '/src/pages',
			'store': '/src/store',
			'hooks': '/src/hooks',
			'utils': '/src/utils',
			'firebase-config': '/src/firebase-config',
			'algolia': '/src/algolia',
			'models': '/src/models.ts',
			'schemas': '/src/schemas.ts',
		},
	},
});

