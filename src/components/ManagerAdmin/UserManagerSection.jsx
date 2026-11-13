// Phần danh sachhs tài khoản + thêm tài khoản
export default function UserManagerSection({
  users,
  onDeleteUser,
  onOpenAddBox,
}) {
  return (
    <div className="mt-8">
      <div className="admin-section-heading admin-users-width mb-3 flex items-center justify-between">
        <h2 className="mb-3 text-2xl font-semibold">Danh sách tài khoản</h2>
        <button type="button"
          className="px-6 py-3 font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
          onClick={onOpenAddBox}
        >
          Thêm tài khoản
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-white/70">
          Hiện chưa có tài khoản nào (ngoại trừ admin).
        </p>
      ) : (
        <ul className="admin-users-width space-y-2">
          {users.map((u) => (
            <li
              key={u.email}
              className="admin-user-row flex items-center justify-between rounded-lg bg-white/5 px-4 py-2 text-sm"
            >
              <span>{u.email}</span>
              <button type="button" className="admin-delete" aria-label={`Xoá tài khoản ${u.email}`} onClick={() => onDeleteUser(u.email)}>
                <img src="/images/logo-header/letter-x_9313433.png" alt="" className="w-4" />
              </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
