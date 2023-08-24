FROM node:18

WORKDIR /app

# copy package.json and package-lock.json to the container
COPY package*.json /app

# install dependencies
RUN npm install

# copy over the rest of code
COPY . /app

EXPOSE 3000

CMD npm start