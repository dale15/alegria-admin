const API_BASE_URL = "http://localhost:5000/api";
// const API_BASE_URL = "/api";

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  console.log(`Fetching API: ${API_BASE_URL}${url}`);

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }

  // ✅ Handle 204 No Content
  if (res.status === 204) {
    return null as T;
  }

  // ✅ Handle empty body safely
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (null as T);
}

export async function apiFetchBlob(
  url: string,
  options: RequestInit = {},
): Promise<Blob> {
  console.log(`Fetching API (blob): ${API_BASE_URL}${url}`);

  const res = await fetch(`${API_BASE_URL}${url}`, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }

  return await res.blob();
}
