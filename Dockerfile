FROM node:20-alpine

COPY build /app/frontend
COPY build_proxy /app

WORKDIR /app

EXPOSE 3001

CMD node index.js
