FROM  node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json frontend/

RUN npm install-client --omit=dev

COPY server/package*.json server/

RUN npm install-server --omit=dev

COPY frontend/ frontend/
RUN npm run build --prefix frontend

COPY server/ server/



USER node 

CMD ["npm" , "start" , "--prefix" , "server"]

EXPOSE 8000