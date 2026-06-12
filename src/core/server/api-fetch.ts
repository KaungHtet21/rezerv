import { useQuery, useMutation, useInfiniteQuery } from 'react-query';
import { API } from '~constants/api';
import { API_SERVICE } from './restApi';
import { queryClient } from './queryClient';
import type {
	ResendVerificationResponse,
	SignInResponse,
	SignUpResponse,
	VerifyEmailResponse,
} from './apis/auth';

interface UseApiQueryOptions {
  url: string;
  params?: any;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchInterval?: number | false;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  server?: 'CHAT';
  queryKey?: string[];
}

export const useApiQuery = ({
  url,
  params,
  enabled = true,
  staleTime,
  cacheTime,
  refetchInterval,
  onSuccess,
  onError,
  queryKey,
}: UseApiQueryOptions) => {
  const key = queryKey || [url, JSON.stringify(params)];

  return useQuery(
    key,
    async () => {
      const res = await API_SERVICE.get(url, { params });
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

interface UseApiCreateOptions {
  url: string;
  method?: 'post' | 'put' | 'patch' | 'delete';
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  invalidateKeys?: string[][];
}

export const useApiCreate = ({
  url,
  method = 'post',
  onSuccess,
  onError,
  invalidateKeys,
}: UseApiCreateOptions) => {
  return useMutation(
    async (data: any) => {
      const res = await API_SERVICE[method](url, data);
      return res.data;
    },
    {
      onSuccess: data => {
        if (invalidateKeys) {
          invalidateKeys.forEach(key => queryClient.invalidateQueries(key));
        }
        onSuccess?.(data);
      },
      onError,
    },
  );
};

// ── Cursor-based infinite query (used by feed) ──────────────

interface UseCursorInfiniteQueryOptions {
  url: string;
  params?: any;
  enabled?: boolean;
  limit?: number;
  queryKey?: string[];
}

export const useCursorInfiniteQuery = ({
  url,
  params,
  enabled = true,
  limit = 20,
  queryKey,
}: UseCursorInfiniteQueryOptions) => {
  const key = queryKey || [url, 'cursor-infinite', JSON.stringify(params)];

  const query = useInfiniteQuery(
    key,
    async ({ pageParam = undefined }) => {
      const res = await API_SERVICE.get(url, {
        params: { ...params, cursor: pageParam, limit },
      });
      return res.data;
    },
    {
      enabled,
      getNextPageParam: (lastPage: any) => {
        if (
          (lastPage?.hasMore || lastPage?.hasNextPage) &&
          lastPage?.nextCursor
        ) {
          return lastPage.nextCursor;
        }
        return undefined;
      },
    },
  );

  const rawData =
    query.data?.pages?.flatMap((page: any) => page?.data ?? []) ?? [];
  const seen = new Set<string>();
  const flatData = rawData.filter((item: any) => {
    const id = item?._id || item?.id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return {
    ...query,
    flatData,
  };
};

// ── Page-based infinite query ────────────────────────────────

interface UseInfiniteApiQueryOptions {
  url: string;
  params?: any;
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
  const key = queryKey || [url, 'infinite', JSON.stringify(params)];

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
      getNextPageParam: (lastPage: any, allPages: any[]) => {
        if (lastPage?.data?.length < pageSize) {
          return undefined;
        }
        return allPages.length + 1;
      },
    },
  );
};

// ── Auth mutations ───────────────────────────────────────────

type AuthMutationOptions<TResponse> = {
	onSuccess?: (data: TResponse) => void;
	onError?: (error: any) => void;
};

export const useSignIn = (options?: AuthMutationOptions<SignInResponse>) =>
	useApiCreate({
		url: API.AUTH.SIGNIN,
		onSuccess: options?.onSuccess,
		onError: options?.onError,
	});

export const useSignUp = (options?: AuthMutationOptions<SignUpResponse>) =>
	useApiCreate({
		url: API.AUTH.SIGNUP,
		onSuccess: options?.onSuccess,
		onError: options?.onError,
	});

export const useVerifyEmail = (
	options?: AuthMutationOptions<VerifyEmailResponse>,
) =>
	useApiCreate({
		url: API.AUTH.VERIFY_EMAIL,
		onSuccess: options?.onSuccess,
		onError: options?.onError,
	});

export const useResendVerification = (
	options?: AuthMutationOptions<ResendVerificationResponse>,
) =>
	useApiCreate({
		url: API.AUTH.RESEND_VERIFICATION,
		onSuccess: options?.onSuccess,
		onError: options?.onError,
	});
