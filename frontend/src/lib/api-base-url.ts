export function getApiBaseUrl() {
  const isServer = typeof window === "undefined";
  const serverApiUrl = process.env.API_URL;
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (isServer && serverApiUrl) {
    return serverApiUrl;
  }

  if (publicApiUrl) {
    return publicApiUrl;
  }

  if (serverApiUrl) {
    return serverApiUrl;
  }

  throw new Error("API base URL is not set. Configure API_URL or NEXT_PUBLIC_API_URL.");
}
