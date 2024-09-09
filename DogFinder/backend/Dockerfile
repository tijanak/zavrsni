FROM node:19-alpine


WORKDIR /usr/src/app

COPY ["package*.json", "nx.json", "./"]

RUN npm install --production

COPY . .

RUN npm install -g @angular/cli 
RUN npm install -g nodemon
RUN npm i nx@19.5.6
RUN npx nx build backend --prod
RUN npx nx reset
CMD ["nodemon","-L", "--watch", "backend/src", "--exec", "npx nx serve backend"]