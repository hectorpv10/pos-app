import { useState } from 'react';
import { Box, Button, Grid, Typography, TextField, InputAdornment, Pagination, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';
import DeleteDialog from '../common/DeleteDialog';
import { useCollectionFromDB, useDB } from 'hooks/firebase';
import { where } from 'firebase/firestore';
import { IProduct } from 'models';
import { toast } from 'react-toastify';

export default function Products() {
	const allProducts = useCollectionFromDB('products', [where('deleted', '==', false)]) as IProduct[];
	const { deleteDocByID } = useDB();

	const [search, setSearch] = useState('');
	const [openDialog, setOpenDialog] = useState(false);
	const [productName, setProductName] = useState('');
	const [productId, setProductId] = useState('');
	const [page, setPage] = useState(1);
	const perPage = 12;

	const filtered = allProducts.filter(p =>
		p.name?.toLowerCase().includes(search.toLowerCase()) ||
		p.category?.toLowerCase().includes(search.toLowerCase()) ||
		p.code?.toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filtered.length / perPage);
	const paginated = filtered.slice((page - 1) * perPage, page * perPage);

	const handleDelete = (id: string, name: string) => {
		setProductId(id);
		setProductName(name);
		setOpenDialog(true);
	};

	const handleConfirmDelete = async () => {
		try {
			setOpenDialog(false);
			await deleteDocByID(productId);
			setProductId('');
			setProductName('');
			toast.success('Producto eliminado correctamente');
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	return (
		<Box sx={{ minHeight: '100vh', background: '#f4f6fb', p: 4 }}>
			<DeleteDialog
				open={openDialog}
				handleConfirm={handleConfirmDelete}
				handleCancel={() => setOpenDialog(false)}
				message={<>¿Eliminar producto <strong>{productName}</strong>?</>}
			/>

			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
				<Box>
					<Typography sx={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', m: 0 }}>
						Productos
					</Typography>
					<Typography sx={{ color: '#888', fontSize: '14px' }}>
						{allProducts.length} productos en total
					</Typography>
				</Box>
				<Button
					href='/products/new'
					variant='contained'
					sx={{
						borderRadius: '10px',
						px: 3,
						fontWeight: 600,
						background: 'linear-gradient(135deg, #1a237e, #283593)',
						textTransform: 'none',
					}}>
					+ Nuevo producto
				</Button>
			</Box>

			{/* Búsqueda */}
			<Box sx={{ mb: 3 }}>
				<TextField
					fullWidth
					placeholder='Buscar por nombre, categoría o código...'
					value={search}
					onChange={e => { setSearch(e.target.value); setPage(1); }}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>🔍</InputAdornment>
						),
					}}
					sx={{
						maxWidth: '500px',
						'& .MuiOutlinedInput-root': {
							borderRadius: '12px',
							background: '#fff',
							'&:hover fieldset': { borderColor: '#1a237e' },
							'&.Mui-focused fieldset': { borderColor: '#1a237e' },
						},
					}}
				/>
			</Box>

			{/* Loading */}
			{allProducts.length === 0 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
					<CircularProgress sx={{ color: '#1a237e' }} />
				</Box>
			)}

			{/* Grid */}
			<Grid container spacing={3}>
				{paginated.map((product) => (
					<Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
						<ProductCard
							hit={product as any}
							handleDelete={() => handleDelete(product.id!, product.name)}
						/>
					</Grid>
				))}
			</Grid>

			{/* Sin resultados */}
			{allProducts.length > 0 && filtered.length === 0 && (
				<Box sx={{ textAlign: 'center', mt: 8, color: '#aaa' }}>
					<Typography sx={{ fontSize: '18px' }}>No se encontraron productos</Typography>
				</Box>
			)}

			{/* Paginación */}
			{totalPages > 1 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
					<Pagination
						count={totalPages}
						page={page}
						onChange={(_, v) => setPage(v)}
						size='large'
						sx={{
							'& .MuiPaginationItem-root': { borderRadius: '8px' },
							'& .Mui-selected': { background: '#1a237e !important', color: '#fff' },
						}}
					/>
				</Box>
			)}
		</Box>
	);
}