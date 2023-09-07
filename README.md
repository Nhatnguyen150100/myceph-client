# 🚀 Myceph-Cephalometric Client

Đây là phần giao diện của phần mềm **Myceph** được viết bằng **ReactJs** kết hợp với một vài thư viện UI như **[bootstrap 5.3](https://getbootstrap.com/)**, **[Meterial UI](https://mui.com/material-ui/getting-started/)** và **[Konvajs](https://konvajs.org/)**.

## Cách cài đặt và chạy chương trình

- Đối với môi trường phát triển (development):

```properties
npm install
npm run serve
```

- Đối với môi trường sản phẩm (production):

```properties
npm install
npm run build:prod
npm run prod
```

## Cấu trúc thư mục

Toàn bộ source code sẽ nằm trong thư mục **src** của dự án. Cụ thể các module sẽ được chia như sau:

- **auth**: Mục này sẽ chứa các component liên quan đến phần đăng nhập, đăng kí hay đặt lại mật khẩu của tài khoản
- **common**: Mục này chứa các component con dùng chung cho cả ứng dụng như các nút, form, modal, ...
- **components**: Mục này chứa các component lớn của hệ thống giống như các layout sẽ được hiển thị nhiều trong từng trang thành phần
- **config**: Thiết lập một vài cài đặt trong hệ thống bao gồm về tài khoản cloud và tài khoản google
- **locales**: Thiết lập dịch 2 tiếng **Anh** và **Việt** trong toàn bộ ứng dụng
- **mocks**: Thiết lập sẵn danh sách giá trị tham khảo dùng cho phân tích sọ nghiêng
- **pages**: Phần này là các thư mục và các components chính để tạo giao diện và hiển thị trên trình duyệt cụ thể như sau:
  - CalculatorToothMovement: file thiết lập danh sách đường cong xương và răng
  - calendar: phần liên quan đến đặt lịch hẹn cho bệnh nhân trong phòng khám
  - discussion: phần chat và thảo luận giữa các bác sĩ được chia sẻ cùng 1 hồ sơ bệnh nhân (sử dụng **[Socket.IO](https://socket.io/)**)
  - lateralCephalometricAnalysis: phần tạo danh sách các phân tích từ giao diện đến config class
  - libraryImages: phần này để tạo giao diện xem ảnh của bệnh nhân và lưu trữ ảnh trên cloud
  - medicalRecord: lưu trữ hồ sơ bệnh án của bệnh nhân bao gồm thông tin bệnh nhân, bệnh sử, vấn đề gặp phải, lịch sử điều trị
  - patientList: Phần này để quản lý bệnh nhân của mỗi tài khoản bác sĩ bao gồm bệnh nhân cá nhân, bệnh nhân phòng khám, bệnh nhân được chia sẻ.
  - setting: phần này nhằm thiết lập các thuộc tính của thông tin bác sĩ hay phòng khám cũng như cài đặt các khóa mã hóa dữ liệu
  - HomePage.jsx: Component hiển thị trang chủ của ứng dụng
  - NotFoundPage.jsx: Nếu đường dẫn không đúng sẽ đi đến component này
- **redux**: Lưu trữ store của toàn ứng dụng. Ở đây sử dụng redux là **[Redux-toolkit](https://redux-toolkit.js.org/)**
- **services**: Lưu trữ các hàm để gọi API cũng như refresh lại token

[Video demo chức năng phân tích sọ nghiêng.](https://youtu.be/2kYSiB9v-e4?si=Xi8D_bHQECcIwxBx)
- **trasnlation**: dịch toàn bộ ứng dụng bằng config trong thư mục **locales**
- **App.jsx**: Thiết lập đường dẫn cho các component sử dụng **[React router dom](https://reactrouter.com/)**
- **index.css**: quy định một vài css chung cho ứng dụng

### Ngoài ra phần mềm sử dụng [webpack](https://webpack.js.org/) để phát triển cũng như build sản phẩm. Các biến môi trường, cổng, các plugin đều được thiết lập trong webpack
