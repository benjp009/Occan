# Use a Node LTS image
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build   # generates the production build and sitemap

CMD ["npm", "start"]
