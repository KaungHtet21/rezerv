import { API } from '~config/api';
import type {
	ResendVerificationResponse,
	SignInResponse,
	SignUpResponse,
	VerifyEmailResponse,
} from '../domain';
import { useApiCreate } from '~shared/infrastructure/api/api-fetch';

type AuthMutationOptions<TResponse> = {
	onSuccess?: (data: TResponse) => void;
	onError?: (error: unknown) => void;
};

export const useSignIn = (options?: AuthMutationOptions<SignInResponse>) =>
	useApiCreate<unknown, SignInResponse>({
		url: API.AUTH.SIGNIN,
		onSuccess: data => options?.onSuccess?.(data),
		onError: options?.onError,
	});

export const useSignUp = (options?: AuthMutationOptions<SignUpResponse>) =>
	useApiCreate<unknown, SignUpResponse>({
		url: API.AUTH.SIGNUP,
		onSuccess: data => options?.onSuccess?.(data),
		onError: options?.onError,
	});

export const useVerifyEmail = (
	options?: AuthMutationOptions<VerifyEmailResponse>,
) =>
	useApiCreate<unknown, VerifyEmailResponse>({
		url: API.AUTH.VERIFY_EMAIL,
		onSuccess: data => options?.onSuccess?.(data),
		onError: options?.onError,
	});

export const useResendVerification = (
	options?: AuthMutationOptions<ResendVerificationResponse>,
) =>
	useApiCreate<unknown, ResendVerificationResponse>({
		url: API.AUTH.RESEND_VERIFICATION,
		onSuccess: data => options?.onSuccess?.(data),
		onError: options?.onError,
	});
