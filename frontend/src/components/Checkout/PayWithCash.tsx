import {
	Box, Button, Dialog, DialogActions, DialogContent,
	DialogTitle, TextField, Typography,
} from '@mui/material';
import { useState } from 'react';
import Bills from './Bills';
import { mapCartState } from 'store/checkout/checkout.selectors';
import { serverTimestamp } from 'firebase/firestore';
import useSaveOrder from 'hooks/firebase/useSaveOrder';
import { useSelector } from 'react-redux';
import { useUser } from 'reactfire';

const PayWithCash: React.FunctionComponent = () => {
	const { count, cartProducts, total, taxes, subTotal, client } = useSelector(mapCartState);
	const [receivedMoney, setReceivedMoney] = useState<number>(0);
	const [selectedBill, setSelectedBill] = useState(0);
	const [change, setChange] = useState(0);
	const { data: user } = useUser();
	const saveOrder = useSaveOrder();
	const [open, setOpen] = useState(false);

	const handleSelectedBillChange = (_: React.MouseEvent<HTMLElement>, newBill: number) => {
		setReceivedMoney(0);
		setSelectedBill(newBill);
		calculateChange(newBill);
	};

	const handleReceivedMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
		const parsedValue = parseInt(e.target.value);
		const value = isNaN(parsedValue) ? 0 : parsedValue;
		if (value > 10000000) return;
		setSelectedBill(0);
		setReceivedMoney(value);
		calculateChange(value);
	};

	const calculateChange = (moneyReceived: number) => moneyReceived && setChange(moneyReceived - total);
	
	const handlePay = () => {
		saveOrder({
			products: cartProducts,
			userID: user?.uid ?? '',
			clientID: client?.id || 'anonymous',
			clientEmail: client?.email || 'anonymous',
			taxes, subTotal, total,
			createdAt: serverTimestamp(),
			payment: 'cash',
			status: 'finished',
		});
	};

	return (
		<>
			<Button disabled={count < 1} onClick={() => setOpen(true)} variant='contained' size='large'
				sx={{
					width: '100%', borderRadius: '12px', fontWeight: 600, textTransform: 'none',
					background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
					'&:hover': { background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' },
				}}>
				💵 Pagar en efectivo
			</Button>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='md'
				PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
				<DialogTitle sx={{ fontWeight: 700, fontSize: '20px', color: '#1a1a2e' }}>
					💵 Pagar en efectivo
				</DialogTitle>
				<DialogContent>
					<Box sx={{ py: 2, display: 'flex', gap: 4 }}>
						<Box>
							<Bills value={selectedBill} handleChange={handleSelectedBillChange} />
							<Box mt={3}>
								<TextField autoFocus label='Efectivo recibido' name='efectivo' type='number'
									value={receivedMoney}
									onChange={handleReceivedMoney}
									sx={{
										'& .MuiOutlinedInput-root': { borderRadius: '10px',
											'&.Mui-focused fieldset': { borderColor: '#1a237e' },
										},
										'& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
									}}
								/>
							</Box>
						</Box>
						<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', borderRadius: '16px', p: 3 }}>
							<Typography sx={{ fontSize: '16px', color: '#888', mb: 1 }}>Total a pagar</Typography>
							<Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1a237e', mb: 3 }}>
								${total.toFixed(2)}
							</Typography>
							<Typography sx={{ fontSize: '16px', color: '#888', mb: 1 }}>Devuelta</Typography>
							<Typography sx={{ fontSize: '48px', fontWeight: 800, color: change >= 0 ? '#2e7d32' : '#e53935' }}>
								${change.toFixed(2)}
							</Typography>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
					<Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', color: '#555', border: '1px solid #ddd', px: 3, textTransform: 'none', fontWeight: 600 }}>
						Cancelar
					</Button>
					<Button
						disabled={(!receivedMoney && selectedBill < total) || (!selectedBill && receivedMoney < total)}
						onClick={() => { handlePay(); setOpen(false); }}
						variant='contained'
						sx={{ borderRadius: '10px', px: 3, fontWeight: 600, textTransform: 'none', background: 'linear-gradient(135deg, #2e7d32, #388e3c)' }}>
						✅ Confirmar pago
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default PayWithCash;