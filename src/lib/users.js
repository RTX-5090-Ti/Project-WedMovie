import { listRecords, request, recordPath } from "./api";
import { normalizeEmail, validateAccount } from "./validation";
import { migrateLibrary } from "./userLibrary";

export const publicUser = ({ id, email, name, role, avatar = "", gender = "unknown" }) => ({ id, email, name, role, avatar, gender });
export const findUser = async (email) => (await listRecords("users", { email: normalizeEmail(email) }))[0];
export const getUser = (id) => request(recordPath("users", id));
export const listUsers = async () => (await listRecords("users")).filter((user) => !user.deleted && user.role !== "admin").map(publicUser);
export async function createUser(fields) {
  const error = validateAccount(fields);
  if (error) throw new Error(error);
  const email = normalizeEmail(fields.email);
  if (await findUser(email)) throw new Error("Email đã tồn tại.");
  return request("/users", { method: "POST", body: {
    id: crypto.randomUUID(), email, name: fields.name.trim(), password: fields.password,
    role: "user", avatar: "", gender: "unknown",
  } });
}
export async function authenticate({ email, password }) {
  const error = validateAccount({ email, password }, { login: true });
  if (error) throw new Error(error);
  let user = await findUser(email);
  let legacy = [];
  try { legacy = JSON.parse(localStorage.getItem("users_db") || "[]"); } catch { /* preserve unreadable data */ }
  if (!Array.isArray(legacy)) legacy = [];
  const old = legacy.find((item) => normalizeEmail(item.email) === normalizeEmail(email));
  if (!user && old && old.password === password) {
    user = await request("/users", { method: "POST", body: {
      id: crypto.randomUUID(), email: normalizeEmail(email), name: old.name?.trim() || normalizeEmail(email).split("@")[0],
      password, role: "user", avatar: old.avatar || "", gender: old.gender || "unknown",
    } });
  }
  if (!user || user.deleted || user.password !== password) throw new Error("Email hoặc mật khẩu không đúng.");
  let warning = "";
  try {
    await migrateLibrary(user, old?.email || email.trim());
    if ((old?.email || email.trim()) !== user.email) await migrateLibrary(user);
    if (old) {
      const remaining = legacy.filter((item) => item !== old);
      if (remaining.length) localStorage.setItem("users_db", JSON.stringify(remaining));
      else localStorage.removeItem("users_db");
    }
  } catch { warning = "Đăng nhập thành công, nhưng dữ liệu cũ chưa chuyển hết. Hãy đăng nhập lại để thử tiếp; bản cũ vẫn được giữ."; }
  return { user: publicUser(user), warning };
}
export async function updateProfile(id, fields) {
  if (fields.name !== undefined && (!fields.name.trim() || fields.name.trim().length > 100)) throw new Error("Tên phải có từ 1 đến 100 ký tự.");
  const user = await getUser(id);
  if (user.deleted) throw new Error("Tài khoản đã bị xóa.");
  const changes = {};
  if (fields.name !== undefined) changes.name = fields.name.trim();
  if (fields.avatar !== undefined) changes.avatar = fields.avatar;
  if (fields.gender !== undefined) changes.gender = fields.gender;
  return publicUser(await request(recordPath("users", id), { method: "PATCH", body: changes }));
}
export async function changePassword(id, oldPassword, newPassword) {
  if (!newPassword?.trim() || newPassword.length < 6) throw new Error("Mật khẩu mới cần ít nhất 6 ký tự.");
  const user = await getUser(id);
  if (user.deleted || user.password !== oldPassword) throw new Error("Mật khẩu cũ không đúng hoặc tài khoản đã bị xóa.");
  await request(recordPath("users", id), { method: "PATCH", body: { password: newPassword } });
}
export async function deleteUser(id) {
  const user = await getUser(id);
  if (user.role === "admin") throw new Error("Không thể xóa tài khoản admin.");
  // Keep a tombstone so an old browser cannot import the deleted account again.
  await request(recordPath("users", id), { method: "PATCH", body: { deleted: true, password: "" } });
}
