import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { PolygonCanvasProps } from '../../src/components/PolygonCanvas/PolygonCanvas';
import { PolygonManager } from '../../src/components/PolygonManager/PolygonManager';

// Mock the API layer so tests don't hit backend
vi.mock('@api/polygons', () => ({
	fetchPolygons: vi.fn().mockResolvedValue([]),
	createPolygon: vi
		.fn()
		.mockResolvedValue({ id: 1, name: 'Triangle 1', points: [], color: '#ff0000' }),
	deletePolygon: vi.fn().mockResolvedValue({}),
}));

// Mock PolygonCanvas to simulate finishing a polygon
vi.mock('@components/PolygonCanvas/PolygonCanvas', () => ({
	PolygonCanvas: (props: PolygonCanvasProps) => {
		const { onClick } = props;

		setTimeout(() => {
			onClick?.(100, 100);
			onClick?.(200, 100);
			onClick?.(150, 200);
		}, 0);

		return <div role="presentation" data-testid="mock-canvas" />;
	},
}));

describe('PolygonManager', () => {
	const renderManager = () => render(<PolygonManager />);

	it('renders controls and canvas', () => {
		renderManager();
		expect(screen.getByText('Finish Polygon')).toBeInTheDocument();
		expect(screen.getByText('Reset')).toBeInTheDocument();
		expect(screen.getByRole('presentation')).toBeInTheDocument();
	});

	it('creates a polygon after naming', async () => {
		renderManager();

		// wait for simulated polygon completion
		await waitFor(() =>
			expect(screen.getByRole('button', { name: /Finish Polygon/i })).not.toBeDisabled()
		);

		await userEvent.click(screen.getByRole('button', { name: /Finish Polygon/i }));

		const dialog = await screen.findByRole('dialog');
		const input = within(dialog).getByRole('textbox');
		await userEvent.type(input, 'Triangle 1');
		await userEvent.click(within(dialog).getByRole('button', { name: /Save/i }));

		await waitFor(() => {
			expect(screen.getByText('Triangle 1')).toBeInTheDocument();
		});
	});

	it('selects a polygon from the list', async () => {
		renderManager();
		await waitFor(() =>
			expect(screen.getByRole('button', { name: /Finish Polygon/i })).not.toBeDisabled()
		);
		await userEvent.click(screen.getByRole('button', { name: /Finish Polygon/i }));

		const dialog = await screen.findByRole('dialog');
		const input = within(dialog).getByRole('textbox');
		await userEvent.type(input, 'Triangle 2');
		await userEvent.click(within(dialog).getByRole('button', { name: /Save/i }));

		const row = await screen.findByRole('row', { name: /Triangle 2/i });
		await userEvent.click(row);
		expect(row).toHaveClass('MuiTableRow-hover');
	});

	it('deletes a polygon from the list', async () => {
		renderManager();
		await waitFor(() =>
			expect(screen.getByRole('button', { name: /Finish Polygon/i })).not.toBeDisabled()
		);
		await userEvent.click(screen.getByRole('button', { name: /Finish Polygon/i }));

		const dialog = await screen.findByRole('dialog');
		const input = within(dialog).getByRole('textbox');
		await userEvent.type(input, 'Triangle 3');
		await userEvent.click(within(dialog).getByRole('button', { name: /Save/i }));

		const deleteBtn = await screen.findByRole('button', { name: /delete/i });
		await userEvent.click(deleteBtn);

		await waitFor(() => {
			expect(screen.queryByText('Triangle 3')).not.toBeInTheDocument();
		});
	});
});
