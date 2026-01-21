########################
# 1️⃣ Build stage
########################
FROM node:20.19.4-alpine AS backend_builder

# Set working directory
WORKDIR /app

# Copy package files 
COPY package.json package-lock.json ./

# Install deps
RUN npm ci

# Copy source code
# Copy source & config cần cho build
COPY src ./src
COPY tsconfig.json .
COPY build-docker.js .
COPY eslint.config.js .
COPY nodemon.json .

# Build TypeScript
RUN npm run build-docker

########################
# 2️⃣ Runtime stage
########################
FROM node:20.19.4-alpine

WORKDIR /app

# Copy dist from build stage
COPY --from=backend_builder /app/dist ./dist

# Copy package files
COPY package.json package-lock.json ./

# Install only the necessary dependencies for runtime
# RUN npm ci --omit=dev

# App run at port
EXPOSE 8080

# run app
CMD ["npm", "run", "start-docker"]
