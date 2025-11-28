# E-commerce Store

A full-stack e-commerce application built with TypeScript, Node.js, Express, MongoDB, and React.

## Prerequisites

- Node.js v16 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecommerce
NTH_ORDER=5
```

### Frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (optional):

```env
REACT_APP_API_URL=http://localhost:3001
```

## Running the Project

### Option 1: Docker Compose (Recommended)

```bash
# Development mode
docker-compose up --build

# Production mode
NODE_ENV=production CLIENT_TARGET=production CLIENT_EXPOSE_PORT=80 BACKEND_CMD=npm start docker-compose up --build
```

### Option 2: Local Development

**Start Backend:**

```bash
cd backend
npm run dev
```

**Start Frontend:**

```bash
cd client
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Testing

```bash
cd backend
npm test
```

## API Endpoints

- `POST /api/cart/add` - Add item to cart
- `GET /api/cart/:userId` - Get cart
- `POST /api/checkout` - Create order
- `POST /api/checkout/validate-discount` - Validate discount code
- `POST /api/admin/generate-discount` - Generate discount code
- `GET /api/admin/stats` - Get admin statistics
