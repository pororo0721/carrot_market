import { Stream } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWR from "swr";
interface ResponseData<T> {
  ok: boolean;
  list: T[];
}
interface SWRResponse<T> {
  data?: ResponseData<T>;
  error?: Error;
  mutate: Function;
  isValidating: boolean;
}

export interface PageHandler {
  number: number;
  decPage: () => void;
  incPage: () => void;
}

type UsePageResult<T> = [SWRResponse<T>, PageHandler];
const usePage = <T = any>(api: string): UsePageResult<T> => {
  const [page, setPage] = useState(0);
  const SWRResponse = useSWR<ResponseData<T>>(`${api}?page=${page + ""}`);
  const { data, mutate } = SWRResponse;
  const listLength = SWRResponse.data?.list?.length ?? 0;
  const pageCutter = listLength > 10 ? 10 : listLength;
  const nextList = SWRResponse.data?.list?.slice(0, pageCutter);
  const responseReduced: SWRResponse<T> = {
    ...SWRResponse,
    data: {
      ...(SWRResponse.data as ResponseData<T>),
      list: SWRResponse.data?.list?.slice(0, pageCutter) as T[],
    },
  };
  const isNext = listLength > 10;
  const pageHandler = {
    number: page,
    decPage: () =>
      setPage((current) => (current === 0 ? current : current - 1)),
    incPage: () => setPage((current) => (isNext ? current + 1 : current)),
  };

  return [responseReduced, pageHandler];
};
export default usePage;