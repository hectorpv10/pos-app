import {
	AppBar,
	Box,
	Button,
	Toolbar,
	Typography,
} from '@mui/material';
import { useSigninCheck } from 'reactfire';

//import CheckoutButton from './CheckoutButton';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';

const pages = [
	{ name: 'Productos', path: '/products' },
	{ name: 'Clientes', path: '/clients' },
	{ name: 'Ordenes', path: '/checkout' },
	{ name: 'Usuarios', path: '/users' },
	{ name: 'Reportes', path: '/reports' },
];

const adminRoutes = ['/reports', '/users'];

export default function POSAppBar() {
	const { data: signinCheck } = useSigninCheck({
		// @ts-ignore
		requiredClaims: { admin: true },
	});
	const { signedIn, hasRequiredClaims: isAdmin } = signinCheck || {};

	return (
		<AppBar
			position='sticky'
			elevation={0}
			sx={{
				background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
				borderBottom: '1px solid rgba(255,255,255,0.08)',
				width: '100%',
			}}>
			<Toolbar disableGutters sx={{ px: 3, minHeight: '64px' }}>

				{/* Logo */}
				<a href='/home' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
					<div style={{
						width: '36px',
						height: '36px',
						background: 'rgba(255,255,255,0.15)',
						borderRadius: '10px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '18px',
					}}>
						🏪
					</div>
					<Typography sx={{
						fontWeight: 800,
						fontSize: '22px',
						letterSpacing: '-0.5px',
						lineHeight: 1,
					}}>
						<span style={{ color: '#fff' }}>POS</span>
						<span style={{ color: '#90caf9' }}>App</span>
					</Typography>
				</a>

				{/* Nav links */}
				<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ml: 4, gap: 1 }}>
					{pages.map(({ name, path }) =>
						((isAdmin && adminRoutes.includes(path)) || !adminRoutes.includes(path)) && (
							<Button
								key={path}
								href={path}
								sx={{
									color: 'rgba(255,255,255,0.75)',
									fontWeight: 500,
									fontSize: '14px',
									borderRadius: '8px',
									px: 2,
									py: 0.8,
									textTransform: 'none',
									transition: 'all 0.2s',
									'&:hover': {
										color: '#fff',
										background: 'rgba(255,255,255,0.12)',
									},
								}}>
								{name}
							</Button>
						)
					)}
				</Box>

				{/* Right side */}
				{signedIn ? (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						{/* <CheckoutButton /> */}
						<UserMenu />
					</Box>
				) : (
					<LoginButton />
				)}
			</Toolbar>
		</AppBar>
	);
}