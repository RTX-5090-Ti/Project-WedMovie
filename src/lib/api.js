export const API_BASE = (import.meta.env?.VITE_API_BASE || "http://localhost:5000").replace(/\/+$/, "");
export async function request(path, { body, signal, ...options } = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, 15000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options, signal: controller.signal,
      headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...options.headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      const error = new Error(response.status === 404 ? "Dữ liệu không còn tồn tại." : `Không thực hiện được yêu cầu (HTTP ${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    if (signal?.aborted || error.status) throw error;
    throw new Error("Không kết nối được server hoặc dữ liệu trả về không hợp lệ. Vui lòng thử lại.");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
export async function listRecords(collection, params = {}, options) {
  const result = await request(`/${collection}?${new URLSearchParams(params)}`, options);
  if (!Array.isArray(result)) throw new Error("Danh sách từ server không hợp lệ.");
  return result;
}
export const recordPath = (collection, id) => `/${collection}/${encodeURIComponent(id)}`;
export const getMovie = (id, options) => request(recordPath("movies", id), options);
