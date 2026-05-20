FROM node:20-alpine AS builder

# Install build dependencies for native node modules (like sqlite3)
RUN apk add --no-cache python3 make g++ gcc sqlite-dev sqlite

WORKDIR /app

COPY package*.json ./

# Install dependencies, allowing compilation if necessary
RUN npm ci

# Copy the rest of the application code
COPY . .

# --- Runtime Stage ---
FROM node:20-alpine

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app /app

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["npm", "start"]
