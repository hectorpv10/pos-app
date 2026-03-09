import { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Backdrop, CircularProgress } from '@mui/material';
import LoadingButton from 'components/common/LoadingButton';
import { Form, Formik, FormikHelpers } from 'formik';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { flushSync } from 'react-dom';
import { IProduct } from 'models';
import { ProductSchema } from 'schemas';
import { formatProduct } from 'utils';
import { toast } from 'react-toastify';
import { useFirestore } from 'reactfire';
import BarcodeScanner from './BarcodeScanner';

export default function AddProduct() {
	const db = useFirestore();
	const [loading, setLoading] = useState(false);
	const isMounted = useRef(true);

	useEffect(() => {
		return () => { isMounted.current = false; };
	}, []);

	const handleSubmit = async (
		values: IProduct,
		{ resetForm }: FormikHelpers<IProduct>
	) => {
		flushSync(() => setLoading(true));
		await new Promise(r => setTimeout(r, 300));
		try {
			await addDoc(
				collection(db, 'products'),
				formatProduct({ ...values, createdAt: serverTimestamp() })
			);
			resetForm();
			toast.success('Producto guardado correctamente');
		} catch (e) {
			toast.error('Error guardando el producto');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{
			minHeight: '100vh',
			background: '#f4f6fb',
			p: 4,
			fontFamily: "'Roboto', sans-serif",
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		}}>
			<Backdrop open={loading} sx={{ zIndex: 9999, flexDirection: 'column', gap: 2 }}>
				<CircularProgress sx={{ color: '#60a5fa' }} size={56} thickness={4} />
				<span style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>
					Guardando producto...
				</span>
			</Backdrop>

			{/* Header */}
			<Box sx={{ mb: 4, maxWidth: '1100px', mx: 'auto', width: '100%' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
					<a href='/products' style={{
						color: '#1a237e',
						textDecoration: 'none',
						fontSize: '14px',
						fontWeight: 600,
						display: 'flex',
						alignItems: 'center',
						gap: '4px',
					}}>
						← Productos
					</a>
				</Box>
				<Typography sx={{ fontSize: '35px', fontWeight: 700, color: '#1a1a2e', m: 0, textAlign: 'center' }}>
					Agregar producto
				</Typography>
				<Typography sx={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
					Completa el formulario para agregar un nuevo producto
				</Typography>
			</Box>

			<Formik
				initialValues={{
					name: '',
					price: '' as unknown as number,
					category: '',
					img: '',
					code: '',
					deleted: false,
				} as IProduct}
				onSubmit={handleSubmit}
				validationSchema={ProductSchema}>
				{({ values, handleChange, handleBlur, errors, touched, submitForm }) => (
					<Form style={{ width: '100%' }}>
						<Box sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
							gap: 3,
							maxWidth: '1100px',
							mx: 'auto',
							width: '100%',
						}}>

							{/* Card info del producto */}
							<Box sx={{
								background: '#fff',
								borderRadius: '16px',
								p: 3,
								boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
								gridColumn: { xs: '1', md: '1 / -1' },
							}}>
								<Typography sx={{ fontWeight: 700, fontSize: '25px', color: '#1a1a2e', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
									<span style={{ fontSize: '25px' }}>📋</span> Información del Producto
								</Typography>
								<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
									<TextField
										fullWidth
										name='name'
										label='Nombre del producto'
										value={values.name}
										onChange={handleChange}
										onBlur={handleBlur}
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant='outlined'
										sx={fieldStyle}
									/>
									<TextField
										fullWidth
										name='category'
										label='Categoría'
										value={values.category}
										onChange={handleChange}
										onBlur={handleBlur}
										error={touched.category && Boolean(errors.category)}
										helperText={touched.category && errors.category}
										variant='outlined'
										sx={fieldStyle}
									/>
									<TextField
										fullWidth
										name='price'
										label='Precio sin ITBIS'
										type='number'
										value={values.price}
										onChange={handleChange}
										onBlur={handleBlur}
										error={touched.price && Boolean(errors.price)}
										helperText={touched.price && errors.price}
										variant='outlined'
										sx={fieldStyle}
									/>
									<TextField
										fullWidth
										label='Precio con ITBIS (18%)'
										type='number'
										value={values.price ? Number((Number(values.price) * 1.18).toFixed(2)) : ''}
										disabled
										variant='outlined'
										sx={{
											...fieldStyle,
											'& .MuiOutlinedInput-root': {
												borderRadius: '10px',
												background: '#f4f6fb',
											},
										}}
									/>
									<TextField
										fullWidth
										name='img'
										label='URL de imagen'
										value={values.img}
										onChange={handleChange}
										onBlur={handleBlur}
										error={touched.img && Boolean(errors.img)}
										helperText={touched.img && errors.img}
										variant='outlined'
										sx={fieldStyle}
									/>
								</Box>
							</Box>

							{/* Card código de barras */}
							<Box sx={{
								background: '#fff',
								borderRadius: '16px',
								p: 3,
								boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
								gridColumn: { xs: '1', md: '1 / -1' },
							}}>
								<Typography sx={{ fontWeight: 700, fontSize: '25px', color: '#1a1a2e', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
									<span style={{ fontSize: '22px' }}>🔖</span> Código de barras
								</Typography>
								<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
									<TextField
										fullWidth
										name='code'
										label='Código de barras'
										value={values.code}
										onChange={handleChange}
										onBlur={handleBlur}
										error={touched.code && Boolean(errors.code)}
										helperText={touched.code && errors.code}
										variant='outlined'
										sx={fieldStyle}
									/>
									<Box sx={{ flexShrink: 0, mt: 1 }}>
										<BarcodeScanner />
									</Box>
								</Box>
							</Box>

							{/* Preview imagen */}
							{values.img && (
								<Box sx={{
									background: '#fff',
									borderRadius: '16px',
									p: 3,
									boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
									gridColumn: { xs: '1', md: '1 / -1' },
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									overflow: 'hidden',
									minWidth: 0,
								}}>
									<img
										src={values.img}
										alt='preview'
										style={{
											width: '120px',
											height: '120px',
											objectFit: 'contain',
											borderRadius: '12px',
											border: '1px solid #eee',
											background: '#f4f6fb',
											padding: '8px',
											flexShrink: 0,
										}}
										onError={e => (e.currentTarget.style.display = 'none')}
									/>
									<Box sx={{ minWidth: 0, flex: 1 }}>
										<Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1a1a2e' }}>
											Vista previa de imagen
										</Typography>
										<Typography sx={{
											fontSize: '12px',
											color: '#888',
											wordBreak: 'break-all',
											overflowWrap: 'anywhere',
											whiteSpace: 'normal',
										}}>
											{values.img}
										</Typography>
									</Box>
								</Box>
							)}

							{/* Botones */}
							<Box sx={{
								gridColumn: { xs: '1', md: '1 / -1' },
								display: 'flex',
								gap: 2,
								justifyContent: 'center',
							}}>
								<LoadingButton
									loading={loading}
									loadingText='Guardando...'
									variant='contained'
									size='large'
									onClick={submitForm}
									sx={{
										borderRadius: '10px',
										px: 4,
										fontWeight: 600,
										background: 'linear-gradient(135deg, #1a237e, #283593)',
										'&.Mui-disabled': {
											background: 'linear-gradient(135deg, #1a237e, #283593)',
											color: '#fff',
											opacity: 0.7,
										},
									}}>
									Agregar producto
								</LoadingButton>
								<a href='/products' style={{
									padding: '10px 24px',
									borderRadius: '10px',
									border: '1px solid #ddd',
									textDecoration: 'none',
									color: '#555',
									fontWeight: 600,
									fontSize: '14px',
									display: 'flex',
									alignItems: 'center',
									background: '#fff',
								}}>
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
	'& .MuiOutlinedInput-root': {
		borderRadius: '10px',
		'&:hover fieldset': { borderColor: '#1a237e' },
		'&.Mui-focused fieldset': { borderColor: '#1a237e' },
	},
	'& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
};