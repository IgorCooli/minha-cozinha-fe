# Dockerfile usando Node.js para servir o React app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies first
RUN npm ci

# Install serve globally
RUN npm install -g serve

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 7001
EXPOSE 7001

# Serve the built app
CMD ["serve", "-s", "build", "-l", "7001"]
