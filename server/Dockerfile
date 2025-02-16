FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env.sample .env

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]