import {
	Dialog,
	DialogContent,
	DialogActions,
	Typography,
	Box,
} from '@mui/material';
import { ReactNode, useState } from 'react';

type Props = {
	open: boolean;
	handleCancel: () => void;
	handleConfirm: () => Promise<void> | void;
	message: string | ReactNode;
};

export default function DeleteDialog({ message, open, handleCancel, handleConfirm }: Props) {
	const [loading, setLoading] = useState(false);

	const onConfirm = async () => {
		setLoading(true);
		try {
			await handleConfirm();
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleCancel}
			PaperProps={{
				sx: {
					borderRadius: '20px',
					boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
					maxWidth: '420px',
					width: '100%',
					p: 1,
				},
			}}>
			<DialogContent>
				<Box sx={{ textAlign: 'center', py: 2 }}>
					<Box sx={{
						width: '64px',
						height: '64px',
						borderRadius: '50%',
						background: '#ffebee',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '28px',
						mx: 'auto',
						mb: 2,
					}}>
						🗑️
					</Box>
					<Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#1a1a2e', mb: 1 }}>
						Confirmar eliminación
					</Typography>
					<Typography sx={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>
						{message}
					</Typography>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
				<button
					onClick={handleCancel}
					disabled={loading}
					style={{
						flex: 1,
						padding: '10px 20px',
						borderRadius: '10px',
						border: '1px solid #ddd',
						background: '#fff',
						color: '#555',
						fontWeight: 600,
						fontSize: '14px',
						cursor: 'pointer',
						transition: 'background 0.15s',
					}}
					onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
					onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
					Cancelar
				</button>
				<button
					onClick={onConfirm}
					disabled={loading}
					style={{
						flex: 1,
						padding: '10px 20px',
						borderRadius: '10px',
						border: 'none',
						background: loading ? '#ef9a9a' : '#e53935',
						color: '#fff',
						fontWeight: 600,
						fontSize: '14px',
						cursor: loading ? 'not-allowed' : 'pointer',
						transition: 'background 0.15s',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '8px',
					}}
					onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#c62828'; }}
					onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#e53935'; }}>
					{loading ? (
						<>
							<span style={{
								width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)',
								borderTopColor: '#fff', borderRadius: '50%',
								display: 'inline-block', animation: 'spin 0.7s linear infinite',
							}} />
							Eliminando...
						</>
					) : '🗑️ Eliminar'}
				</button>
			</DialogActions>
			<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
		</Dialog>
	);
}