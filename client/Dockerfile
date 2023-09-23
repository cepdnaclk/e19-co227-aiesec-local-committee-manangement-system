FROM node:18

WORKDIR /client

COPY ./package*.json ./package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# copy package.json and package-lock.json to the container
#COPY package*.json /app

# install dependencies
#RUN npm install

# copy over the rest of code
#COPY . .

#EXPOSE 3000

#CMD ["npm", "start"]