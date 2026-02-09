# Food App

A full-stack food ordering application with user authentication, restaurant and menu management, order processing, and admin features. Built with React (Vite, TypeScript, Tailwind CSS) for the frontend and Node.js (Express, TypeScript, MongoDB, Cloudinary) for the backend.

## Features

### User Features
- User signup, login, email verification, and password reset
- Profile management with profile picture upload (Cloudinary)
- Browse restaurants and menus
- Add items to cart and checkout
- View order history and order status

### Admin Features
- Add, edit, and delete menu items
- Manage restaurant details
- View and manage orders

### Security
- Passwords hashed with bcrypt
- JWT-based authentication (token in HTTP-only cookies)
- Email verification and password reset via email (Mailtrap)

## Tech Stack

### Frontend
- React (Vite, TypeScript)
- Tailwind CSS for styling
- Zustand for state management
- Axios for API requests

### Backend
- Node.js, Express, TypeScript
- MongoDB (Mongoose ODM)
- Cloudinary for image uploads
- Mailtrap for email services
- bcryptjs for password hashing
- JWT for authentication

## Folder Structure

```
Food app/
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── admin/         # Admin pages (Add/Edit/Delete Menu, Orders, Restaurant)
│   │   ├── auth/          # Auth pages (Login, Signup, Forgot/Reset Password, Verify Email)
│   │   ├── components/    # UI components (Navbar, Footer, Cart, etc.)
│   │   ├── layout/        # Layout components
│   │   ├── lib/           # Utility functions
│   │   ├── shcema/        # Validation schemas
│   │   ├── store/         # Zustand stores
│   │   ├── types/         # TypeScript types
│   │   └── assets/        # Static assets
│   ├── public/
│   ├── index.html
│   └── ...
├── server/                # Backend (Node.js/Express)
│   ├── controller/        # Route controllers (user, menu, order, restaurant)
│   ├── db/                # Database connection
│   ├── mailtrap/          # Email templates and logic
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions (Cloudinary, token, etc.)
│   └── index.ts           # Entry point
├── package.json           # Project metadata
└── README.md              # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB
- Cloudinary account
- Mailtrap account

### 1. Clone the repository
```
git clone <repo-url>
cd Food app
```

### 2. Install dependencies
#### Backend
```
cd server
npm install
```
#### Frontend
```
cd ../client
npm install
```

### 3. Environment Variables
Create `.env` files in both `server/` and `client/` directories.

#### server/.env
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
FRONTEND_URL=http://localhost:5173
```

#### client/.env
```
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application
#### Start Backend
```
cd server
npm run dev
```
#### Start Frontend
```
cd ../client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## API Endpoints (Backend)
- `/api/user` - User authentication and profile
- `/api/menu` - Menu management
- `/api/restaurant` - Restaurant management
- `/api/order` - Order management

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
