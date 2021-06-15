FROM node:alpine

WORKDIR /home/node/app
COPY package.json package.json
RUN npm install --silent
COPY . .
RUN mkdir images
ENTRYPOINT [ "node" ]
CMD [ "server.js" ]
