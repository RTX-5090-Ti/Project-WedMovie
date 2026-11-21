import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
// Bôx thheem tài khoản

export default function AddUserModal({
  open,
  busy = false,
  newName,
  newEmail,
  newPassword,
  onChangePassword,
  error,
  onChangeName,
  onChangeEmail,
  onClose,
  onCreate,
}) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <Dialog open={open} onClose={() => { if (!busy) onClose(); }} fullWidth maxWidth="xs" className="admin-dialog" aria-labelledby="add-user-title">
      <div className="admin-dialog-content w-full max-w-md rounded-2xl border border-white/10 bg-[#1c1f29] p-6 shadow-xl">
        <h3 id="add-user-title" className="mb-4 text-xl font-semibold">{t("admin.createUser")}</h3>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="add-user-newName" className="text-sm text-white/70">{t("admin.name")}</label>
            <input id="add-user-newName"
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder={t("admin.namePlaceholder")}
              value={newName}
              onChange={(e) => onChangeName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="add-user-newEmail" className="text-sm text-white/70">{t("admin.email")}</label>
            <input id="add-user-newEmail"
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="email"
              placeholder={t("admin.emailPlaceholder")}
              value={newEmail}
              onChange={(e) => onChangeEmail(e.target.value)}
            />
          </div>

          <label className="block text-sm">{t("admin.password")}
            <input type="password" value={newPassword} onChange={(e) => onChangePassword(e.target.value)} className="w-full px-3 py-2 bg-transparent border rounded-lg" />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="admin-dialog-actions flex justify-end gap-3 pt-2 mt-4">
            <button type="button" disabled={busy}
            onClick={onClose}
              className="px-4 py-2 text-sm border cursor-pointer rounded-xl border-white/30 hover:bg-white/10"
            >
              {t("admin.close")}

            </button>
            <button type="button" disabled={busy}
            onClick={onCreate}
              className="px-4 py-2 text-sm font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
            >
              {t("admin.create")}

            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
