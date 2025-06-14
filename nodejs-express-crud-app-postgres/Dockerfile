# Use Node.js 18 LTS as base image
FROM node:22-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source code
COPY src/ ./src/
COPY public/ ./public/
COPY views/ ./views/

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]