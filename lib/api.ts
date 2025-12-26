const API_BASE_URL = "https://localhost:7178";

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  console.log(`Fetching API: ${API_BASE_URL}${url}`);

  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
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