FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
EXPOSE 3000

CMD ["npm", "run", "host"]
