import {
	AuthProvider,
	FirestoreProvider,
	FunctionsProvider,
	useFirebaseApp,
} from 'reactfire';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

interface FirebaseComponentsProps {}

const FirebaseComponents: React.FunctionComponent<FirebaseComponentsProps> = ({
	children,
}) => {
	const app = useFirebaseApp();

	const auth = getAuth(app);
	const functions = getFunctions(app);
	const db = getFirestore(app);

	console.log('ENVIRONMENT:', process.env.NODE_ENV);
	if (process.env.NODE_ENV !== 'production') {
		// @ts-ignore
		self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

		// connectFunctionsEmulator(functions, 'localhost', 5001);
		// connectAuthEmulator(auth, 'http://localhost:9099');
		// connectFirestoreEmulator(db, 'localhost', 8080);
	}

	// Disabled App Check for development
	// const appCheck = initializeAppCheck(app, {
	// 	provider: new ReCaptchaV3Provider(
	// 		'6LfuLzUfAAAAAN8l156dswfgyBM9TrhBvoVEVBjZ'
	// 	),
	// 	isTokenAutoRefreshEnabled: true,
	// });

	return (
		<FirestoreProvider sdk={db}>
			<FunctionsProvider sdk={functions}>
				<AuthProvider sdk={auth}>{children}</AuthProvider>
			</FunctionsProvider>
		</FirestoreProvider>
	);
};

export default FirebaseComponents;

