# 🧩 Stage 1 — Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for efficient caching)
COPY package*.json ./

# Install only production deps (no dev)
RUN npm install --omit=dev

# Copy rest of the app
COPY server.js ./server.js
COPY public ./public
COPY data ./data

# Expose app port
EXPOSE 3000

# Start the Express server
CMD ["node", "server.js"]
