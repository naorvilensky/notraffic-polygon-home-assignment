import { useEffect, useRef, useState } from 'react';
import { type RgbColor, RgbColorPicker } from 'react-colorful';
import { Circle, Image as KonvaImage, Layer, Line, Stage } from 'react-konva';

import type { Polygon } from '@interfaces/polygon.interface';
import { Button, Stack } from '@mui/material';
import { rgbWithAlpha } from '@utils/rgba.utils';
import type { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';

const DEFAULT_POLY_COLOR: RgbColor = {
	r: 240,
	g: 18,
	b: 18,
};
const STROKE_WIDTH = 2;
const MIN_NUM_OF_POINTS = 3;
const ALPHA = 0.3;

export function CanvasArea() {
	const [image] = useImage('https://picsum.photos/1920/1080');
	const stageSize = useRef<{ width: number; height: number }>({ width: 960, height: 540 });
	const lastPolyId = useRef(0);
	const [selectedPolyId, setSelectedPolyId] = useState<number | null>(null);
	const [polygons, setPolygons] = useState<Polygon[]>([]);
	const [polyColor, setPolyColor] = useState<RgbColor>(DEFAULT_POLY_COLOR);
	const [points, setPoints] = useState<number[][]>([]);

	const getRgbWithAlpha = (rgbColor: RgbColor) => rgbWithAlpha(rgbColor, ALPHA);

	useEffect(() => {}, []);

	const handleClick = (e: KonvaEventObject<MouseEvent>) => {
		const stage = e.target.getStage();
		if (!stage) return;

		const pointer = stage.getPointerPosition();

		if (pointer) {
			if (selectedPolyId !== null) {
				setSelectedPolyId(null);
			}

			setPoints(oldPoints => [...oldPoints, [pointer.x, pointer.y]]);
		}
	};

	const handleFinish = () => {
		if (points.length >= MIN_NUM_OF_POINTS) {
			setPolygons(oldPolygons => [
				...oldPolygons,
				{
					id: lastPolyId.current,
					name: '',
					points: [...points],
					color: getRgbWithAlpha(polyColor),
				},
			]);
			lastPolyId.current++;
			setPoints([]);
		}
	};

	const handleReset = () => {
		setPoints([]);
	};

	const handleDelete = () => {
		setPolygons(oldPolygons => oldPolygons.filter(polygon => polygon.id !== selectedPolyId));
		setSelectedPolyId(null);
	};

	return (
		<Stack spacing={2}>
			<RgbColorPicker color={polyColor} onChange={setPolyColor} />
			<Stage
				width={stageSize.current.width}
				height={stageSize.current.height}
				onClick={handleClick}
			>
				{/* Background image */}
				<Layer>
					{image && (
						<KonvaImage
							image={image}
							width={stageSize.current.width}
							height={stageSize.current.height}
						/>
					)}
				</Layer>

				<Layer>
					{polygons.map((polygon: Polygon) => {
						const isSelected = selectedPolyId === polygon.id;

						return (
							<Line
								key={polygon.id}
								points={polygon.points.flat()}
								stroke={polygon.color}
								strokeWidth={STROKE_WIDTH + (isSelected ? 2 : 0)}
								dashEnabled={isSelected}
								closed={true}
								fill={polygon.color}
								onClick={e => {
									e.cancelBubble = true;
									setSelectedPolyId(polygon.id);
								}}
								onMouseEnter={e => {
									const container = e.target.getStage()?.container();
									if (container) container.style.cursor = 'pointer';
								}}
								onMouseLeave={e => {
									const container = e.target.getStage()?.container();
									if (container) container.style.cursor = 'default';
								}}
							/>
						);
					})}

					{/* In-progress line */}
					{points?.length > 0 && (
						<Line
							points={points.flat()}
							stroke={getRgbWithAlpha(polyColor)}
							strokeWidth={STROKE_WIDTH}
							closed={false}
						/>
					)}

					{/* Show dots on each vertex */}
					{points.map(([x, y], i) => (
						<Circle key={i} x={x} y={y} radius={4} fill={getRgbWithAlpha(polyColor)} />
					))}
				</Layer>
			</Stage>

			{/* Controls */}
			<Stack direction="row" spacing={2}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleFinish}
					disabled={points.length < MIN_NUM_OF_POINTS}
				>
					Finish Polygon
				</Button>
				<Button variant="outlined" onClick={handleReset} disabled={!points?.length}>
					Reset
				</Button>
				<Button
					variant="outlined"
					color="error"
					onClick={handleDelete}
					disabled={selectedPolyId === null}
				>
					Delete
				</Button>
			</Stack>
		</Stack>
	);
}
