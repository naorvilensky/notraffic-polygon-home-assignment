import { PolygonManager } from '@components/PolygonManager/PolygonManager';
import { Typography, Container, Stack } from '@mui/material';

function App() {
	return (
		<Container sx={{ py: 4 }}>
			<Stack spacing={4}>
				<Typography variant="h4" component="h1">
					NoTraffic Polygon Manager
				</Typography>

				<PolygonManager />
			</Stack>
		</Container>
	);
}

export default App;
