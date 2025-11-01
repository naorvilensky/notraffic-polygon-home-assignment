import { useCallback, useEffect, useRef, useState } from 'react';
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
	CircularProgress,
} from '@mui/material';
import { usePolygonsApi } from '@src/hooks/usePolygonsApi';

const DEFAULT_POLY_COLOR = 'rgba(240, 18, 18, 0.3)';
const MIN_POINTS = 3;
const STAGE_WIDTH = 960;
const STAGE_HEIGHT = 540;

export function PolygonManager() {
	const lastPolyId = useRef(0);

	const {
		fetch: fetchPolygons,
		create: createPolygon,
		remove: removePolygon,
		isFetching,
		isCreating,
		isRemoving,
	} = usePolygonsApi();
	const [polygons, setPolygons] = useState<Polygon[]>([]);
	const [points, setPoints] = useState<number[][]>([]);
	const [selectedPolygonName, setSelectedPolygonName] = useState<string>('');
	const [drawingColor, setDrawingColor] = useState(DEFAULT_POLY_COLOR);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newPolyName, setNewPolyName] = useState('');
	const [nameError, setNameError] = useState('');

	useEffect(() => {
		fetchPolygons().then((newPolygons: Polygon[]) => {
			setPolygons(existingPolygons => [
				...newPolygons,
				...existingPolygons.filter(
					({ name }: Polygon) =>
						!newPolygons.some(({ name: name2 }: Polygon) => name !== name2)
				),
			]);
		});
	}, [fetchPolygons]);

	const handleCanvasClick = useCallback((x: number, y: number) => {
		setSelectedPolygonName('');
		setPoints(prev => [...prev, [x, y]]);
	}, []);

	const handleFinish = useCallback(() => {
		if (points.length >= MIN_POINTS) {
			setIsDialogOpen(true);
		}
	}, [points]);

	const handleSavePolygon = useCallback(() => {
		const name = newPolyName.trim();

		if (!name || polygons.some(p => p.name === name)) {
			return;
		}

		const polygon = {
			id: lastPolyId.current,
			name,
			points: [...points],
			color: drawingColor,
		};

		createPolygon(polygon).then((savedPolygon: Polygon) => {
			polygon.id = savedPolygon.id as number;
		});

		setPolygons(prev => [...prev, polygon]);

		lastPolyId.current++;
		setPoints([]);
		setNewPolyName('');
		setIsDialogOpen(false);
	}, [drawingColor, newPolyName, points, polygons, createPolygon]);

	const handleSelect = useCallback((name: string) => {
		setSelectedPolygonName(name);
	}, []);

	const handleDelete = useCallback(
		(polygon: Polygon) => {
			setPolygons(prev => prev.filter(p => p.name !== polygon.name));

			// only if the polygon has been saved to the backend
			if (polygon.id !== null) {
				removePolygon(polygon.id);
			}

			setSelectedPolygonName('');
		},
		[removePolygon]
	);

	const handleOnChangeName = useCallback(
		(name: string) => {
			setNewPolyName(name);

			if (!name) {
				setNameError("Name can't be empty");
				return;
			}

			if (polygons.some(p => p.name === name)) {
				setNameError('Name already exists');
				return;
			}

			setNameError('');
		},
		[polygons]
	);

	return (
		<Stack direction="row" spacing={4}>
			{/* Canvas & controls */}
			<Stack spacing={2} flex={1}>
				<Stack direction="row" justifyContent="space-between" flex={1}>
					<RgbaColorPicker
						color={{ r: 240, g: 18, b: 18, a: 0.3 }}
						onChange={({ r, g, b }) => {
							setDrawingColor(`rgba(${r},${g},${b},0.3)`);
						}}
					/>
					<Stack spacing={2} alignContent="center" direction="row">
						{isFetching && <div>Loading polygons...</div>}
						{isCreating && !isFetching && <div>Saving polygons...</div>}
						{isRemoving && !isCreating && !isRemoving && (
							<div>Deleting polygons...</div>
						)}
						{(isFetching || isCreating || isRemoving) && <CircularProgress size={20} />}
					</Stack>
				</Stack>

				<PolygonCanvas
					width={STAGE_WIDTH}
					height={STAGE_HEIGHT}
					polygons={polygons}
					points={points}
					onClick={handleCanvasClick}
					drawingColor={drawingColor}
					selectedPolygonName={selectedPolygonName}
					onSelectPolygon={handleSelect}
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
			<Stack>
				<PolygonList
					polygons={polygons}
					selectedPolygonName={selectedPolygonName}
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
						error={!!nameError}
						label="Name"
						placeholder="Enter polygon name"
						helperText={nameError || ''}
						fullWidth
						margin="dense"
						value={newPolyName}
						onChange={e => handleOnChangeName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleSavePolygon} disabled={!!nameError}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}
