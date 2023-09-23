FROM node:18

WORKDIR /client

#COPY ./package*.json ./package-lock.json ./
#for layer caching
COPY package*.json . 

RUN npm install

#comment this and try again
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