export const fetchData = async <T extends object | string>(endpoint: string, params: URLSearchParams | string) => {
  const body: T = await fetch(`${endpoint}?${params}`).then((r) => r.json());
  if (typeof body === "string") throw new Error(body);
  return body as Exclude<T, string>;
};
