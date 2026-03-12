FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Use npm install --production instead of npm ci
RUN npm install --production

COPY . .

RUN mkdir -p logs uploads

EXPOSE 5000

CMD ["node", "server.js"]