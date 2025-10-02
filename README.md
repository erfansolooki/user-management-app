# User Management App

A modern React TypeScript application for user management with authentication and CRUD operations.

## Features

- **Authentication**: Login/logout functionality using reqres.in API
- **User Management**: View, create, edit, and delete users
- **Protected Routes**: Route protection with authentication middleware
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Form Validation**: Generic form validation hook
- **State Management**: Global state management with Zustand
- **Type Safety**: Full TypeScript support
- **Clean Architecture**: SOLID principles and clean code practices

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router DOM** for routing
- **Zustand** for state management
- **Tailwind CSS** for styling
- **reqres.in** API for backend services

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   ├── Auth/           # Authentication components
│   ├── Users/          # User management components
│   └── Layout/         # Layout components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── store/             # Zustand stores
├── types/             # TypeScript type definitions
├── config/            # Configuration files
└── pages/             # Page components
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Usage

1. **Login**: Use any email and password to login (demo mode)
2. **View Users**: Browse the paginated list of users
3. **User Details**: Click "View" to see user details
4. **Create User**: Click "Add New User" to create a new user
5. **Edit User**: Click "Edit" to modify user information
6. **Delete User**: Click "Delete" to remove a user

## API Endpoints

The app uses the following reqres.in endpoints:

- `POST /api/login` - User authentication
- `GET /api/users?page={page}` - Get users list
- `GET /api/users/{id}` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Architecture Patterns

### Compound Components

UI components use the compound component pattern for better composition:

```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Custom Hooks

Reusable logic is encapsulated in custom hooks:

```tsx
const { users, fetchUsers, createUser } = useUsers();
const { values, errors, handleSubmit } = useFormValidation({...});
```

### Service Layer

All API calls are centralized in the service layer:

```tsx
import { apiService } from "../services/api";
const response = await apiService.getUsers({ page: 1 });
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
