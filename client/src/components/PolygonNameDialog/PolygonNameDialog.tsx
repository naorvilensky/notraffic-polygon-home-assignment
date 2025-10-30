import { useState, useEffect } from 'react';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
} from '@mui/material';

interface Props {
	open: boolean;
	onClose: () => void;
	onSave: (name: string) => void;
}

export function PolygonNameDialog({ open, onClose, onSave }: Props) {
	const [name, setName] = useState('');

	useEffect(() => {
		if (open) {
			setName('');
		}
	}, [open]);

	const handleSave = () => {
		onSave(name.trim());
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Name your polygon</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Polygon Name"
					fullWidth
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} disabled={!name.trim()}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
