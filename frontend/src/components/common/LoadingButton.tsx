import { Button, ButtonProps, CircularProgress } from '@mui/material';

type Props = ButtonProps & {
	loading?: boolean;
	loadingText?: string;
};

export default function LoadingButton({
	loading = false,
	loadingText,
	children,
	disabled,
	...rest
}: Props) {
	return (
		<Button
			disabled={disabled || loading}
			startIcon={loading ? <CircularProgress size={18} color='inherit' /> : undefined}
			{...rest}>
			{loading && loadingText ? loadingText : children}
		</Button>
	);
}