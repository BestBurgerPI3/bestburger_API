FROM node:20.11.0

RUN mkdir -p /home/app

WORKDIR /home/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
COPY . .

EXPOSE 3011

CMD ["node", "app.js"]
