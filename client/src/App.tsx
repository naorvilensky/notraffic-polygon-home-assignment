import { PolygonManager } from '@components/PolygonManager/PolygonManager';
import { Typography, Container, Stack } from '@mui/material';

import { RequestQueueProvider } from './context/RequestQueueProvider';

function App() {
	return (
		<Container sx={{ py: 4 }}>
			<Stack spacing={4}>
				<Typography variant="h4" component="h1">
					NoTraffic Polygon Manager
				</Typography>

				<RequestQueueProvider>
					<PolygonManager />
				</RequestQueueProvider>
			</Stack>
		</Container>
	);
}

export default App;
