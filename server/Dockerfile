FROM node:alpine

WORKDIR /home/node/app
COPY package*.json .
RUN npm install --silent
COPY . .
RUN mkdir images
CMD ["npm","run","prod"]
