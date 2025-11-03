export default function Footer() {
  const links = [
    "FAQ",
    "Trung tâm trợ giúp",
    "Tài khoản",
    "Trung tâm đa phương tiện",
    "Quan hệ nhà đầu tư",
    "Việc làm",
    "Điều khoản sử dụng",
    "Quyền riêng tư",
    "Tùy chọn cookie",
    "Thông tin doanh nghiệp",
    "Liên hệ",
    "Chỉ số tốc độ",
  ];

  return (
    <footer className="text-gray-400 bg-[#192026] border-t border-white/10">
      <div className="w-full px-6 py-10 mx-auto max-w-7xl">
        {/* hotline / contact line */}
        <p className="mb-6 text-sm">
          Câu hỏi? Liên hệ:{" "}
          <a href="tel:0123456789" className="underline hover:text-gray-200">
            0123 456 789
          </a>
        </p>

        {/* link grid */}
        <nav className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-4">
          {links.map((t, i) => (
            <a
              key={i}
              href="#"
              className="transition-colors hover:text-gray-200"
            >
              {t}
            </a>
          ))}
        </nav>

        {/* bottom row: language + legal */}
        <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between">
          {/* language */}
          <label className="inline-flex items-center gap-2 text-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="fill-gray-400"
            >
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm7.93 9h-3.11a15.7 15.7 0 0 0-1.13-5A8.03 8.03 0 0 1 19.93 11ZM12 4c.86 0 2.39 2.07 2.97 6H9.03C9.61 6.07 11.14 4 12 4ZM8.24 6a15.7 15.7 0 0 0-1.13 5H4.07A8.03 8.03 0 0 1 8.24 6ZM4.07 13h3.04c.12 1.74.57 3.51 1.3 5a8.03 8.03 0 0 1-4.34-5Zm4.96 0h5.94c-.58 3.93-2.11 6-2.97 6s-2.39-2.07-2.97-6Zm7.36 5a14.7 14.7 0 0 0 1.3-5h3.04a8.03 8.03 0 0 1-4.34 5Z" />
            </svg>
            <select
              className="px-2 py-1 text-gray-200 bg-transparent border rounded border-white/20 focus:outline-none focus:ring-1 focus:ring-white/40"
              defaultValue="vi"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </label>

          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} MovieVerse. Một sản phẩm học tập.
            <span className="ml-2">Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
