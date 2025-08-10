# Personal Finance Management Application

A comprehensive full-stack web application for personal finance management built with React, Redux, and Node.js. This application helps users track their income, expenses, manage budgets, and visualize their financial data through interactive charts.

## Features

### Core Functionality
- **User Authentication**: Secure signup and login system with JWT-based authentication
- **Transaction Management**: Add, view, and manage income and expense transactions
- **Budget Planning**: Create and track budgets for different categories
- **Category Management**: Organize transactions with customizable categories
- **Data Visualization**: Interactive charts showing spending patterns and financial overview
- **Mobile Responsive**: Optimized for both desktop and mobile devices

### User Interface
- Modern, clean UI built with Shadcn/ui components
- Dark/Light theme support
- Interactive dashboard with financial insights
- Mobile-friendly bottom navigation
- Real-time form validation using Zod

## Database Schema

The application uses PostgreSQL with the following entity relationships:

### ER Diagram Overview
The database consists of four main tables with the following relationships:

1. **users** (Primary table for user authentication)
   - Stores user credentials and profile information
   - One-to-many relationship with transactions and expense_categories

2. **expense_categories** (User-specific expense/income categories)
   - Each category belongs to a specific user
   - One-to-many relationship with transactions
   - One-to-many relationship with categories_budget

3. **transactions** (Financial transaction records)
   - Each transaction belongs to a user
   - Each transaction can be linked to a category
   - Supports both income and expense types

4. **categories_budget** (Monthly budget allocation per category)
   - Links to expense_categories for budget tracking
   - Stores monthly and yearly budget allocations

### Relationships
- **users → transactions**: One user can have many transactions
- **users → expense_categories**: One user can have many categories
- **expense_categories → transactions**: One category can have many transactions
- **expense_categories → categories_budget**: One category can have multiple budget entries (for different months/years)

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit with Redux Thunk
- **Routing**: React Router DOM v6
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Query Management**: TanStack Query

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **CORS**: Enabled for cross-origin requests

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (v12 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/ashishkpandey91/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. PostgreSQL Database Setup

#### Install PostgreSQL
If you haven't installed PostgreSQL, download and install it from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

#### Create Database and User
Connect to PostgreSQL as superuser:
```bash
psql -U postgres
```

Create a new database and user:
```sql
-- Create database
CREATE DATABASE expense_tracker;

-- Create user with password
CREATE USER your_db_user WITH PASSWORD 'your_password';

-- Grant all privileges on database to user
GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO your_db_user;

-- Connect to the database
\c expense_tracker;
```

#### Create Database Schema
Execute the following SQL to create the required tables:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expense categories table
CREATE TABLE expense_categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES expense_categories(id) ON DELETE SET NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('income', 'expense')),
    transaction_description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_date DATE NOT NULL
);

-- Categories budget table
CREATE TABLE categories_budget (
    id SERIAL PRIMARY KEY,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    year INTEGER NOT NULL,
    expense_categories_id INTEGER REFERENCES expense_categories(id) ON DELETE CASCADE,
    budget DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 3. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory with the following variables:
```env
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev  # For development with hot reload
# or
npm start    # For production
```

The backend server will start on the configured port (default: 3000).

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Configure the API endpoint in `frontend/src/conf/index.ts` if needed.

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── db.js           # Database connection
│   │   └── index.js        # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   │   └── ui/         # Shadcn UI components
    │   ├── features/       # Redux slices
    │   ├── hooks/          # Custom React hooks
    │   ├── pages/          # Page components
    │   ├── schema/         # Zod validation schemas
    │   ├── services/       # API service functions
    │   ├── store/          # Redux store configuration
    │   ├── types/          # TypeScript type definitions
    │   └── utils/          # Utility functions
    ├── public/             # Static assets
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Finance
- `GET /api/finance/transactions` - Get user transactions
- `POST /api/finance/transactions` - Create new transaction
- `PUT /api/finance/transactions/:id` - Update transaction
- `DELETE /api/finance/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built with [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- Icons from [Lucide React](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
