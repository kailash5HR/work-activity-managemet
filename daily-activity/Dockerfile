FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production \
    PORT=3001 \
    HOST=0.0.0.0 \
    JWT_SECRET=change-this-secret-in-production

EXPOSE 3001

CMD ["npm", "start"]
