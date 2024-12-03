import {
  DefaultError,
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/vue-query'
import { Ref } from 'vue'

/**
 * Function signature for page-based fetchers.
 */
type PageFetchFunction<TItem extends object> = (param: {
  page: number
}) => Promise<{ items: TItem[]; pagination: { current_page: number; max_page: number } }>

// declare function useInfiniteQuery<TQueryFnData, TError = DefaultError, TData = InfiniteData<TQueryFnData>, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown>(options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey, TPageParam>, queryClient?: QueryClient): UseInfiniteQueryReturnType<TData, TError>;

type PageResponse<TItem extends object> = {
  items: TItem[]
  pagination: { current_page: number; max_page: number }
}

export const useInfinitePageQuery = <
  TItem extends object,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<
    UseInfiniteQueryOptions<
      PageResponse<TItem>,
      TError,
      InfiniteData<PageResponse<TItem>>,
      PageResponse<TItem>,
      TQueryKey,
      number
    >,
    'getNextPageParam' | 'initialPageParam'
  >
) => {
  return useInfiniteQuery({
    ...options,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.current_page >= lastPage.pagination.max_page
        ? undefined
        : lastPage.pagination.current_page + 1
    },
    initialPageParam: 1,
  })
}
