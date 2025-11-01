import { Circle, Image as KonvaImage, Layer, Line, Stage } from 'react-konva';

import type { Polygon } from '@interfaces/polygon.interface';
import { CircularProgress, Stack, Typography } from '@mui/material';
import useImage from 'use-image';

export interface PolygonCanvasProps {
	polygons: Polygon[];
	points: number[][];
	width: number;
	height: number;
	selectedPolygonName: string;
	onSelectPolygon: (name: string) => void;
	onClick: (x: number, y: number) => void;
	drawingColor: string;
}

export function PolygonCanvas({
	polygons,
	points,
	width,
	height,
	selectedPolygonName,
	onSelectPolygon,
	onClick,
	drawingColor,
}: PolygonCanvasProps) {
	const [image, status] = useImage('https://picsum.photos/1920/1080');

	return (
		<div className="polygon-canvas">
			{status === 'loading' && (
				<Stack
					spacing={4}
					direction="row"
					alignItems="center"
					justifyContent="center"
					height={height}
				>
					<Typography variant="h4" component="h1">
						Loading image...
					</Typography>
					<CircularProgress />
				</Stack>
			)}
			{status === 'loaded' && (
				<Stage
					width={width}
					height={height}
					onClick={e => {
						const stage = e.target.getStage();
						const pos = stage?.getPointerPosition();
						if (pos) {
							onClick(pos.x, pos.y);
						}
					}}
				>
					<Layer>
						{image && <KonvaImage image={image} width={width} height={height} />}
					</Layer>

					<Layer>
						{polygons.map(polygon => (
							<Line
								key={polygon.id}
								points={polygon.points.flat()}
								stroke={polygon.color}
								strokeWidth={selectedPolygonName === polygon.name ? 4 : 2}
								closed
								fill={polygon.color}
								onClick={e => {
									e.cancelBubble = true;
									onSelectPolygon(polygon.name);
								}}
							/>
						))}

						{points.length > 0 && (
							<Line
								points={points.flat()}
								stroke={drawingColor}
								strokeWidth={2}
								closed={false}
							/>
						)}

						{points.map(([x, y], i) => (
							<Circle key={i} x={x} y={y} radius={4} fill={drawingColor} />
						))}
					</Layer>
				</Stage>
			)}
		</div>
	);
}
