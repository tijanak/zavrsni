FROM node:19-alpine


WORKDIR /usr/src/app

COPY ["package*.json", "nx.json", "./"]

RUN npm install --production

COPY . .
RUN npm install -g @angular/cli 
RUN npm i nx@19.5.6
RUN npx nx build frontend
RUN npx nx reset
CMD npx nx serve frontend