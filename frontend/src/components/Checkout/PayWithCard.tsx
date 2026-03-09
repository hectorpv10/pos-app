import {
	Box, Button, Dialog, DialogActions, DialogContent,
	DialogTitle, TextField, Typography,
} from '@mui/material';
import { useState } from 'react';
import { mapCartState } from 'store/checkout/checkout.selectors';
import { serverTimestamp } from 'firebase/firestore';
import useSaveOrder from 'hooks/firebase/useSaveOrder';
import { useSelector } from 'react-redux';
import { useUser } from 'reactfire';

const PayWithCard: React.FunctionComponent = () => {
	const { count, cartProducts, total, taxes, subTotal, client } = useSelector(mapCartState);
	const { data: user } = useUser();
	const saveOrder = useSaveOrder();
	const [open, setOpen] = useState(false);
	const [cardNumber, setCardNumber] = useState('');
	const [cardHolder, setCardHolder] = useState('');

	const formatCardNumber = (value: string) => {
		const numbers = value.replace(/\D/g, '').slice(0, 16);
		return numbers.replace(/(.{4})/g, '$1 ').trim();
	};

	const handlePay = () => {
		saveOrder({
			products: cartProducts,
			userID: user?.uid ?? '',
			clientID: client?.id || 'anonymous',
			clientEmail: client?.email || 'anonymous',
			taxes, subTotal, total,
			createdAt: serverTimestamp(),
			payment: 'card',
			status: 'finished',
			cardInfo: {
				last4Digits: cardNumber.replace(/\s/g, '').slice(-4),
				nameOnCard: cardHolder,
			},
		});
		setOpen(false);
		setCardNumber('');
		setCardHolder('');
	};

	const isValid = cardNumber.replace(/\s/g, '').length === 16 && cardHolder.length > 2;

	return (
		<>
			<Button disabled={count < 1} onClick={() => setOpen(true)} variant='contained' size='large'
				sx={{
					width: '100%', borderRadius: '12px', fontWeight: 600, textTransform: 'none',
					background: 'linear-gradient(135deg, #1a237e, #283593)',
					'&:hover': { background: 'linear-gradient(135deg, #0d1b6e, #1a237e)' },
				}}>
				💳 Pagar con tarjeta
			</Button>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'
				PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
				<DialogTitle sx={{ fontWeight: 700, fontSize: '20px', color: '#1a1a2e' }}>
					💳 Pagar con tarjeta
				</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
						{/* Preview tarjeta */}
						<Box sx={{
							background: 'linear-gradient(135deg, #1a237e, #283593)',
							borderRadius: '16px', p: 3, color: '#fff',
							boxShadow: '0 8px 24px rgba(26,35,126,0.3)',
						}}>
							<Typography sx={{ fontSize: '12px', opacity: 0.7, mb: 2 }}>TARJETA DE CRÉDITO</Typography>
							<Typography sx={{ fontSize: '22px', fontWeight: 700, letterSpacing: '3px', mb: 2, fontFamily: 'monospace' }}>
								{cardNumber || '•••• •••• •••• ••••'}
							</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
								<Box>
									<Typography sx={{ fontSize: '10px', opacity: 0.7 }}>TITULAR</Typography>
									<Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
										{cardHolder || 'NOMBRE APELLIDO'}
									</Typography>
								</Box>
								<Typography sx={{ fontSize: '24px' }}>💳</Typography>
							</Box>
						</Box>

						<TextField
							fullWidth label='Número de tarjeta'
							value={cardNumber}
							onChange={e => setCardNumber(formatCardNumber(e.target.value))}
							placeholder='1234 5678 9012 3456'
							inputProps={{ maxLength: 19 }}
							sx={{
								'& .MuiOutlinedInput-root': { borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#1a237e' } },
								'& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
							}}
						/>
						<TextField
							fullWidth label='Nombre del titular'
							value={cardHolder}
							onChange={e => setCardHolder(e.target.value.toUpperCase())}
							placeholder='JUAN PÉREZ'
							sx={{
								'& .MuiOutlinedInput-root': { borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#1a237e' } },
								'& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
							}}
						/>

						<Box sx={{ background: '#f4f6fb', borderRadius: '12px', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography sx={{ fontSize: '16px', color: '#888' }}>Total a cobrar</Typography>
							<Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1a237e' }}>${total.toFixed(2)}</Typography>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
					<Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', color: '#555', border: '1px solid #ddd', px: 3, textTransform: 'none', fontWeight: 600 }}>
						Cancelar
					</Button>
					<Button disabled={!isValid} onClick={handlePay} variant='contained'
						sx={{ borderRadius: '10px', px: 3, fontWeight: 600, textTransform: 'none', background: 'linear-gradient(135deg, #1a237e, #283593)' }}>
						✅ Confirmar pago
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default PayWithCard;