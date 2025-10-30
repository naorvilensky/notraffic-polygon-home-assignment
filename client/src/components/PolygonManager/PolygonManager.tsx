import { useCallback, useRef, useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';

import { PolygonCanvas } from '@components/PolygonCanvas/PolygonCanvas';
import { PolygonList } from '@components/PolygonList/PolygonList';
import type { Polygon } from '@interfaces/polygon.interface';
import {
	Stack,
	Button,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';

const DEFAULT_POLY_COLOR = 'rgba(240, 18, 18, 0.3)';
const MIN_POINTS = 3;
const STAGE_WIDTH = 960;
const STAGE_HEIGHT = 540;

export function PolygonManager() {
	const lastPolyId = useRef(0);

	const [polygons, setPolygons] = useState<Polygon[]>([]);
	const [points, setPoints] = useState<number[][]>([]);
	const [selectedPolygonId, setSelectedPolygonId] = useState<number | null>(null);
	const [drawingColor, setDrawingColor] = useState(DEFAULT_POLY_COLOR);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newPolyName, setNewPolyName] = useState('');

	/** Canvas click: add point */
	const handleCanvasClick = useCallback((x: number, y: number) => {
		setSelectedPolygonId(null);
		setPoints(prev => [...prev, [x, y]]);
	}, []);

	/** Finish drawing polygon -> open name dialog */
	const handleFinish = useCallback(() => {
		if (points.length >= MIN_POINTS) {
			setIsDialogOpen(true);
		}
	}, [points]);

	/** Save polygon after naming */
	const handleSavePolygon = useCallback(() => {
		setPolygons(prev => [
			...prev,
			{
				id: lastPolyId.current,
				name: newPolyName.trim(),
				points: [...points],
				color: drawingColor,
			},
		]);

		lastPolyId.current++;
		setPoints([]);
		setNewPolyName('');
		setIsDialogOpen(false);
	}, [drawingColor, newPolyName, points]);

	/** Select polygon from list */
	const handleSelect = useCallback((id: number) => {
		setSelectedPolygonId(id);
	}, []);

	/** Delete polygon */
	const handleDelete = useCallback(
		(id: number) => {
			setPolygons(prev => prev.filter(p => p.id !== id));
			if (selectedPolygonId === id) setSelectedPolygonId(null);
		},
		[selectedPolygonId]
	);

	return (
		<Stack direction="row" spacing={4}>
			{/* Canvas & controls */}
			<Stack spacing={2} flex={1}>
				<RgbaColorPicker
					color={{ r: 240, g: 18, b: 18, a: 0.3 }}
					onChange={({ r, g, b }) => {
						setDrawingColor(`rgba(${r},${g},${b},0.3)`);
					}}
				/>

				<PolygonCanvas
					width={STAGE_WIDTH}
					height={STAGE_HEIGHT}
					polygons={polygons}
					points={points}
					onClick={handleCanvasClick}
					drawingColor={drawingColor}
					selectedPolygonId={selectedPolygonId}
				/>

				<Stack direction="row" spacing={2}>
					<Button
						variant="contained"
						onClick={handleFinish}
						disabled={points.length < MIN_POINTS}
					>
						Finish Polygon
					</Button>

					<Button variant="outlined" onClick={() => setPoints([])}>
						Reset
					</Button>
				</Stack>
			</Stack>

			{/* Polygon list */}
			<Stack sx={{ width: 320 }}>
				<PolygonList
					polygons={polygons}
					selectedPolygonId={selectedPolygonId}
					onSelect={handleSelect}
					onDelete={handleDelete}
				/>
			</Stack>

			{/* Naming dialog */}
			<Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
				<DialogTitle>Name your polygon</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						label="Name"
						fullWidth
						value={newPolyName}
						onChange={e => setNewPolyName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleSavePolygon} disabled={!newPolyName.trim()}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}
