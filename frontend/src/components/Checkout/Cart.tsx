import {
	Box, Typography, IconButton, Table, TableBody,
	TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { TAX_RATE, mapCartState } from 'store/checkout/checkout.selectors';
import { formatToCurrency } from 'utils';
import { useSelector } from 'react-redux';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch } from 'store/hooks';
import { removeFromCart } from 'store/checkout/checkout.slice';

const Cart: React.FunctionComponent = () => {
	const { cartProducts, count, total, subTotal, taxes } = useSelector(mapCartState);
	const dispatch = useAppDispatch();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<TableContainer sx={{ maxHeight: 320, borderRadius: '12px', border: '1px solid #f0f0f0' }}>
				<Table stickyHeader size='small'>
					<TableHead>
						<TableRow>
							{['Descripción', 'Cant.', 'Precio', 'Total', ''].map(h => (
								<TableCell key={h} sx={{
									background: 'linear-gradient(135deg, #1a237e, #283593)',
									color: '#fff', fontWeight: 700, fontSize: '12px',
									borderBottom: 'none',
								}}>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{cartProducts.length > 0 ? cartProducts.map(({ name, count, price, objectID }, i) => (
							<TableRow key={objectID} sx={{
								background: i % 2 === 0 ? '#fff' : '#fafbfd',
								'&:hover': { background: '#f0f4ff' },
							}}>
								<TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', borderBottom: '1px solid #f0f0f0' }}>
									{name}
								</TableCell>
								<TableCell sx={{ fontSize: '13px', color: '#555', borderBottom: '1px solid #f0f0f0' }}>
									{count}
								</TableCell>
								<TableCell sx={{ fontSize: '13px', color: '#555', borderBottom: '1px solid #f0f0f0' }}>
									{formatToCurrency(price)}
								</TableCell>
								<TableCell sx={{ fontSize: '13px', fontWeight: 700, color: '#1a237e', borderBottom: '1px solid #f0f0f0' }}>
									{formatToCurrency(count * price)}
								</TableCell>
								<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
									<IconButton size='small' onClick={() => objectID && dispatch(removeFromCart(objectID))}
										sx={{ color: '#e53935', '&:hover': { background: '#ffebee' } }}>
										<DeleteIcon fontSize='small' />
									</IconButton>
								</TableCell>
							</TableRow>
						)) : (
							<TableRow>
								<TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#aaa', fontSize: '14px' }}>
									🛒 No hay productos en el carrito
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Totales */}
			<Box sx={{ background: '#f4f6fb', borderRadius: '12px', p: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
					<Typography sx={{ fontSize: '14px', color: '#888' }}>Subtotal</Typography>
					<Typography sx={{ fontSize: '14px', color: '#555' }}>{formatToCurrency(subTotal)}</Typography>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
					<Typography sx={{ fontSize: '14px', color: '#888' }}>ITBIS ({(TAX_RATE * 100).toFixed(0)}%)</Typography>
					<Typography sx={{ fontSize: '14px', color: '#555' }}>{formatToCurrency(taxes)}</Typography>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #e0e0e0' }}>
					<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e' }}>Total</Typography>
					<Typography sx={{ fontSize: '24px', fontWeight: 800, color: '#1a237e' }}>{formatToCurrency(total)}</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default Cart;