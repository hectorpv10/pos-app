import { useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useCollectionFromDB } from 'hooks/firebase';
import { where } from 'firebase/firestore';
import { IProduct, Client } from 'models';
import { formatToCurrency } from 'utils';

interface Props extends RouteComponentProps {}

function StatCard({ icon, label, value, color, href }: {
	icon: string;
	label: string;
	value: string | number;
	color: string;
	href: string;
}) {
	return (
		<a href={href} style={{ textDecoration: 'none' }}>
			<div style={{
				background: '#fff',
				borderRadius: '16px',
				padding: '24px',
				display: 'flex',
				alignItems: 'center',
				gap: '16px',
				boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
				transition: 'transform 0.2s, box-shadow 0.2s',
				cursor: 'pointer',
			}}
			onMouseEnter={e => {
				(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
				(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
			}}
			onMouseLeave={e => {
				(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
				(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
			}}>
				<div style={{
					width: '56px',
					height: '56px',
					borderRadius: '14px',
					background: color,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '26px',
					flexShrink: 0,
				}}>
					{icon}
				</div>
				<div>
					<div style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', lineHeight: 1 }}>
						{value}
					</div>
					<div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
						{label}
					</div>
				</div>
			</div>
		</a>
	);
}

function SectionTable({ title, icon, color, children }: {
	title: string;
	icon: string;
	color: string;
	children: React.ReactNode;
}) {
	return (
		<div style={{
			background: '#fff',
			borderRadius: '16px',
			boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
			overflow: 'hidden',
		}}>
			<div style={{
				padding: '16px 24px',
				borderBottom: '1px solid #f0f0f0',
				display: 'flex',
				alignItems: 'center',
				gap: '10px',
			}}>
				<span style={{
					width: '32px',
					height: '32px',
					borderRadius: '8px',
					background: color,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '16px',
				}}>{icon}</span>
				<span style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a2e' }}>{title}</span>
			</div>
			<div style={{ padding: '8px 0' }}>
				{children}
			</div>
		</div>
	);
}

export default function Home({}: Props) {
	const allProducts = useCollectionFromDB('products', [where('deleted', '==', false)]) as IProduct[];
	const allClients = useCollectionFromDB('clients', [where('deleted', '==', false)]) as Client[];
	const allOrders = useCollectionFromDB('orders');

	const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
	const recentClients = [...allClients].slice(0, 5);
	const recentProducts = [...allProducts].slice(0, 5);
	const recentOrders = [...allOrders].sort((a, b) =>
		(b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
	).slice(0, 5);

	const loading = allProducts.length === 0 && allClients.length === 0;

	return (
		<div style={{
			minHeight: '100vh',
			background: '#f4f6fb',
			padding: '32px',
			fontFamily: "'Roboto', sans-serif",
		}}>
			{/* Header */}
			<div style={{ marginBottom: '32px' }}>
				<h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#1a1a2e' }}>
					Bienvenido al sistema
				</h1>
				<p style={{ margin: '4px 0 0', color: '#888', fontSize: '14px' }}>
					{new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
				</p>
			</div>

			{/* KPI Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard icon="👥" label="Clientes activos" value={allClients.length} color="#e3f2fd" href="/clients" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard icon="📦" label="Productos activos" value={allProducts.length} color="#e8f5e9" href="/products" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard icon="🧾" label="Órdenes totales" value={allOrders.length} color="#fff3e0" href="/checkout" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard icon="💰" label="Ingresos totales" value={formatToCurrency(totalRevenue)} color="#f3e5f5" href="/reports" />
				</Grid>
			</Grid>

			{/* Tablas */}
			<Grid container spacing={3}>
				{/* Clientes recientes */}
				<Grid item xs={3} md={6}>
					<SectionTable title="Clientes recientes" icon="👥" color="#e3f2fd">
						{recentClients.length === 0 ? (
							<div style={{ padding: '24px', textAlign: 'center', color: '#aaa' }}>Sin clientes</div>
						) : recentClients.map((c, i) => (
							<a key={c.id || i} href={`/clients/${c.id}/edit`} style={{
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
								padding: '12px 24px',
								textDecoration: 'none',
								borderBottom: i < recentClients.length - 1 ? '1px solid #f5f5f5' : 'none',
								transition: 'background 0.15s',
							}}
							onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
							onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
								<div style={{
									width: '38px', height: '38px', borderRadius: '50%',
									background: '#1565c0', color: '#fff',
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									fontWeight: 700, fontSize: '14px', flexShrink: 0,
								}}>
									{c.name?.charAt(0) || '?'}
								</div>
								<div>
									<div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '14px' }}>{c.name}</div>
									<div style={{ color: '#888', fontSize: '12px' }}>{c.email}</div>
								</div>
							</a>
						))}
					</SectionTable>
				</Grid>

				{/* Productos recientes */}
				<Grid item xs={12} md={6}>
					<SectionTable title="Productos recientes" icon="📦" color="#e8f5e9">
						{recentProducts.length === 0 ? (
							<div style={{ padding: '24px', textAlign: 'center', color: '#aaa' }}>Sin productos</div>
						) : recentProducts.map((p, i) => (
							<a key={p.id || i} href={`/products/${p.id}/edit`} style={{
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
								padding: '12px 24px',
								textDecoration: 'none',
								borderBottom: i < recentProducts.length - 1 ? '1px solid #f5f5f5' : 'none',
								transition: 'background 0.15s',
							}}
							onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
							onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
								<div style={{
									width: '38px', height: '38px', borderRadius: '10px',
									background: p.img ? `url(${p.img}) center/cover` : '#2e7d32',
									color: '#fff', display: 'flex', alignItems: 'center',
									justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0,
								}}>
									{!p.img && p.name?.charAt(0)}
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '14px' }}>{p.name}</div>
									<div style={{ color: '#888', fontSize: '12px' }}>{p.category}</div>
								</div>
								<div style={{ fontWeight: 700, color: '#2e7d32', fontSize: '14px' }}>
									{formatToCurrency(p.price)}
								</div>
							</a>
						))}
					</SectionTable>
				</Grid>

				{/* Órdenes recientes */}
				<Grid item xs={12}>
					<SectionTable title="Órdenes recientes" icon="🧾" color="#fff3e0">
						{recentOrders.length === 0 ? (
							<div style={{ padding: '24px', textAlign: 'center', color: '#aaa' }}>Sin órdenes</div>
						) : recentOrders.map((o, i) => (
							<div key={o.id || i} style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '12px 24px',
								borderBottom: i < recentOrders.length - 1 ? '1px solid #f5f5f5' : 'none',
							}}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
									<div style={{
										width: '38px', height: '38px', borderRadius: '10px',
										background: '#fff3e0', display: 'flex',
										alignItems: 'center', justifyContent: 'center', fontSize: '18px',
									}}>🧾</div>
									<div>
										<div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '14px' }}>
											{o.payment === 'cash' ? 'Efectivo' : 'Tarjeta'}
										</div>
										<div style={{ color: '#888', fontSize: '12px' }}>
											{o.products?.length || 0} producto(s)
										</div>
									</div>
								</div>
								<div style={{ fontWeight: 700, color: '#2e7d32', fontSize: '16px' }}>
									{formatToCurrency(o.total)}
								</div>
							</div>
						))}
					</SectionTable>
				</Grid>
			</Grid>
		</div>
	);
}