FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY src /var/www/html
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 4200
CMD [ "node", "app.js" ]