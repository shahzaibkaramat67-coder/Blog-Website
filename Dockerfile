FROM node:22-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy backend and frontend
WORKDIR /app
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Run application from backend
WORKDIR /app/backend

EXPOSE 3002

CMD ["node", "app.js"]