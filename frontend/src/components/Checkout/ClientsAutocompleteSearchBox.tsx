import {
	Autocomplete, AutocompleteChangeReason,
	AutocompleteRenderInputParams, TextField, Typography, Avatar,
} from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { setClient } from 'store/checkout/checkout.slice';
import { Box } from '@mui/system';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectClient } from 'store/checkout/checkout.selectors';
import { useCollectionFromDB } from 'hooks/firebase';
import { where } from 'firebase/firestore';
import { Client } from 'models';

const ClientsAutocompleteSearchBox: FunctionComponent = () => {
	const allClients = useCollectionFromDB('clients', [where('deleted', '==', false)]) as Client[];
	const client = useAppSelector(selectClient);
	const [inputValue, setInputValue] = useState('');
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!client) setInputValue('');
	}, [client]);

	const filtered = allClients.filter(c =>
		c.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
		c.email?.toLowerCase().includes(inputValue.toLowerCase()) ||
		c.cardCode?.toLowerCase().includes(inputValue.toLowerCase())
	).sort((a, b) => ((b.createdAt as any)?.seconds ?? 0) - ((a.createdAt as any)?.seconds ?? 0));

	const handleChange = (
		event: React.SyntheticEvent<Element, Event>,
		value: any | null,
		reason: AutocompleteChangeReason,
	) => {
		if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Backspace' && reason === 'removeOption') return;
		dispatch(setClient(value));
		setTimeout(() => setInputValue(''), 0);
	};

	return (
		<Autocomplete
			fullWidth
			clearOnBlur
			clearOnEscape
			freeSolo
			filterOptions={x => x}
			size='small'
			inputValue={inputValue}
			noOptionsText='No se han encontrado clientes'
			onInputChange={(_, value, reason) => {
				if (reason !== 'reset') setInputValue(value);
			}}
			onChange={handleChange}
			options={filtered}
			getOptionLabel={option => typeof option === 'string' ? option : option?.name}
			renderOption={(props, option) => (
				<li {...props} key={option.id}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Box sx={{
							width: '32px', height: '32px', borderRadius: '50%',
							background: 'linear-gradient(135deg, #1a237e, #283593)',
							display: 'flex', alignItems: 'center', justifyContent: 'center',
							color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0,
						}}>
							{option?.name?.charAt(0).toUpperCase()}
						</Box>
						<Box>
							<Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>{option?.name}</Typography>
							<Typography sx={{ fontSize: '12px', color: '#888' }}>🎫 {option?.cardCode} · {option?.email}</Typography>
						</Box>
					</Box>
				</li>
			)}
			renderInput={(params: AutocompleteRenderInputParams) => (
				<TextField
					{...params}
					label='Cliente'
					sx={{
						'& .MuiOutlinedInput-root': {
							borderRadius: '10px',
							'&:hover fieldset': { borderColor: '#1a237e' },
							'&.Mui-focused fieldset': { borderColor: '#1a237e' },
						},
						'& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
					}}
				/>
			)}
		/>
	);
};

export default ClientsAutocompleteSearchBox;