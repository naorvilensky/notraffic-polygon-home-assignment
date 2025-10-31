import type { Polygon } from '@interfaces/polygon.interface';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';

interface Props {
	polygons: Polygon[];
	selectedPolygonId: number | null;
	onSelect: (id: number) => void;
	onDelete: (id: number) => void;
}

export function PolygonList({ polygons, selectedPolygonId, onSelect, onDelete }: Props) {
	return (
		<Table className="polygon-list" size="small">
			<TableHead>
				<TableRow>
					<TableCell>Name</TableCell>
					<TableCell>Points</TableCell>
					<TableCell>Color</TableCell>
					<TableCell />
				</TableRow>
			</TableHead>
			<TableBody>
				{polygons.map(polygon => (
					<TableRow
						key={polygon.id}
						hover
						selected={selectedPolygonId === polygon.id}
						onClick={() => polygon.id !== null && onSelect(polygon.id)}
						sx={{ cursor: 'pointer' }}
					>
						<TableCell>{polygon.name}</TableCell>
						<TableCell>{polygon.points.length}</TableCell>
						<TableCell>
							<div
								style={{
									width: 16,
									height: 16,
									backgroundColor: polygon.color,
									borderRadius: 4,
									border: '1px solid #ccc',
								}}
							/>
						</TableCell>
						<TableCell>
							<IconButton
								aria-label="delete"
								size="small"
								onClick={e => {
									e.stopPropagation();
									if (polygon.id !== null) {
										onDelete(polygon.id);
									}
								}}
							>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
