# Dockerfile - builds node server with public files
FROM node:18-alpine
WORKDIR /app
COPY server/package.json ./server/package.json
RUN apk add --no-cache git build-base python3
COPY . .
WORKDIR /app/server
RUN npm install --production
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","server/server.js"]
