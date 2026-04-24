FROM node:20

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]