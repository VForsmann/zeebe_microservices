FROM node:11-alpine
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 8090
CMD [ "npm", "run", "watch" ]