FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 7001
CMD ["npx", "serve", "-s", "build", "-l", "7001"]