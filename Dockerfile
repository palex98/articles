FROM node:22 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM postgres:15 AS db

COPY docker/init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY docker/seed.sql /docker-entrypoint-initdb.d/02-seed.sql

RUN chmod +x /docker-entrypoint-initdb.d/*.sql

FROM node:22-alpine AS runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/server.js"]
