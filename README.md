# Movie website — React + JSON Server

## Chạy dự án

```sh
npm install
npm run server
```

Mở terminal thứ hai:

```sh
npm run dev
```

JSON Server chạy ở `http://localhost:5000`. Frontend dùng địa chỉ này mặc định.
Nếu đổi địa chỉ API, sao chép `.env.example` thành `.env.local`, đặt `VITE_API_BASE`, rồi khởi động lại Vite.
Muốn dùng từ máy khác, server phải có địa chỉ truy cập được từ máy đó; `localhost` luôn chỉ chính máy đang mở trình duyệt.

## Tài khoản và dữ liệu

- Admin ban đầu: `admin@gmail.com` / `123`. Đổi mật khẩu trong trang Tài khoản sẽ cập nhật server; không còn đăng nhập bằng mật khẩu hardcode.
- `db.json` lưu các collection `movies`, `users`, `favorites`, `history`.
- Đây là đăng nhập mô phỏng phục vụ đồ án. JSON Server không thực thi xác thực/phân quyền, và mật khẩu demo được lưu dạng văn bản. Không dùng tài khoản hoặc mật khẩu thật.
- localStorage chỉ dùng cho phiên đăng nhập. Khi đăng nhập lại từ trình duyệt cũ, tài khoản cũ được nhập nếu server chưa có email đó và mật khẩu khớp; yêu thích/lịch sử cũ được nhập thêm, không ghi đè bản trên server. Chỉ xóa phần dữ liệu cũ đã chuyển thành công.
- Tài khoản bị admin xóa được đánh dấu `deleted` để trình duyệt cũ không tự nhập lại tài khoản đó. Bản ghi này không xuất hiện trong danh sách quản lý và không thể đăng nhập.
- Tài khoản mới cần mật khẩu ít nhất 6 ký tự. Tài khoản cũ vẫn đăng nhập được bằng mật khẩu hiện tại.

## Danh sách phim

Các trang lấy chung danh sách phim trong phiên chạy ứng dụng. Thêm/sửa/xóa phim trong quản lý cập nhật nguồn dữ liệu chung ngay sau khi server xác nhận.
URL có thể mở trực tiếp, tải lại hoặc chia sẻ, ví dụ:

- `/all-movies?type=hot`
- `/all-movies?type=single`
- `/all-movies?genre=Anime`
- `/all-movies?country=Nhật%20Bản`
- `/all-movies?type=favorites` (danh sách của tài khoản đang đăng nhập)

## Kiểm tra

```sh
npm test
npm run build
npm run lint
```

Test chạy JSON Server trên cổng ngẫu nhiên với dữ liệu trong bộ nhớ; không ghi vào `db.json` của dự án.
