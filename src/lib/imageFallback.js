export function movieImageFallback(event) {
  const image = event.currentTarget;
  const fallback = "/images/default-poster.svg";
  // Không lặp lại yêu cầu nếu chính ảnh dự phòng cũng tải lỗi.
  if (image.getAttribute("src") !== fallback) image.src = fallback;
}

export function backdropFallback(event) {
  const image = event.currentTarget;
  const fallback = "/images/default-backdrop.svg";
  if (image.getAttribute("src") !== fallback) image.src = fallback;
}
