# Use a Node LTS image
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
ENV PORT=8080
EXPOSE 8080
RUN npm run build   # generates the production build and sitemap

CMD ["npm", "start"]
