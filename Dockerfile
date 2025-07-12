# Stage 1: Build the application
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy source code and build the project
COPY . .
RUN npm run build

# Stage 2: Use Nginx to serve the built app
FROM nginx:stable-alpine

# Add custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx listens on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
