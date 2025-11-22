# Components Structure

Cấu trúc thư mục components đã được tổ chức lại theo React best practices:

## 📁 Cấu trúc thư mục

```
components/
├── providers/           # Provider components
│   ├── AuthProvider.tsx       # Authentication context & provider
│   └── ThemeProvider.tsx      # Theme context & provider
│
├── contexts/            # Context components
│   ├── AddMovieContext.tsx    # Add movie modal state management
│   ├── ExportContext.tsx      # Export functionality state
│   ├── Alert.tsx              # Alert dialog context & component
│   └── Toast.tsx              # Toast notification context & component
│
├── auth/                # Authentication components
│   └── Login.tsx              # Login page component
│
├── pages/               # Page components (routes)
│   ├── Dashboard.tsx          # Main dashboard page
│   ├── SearchPage.tsx         # Movie search page
│   ├── StatsPage.tsx          # Statistics page
│   ├── AlbumsPage.tsx         # Albums listing page
│   └── AlbumDetailPage.tsx    # Album detail page
│
├── modals/              # Modal components
│   ├── AddMovieModal.tsx      # Add/Edit movie modal
│   ├── ExportModal.tsx        # Export data modal
│   ├── MovieDetailModal.tsx   # Movie detail modal
│   ├── RandomPickerModal.tsx  # Random movie picker
│   └── AlbumSelectorModal.tsx # Album selector modal
│
├── ui/                  # Reusable UI components
│   ├── MovieCard.tsx          # Movie card component
│   ├── StatsCard.tsx          # Statistics card component
│   ├── Loading.tsx            # Loading spinner component
│   └── SplashScreen.tsx       # App splash screen
│
└── layout/              # Layout components
    ├── Layout.tsx             # Main layout wrapper
    ├── Navbar.tsx             # Navigation bar
    └── Footer.tsx             # Footer component
```

## 🎯 Quy tắc sử dụng

### Providers

- Chứa các Context Provider components
- Quản lý global state (auth, theme, etc.)
- Export hooks để consume context (useAuth, useTheme)

### Contexts

- Context components cho các chức năng cụ thể
- Cung cấp state management cho các tính năng như modals, notifications
- Export hooks để sử dụng trong components khác

### Auth

- Components liên quan đến authentication
- Login, Register, Password Reset, etc.

### Pages

- Components đại diện cho các route/page trong app
- Được sử dụng trong React Router configuration
- Thường combine nhiều components nhỏ hơn

### Modals

- Các modal/dialog components
- Popup overlays cho các chức năng cụ thể
- Controlled bởi contexts hoặc local state

### UI

- Reusable UI components
- Pure presentational components
- Có thể tái sử dụng ở nhiều nơi trong app

### Layout

- Components cấu trúc layout của app
- Navbar, Footer, Sidebar, Layout wrapper
- Được sử dụng để tạo consistent layout

## 📝 Import paths

Với cấu trúc mới, các import paths sẽ rõ ràng hơn:

```typescript
// Providers
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

// Contexts
import { useAddMovie } from "@/components/contexts/AddMovieContext";
import { useToast } from "@/components/contexts/Toast";
import { useAlert } from "@/components/contexts/Alert";

// Pages
import Dashboard from "@/components/pages/Dashboard";
import SearchPage from "@/components/pages/SearchPage";

// Modals
import AddMovieModal from "@/components/modals/AddMovieModal";
import ExportModal from "@/components/modals/ExportModal";

// UI Components
import MovieCard from "@/components/ui/MovieCard";
import Loading from "@/components/ui/Loading";

// Layout
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/layout/Navbar";
```

## ✅ Lợi ích

1. **Tổ chức rõ ràng**: Dễ tìm và quản lý components
2. **Scalability**: Dễ dàng thêm components mới vào đúng thư mục
3. **Maintainability**: Code dễ maintain và refactor
4. **Team collaboration**: Team members dễ hiểu cấu trúc
5. **Best practices**: Tuân thủ React best practices

## 🔄 Migration completed

Tất cả imports đã được cập nhật trong:

- ✅ App.tsx
- ✅ index.tsx
- ✅ All component files
- ✅ All page components
- ✅ All modal components
- ✅ All UI components
- ✅ All layout components

Không có circular dependencies và tất cả imports đều hoạt động chính xác.
