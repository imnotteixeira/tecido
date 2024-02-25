# First, building the static files
FROM node:16.20.0-alpine as build

WORKDIR /usr/src/app
COPY package.json package-lock.json tsconfig.json assets.webpack.config.js ./

# Because colors break logs
ENV NPM_CONFIG_COLOR=false

# Necessary files for building the app
COPY src/ src/

# Copy env files
COPY .env* ./

# Production or not doesn't really matter as this image will not be used other than for building
RUN npm ci

# Building the image
RUN npm run assets:build

FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copying the built files into the nginx image, to the default served directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

RUN ls /usr/share/nginx/html

# Set the nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf