FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Build the app
COPY frontend ./
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN npm run build

FROM nginx:alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


