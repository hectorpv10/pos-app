import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectClient } from 'store/checkout/checkout.selectors';

const ClientInfo: React.FunctionComponent = () => {
	const client = useSelector(selectClient);

	return (
		<Box sx={{
			background: '#fff', borderRadius: '16px',
			p: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
		}}>
			<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
				<span style={{ fontSize: '18px' }}>👤</span> Cliente
			</Typography>

			{client ? (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Box sx={{
						width: '48px', height: '48px', borderRadius: '50%',
						background: 'linear-gradient(135deg, #1a237e, #283593)',
						display: 'flex', alignItems: 'center', justifyContent: 'center',
						color: '#fff', fontWeight: 700, fontSize: '20px', flexShrink: 0,
					}}>
						{client.name?.charAt(0).toUpperCase()}
					</Box>
					<Box sx={{ flex: 1 }}>
						<Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#1a1a2e' }}>
							{client.name}
						</Typography>
						<Typography sx={{ fontSize: '12px', color: '#888' }}>
							🎫 {client.cardCode}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Box sx={{ background: '#e8f5e9', borderRadius: '10px', px: 2, py: 1, textAlign: 'center' }}>
							<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#2e7d32' }}>{client.visits}</Typography>
							<Typography sx={{ fontSize: '11px', color: '#888' }}>Visitas</Typography>
						</Box>
						<Box sx={{ background: '#fff3e0', borderRadius: '10px', px: 2, py: 1, textAlign: 'center' }}>
							<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#e65100' }}>{client.points}</Typography>
							<Typography sx={{ fontSize: '11px', color: '#888' }}>Puntos</Typography>
						</Box>
					</Box>
				</Box>
			) : (
				<Typography sx={{ fontSize: '14px', color: '#aaa', textAlign: 'center', py: 1 }}>
					Sin cliente seleccionado — se procesará como anónimo
				</Typography>
			)}
		</Box>
	);
};

export default ClientInfo;