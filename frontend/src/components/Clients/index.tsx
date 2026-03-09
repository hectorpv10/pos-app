import { useState } from 'react';
import {
	Box, Button, Typography, TextField, InputAdornment,
	Pagination, CircularProgress, Select, MenuItem, FormControl, InputLabel,
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import DeleteDialog from '../common/DeleteDialog';
import { useCollectionFromDB, useDB } from 'hooks/firebase';
import { where } from 'firebase/firestore';
import { Client } from 'models';
import { toast } from 'react-toastify';

export default function Clients() {
	const allClients = useCollectionFromDB('clients', [where('deleted', '==', false)]) as Client[];
	const { deleteDocByID } = useDB();

	const [search, setSearch] = useState('');
	const [sortBy, setSortBy] = useState('newest');
	const [openDialog, setOpenDialog] = useState(false);
	const [clientName, setClientName] = useState('');
	const [clientId, setClientId] = useState('');
	const [page, setPage] = useState(1);
	const perPage = 10;

	const filtered = allClients
		.filter(c =>
			c.name?.toLowerCase().includes(search.toLowerCase()) ||
			c.email?.toLowerCase().includes(search.toLowerCase()) ||
			c.phone?.toLowerCase().includes(search.toLowerCase()) ||
			c.address?.toLowerCase().includes(search.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === 'newest') return ((b.createdAt as any)?.seconds ?? 0) - ((a.createdAt as any)?.seconds ?? 0);
			if (sortBy === 'oldest') return ((a.createdAt as any)?.seconds ?? 0) - ((b.createdAt as any)?.seconds ?? 0);
			if (sortBy === 'name_asc') return (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase());
			if (sortBy === 'name_desc') return (b.name || '').toLowerCase().localeCompare((a.name || '').toLowerCase());
			if (sortBy === 'points_desc') return (b.points || 0) - (a.points || 0);
			if (sortBy === 'visits_desc') return (b.visits || 0) - (a.visits || 0);
			return 0;
		});

	const totalPages = Math.ceil(filtered.length / perPage);
	const paginated = filtered.slice((page - 1) * perPage, page * perPage);

	const handleDelete = (id: string, name: string) => {
		setClientId(id);
		setClientName(name);
		setOpenDialog(true);
	};
	
	const handleConfirmDelete = async () => {
		console.log('clientId:', clientId);
		try {
			setOpenDialog(false);
			await deleteDocByID(clientId, 'clients');
			toast.success('Cliente eliminado correctamente');
		} catch (e) {
			console.log('error:', e);
			toast.error((e as Error).message);
		}
	};

	const selectStyle = {
		borderRadius: '12px',
		background: '#fff',
		'& fieldset': { borderColor: '#e0e0e0' },
		'&:hover fieldset': { borderColor: '#1a237e' },
		'&.Mui-focused fieldset': { borderColor: '#1a237e !important' },
	};

	return (
		<Box sx={{ minHeight: '100vh', background: '#f4f6fb', p: 4 }}>
			<DeleteDialog
				open={openDialog}
				handleConfirm={handleConfirmDelete}
				handleCancel={() => setOpenDialog(false)}
				message={<>¿Eliminar cliente <strong>{clientName}</strong>?</>}
			/>

			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
				<Box>
					<Typography sx={{ fontSize: '40px', fontWeight: 700, color: '#1a1a2e' }}>
						Clientes
					</Typography>
					<Typography sx={{ color: '#888', fontSize: '14px' }}>
						{filtered.length} de {allClients.length} clientes
					</Typography>
				</Box>
				<Button href='/clients/new' variant='contained' sx={{
					borderRadius: '10px', px: 3, fontWeight: 600,
					background: 'linear-gradient(135deg, #1a237e, #283593)', textTransform: 'none',
				}}>
					+ Nuevo cliente
				</Button>
			</Box>

			{/* Búsqueda y filtros */}
			<Box sx={{
				display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center',
				background: '#fff', borderRadius: '16px', p: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
			}}>
				<TextField
					placeholder='Buscar por nombre, email, teléfono o dirección...'
					value={search}
					onChange={e => { setSearch(e.target.value); setPage(1); }}
					InputProps={{ startAdornment: <InputAdornment position='start'>🔍</InputAdornment> }}
					sx={{
						flex: 1, minWidth: '200px',
						'& .MuiOutlinedInput-root': {
							borderRadius: '12px',
							'&:hover fieldset': { borderColor: '#1a237e' },
							'&.Mui-focused fieldset': { borderColor: '#1a237e' },
						},
					}}
				/>
				<FormControl sx={{ minWidth: 200, '& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' } }}>
					<InputLabel>Ordenar por</InputLabel>
					<Select value={sortBy} label='Ordenar por'
						onChange={e => { setSortBy(e.target.value); setPage(1); }} sx={selectStyle}>
						<MenuItem value='newest'>🕐 Más recientes primero</MenuItem>
						<MenuItem value='oldest'>🕐 Más antiguos primero</MenuItem>
						<MenuItem value='name_asc'>🔤 Nombre A-Z</MenuItem>
						<MenuItem value='name_desc'>🔤 Nombre Z-A</MenuItem>
						<MenuItem value='points_desc'>⭐ Mayor puntos</MenuItem>
						<MenuItem value='visits_desc'>👣 Mayor visitas</MenuItem>
					</Select>
				</FormControl>
				{(search || sortBy !== 'newest') && (
					<Button onClick={() => { setSearch(''); setSortBy('newest'); setPage(1); }}
						sx={{ borderRadius: '10px', color: '#e53935', border: '1px solid #ffcdd2', textTransform: 'none', fontWeight: 600, px: 2 }}>
						✕ Limpiar
					</Button>
				)}
			</Box>

			{/* Loading */}
			{allClients.length === 0 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
					<CircularProgress sx={{ color: '#1a237e' }} />
				</Box>
			)}

			{/* Tabla */}
			{allClients.length > 0 && (
				<TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
					<Table>
						<TableHead>
							<TableRow sx={{ background: 'linear-gradient(135deg, #1a237e, #283593)' }}>
								{['Cliente', 'Email', 'Teléfono', 'Dirección', 'Puntos', 'Visitas','Fecha Creación', 'Fecha Actualización', 'Acciones'].map(col => (
									<TableCell key={col} sx={{ color: '#fff', fontWeight: 700, fontSize: '15px', borderBottom: 'none', whiteSpace: 'nowrap' }}>
										{col}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{paginated.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#aaa', fontSize: '16px' }}>
										No se encontraron clientes
									</TableCell>
								</TableRow>
							) : paginated.map((client, i) => (
								<TableRow key={client.id} sx={{
									background: i % 2 === 0 ? '#fff' : '#fafbfd',
									'&:hover': { background: '#f0f4ff' },
									transition: 'background 0.15s',
								}}>
									{/* Avatar + nombre */}
									<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
											<Box sx={{
												width: '36px', height: '36px', borderRadius: '50%',
												background: 'linear-gradient(135deg, #1a237e, #283593)',
												display: 'flex', alignItems: 'center', justifyContent: 'center',
												color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0,
											}}>
												{client.name?.charAt(0).toUpperCase()}
											</Box>
											<Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1a1a2e', whiteSpace: 'nowrap' }}>
												{client.name}
											</Typography>
										</Box>
									</TableCell>
									<TableCell sx={{ fontSize: '13px', color: '#555', borderBottom: '1px solid #f0f0f0' }}>
										{client.email}
									</TableCell>
									<TableCell sx={{ fontSize: '13px', color: '#555', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
										{client.phone}
									</TableCell>
									<TableCell sx={{ fontSize: '13px', color: '#555', borderBottom: '1px solid #f0f0f0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
										<span title={client.address}>{client.address}</span>
									</TableCell>
									<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
										<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, background: '#e8f5e9', borderRadius: '8px', px: 1.5, py: 0.5 }}>
											<Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#2e7d32' }}>⭐ {client.points || 0}</Typography>
										</Box>
									</TableCell>
									<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
										<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, background: '#e3f2fd', borderRadius: '8px', px: 1.5, py: 0.5 }}>
											<Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1565c0' }}>👣 {client.visits || 0}</Typography>
										</Box>
									</TableCell>
									<TableCell sx={{ borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
										<Typography sx={{ fontSize: '12px', color: '#888' }}>
											{(client.createdAt as any)?.seconds
												? new Date((client.createdAt as any).seconds * 1000).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
												: '—'}
										</Typography>
									</TableCell>
									<TableCell sx={{ borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
										<Typography sx={{ fontSize: '12px', color: '#888' }}>
											{(client.updatedAt as any)?.seconds
												? new Date((client.updatedAt as any).seconds * 1000).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
												: '—'}
										</Typography>
									</TableCell>
									<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
										<Box sx={{ display: 'flex', gap: 1 }}>
											<a href={`/clients/${client.id}/edit`} style={{
												padding: '6px 12px', borderRadius: '8px', textDecoration: 'none',
												fontSize: '12px', fontWeight: 600, color: '#1a237e',
												background: '#e8eaf6', transition: 'background 0.15s',
											}}
											onMouseEnter={e => (e.currentTarget.style.background = '#c5cae9')}
											onMouseLeave={e => (e.currentTarget.style.background = '#e8eaf6')}>
												✏️ Editar
											</a>
											<button onClick={() => handleDelete(client.id!, client.name)} style={{
												padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
												fontSize: '12px', fontWeight: 600, color: '#e53935',
												background: '#ffebee', transition: 'background 0.15s',
											}}
											onMouseEnter={e => (e.currentTarget.style.background = '#ffcdd2')}
											onMouseLeave={e => (e.currentTarget.style.background = '#ffebee')}>
												🗑️ Eliminar
											</button>
										</Box>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{/* Paginación */}
			{totalPages > 1 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
					<Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size='large'
						sx={{ '& .MuiPaginationItem-root': { borderRadius: '8px' }, '& .Mui-selected': { background: '#1a237e !important', color: '#fff' } }} />
				</Box>
			)}
		</Box>
	);
}