import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Backdrop, CircularProgress, Skeleton } from '@mui/material';
import LoadingButton from 'components/common/LoadingButton';
import { Form, Formik } from 'formik';
import { doc, updateDoc } from 'firebase/firestore';
import { flushSync } from 'react-dom';
import { Client } from 'models';
import { ClientSchema } from 'schemas';
import { formatClient } from 'utils';
import { toast } from 'react-toastify';
import { useDB } from 'hooks/firebase';

type Props = { id: string };

export default function EditClient({ id }: Props) {
	const { db, getDocByID } = useDB();
	const [client, setClient] = useState<null | Client>(null);
	const [error, setError] = useState<null | string>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getDocByID(id, 'clients').then(data => setClient(data as Client)).catch(e => setError((e as Error).message));
	}, []);

	return (
		<Box sx={{ minHeight: '100vh', background: '#f4f6fb', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Backdrop open={loading} sx={{ zIndex: 9999, flexDirection: 'column', gap: 2 }}>
				<CircularProgress sx={{ color: '#60a5fa' }} size={56} thickness={4} />
				<span style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Guardando cambios...</span>
			</Backdrop>

			{/* Header */}
			<Box sx={{ mb: 4, maxWidth: '1100px', mx: 'auto', width: '100%' }}>
				<a href='/clients' style={{ color: '#1a237e', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
					← Clientes
				</a>
				<Typography sx={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', textAlign: 'center', mt: 0.5 }}>
					Editar cliente
				</Typography>
				<Typography sx={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
					Modifica los campos que deseas actualizar
				</Typography>
			</Box>

			{/* Skeleton */}
			{!client && !error && (
				<Box sx={{ maxWidth: '1100px', width: '100%' }}>
					<Box sx={{ background: '#fff', borderRadius: '16px', p: 3, mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
						{[1,2,3,4].map(i => <Skeleton key={i} height={60} sx={{ mb: 1 }} />)}
					</Box>
				</Box>
			)}

			{/* Error */}
			{error && (
				<Box sx={{ maxWidth: '1100px', width: '100%', background: '#fff', borderRadius: '16px', p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #ffcdd2' }}>
					<Typography sx={{ fontWeight: 700, color: '#e53935', fontSize: '18px' }}>Error</Typography>
					<Typography sx={{ color: '#555', mt: 1 }}>{error}</Typography>
				</Box>
			)}

			{/* Form */}
			{client && !error && (
				<Formik initialValues={client} validationSchema={ClientSchema}
					onSubmit={async (values) => {
						flushSync(() => setLoading(true));
						await new Promise(r => setTimeout(r, 300));
						try {
							await updateDoc(doc(db, 'clients', id), formatClient(values));
							toast.success('Cliente actualizado correctamente');
							setTimeout(() => window.location.href = '/clients', 1000);
						} catch (e) {
							toast.error('Error guardando el cliente');
						} finally {
							setLoading(false);
						}
					}}>
					{({ values, handleChange, handleBlur, errors, touched, submitForm }) => (
						<Form style={{ width: '100%' }}>
							<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, maxWidth: '1100px', mx: 'auto', width: '100%' }}>

								{/* Info básica */}
								<Box sx={{ background: '#fff', borderRadius: '16px', p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', gridColumn: { xs: '1', md: '1 / -1' } }}>
									<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
										<span style={{ fontSize: '18px' }}>👤</span> Información básica
									</Typography>
									<Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
										{[
											{ name: 'name', label: 'Nombre completo' },
											{ name: 'email', label: 'Email', type: 'email' },
											{ name: 'phone', label: 'Teléfono' },
											{ name: 'address', label: 'Dirección' },
										].map(field => (
											<TextField key={field.name} fullWidth name={field.name} label={field.label}
												type={field.type || 'text'}
												value={(values as any)[field.name] || ''}
												onChange={handleChange} onBlur={handleBlur}
												error={(touched as any)[field.name] && Boolean((errors as any)[field.name])}
												helperText={(touched as any)[field.name] && (errors as any)[field.name]}
												variant='outlined' sx={fieldStyle} />
										))}
									</Box>
								</Box>

								{/* Membresía */}
								<Box sx={{ background: '#fff', borderRadius: '16px', p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', gridColumn: { xs: '1', md: '1 / -1' } }}>
									<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
										<span style={{ fontSize: '18px' }}>🎫</span> Membresía
									</Typography>
									<Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
										{[
											{ name: 'cardCode', label: 'Número de tarjeta de membresía' },
											{ name: 'points', label: 'Puntos', type: 'number' },
											{ name: 'visits', label: 'Visitas', type: 'number' },
										].map(field => (
											<TextField key={field.name} fullWidth name={field.name} label={field.label}
												type={field.type || 'text'}
												value={(values as any)[field.name] || ''}
												onChange={handleChange} onBlur={handleBlur}
												error={(touched as any)[field.name] && Boolean((errors as any)[field.name])}
												helperText={(touched as any)[field.name] && (errors as any)[field.name]}
												variant='outlined' sx={fieldStyle} />
										))}
									</Box>
								</Box>

								{/* Botones */}
								<Box sx={{ gridColumn: { xs: '1', md: '1 / -1' }, display: 'flex', gap: 2, justifyContent: 'center' }}>
									<LoadingButton loading={loading} loadingText='Guardando...' variant='contained' size='large' onClick={submitForm}
										sx={{ borderRadius: '10px', px: 4, fontWeight: 600, background: 'linear-gradient(135deg, #1a237e, #283593)', '&.Mui-disabled': { background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#fff', opacity: 0.7 } }}>
										Guardar cambios
									</LoadingButton>
									<a href='/clients' style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', textDecoration: 'none', color: '#555', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', background: '#fff' }}>
										Cancelar
									</a>
								</Box>
							</Box>
						</Form>
					)}
				</Formik>
			)}
		</Box>
	);
}

const fieldStyle = {
	'& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#1a237e' }, '&.Mui-focused fieldset': { borderColor: '#1a237e' } },
	'& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
};