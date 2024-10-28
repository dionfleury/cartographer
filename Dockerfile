FROM node:alpine

WORKDIR /app

RUN npm config set registry https://registry.npmjs.org/

COPY package.json .

COPY . .

RUN npm install

RUN npm run build

RUN npm prune --production

EXPOSE 3000
EXPOSE 3443

CMD ["npm", "run", "start"]