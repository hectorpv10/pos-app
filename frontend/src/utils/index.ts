import { Client, FixMeLater } from 'models';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';

import { GridCellValue } from '@mui/x-data-grid';
import { IProduct } from 'models';
import { v4 } from 'uuid';
import { useFirestore } from 'reactfire';

export const formatToCurrency = (value: string | number | GridCellValue) =>
	Number(value).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});

export const formatClient = (values: Client) => ({
	...values,
	name: values.name.toUpperCase(),
	address: values.address.toUpperCase(),
	email: values.email.toLowerCase(),
	updatedAt: serverTimestamp(),
	deleted: false,
});

export const formatProduct = (values: IProduct) => ({
	...values,
	name: values.name.toUpperCase(),
	category: values.category.toUpperCase(),
	img:
    values.img ||
    `https://placehold.co/300x160/e8eaf6/1a237e?text=${values.name}`,
	code: values.code || null,
	price: Number(values.price),
	priceWithTax: Number((Number(values.price) * 1.18).toFixed(2)),
	deleted: false,
	updatedAt: serverTimestamp(),
});

export const uuid = v4;

