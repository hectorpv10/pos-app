import { Box, Typography, Chip } from '@mui/material';
import { FixMeLater } from '../../models';
import { formatToCurrency } from 'utils';

type Props = { hit: FixMeLater; handleDelete: () => void };

export default function ProductCard({ hit, handleDelete }: Props) {
	return (
		<Box sx={{
			background: '#fff',
			borderRadius: '16px',
			overflow: 'hidden',
			boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
			transition: 'transform 0.2s, box-shadow 0.2s',
			'&:hover': {
				transform: 'translateY(-4px)',
				boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
			},
			display: 'flex',
			flexDirection: 'column',
		}}>
			{/* Imagen */}
			<Box sx={{ position: 'relative' }}>
				<Box
					component='img'
					src={hit?.img}
					alt={hit?.name}
					sx={{
						width: '100%',
						height: '180px',
						objectFit: 'contain',
						display: 'block',
						background: '#f4f6fb',
					}}
					onError={(e: any) => {
						e.currentTarget.src = `https://placehold.co/300x160/e8eaf6/1a237e?text=${encodeURIComponent(hit?.name || 'Producto')}`;
					}}
				/>
				{/* Badge categoría */}
				<Chip
					label={hit?.category?.toUpperCase()}
					size='small'
					sx={{
						position: 'absolute',
						top: 10,
						left: 10,
						background: 'rgba(26,35,126,0.85)',
						color: '#fff',
						fontWeight: 700,
						fontSize: '10px',
						borderRadius: '8px',
						backdropFilter: 'blur(4px)',
					}}
				/>
			</Box>

			{/* Contenido */}
			<Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
				    {/* Nombre */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<Typography sx={{ fontSize: '16px', color: '#1a1a2e', flexShrink: 0 }}>Nombre:</Typography>
					<Typography 
					title={hit?.name}
					sx={{
						fontWeight: 700,
						fontSize: '17px',
						color: '#101069',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						cursor: 'default',
					}}>
						{hit?.name}
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<Typography sx={{ fontSize: '16px', color: '#1a1a2e', flexShrink: 0 }}>Descripción:</Typography>
					<Typography sx={{
						fontSize: '16px',
						color: '#1a1a2e',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}>
						{hit?.category}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<Typography sx={{ fontSize: '12px', color: '#888', flexShrink: 0 }}>Sin ITBIS:</Typography>
						<Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1a237e' }}>
							{formatToCurrency(hit?.price)}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<Typography sx={{ fontSize: '12px', color: '#888', flexShrink: 0 }}>Con ITBIS:</Typography>
						<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#283593' }}>
							{formatToCurrency(hit?.priceWithTax || hit?.price * 1.18)}
						</Typography>
					</Box>
				</Box>

				{hit?.code && (
					<Typography sx={{
						fontSize: '11px',
						color: '#aaa',
						fontFamily: 'monospace',
					}}>
						# {hit?.code}
					</Typography>
				)}
			</Box>

			{/* Acciones */}
			<Box sx={{
				display: 'flex',
				borderTop: '1px solid #f0f0f0',
				overflow: 'hidden',
				borderRadius: '0 0 16px 16px',
			}}>
				<a
					href={`/products/${hit?.objectID || hit?.id}/edit`}
					style={{
						flex: 1,
						padding: '10px',
						textAlign: 'center',
						textDecoration: 'none',
						fontSize: '13px',
						fontWeight: 600,
						color: '#1a237e',
						background: '#fff',
						transition: 'background 0.15s',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '4px',
					}}
					onMouseEnter={e => (e.currentTarget.style.background = '#f5f7ff')}
					onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
					✏️ Editar
				</a>
				<Box sx={{ width: '1px', background: '#f0f0f0' }} />
				<button
					onClick={handleDelete}
					style={{
						flex: 1,
						padding: '10px',
						textAlign: 'center',
						border: 'none',
						cursor: 'pointer',
						fontSize: '13px',
						fontWeight: 600,
						color: '#e53935',
						background: '#fff',
						transition: 'background 0.15s',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '4px',
					}}
					onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
					onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
					🗑️ Eliminar
				</button>
			</Box>
		</Box>
	);
}