import launchesRouter from "./launches/launches.routes.js";
import planetsRouter from "./planets/planets.routes.js";
import express from 'express';


const api = express.Router();


api.use("/planets",planetsRouter);
api.use("/launches",launchesRouter);


export default api;