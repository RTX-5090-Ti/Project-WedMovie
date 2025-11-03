// Phần danh sachhs tài khoản + thêm tài khoản
export default function UserManagerSection({
  users,
  onDeleteUser,
  onOpenAddBox,
}) {
  return (
    <div className="mt-8">
      <div className="mb-3 flex w-[50%] items-center justify-between">
        <h2 className="mb-3 text-2xl font-semibold">Danh sách tài khoản</h2>
        <span
          className="px-6 py-3 font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
          onClick={onOpenAddBox}
        >
          Thêm tài khoản
        </span>
      </div>

      {users.length === 0 ? (
        <p className="text-white/70">
          Hiện chưa có tài khoản nào (ngoại trừ admin).
        </p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.email}
              className="flex w-[50%] items-center justify-between rounded-lg bg-white/5 px-4 py-2 text-sm"
            >
              <span>{u.email}</span>
              <div>
                <img
                  onClick={() => onDeleteUser(u.email)}
                  className="w-5 cursor-pointer"
                  src="/images/logo-header/letter-x_9313433.png"
                  alt="delete"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
