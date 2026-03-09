import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { ILogin } from 'models';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';
import { useFirebaseApp } from 'reactfire';

interface LoginProps {}

const Login: React.FunctionComponent<LoginProps> = () => {
	const app = useFirebaseApp();
	const auth = getAuth(app);

	const handleSubmit = async ({ email, password }: ILogin): Promise<void> => {
		try {
				await signInWithEmailAndPassword(auth, email, password);
			}
		catch (error: unknown) {
				const { code, message } = error as { code: string; message: string };
				switch (code) {
					case 'auth/user-not-found':
						toast.error('El usuario no existe');
						break;
					case 'auth/wrong-password':
						toast.error('Contraseña incorrecta');
						break;
					default:
						toast.error(message);
				}
			throw error;
		}
	};
	return ( <LoginForm onSubmit={handleSubmit} />);
};

export default Login;

