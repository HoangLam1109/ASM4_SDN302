# Quiz App Frontend (TypeScript)

Ứng dụng Quiz được xây dựng với React, TypeScript, Redux Toolkit và Bootstrap 5.

## Tính năng

### Người dùng thường:
- Đăng nhập/Đăng ký
- Xem danh sách quiz
- Làm bài quiz
- Xem điểm sau khi hoàn thành

### Admin:
- Tất cả tính năng của người dùng thường
- Tạo quiz mới
- Chỉnh sửa quiz
- Xóa quiz
- Tạo và quản lý câu hỏi

## Cấu trúc thư mục

```
src/
├── components/          # React components
│   ├── Login.tsx       # Trang đăng nhập
│   ├── Signup.tsx      # Trang đăng ký
│   ├── QuizList.tsx    # Danh sách quiz
│   ├── TakeQuiz.tsx    # Làm bài quiz
│   ├── QuizForm.tsx    # Tạo/sửa quiz (admin)
│   ├── Navbar.tsx      # Navigation bar
│   └── PrivateRoute.tsx # Bảo vệ routes
├── hooks/              # Custom hooks
│   └── redux.ts        # Redux hooks với TypeScript
├── store/              # Redux store
│   ├── store.ts        # Configure store
│   └── slices/         # Redux slices
│       ├── authSlice.ts
│       └── quizSlice.ts
├── services/           # API services
│   └── api.ts          # API calls
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` trong thư mục root:
```
REACT_APP_API_URL=http://localhost:3000/api
```

3. Chạy ứng dụng:
```bash
npm start
```

Ứng dụng sẽ chạy tại http://localhost:3000

## API Endpoints được sử dụng

### User APIs:
- `POST /api/login` - Đăng nhập
- `GET /api/users` - Lấy tất cả users
- `POST /api/users` - Tạo user mới (admin)
- `GET /api/users/:id` - Xem chi tiết user
- `PUT /api/users/:id` - Cập nhật user (admin)
- `DELETE /api/users/:id` - Xóa user (admin)

### Quiz APIs:
- `GET /api/quizzes` - Lấy tất cả quiz
- `GET /api/quizzes/:id` - Lấy quiz theo ID
- `POST /api/quizzes` - Tạo quiz mới (admin)
- `PUT /api/quizzes/:id` - Cập nhật quiz (admin)
- `DELETE /api/quizzes/:id` - Xóa quiz (admin)
- `GET /api/quizzes/:quizId/populate` - Lấy questions theo keyword
- `POST /api/quizzes/:quizId/question` - Thêm 1 question vào quiz (admin)
- `POST /api/quizzes/:quizId/questions` - Thêm nhiều questions vào quiz (admin)

### Question APIs:
- `GET /api/questions` - Lấy tất cả questions
- `POST /api/questions` - Tạo question mới
- `PUT /api/questions/:id` - Cập nhật question (author)
- `GET /api/questions/:id` - Xem chi tiết question
- `DELETE /api/questions/:id` - Xóa question (author)

## Cấu hình Backend

Backend cần chạy tại `http://localhost:3000` và cung cấp các endpoints như trên.

Backend cần gửi response với format:
```typescript
// Login response
{
  token: string,
  user: {
    _id: string,
    name: string,
    email: string,
    isAdmin: boolean
  }
}

// Quiz response
{
  _id: string,
  title: string,
  description: string,
  questions: Question[]
}
```

## State Management

Ứng dụng sử dụng Redux Toolkit với 2 slices chính:

1. **authSlice**: Quản lý authentication state
   - user: Thông tin người dùng
   - token: JWT token
   - isAuthenticated: Trạng thái đăng nhập
   - isAdmin: Quyền admin

2. **quizSlice**: Quản lý quiz state
   - quizzes: Danh sách quiz
   - currentQuiz: Quiz đang làm
   - userAnswers: Câu trả lời của người dùng
   - score: Điểm số
   - loading: Trạng thái loading

## TypeScript Types

Tất cả các types được định nghĩa trong `src/types/index.ts`:
- User
- Question
- Quiz
- LoginCredentials
- SignupData
- AuthResponse
- QuizSubmission
- QuizResult

## Bootstrap Components

Ứng dụng sử dụng Bootstrap 5 cho styling:
- Card components
- Form controls
- Buttons
- Navbar
- Grid system
- Alerts

## Routes

- `/login` - Trang đăng nhập
- `/signup` - Trang đăng ký
- `/` - Danh sách quiz (protected)
- `/quiz/:id` - Làm bài quiz (protected)
- `/quiz/create` - Tạo quiz mới (admin only)
- `/quiz/edit/:id` - Chỉnh sửa quiz (admin only)

## Authentication

Token được lưu trong localStorage và tự động gửi kèm mỗi request thông qua axios interceptor.

## Development

Chạy ứng dụng ở chế độ development:
```bash
npm start
```

Build ứng dụng cho production:
```bash
npm run build
```
