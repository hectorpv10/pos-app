import { Box, Typography } from '@mui/material';
import Cart from './Cart';
import ClientInfo from './ClientInfo';
import ClientsInstantSearch from 'components/Clients/ClientsInstantSearch';
import ClientsSearch from './ClientsSearch';
import ProductsSearch from './ProductsSearch';

const Order: React.FunctionComponent = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			{/* Búsquedas */}
			<Box sx={{
				background: '#fff', borderRadius: '16px',
				p: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
			}}>
				<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
					<span style={{ fontSize: '18px' }}>🔍</span> Buscar
				</Typography>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<ClientsInstantSearch>
						<ClientsSearch />
					</ClientsInstantSearch>
					<ProductsSearch />
				</Box>
			</Box>

			{/* Info cliente */}
			<ClientInfo />

			{/* Carrito */}
			<Box sx={{
				background: '#fff', borderRadius: '16px',
				p: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', flexGrow: 1,
			}}>
				<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
					<span style={{ fontSize: '18px' }}>🛒</span> Carrito
				</Typography>
				<Cart />
			</Box>
		</Box>
	);
};

export default Order;