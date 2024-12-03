import {
  DefaultError,
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/vue-query'

type PageResponse<TItem> = {
  items: TItem[]
  pagination: { current_page: number; max_page: number }
}

export const useInfinitePageQuery = <
  TItem,
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
