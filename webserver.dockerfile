FROM node:16.20.0-alpine as build

ARG WEBSERVER_DIR
ARG PORT

WORKDIR /usr/src/app

COPY ${WEBSERVER_DIR}/package*.json ./
COPY ${WEBSERVER_DIR}/tsconfig*.json ./
COPY ${WEBSERVER_DIR}/vite.config.js ./
COPY ${WEBSERVER_DIR}/index.html ./

ENV PORT=${PORT}

# Because colors break logs
ENV NPM_CONFIG_COLOR=false

# Production or not doesn't really matter as this image will not be used other than for building
RUN npm ci

# Copy env files
COPY ${WEBSERVER_DIR}/.env* ./

# Necessary files for building the app
COPY ${WEBSERVER_DIR}/src/ src/

# Building the image for development, and run the server
FROM build as image-dev

# Build for development
RUN npm run build:client

# Start the server
CMD npm run dev

FROM build as image-prod

# Build for production
RUN npm run build:server

# Start the server
CMD npm start
