# Use a Node LTS image
FROM node:18

WORKDIR /app
COPY package*.json ./

# Install Google Chrome for puppeteer
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates && \
    wget -q -O /usr/share/keyrings/google-linux-signing-keyring.gpg https://dl.google.com/linux/linux_signing_key.pub && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome \
    PUPPETEER_SKIP_DOWNLOAD=true 
    
RUN npm ci

COPY . .
RUN npm run build   # generates the production build and sitemap

CMD ["npm", "start"]
