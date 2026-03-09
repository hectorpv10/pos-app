import {
	Avatar,
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { stringAvatar } from 'utils/avatar';
import { useUser } from 'reactfire';

const UserMenu: React.FunctionComponent = () => {
	const { data: user } = useUser();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
	const handleClose = () => setAnchorEl(null);

	const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
	const email = user?.email || '';
	const initials = displayName
		.split(' ')
		.map((n: string) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	return (
		<Box sx={{ flexGrow: 0 }}>
			{/* Trigger button */}
			<IconButton
				onClick={handleOpen}
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					borderRadius: '12px',
					padding: '6px 12px',
					transition: 'background 0.2s',
					'&:hover': {
						background: 'rgba(255,255,255,0.12)',
					},
				}}>
				<Avatar
					sx={{
						width: 36,
						height: 36,
						background: 'linear-gradient(135deg, #42a5f5, #1565c0)',
						fontSize: '14px',
						fontWeight: 700,
					}}>
					{initials}
				</Avatar>
				<Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
					<Typography sx={{ color: '#fff', fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>
						{displayName}
					</Typography>
					<Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', lineHeight: 1.2 }}>
						{user?.isAnonymous ? 'Invitado' : 'Administrador'}
					</Typography>
				</Box>
				<Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', ml: 0.5 }}>
					▾
				</Typography>
			</IconButton>

			{/* Dropdown */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				PaperProps={{
					sx: {
						mt: 1,
						minWidth: 220,
						borderRadius: '14px',
						boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
						border: '1px solid rgba(0,0,0,0.06)',
						overflow: 'visible',
					},
				}}>

				{/* User info header */}
				<Box sx={{ px: 2, py: 1.5 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Avatar sx={{
							width: 42,
							height: 42,
							background: 'linear-gradient(135deg, #42a5f5, #1565c0)',
							fontSize: '16px',
							fontWeight: 700,
						}}>
							{initials}
						</Avatar>
						<Box>
							<Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e' }}>
								{displayName}
							</Typography>
							<Typography sx={{ fontSize: '12px', color: '#888' }}>
								{email}
							</Typography>
							<Box sx={{
								display: 'inline-block',
								background: '#e3f2fd',
								color: '#1565c0',
								fontSize: '11px',
								fontWeight: 600,
								borderRadius: '6px',
								px: 1,
								py: 0.2,
								mt: 0.3,
							}}>
								Administrador
							</Box>
						</Box>
					</Box>
				</Box>

				<Divider />

				{/* Ver perfil */}
				<MenuItem
					onClick={handleClose}
					component='a'
					href={`/users/${user?.uid}/edit`}
					sx={{
						py: 1.2,
						px: 2,
						gap: 1.5,
						fontSize: '14px',
						color: '#333',
						'&:hover': { background: '#f5f7ff' },
					}}>
					<ListItemIcon sx={{ minWidth: 'auto' }}>
						<span style={{ fontSize: '18px' }}>👤</span>
					</ListItemIcon>
					Ver perfil
				</MenuItem>

				<Divider />

				{/* Cerrar sesión */}
				<MenuItem
					onClick={handleClose}
					component='a'
					href='/logout'
					sx={{
						py: 1.2,
						px: 2,
						gap: 1.5,
						fontSize: '14px',
						color: '#e53935',
						'&:hover': { background: '#fff5f5' },
					}}>
					<ListItemIcon sx={{ minWidth: 'auto' }}>
						<span style={{ fontSize: '18px' }}>🚪</span>
					</ListItemIcon>
					Cerrar sesión
				</MenuItem>
			</Menu>
		</Box>
	);
};

export default UserMenu;