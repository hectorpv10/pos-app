import { Box, Typography } from '@mui/material';
import PayWithCard from './PayWithCard';
import PayWithCash from './PayWithCash';
import BarcodeScanner from './BarcodeScanner';

const Menu: React.FunctionComponent = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
			{/* Scanner */}
			<Box sx={{
				background: '#fff', borderRadius: '16px',
				p: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
			}}>
				<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
					<span style={{ fontSize: '18px' }}>📷</span> Escáner
				</Typography>
				<BarcodeScanner />
			</Box>

			{/* Métodos de pago */}
			<Box sx={{
				background: '#fff', borderRadius: '16px',
				p: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
			}}>
				<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
					<span style={{ fontSize: '18px' }}>💳</span> Método de pago
				</Typography>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<Box sx={{ flex: 1 }}>
						<PayWithCash />
					</Box>
					<Box sx={{ flex: 1 }}>
						<PayWithCard />
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Menu;