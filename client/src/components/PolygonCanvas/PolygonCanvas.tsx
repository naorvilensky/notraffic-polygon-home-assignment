import { Circle, Image as KonvaImage, Layer, Line, Stage } from 'react-konva';

import type { Polygon } from '@interfaces/polygon.interface';
import useImage from 'use-image';

export interface PolygonCanvasProps {
	polygons: Polygon[];
	points: number[][];
	width: number;
	height: number;
	selectedPolygonId: number | null;
	onClick: (x: number, y: number) => void;
	drawingColor: string;
}

export function PolygonCanvas({
	polygons,
	points,
	width,
	height,
	selectedPolygonId,
	onClick,
	drawingColor,
}: PolygonCanvasProps) {
	const [image] = useImage('https://picsum.photos/1920/1080');

	return (
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
			<Layer>{image && <KonvaImage image={image} width={width} height={height} />}</Layer>

			<Layer>
				{polygons.map(polygon => (
					<Line
						key={polygon.id}
						points={polygon.points.flat()}
						stroke={polygon.color}
						strokeWidth={selectedPolygonId === polygon.id ? 4 : 2}
						closed
						fill={polygon.color}
						onClick={e => {
							e.cancelBubble = true;
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
	);
}
