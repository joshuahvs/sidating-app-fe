# Build stage
FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json ./

ARG VITE_API_URL
ARG VITE_BE2_API_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BE2_API_URL=$VITE_BE2_API_URL

RUN npm ci

COPY . .

# Pastikan variabel API tersimpan untuk build, sesuaikan dengan attr di env kalian
RUN echo "VITE_API_URL=$VITE_API_URL" > .env.production && \
    echo "VITE_BE2_API_URL=$VITE_BE2_API_URL" >> .env.production

RUN npm run build

# Production stage
FROM nginx:alpine AS production-stage

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1
CMD ["nginx", "-g", "daemon off;"]


# # Stage 1: Build
# FROM node:22-alpine AS build
# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy source code
# COPY . .

# # Build the application
# RUN npm run build

# # Stage 2: Serve with nginx
# FROM nginx:alpine

# # Copy built files from build stage
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copy nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]