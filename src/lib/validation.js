export const normalizeEmail = (email = "") => email.trim().toLowerCase();
export const validEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
export function validateAccount(
  { name, email, password },
  { login = false } = {},
) {
  if (!validEmail(email)) return "Vui lòng nhập email hợp lệ.";
  if (!login && (!name?.trim() || name.trim().length > 100))
    return "Tên phải có từ 1 đến 100 ký tự.";
  if (!password?.trim()) return "Vui lòng nhập mật khẩu.";
  if (!login && password.length < 6) return "Mật khẩu mới cần ít nhất 6 ký tự.";
  return "";
}
const validMedia = (value) =>
  !value ||
  /^\/(?!\/)/.test(value) ||
  /^\.\/public\//.test(value) ||
  /^https?:\/\/[^\s]+$/i.test(value);
export function validateMovie(form) {
  if (!form.titleVi?.trim() || !form.titleEn?.trim())
    return "Vui lòng nhập tiêu đề tiếng Việt và tiếng Anh.";
  if (form.titleVi.trim().length > 200 || form.titleEn.trim().length > 200)
    return "Tiêu đề không được vượt quá 200 ký tự.";
  if (
    form.year !== undefined &&
    String(form.year).trim() &&
    (!Number.isInteger(Number(form.year)) ||
      Number(form.year) < 1888 ||
      Number(form.year) > new Date().getFullYear() + 10)
  )
    return "Năm phim không hợp lệ.";
  if (
    form.rating !== undefined &&
    String(form.rating).trim() &&
    (!Number.isFinite(Number(form.rating)) ||
      Number(form.rating) < 0 ||
      Number(form.rating) > 10)
  )
    return "Điểm đánh giá phải từ 0 đến 10.";
  if (
    [form.poster, form.smallPoster, form.backdrop, form.trailer].some(
      (value) => !validMedia(value?.trim()),
    )
  )
    return "Ảnh/video cần là đường dẫn /images/…, /videos/… hoặc URL http(s).";
  return "";
}
