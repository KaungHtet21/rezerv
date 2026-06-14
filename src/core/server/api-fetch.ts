import { useQuery, useMutation, useInfiniteQuery } from 'react-query';
import { API_SERVICE } from './restApi';
import { queryClient } from './queryClient';

interface UseApiQueryOptions<TData = unknown> {
	url: string;
	params?: Record<string, unknown>;
	enabled?: boolean;
	staleTime?: number;
	cacheTime?: number;
	refetchInterval?: number | false;
	onSuccess?: (data: TData) => void;
	onError?: (error: unknown) => void;
	queryKey?: readonly string[];
}

export const useApiQuery = <TData = unknown>({
	url,
	params,
	enabled = true,
	staleTime,
	cacheTime,
	refetchInterval,
	onSuccess,
	onError,
	queryKey,
}: UseApiQueryOptions<TData>) => {
	const key = queryKey ?? [url, JSON.stringify(params)];

	return useQuery<TData>(
		key,
		async () => {
			const res = await API_SERVICE.get<TData>(url, { params });
			return res.data;
		},
		{
			enabled,
			staleTime,
			cacheTime,
			refetchInterval,
			onSuccess,
			onError,
		},
	);
};

interface UseApiMutationOptions<TVariables = unknown, TResponse = unknown> {
	url: string | ((variables: TVariables) => string);
	method?: 'post' | 'put' | 'patch' | 'delete';
	getBody?: (variables: TVariables) => unknown;
	onSuccess?: (data: TResponse, variables: TVariables) => void;
	onError?: (error: unknown, variables: TVariables, context: unknown) => void;
	onMutate?: (variables: TVariables) => unknown;
	onSettled?: (
		data: TResponse | undefined,
		error: unknown,
		variables: TVariables,
		context: unknown,
	) => void;
	invalidateKeys?: readonly (readonly string[])[];
}

const resolveUrl = <TVariables>(
	url: string | ((variables: TVariables) => string),
	variables: TVariables,
) => (typeof url === 'function' ? url(variables) : url);

export const useApiCreate = <
	TVariables = unknown,
	TResponse = unknown,
>(options: UseApiMutationOptions<TVariables, TResponse>) => {
	const {
		url,
		method = 'post',
		getBody,
		onSuccess,
		onError,
		onMutate,
		onSettled,
		invalidateKeys,
	} = options;

	return useMutation<TResponse, unknown, TVariables>(
		async (variables: TVariables) => {
			const resolvedUrl = resolveUrl(url, variables);
			const body = getBody ? getBody(variables) : variables;
			const res = await API_SERVICE[method](resolvedUrl, body ?? {});
			return res.data as TResponse;
		},
		{
			onMutate,
			onSuccess: (data, variables) => {
				if (invalidateKeys) {
					invalidateKeys.forEach(key => queryClient.invalidateQueries(key));
				}
				onSuccess?.(data, variables);
			},
			onError,
			onSettled,
		},
	);
};

export const useApiUpdate = <
	TVariables = unknown,
	TResponse = unknown,
>(options: UseApiMutationOptions<TVariables, TResponse>) => {
	const {
		url,
		method = 'patch',
		getBody,
		onSuccess,
		onError,
		onMutate,
		onSettled,
		invalidateKeys,
	} = options;

	return useMutation<TResponse, unknown, TVariables>(
		async (variables: TVariables) => {
			const resolvedUrl = resolveUrl(url, variables);
			const body = getBody ? getBody(variables) : variables;
			const res = await API_SERVICE[method](resolvedUrl, body ?? {});
			return res.data as TResponse;
		},
		{
			onMutate,
			onSuccess: (data, variables) => {
				if (invalidateKeys) {
					invalidateKeys.forEach(key => queryClient.invalidateQueries(key));
				}
				onSuccess?.(data, variables);
			},
			onError,
			onSettled,
		},
	);
};

export const useApiDelete = <
	TVariables = void,
	TResponse = unknown,
>(options: Omit<UseApiMutationOptions<TVariables, TResponse>, 'method' | 'getBody'>) => {
	const { url, onSuccess, onError, onMutate, onSettled, invalidateKeys } = options;

	return useMutation<TResponse, unknown, TVariables>(
		async (variables: TVariables) => {
			const resolvedUrl = resolveUrl(url, variables);
			const res = await API_SERVICE.delete(resolvedUrl);
			return res.data as TResponse;
		},
		{
			onMutate,
			onSuccess: (data, variables) => {
				if (invalidateKeys) {
					invalidateKeys.forEach(key => queryClient.invalidateQueries(key));
				}
				onSuccess?.(data, variables);
			},
			onError,
			onSettled,
		},
	);
};

interface UseInfiniteApiQueryOptions {
	url: string;
	params?: Record<string, unknown>;
	enabled?: boolean;
	pageSize?: number;
	queryKey?: string[];
}

export const useInfiniteApiQuery = ({
	url,
	params,
	enabled = true,
	pageSize = 20,
	queryKey,
}: UseInfiniteApiQueryOptions) => {
	const key = queryKey ?? [url, 'infinite', JSON.stringify(params)];

	return useInfiniteQuery(
		key,
		async ({ pageParam = 1 }) => {
			const res = await API_SERVICE.get(url, {
				params: { ...params, page: pageParam, limit: pageSize },
			});
			return res.data;
		},
		{
			enabled,
			getNextPageParam: (lastPage: { data?: unknown[] }, allPages: unknown[]) => {
				if ((lastPage?.data?.length ?? 0) < pageSize) {
					return undefined;
				}
				return allPages.length + 1;
			},
		},
	);
};
