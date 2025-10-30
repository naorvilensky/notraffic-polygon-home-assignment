import { useState } from 'react';
import { Stage, Layer, Line, Image as KonvaImage, Circle } from 'react-konva';

import { Button, Stack } from '@mui/material';
import type { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';

export function CanvasArea() {
	const [image] = useImage('https://picsum.photos/1920/1080');
	const [stageSize] = useState({ width: 960, height: 540 });
	const [points, setPoints] = useState<number[]>([]);
	const [isPolygonClosed, setPolygonClosed] = useState(false);

	const handleClick = (e: KonvaEventObject<MouseEvent>) => {
		if (isPolygonClosed) return;

		const stage = e.target.getStage();
		if (!stage) return;

		const pointer = stage.getPointerPosition();

		if (pointer) {
			setPoints([...points, pointer.x, pointer.y]);
		}
	};

	const handleFinish = () => {
		if (points.length >= 6) {
			// at least 3 points (x,y pairs)
			setPolygonClosed(true);
		}
	};

	const handleReset = () => {
		setPoints([]);
		setPolygonClosed(false);
	};

	return (
		<Stack spacing={2}>
			<Stage
				width={stageSize.width}
				height={stageSize.height}
				onClick={handleClick}
				style={{ border: '1px solid #ccc', marginTop: '1rem' }}
			>
				<Layer>
					{/* Background image */}
					{image && (
						<KonvaImage
							image={image}
							width={stageSize.width}
							height={stageSize.height}
						/>
					)}

					{/* In-progress line or finished polygon */}
					{points.length > 0 && (
						<Line
							points={points}
							stroke="red"
							strokeWidth={2}
							closed={isPolygonClosed}
							fill={isPolygonClosed ? 'rgba(255,0,0,0.2)' : undefined}
						/>
					)}

					{/* Optional: show dots on each vertex */}
					{points.length > 0 &&
						points
							.reduce(
								(acc, curr, idx) => {
									if (idx % 2 === 0) acc.push([points[idx], points[idx + 1]]);
									return acc;
								},
								[] as [number, number][]
							)
							.map(([x, y], i) => (
								<Circle key={i} x={x} y={y} radius={4} fill="red" />
							))}
				</Layer>
			</Stage>

			{/* Controls */}
			<Stack direction="row" spacing={2}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleFinish}
					disabled={points.length < 6 || isPolygonClosed}
				>
					Finish Polygon
				</Button>
				<Button variant="outlined" onClick={handleReset}>
					Reset
				</Button>
			</Stack>
		</Stack>
	);
}
