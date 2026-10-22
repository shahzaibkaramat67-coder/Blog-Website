
FROM node:22-alpine

# Set backend working directory
WORKDIR /app/backend

# Copy backend dependency files
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/ ./

# Copy frontend files
COPY frontend/ /app/frontend/

# Application port
EXPOSE 3002

# Start backend
CMD ["node", "app.js"]
