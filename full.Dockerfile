FROM node:20-alpine

COPY ./ /tmp/source
WORKDIR /tmp/source

RUN npm ci
RUN npm run build
RUN npx @vercel/ncc build proxy-server.js -o /app
RUN mkdir -p /app
RUN mv build /app/frontend
RUN rm -f -R /tmp/source

WORKDIR /app

EXPOSE 3001

CMD node index.js
