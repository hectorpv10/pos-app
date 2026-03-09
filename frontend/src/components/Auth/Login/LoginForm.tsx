import { useState, useRef, useEffect } from 'react';
import { navigate } from '@reach/router';
import { Form, Formik } from 'formik';
import { ILogin } from 'models';
import { LoginSchema } from 'schemas';
import LoadingButton from 'components/common/LoadingButton';
import bgImage from '../../../assets/images/posBg.jpg';
import { flushSync } from 'react-dom';
import { Backdrop, CircularProgress } from '@mui/material';

interface LoginFormProps {
	onSubmit: (values: ILogin) => Promise<void>;
}

function SubmitButton({ loading }: { loading: boolean }) {
	return (
		<>
			<Backdrop
				open={loading}
				sx={{ zIndex: 9999, flexDirection: 'column', gap: 2 }}>
				<CircularProgress sx={{ color: '#60a5fa' }} size={56} thickness={4} />
				<span style={{
					color: '#fff',
					fontSize: '16px',
					fontWeight: 600,
					letterSpacing: '0.5px',
				}}>
					Cargando....
				</span>
			</Backdrop>
			<LoadingButton
				loading={false}
				fullWidth
				type='submit'
				variant='contained'
				size='large'
				sx={{
					height: '52px',
					borderRadius: '12px',
					fontSize: '16px',
					fontWeight: 600,
					background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
					boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
					mb: '20px',
					mt: '8px',
				}}>
				Iniciar sesión
			</LoadingButton>
		</>
	);
}

const LoginForm: React.FunctionComponent<LoginFormProps> = ({ onSubmit }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const isMounted = useRef(true);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			onSubmit={async (values) => {
				flushSync(() => setLoading(true));
				await new Promise(resolve => setTimeout(resolve, 2000));
				try {
					await onSubmit(values);
				} catch (e) {
					if (isMounted.current) setLoading(false);
				}
			}}
			validationSchema={LoginSchema}>
			{({ values, handleChange, handleBlur, errors, touched }) => (
				<Form>
					<div style={styles.wrapper}>
						<div style={styles.bgLayer1} />
						<div style={styles.bgLayer2} />

						<div style={styles.card}>
							{/* Logo */}
							<div style={styles.logoRow}>
								<div style={styles.logoIcon}>
									<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
										<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
								<span style={styles.logoText}>
									<span style={{ color: '#fff' }}>POS</span>
									<span style={{ color: '#60a5fa' }}> App</span>
								</span>
							</div>

							<h1 style={styles.title}>Bienvenido</h1>
							<p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>

							{/* Email */}
							<div style={styles.fieldGroup}>
								<label style={styles.label}>Correo electrónico</label>
								<div style={{
									...styles.inputWrapper,
									...(touched.email && errors.email ? styles.inputError : {}),
								}}>
									<svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
										<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#888" strokeWidth="2"/>
										<polyline points="22,6 12,13 2,6" stroke="#888" strokeWidth="2"/>
									</svg>
									<input
										name="email"
										type="email"
										placeholder="usuario@empresa.com"
										value={values.email}
										onChange={handleChange}
										onBlur={handleBlur}
										style={styles.input}
									/>
								</div>
								{touched.email && errors.email && (
									<span style={styles.errorText}>{errors.email}</span>
								)}
							</div>

							{/* Password */}
							<div style={styles.fieldGroup}>
								<label style={styles.label}>Contraseña</label>
								<div style={{
									...styles.inputWrapper,
									...(touched.password && errors.password ? styles.inputError : {}),
								}}>
									<svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
										<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#888" strokeWidth="2"/>
										<path d="M7 11V7a5 5 0 0110 0v4" stroke="#888" strokeWidth="2"/>
									</svg>
									<input
										name="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="Contraseña"
										value={values.password}
										onChange={handleChange}
										onBlur={handleBlur}
										style={styles.input}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										style={styles.eyeBtn}>
										{showPassword ? (
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
												<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
												<path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
												<line x1="1" y1="1" x2="23" y2="23" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
											</svg>
										) : (
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#888" strokeWidth="2"/>
												<circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/>
											</svg>
										)}
									</button>
								</div>
								{touched.password && errors.password && (
									<span style={styles.errorText}>{errors.password}</span>
								)}
							</div>

							<SubmitButton loading={loading} />

							<p style={styles.helpText}>
								¿Olvidaste tu contraseña? Contacta el{' '}
								<strong style={{ color: '#93c5fd' }}>Administrador</strong>.
							</p>

							<p style={styles.copyright}>POS App © {new Date().getFullYear()}</p>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

const styles: Record<string, React.CSSProperties> = {
	wrapper: {
		minHeight: '100vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		overflow: 'hidden',
		backgroundImage: `url(${bgImage})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		fontFamily: "'Segoe UI', system-ui, sans-serif",
	},
	bgLayer1: {
		position: 'absolute',
		inset: 0,
		background: 'linear-gradient(135deg, rgba(7, 10, 20, 0.75) 0%, rgba(11, 16, 36, 0.65) 100%)',
		pointerEvents: 'none',
	},
	bgLayer2: {
		position: 'absolute',
		inset: 0,
		background: 'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(10, 19, 52, 0.5) 0%, transparent 70%)',
		pointerEvents: 'none',
	},
	card: {
		position: 'relative',
		zIndex: 1,
		width: '100%',
		height: '650px',
		maxWidth: '700px',
		background: 'rgba(10, 15, 35, 0.82)',
		backdropFilter: 'blur(24px)',
		WebkitBackdropFilter: 'blur(24px)',
		border: '1px solid rgba(96, 165, 250, 0.15)',
		borderRadius: '24px',
		padding: '48px 44px',
		boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
	},
	logoRow: {
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
		marginBottom: '32px',
		justifyContent: 'center',
	},
	logoIcon: {
		width: '52px',
		height: '52px',
		background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
		borderRadius: '14px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
	},
	logoText: {
		fontSize: '30px',
		fontWeight: 700,
		letterSpacing: '-0.5px',
	},
	title: {
		margin: '0 0 8px',
		fontSize: '26px',
		fontWeight: 700,
		color: '#f0f6ff',
		textAlign: 'center',
	},
	subtitle: {
		margin: '0 0 32px',
		fontSize: '14px',
		color: '#64748b',
		textAlign: 'center',
	},
	fieldGroup: {
		marginBottom: '20px',
	},
	label: {
		display: 'block',
		fontSize: '16px',
		fontWeight: 600,
		color: '#94a3b8',
		marginBottom: '8px',
		textTransform: 'uppercase',
		letterSpacing: '0.6px',
	},
	inputWrapper: {
		display: 'flex',
		alignItems: 'center',
		background: 'rgba(255,255,255,0.04)',
		border: '1.5px solid rgba(255,255,255,0.1)',
		borderRadius: '12px',
		padding: '0 16px',
		height: '52px',
		transition: 'border-color 0.2s',
	},
	inputError: {
		borderColor: 'rgba(248,113,113,0.6)',
	},
	inputIcon: {
		flexShrink: 0,
		marginRight: '10px',
	},
	input: {
		flex: 1,
		border: 'none',
		outline: 'none',
		background: 'transparent',
		fontSize: '18px',
		color: '#e2e8f0',
		height: '100%',
		WebkitBoxShadow: '0 0 0px 1000px #161f39 inset',
		WebkitTextFillColor: '#e2e8f0',
		caretColor: '#e2e8f0',
	},
	eyeBtn: {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		padding: '4px',
		display: 'flex',
		alignItems: 'center',
		flexShrink: 0,
	},
	errorText: {
		display: 'block',
		fontSize: '12px',
		color: '#f87171',
		marginTop: '6px',
		paddingLeft: '4px',
	},
	helpText: {
		fontSize: '13px',
		color: '#475569',
		textAlign: 'center',
		margin: '0 0 24px',
	},
	copyright: {
		fontSize: '12px',
		color: '#334155',
		textAlign: 'center',
		margin: 0,
	},
};

export default LoginForm;