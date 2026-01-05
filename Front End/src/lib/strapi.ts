import qs from 'qs';

export function getStrapiURL(path = '') {
  return `https://active-success-312253e677.strapiapp.com${path}`;
}

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options: RequestInit = {}
) {
  const mergedOptions: RequestInit = {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  };

  const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
  const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ''}`)}`;

  try {
    console.log(`[Strapi] Fetching fresh: ${requestUrl}`);
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error(`[Strapi] Error ${response.status}`);
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Strapi] Got ${data.data?.length || 1} item(s)`);
    return data;
  } catch (error) {
    console.error(`[Strapi] Error:`, error);
    return { data: [], meta: {} };
  }
}

export function getStrapiMedia(url: string | null) {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${getStrapiURL()}${url}`;
}
