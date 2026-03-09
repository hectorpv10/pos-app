import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import Menu from './Menu';
import Order from './Order';
import ProductsInstantSearch from 'components/Products/ProductsInstantSearch';
import { useCollectionFromDB } from 'hooks/firebase';
import { IOrder } from 'models';
import { formatToCurrency } from 'utils';

export default function Checkout() {
	const recentOrders = useCollectionFromDB('orders') as (IOrder & { id: string })[];

	const sorted = [...recentOrders].sort((a, b) =>
		((b.createdAt as any)?.seconds ?? 0) - ((a.createdAt as any)?.seconds ?? 0)
	).slice(0, 20);

	return (
		<Box sx={{ minHeight: '100vh', background: '#f4f6fb', p: 3 }}>
			<ProductsInstantSearch>
				<Grid container spacing={3}>
					<Grid item xs={12} md={5}>
						<Order />
					</Grid>
					<Grid item xs={12} md={7}>
						<Menu />
					</Grid>
				</Grid>
			</ProductsInstantSearch>

			{/* Órdenes recientes */}
			<Box sx={{ mt: 4 }}>
				<Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
					<span>🧾</span> Órdenes recientes
				</Typography>

				<TableContainer sx={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
					<Table>
						<TableHead>
							<TableRow sx={{ background: 'linear-gradient(135deg, #1a237e, #283593)' }}>
								{['ID', 'Email', 'Productos', 'Subtotal', 'ITBIS', 'Total', 'Pago', 'Estado', 'Fecha'].map(col => (
									<TableCell key={col} sx={{ color: '#fff', fontWeight: 700, fontSize: '13px', borderBottom: 'none', whiteSpace: 'nowrap' }}>
										{col}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{sorted.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} sx={{ textAlign: 'center', py: 6, color: '#aaa', fontSize: '14px' }}>
										No hay órdenes registradas
									</TableCell>
								</TableRow>
							) : sorted.map((order, i) => (
								<TableRow key={order.id} sx={{
									background: i % 2 === 0 ? '#fff' : '#fafbfd',
									'&:hover': { background: '#f0f4ff' },
									transition: 'background 0.15s',
								}}>
									<TableCell sx={{ fontSize: '12px', color: '#aaa', borderBottom: '1px solid #f0f0f0', fontFamily: 'monospace', cursor: 'default' }} title={order.id}>
										{order.id}
									</TableCell>

									<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>

										{order.clientEmail}
									</TableCell>

									<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
										<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
											{order.products?.slice(0, 2).map((p, pi) => (
												<Typography key={pi} sx={{ fontSize: '12px', color: '#555' }}>
													{p.count}x {p.name}
												</Typography>
											))}
											{order.products?.length > 2 && (
												<Typography sx={{ fontSize: '11px', color: '#aaa' }}>
													+{order.products.length - 2} más
												</Typography>
											)}
										</Box>
									</TableCell>
									<TableCell sx={{ fontSize: '13px', color: '#555', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
										{formatToCurrency(order.subTotal)}
									</TableCell>
									<TableCell sx={{ fontSize: '13px', color: '#555', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
										{formatToCurrency(order.taxes)}
									</TableCell>
									<TableCell sx={{ fontSize: '14px', fontWeight: 700, color: '#1a237e', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
										{formatToCurrency(order.total)}
									</TableCell>
									<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
										<Chip
											label={order.payment === 'cash' ? '💵 Efectivo' : '💳 Tarjeta'}
											size='small'
											sx={{
												background: order.payment === 'cash' ? '#e8f5e9' : '#e3f2fd',
												color: order.payment === 'cash' ? '#2e7d32' : '#1565c0',
												fontWeight: 600, fontSize: '11px', borderRadius: '8px',
											}}
										/>
									</TableCell>
									<TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
										<Chip
											label={order.status === 'finished' ? '✅ Completada' : order.status}
											size='small'
											sx={{
												background: '#e8f5e9', color: '#2e7d32',
												fontWeight: 600, fontSize: '11px', borderRadius: '8px',
											}}
										/>
									</TableCell>
									<TableCell sx={{ fontSize: '12px', color: '#888', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
										{(order.createdAt as any)?.seconds
											? new Date((order.createdAt as any).seconds * 1000).toLocaleDateString('es-DO', {
												day: '2-digit', month: 'short', year: 'numeric',
												hour: '2-digit', minute: '2-digit',
											})
											: '—'}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	);
}