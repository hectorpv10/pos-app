import { useState } from 'react';
import {
	Box, Button, Grid, Typography, TextField, InputAdornment,
	Pagination, CircularProgress, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
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
	const [filterCategory, setFilterCategory] = useState('');
	const [sortBy, setSortBy] = useState('newest');
	const [openDialog, setOpenDialog] = useState(false);
	const [productName, setProductName] = useState('');
	const [productId, setProductId] = useState('');
	const [page, setPage] = useState(1);
	const perPage = 12;

	const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];

	const filtered = allProducts
		.filter(p =>
			(p.name?.toLowerCase().includes(search.toLowerCase()) ||
			p.category?.toLowerCase().includes(search.toLowerCase()) ||
			p.code?.toLowerCase().includes(search.toLowerCase())) &&
			(filterCategory ? p.category === filterCategory : true)
		)
		.sort((a, b) => {
			if (sortBy === 'newest') {
				const aTime = (a.createdAt as any)?.seconds ?? (a.createdAt as any)?._seconds ?? 0;
				const bTime = (b.createdAt as any)?.seconds ?? (b.createdAt as any)?._seconds ?? 0;
				return bTime - aTime;
			}
			if (sortBy === 'oldest') {
				const aTime = (a.createdAt as any)?.seconds ?? (a.createdAt as any)?._seconds ?? 0;
				const bTime = (b.createdAt as any)?.seconds ?? (b.createdAt as any)?._seconds ?? 0;
				return aTime - bTime;
			}
			if (sortBy === 'name_asc') return (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase());
			if (sortBy === 'name_desc') return (b.name || '').toLowerCase().localeCompare((a.name || '').toLowerCase());
			if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
			if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
			return 0;
		});

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

	const selectStyle = {
		borderRadius: '12px',
		background: '#fff',
		'& fieldset': { borderColor: '#e0e0e0' },
		'&:hover fieldset': { borderColor: '#1a237e' },
		'&.Mui-focused fieldset': { borderColor: '#1a237e' },
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
					<Typography sx={{ fontSize: '40px', fontWeight: 700, color: '#1a1a2e', m: 0 }}>
						Productos
					</Typography>
					<Typography sx={{ color: '#888', fontSize: '14px' }}>
						{filtered.length} de {allProducts.length} productos
					</Typography>
				</Box>
				<Button
					href='/products/new'
					variant='contained'
					sx={{
						borderRadius: '10px',
						px: 3,
						fontWeight: 700,
						background: 'linear-gradient(135deg, #1a237e, #283593)',
						textTransform: 'none',
					}}>
					+ Nuevo producto
				</Button>
			</Box>

			{/* Búsqueda y filtros */}
			<Box sx={{
				display: 'flex',
				gap: 2,
				mb: 3,
				flexWrap: 'wrap',
				alignItems: 'center',
				background: '#fff',
				borderRadius: '16px',
				p: 2,
				boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
			}}>
				<TextField
					placeholder='Buscar por nombre, categoría o código...'
					value={search}
					onChange={e => { setSearch(e.target.value); setPage(1); }}
					InputProps={{
						startAdornment: <InputAdornment position='start'>🔍</InputAdornment>,
					}}
					sx={{
						flex: 1,
						minWidth: '200px',
						'& .MuiOutlinedInput-root': {
							borderRadius: '12px',
							'&:hover fieldset': { borderColor: '#1a237e' },
							'&.Mui-focused fieldset': { borderColor: '#1a237e' },
						},
					}}
				/>

				<FormControl sx={{ minWidth: 160 }}>
					<InputLabel>Categoría</InputLabel>
					<Select
						value={filterCategory}
						label='Categoría'
						onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
						sx={selectStyle}>
						<MenuItem value=''>Todas</MenuItem>
						{categories.map(c => (
							<MenuItem key={c} value={c}>{c}</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>Ordenar por</InputLabel>
					<Select
						value={sortBy}
						label='Ordenar por'
						onChange={e => { setSortBy(e.target.value); setPage(1); }}
						sx={selectStyle}>
						<MenuItem value='newest'>🕐 Más recientes primero</MenuItem>
						<MenuItem value='oldest'>🕐 Más antiguos primero</MenuItem>
						<MenuItem value='name_asc'>🔤 Nombre A-Z</MenuItem>
						<MenuItem value='name_desc'>🔤 Nombre Z-A</MenuItem>
						<MenuItem value='price_asc'>💲 Precio menor a mayor</MenuItem>
						<MenuItem value='price_desc'>💲 Precio mayor a menor</MenuItem>
					</Select>
				</FormControl>

				{(search || filterCategory || sortBy !== 'newest') && (
					<Button
						onClick={() => { setSearch(''); setFilterCategory(''); setSortBy('newest'); setPage(1); }}
						sx={{
							borderRadius: '10px',
							color: '#e53935',
							border: '1px solid #ffcdd2',
							textTransform: 'none',
							fontWeight: 600,
							px: 2,
							whiteSpace: 'nowrap',
						}}>
						✕ Limpiar
					</Button>
				)}
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
					<Typography sx={{ fontSize: '14px', mt: 1 }}>Intenta con otros filtros</Typography>
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