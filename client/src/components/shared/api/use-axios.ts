import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { axiosInstance } from './axios';

type HookProps = {
  fetchOnLoad?: boolean;
};

export const useAxios = <T = any>({
  fetchOnLoad = true,
  ...axiosParams
}: HookProps & AxiosRequestConfig) => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [params, setParams] = useState<AxiosRequestConfig | null>(
    fetchOnLoad ? axiosParams : null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (params: AxiosRequestConfig) => {
    try {
      setLoading(true);
      const result = await axiosInstance.request<T>({
        ...axiosParams,
        ...params,
      });
      setResponse(result.data);
    } catch (error) {
      setLoading(false);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params) {
      fetchData(params);
      setParams(null);
    }
  }, [params]);

  return {
    response,
    error,
    loading,
    refetch: (params?: AxiosRequestConfig) => {
      setParams(params ?? {});
    },
  };
};
