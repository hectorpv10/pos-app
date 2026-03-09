import {
	collection,
	doc,
	getDocs,
	getDoc,
	onSnapshot,
	query,
	QueryConstraint,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import { FixMeLater } from 'models';
import { useEffect, useState } from 'react';
import { useFirestore } from 'reactfire';

export const useDB = () => {
	// const db = {};
	const db = useFirestore();

	const getDataFromDB = async (collectionName = 'products') => {
		const querySnapshot = await getDocs(collection(db, collectionName));
		const data: FixMeLater[] = [];
		querySnapshot.forEach((doc) => {
			data.push(doc.data());
		});
		return data;
	};

	const getDocByID = async (id: string, collectionName = 'products') => {
		const docRef = doc(db, collectionName, id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) return docSnap.data();
		else throw new Error('No such document');
	};

	const getDocByCode = async (code: string, collectionName = 'products') => {
		const q = query(collection(db, collectionName), where('code', '==', code));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs[0];
	};

	const deleteDocByID = async (id: string, collectionName = 'products') => {
		const docRef = doc(db, collectionName, id);
		await updateDoc(docRef, { deleted: true, updatedAt: serverTimestamp() });
	};

	return { db, getDataFromDB, getDocByID, getDocByCode, deleteDocByID };
};

export const useCollectionFromDB = (
	collectionName: string,
	filters: QueryConstraint[] = []
    ) => {
			const [data, setData] = useState<FixMeLater[]>([]);
			const db = useFirestore();

			useEffect(() => {
				const colRef = collection(db, collectionName);
				const q = query(colRef, ...filters);

				const unsubscribe = onSnapshot(q, (snapshot) => {
					const result: FixMeLater[] = [];
					snapshot.forEach((doc) => {
						result.push({ ...doc.data(), id: doc.id });
					});
					setData(result);
				});

			return () => {
					unsubscribe();
					setData([]);
				};
			}, [collectionName]);

	return data;
};
