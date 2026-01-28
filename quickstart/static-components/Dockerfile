# Stage 1: Build components
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY webpack.config.components.js claspo.config.js ./
COPY components ./components
RUN npm run components:build:prod

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/bundled-components /usr/share/nginx/html
COPY quickstart/static-components/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
