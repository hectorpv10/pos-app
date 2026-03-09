import {
	Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason,
	AutocompleteRenderInputParams, TextField, Typography,
} from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { Box } from '@mui/system';
import { addToCart } from 'store/checkout/checkout.slice';
import { useAppDispatch } from 'store/hooks';
import { useSelector } from 'react-redux';
import { mapCartState } from 'store/checkout/checkout.selectors';
import { useCollectionFromDB } from 'hooks/firebase';
import { where } from 'firebase/firestore';
import { IProduct } from 'models';
import { formatToCurrency } from 'utils';

const ProductsAutocompleteSearchBox: FunctionComponent = () => {
	const allProducts = useCollectionFromDB('products', [where('deleted', '==', false)]) as IProduct[];
	const { cartProducts } = useSelector(mapCartState);
	const [inputValue, setInputValue] = useState('');
	const [selectedProduct, setSelectedProduct] = useState<any>(null);
	const dispatch = useAppDispatch();

	const filtered = allProducts
		.filter(p => p.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
			p.category?.toLowerCase().includes(inputValue.toLowerCase()))
		.sort((a, b) => {
			const aTime = (a.createdAt as any)?.seconds ?? 0;
			const bTime = (b.createdAt as any)?.seconds ?? 0;
			return bTime - aTime;
		});

	const handleChange = (
		event: React.SyntheticEvent<Element, Event>,
		value: any | null,
		reason: AutocompleteChangeReason,
	) => {
		if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Backspace' && reason === 'removeOption') return;
		if (value) dispatch(addToCart({ ...value, objectID: value.id }));
		setInputValue('');
		setSelectedProduct(null);
	};

	return (
		<Autocomplete
			fullWidth
			clearOnBlur
			clearOnEscape
			filterOptions={x => x}
			size='small'
			value={selectedProduct}
			inputValue={inputValue}
			noOptionsText='No se encontraron productos'
			onInputChange={(_, value) => setInputValue(value)}
			onChange={handleChange}
			options={filtered}
			groupBy={option => option.category}
			getOptionLabel={option => option.name}
			renderOption={(props, option) => (
				<li {...props} key={option.id}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
						<Typography sx={{ fontSize: '14px' }}>{option.name}</Typography>
						<Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1a237e' }}>
							{formatToCurrency(option.price)}
						</Typography>
					</Box>
				</li>
			)}
			renderInput={(params: AutocompleteRenderInputParams) => (
				<TextField
					{...params}
					label='Producto'
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

export default ProductsAutocompleteSearchBox;