// Phim mới dùng createdAt; phim cũ chưa có ngày tạo giữ thứ tự ID số.
export function newestMovieFirst(a, b) {
  const dateA = Date.parse(a.createdAt) || 0;
  const dateB = Date.parse(b.createdAt) || 0;
  return dateB - dateA || (Number(b.id) || 0) - (Number(a.id) || 0);
}
