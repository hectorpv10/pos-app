import { useState } from 'react';
import { Box, Typography, TextField, Backdrop, CircularProgress } from '@mui/material';
import LoadingButton from 'components/common/LoadingButton';
import { Form, Formik, FormikHelpers } from 'formik';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { flushSync } from 'react-dom';
import { Client } from 'models';
import { ClientSchema } from 'schemas';
import { formatClient } from 'utils';
import { toast } from 'react-toastify';
import { useFirestore } from 'reactfire';

const formatPhone = (value: string) => {
	const numbers = value.replace(/\D/g, '').slice(0, 10);
	if (numbers.length <= 3) return `(${numbers}`;
	if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
	return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
};

export default function AddClient() {
	const db = useFirestore();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (values: Client, { resetForm }: FormikHelpers<Client>) => {
		flushSync(() => setLoading(true));
		await new Promise(r => setTimeout(r, 300));
		try {
			await addDoc(collection(db, 'clients'), formatClient({ ...values, createdAt: serverTimestamp() }));
			resetForm();
			toast.success('Cliente guardado correctamente');
			setTimeout(() => window.location.href = '/clients', 1000);
		} catch (e) {
			toast.error('Error guardando el cliente');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ minHeight: '100vh', background: '#f4f6fb', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Backdrop open={loading} sx={{ zIndex: 9999, flexDirection: 'column', gap: 2 }}>
				<CircularProgress sx={{ color: '#60a5fa' }} size={56} thickness={4} />
				<span style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Guardando cliente...</span>
			</Backdrop>

			{/* Header */}
			<Box sx={{ mb: 4, maxWidth: '1100px', mx: 'auto', width: '100%' }}>
				<a href='/clients' style={{ color: '#1a237e', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
					← Clientes / Agregar
				</a>
				<Typography sx={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', textAlign: 'center', mt: 0.5 }}>
					Agregar cliente
				</Typography>
				<Typography sx={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
					Completa el formulario para agregar un nuevo cliente
				</Typography>
			</Box>

			<Formik initialValues={{} as Client} onSubmit={handleSubmit} validationSchema={ClientSchema}>
				{({ values, handleChange, handleBlur, errors, touched, submitForm }) => (
					<Form style={{ width: '100%' }}>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, maxWidth: '1100px', mx: 'auto', width: '100%' }}>

							{/* Info básica */}
							<Box sx={{ background: '#fff', borderRadius: '16px', p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', gridColumn: { xs: '1', md: '1 / -1' } }}>
								<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
									<span style={{ fontSize: '18px' }}>👤</span> Información básica
								</Typography>
								<Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
									<TextField fullWidth name='name' label='Nombre completo'
										value={values.name || ''}
										onChange={handleChange} onBlur={handleBlur}
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant='outlined' sx={fieldStyle} />

									<TextField fullWidth name='email' label='Email' type='email'
										value={values.email || ''}
										onChange={handleChange} onBlur={handleBlur}
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										variant='outlined' sx={fieldStyle} />

									<TextField fullWidth name='phone' label='Teléfono'
										value={values.phone || ''}
										onChange={e => {
											const formatted = formatPhone(e.target.value);
											handleChange({ target: { name: 'phone', value: formatted } } as any);
										}}
										onBlur={handleBlur}
										error={touched.phone && Boolean(errors.phone)}
										helperText={(touched.phone && errors.phone) || 'Formato: (809) 555-1234'}
										variant='outlined' sx={fieldStyle} />

									<TextField fullWidth name='address' label='Dirección'
										value={values.address || ''}
										onChange={handleChange} onBlur={handleBlur}
										error={touched.address && Boolean(errors.address)}
										helperText={touched.address && errors.address}
										variant='outlined' sx={fieldStyle} />
								</Box>
							</Box>

							{/* Membresía */}
							<Box sx={{ background: '#fff', borderRadius: '16px', p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', gridColumn: { xs: '1', md: '1 / -1' } }}>
								<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
									<span style={{ fontSize: '18px' }}>🎫</span> Membresía
								</Typography>
								<Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
									<TextField fullWidth name='cardCode' label='Número de tarjeta de membresía'
										value={values.cardCode || ''}
										onChange={handleChange} onBlur={handleBlur}
										error={touched.cardCode && Boolean(errors.cardCode)}
										helperText={touched.cardCode && errors.cardCode}
										variant='outlined' sx={fieldStyle} />

									<TextField fullWidth name='points' label='Puntos' type='number'
										value={values.points || ''}
										onChange={handleChange} onBlur={handleBlur}
										error={touched.points && Boolean(errors.points)}
										helperText={touched.points && errors.points}
										variant='outlined' sx={fieldStyle} />

									<TextField fullWidth name='visits' label='Visitas' type='number'
										value={values.visits || ''}
										onChange={handleChange} onBlur={handleBlur}
										error={touched.visits && Boolean(errors.visits)}
										helperText={touched.visits && errors.visits}
										variant='outlined' sx={fieldStyle} />
								</Box>
							</Box>

							{/* Botones */}
							<Box sx={{ gridColumn: { xs: '1', md: '1 / -1' }, display: 'flex', gap: 2, justifyContent: 'center' }}>
								<LoadingButton loading={loading} loadingText='Guardando...' variant='contained' size='large' onClick={submitForm}
									sx={{ borderRadius: '10px', px: 4, fontWeight: 600, background: 'linear-gradient(135deg, #1a237e, #283593)', '&.Mui-disabled': { background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#fff', opacity: 0.7 } }}>
									Agregar cliente
								</LoadingButton>
								<a href='/clients' style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', textDecoration: 'none', color: '#555', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', background: '#fff' }}>
									Cancelar
								</a>
							</Box>
						</Box>
					</Form>
				)}
			</Formik>
		</Box>
	);
}

const fieldStyle = {
	'& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#1a237e' }, '&.Mui-focused fieldset': { borderColor: '#1a237e' } },
	'& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
};