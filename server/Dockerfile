FROM node:10-alpine
WORKDIR /usr/src/movie-finder
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "prod" ]