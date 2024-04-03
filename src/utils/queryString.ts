import { EndPointValues, QueryStringKeyValues } from '../consts/URL';

export const setEndpoint = (endPoint: EndPointValues) => {
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_PATH : process.env.LOCAL_PATH!;
  const newPath = baseUrl + '/' + endPoint;
  window.history.replaceState({}, '', newPath);
};

export const getEndpoint = () => {
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_PATH : process.env.LOCAL_PATH!;
  const currentUrl = window.location.href.split('?')[0];
  const endpoint = currentUrl.substring(baseUrl!.length);
  return endpoint;
};

export const getUrlParams = (paramKey: QueryStringKeyValues) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramKey);
};

export const setUrlParams = (paramKey: QueryStringKeyValues, endpoint: string, paramValue: string) => {
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_PATH : process.env.LOCAL_PATH!;
  const newUrl = endpoint.length
    ? `${baseUrl}${endpoint}?${paramKey}=${paramValue}`
    : `${baseUrl}?${paramKey}=${paramValue}`;
  window.history.replaceState({}, '', newUrl);
};

export const redirectToRoot = () => {
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_PATH : process.env.LOCAL_PATH!;
  window.history.replaceState({}, '', baseUrl);
};

export const deleteUrlParams = (paramKey: QueryStringKeyValues) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(paramKey);
  const newUrl = `${url.pathname}${url.search}`;

  window.history.replaceState({}, '', newUrl);
};
