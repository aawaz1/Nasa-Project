import http from 'http';
import app from './app.js';
import {loadPlanetsData} from './models/planets/planets.model.js';
import { mongoConnect } from './services/mongo.js';
import {loadLaunchData} from '../src/models/launches/launches.model.js'
import dotenv from 'dotenv';


// dotenv.config();


const PORT = process.env.PORT || 8000
const server = http.createServer(app);



async function startServer(){
    await mongoConnect();
    await loadLaunchData();
    await loadPlanetsData();
server.listen(PORT , () => {
     console.log(PORT)
});

}

startServer();





