import { useEffect, useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { useAppDispatch } from 'store/hooks';
import { addToCart } from 'store/checkout/checkout.slice';
import { IProduct } from 'models';
import useDebounce from 'hooks/useDebounce';
import { toast } from 'react-toastify';
import { useDB } from 'hooks/firebase';
import { Box, Typography, Button } from '@mui/material';

export default function BarcodeScanner() {
	const { getDocByCode } = useDB();
	const [code, setCode] = useState('');
	const [active, setActive] = useState(false);
	const debouncedCode = useDebounce(code, 700);
	const dispatch = useAppDispatch();

	const getByCode = async (code: string) => {
		try {
			const p = await getDocByCode(code);
			dispatch(addToCart({ ...p.data(), objectID: p.id } as IProduct));
			toast.success(`${p.data().name} agregado al carrito`);
			setCode('');
		} catch (error) {
			toast.error(`Código ${code} no encontrado`);
			setCode('');
		}
	};

	useEffect(() => {
		if (debouncedCode) getByCode(debouncedCode);
	}, [debouncedCode]);

	return (
		<Box>
			{!active ? (
				<Button onClick={() => setActive(true)} variant='outlined' fullWidth
					sx={{
						borderRadius: '10px', textTransform: 'none', fontWeight: 600,
						borderColor: '#1a237e', color: '#1a237e', py: 1.5,
						'&:hover': { borderColor: '#1a237e', background: '#f0f4ff' },
					}}>
					📷 Activar escáner de código de barras
				</Button>
			) : (
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
					<Box sx={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #1a237e' }}>
						<BarcodeScannerComponent
							width={320}
							height={240}
							onUpdate={(err, result) => {
								if (result) setCode(result.getText());
							}}
						/>
					</Box>
					<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
						<Box sx={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32', animation: 'pulse 1.5s infinite' }} />
						<Typography sx={{ fontSize: '13px', color: '#888' }}>Escáner activo — apunta a un código de barras</Typography>
					</Box>
					<Button onClick={() => setActive(false)} size='small'
						sx={{ borderRadius: '8px', textTransform: 'none', color: '#e53935', border: '1px solid #ffcdd2' }}>
						✕ Desactivar escáner
					</Button>
				</Box>
			)}
			<style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
		</Box>
	);
}