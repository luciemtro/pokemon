declare module "use-suspense" {
  export function useSuspense<T>(fetcher: () => Promise<T>): T;
}
