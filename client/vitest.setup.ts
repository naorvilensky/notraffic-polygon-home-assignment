import '@testing-library/jest-dom';
import { vi } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Mock Canvas for Konva in jsdom
if (typeof HTMLCanvasElement !== 'undefined') {
	Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
		value: function getContext(
			contextId: string,
			_options?: any
		): CanvasRenderingContext2D | null {
			if (contextId !== '2d') return null;

			// Properly typed TextMetrics mock
			const metrics: TextMetrics = {
				width: 0,
				actualBoundingBoxAscent: 0,
				actualBoundingBoxDescent: 0,
				actualBoundingBoxLeft: 0,
				actualBoundingBoxRight: 0,
				fontBoundingBoxAscent: 0,
				fontBoundingBoxDescent: 0,
				emHeightAscent: 0,
				emHeightDescent: 0,
				hangingBaseline: 0,
				alphabeticBaseline: 0,
				ideographicBaseline: 0,
			};

			const imageData: ImageData = {
				data: new Uint8ClampedArray(),
				width: 0,
				height: 0,
				colorSpace: 'srgb',
			};

			// The mock 2D context (enough for Konva)
			const ctx: Partial<CanvasRenderingContext2D> = {
				canvas: this,
				fillRect: () => {},
				clearRect: () => {},
				getImageData: () => imageData,
				putImageData: () => {},
				createImageData: () => imageData,
				setTransform: () => {},
				drawImage: () => {},
				save: () => {},
				fillText: () => {},
				measureText: () => metrics,
				restore: () => {},
				beginPath: () => {},
				moveTo: () => {},
				lineTo: () => {},
				closePath: () => {},
				stroke: () => {},
				translate: () => {},
				scale: () => {},
				rotate: () => {},
				arc: () => {},
				fill: () => {},
				strokeRect: () => {},
				rect: () => {},
				clip: () => {},
			};

			return ctx as CanvasRenderingContext2D;
		},
	});
}

vi.mock('@api/polygons', () => ({
	fetchPolygons: vi.fn(async () => []),
	createPolygon: vi.fn(async () => ({ id: 1 })),
	removePolygon: vi.fn(async () => ({})),
}));
