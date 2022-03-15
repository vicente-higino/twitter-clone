FROM node:alpine

WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN mkdir images
CMD ["npm","run","prod"]
