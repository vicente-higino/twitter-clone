
# Frontend build based on Node.js
FROM node:14.16.1-alpine as build-stage
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
COPY . /usr/src/app
RUN npm run build

# Stage 1
# Production build based on Nginx with artifacts from Stage 0
FROM nginx:1.14-alpine
COPY default.conf /etc/nginx/conf.d/
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]