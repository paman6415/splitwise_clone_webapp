# Use Node.js image for frontend
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy frontend code
COPY frontend .

# Expose Vite dev server port
EXPOSE 5173

# Start the frontend app
CMD ["npm", "run", "dev", "--", "--host"]
