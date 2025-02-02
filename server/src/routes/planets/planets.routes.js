import express from  'express';
import { httpGetAllPlanets } from '../../controllers/planets/planets.controller.js';

const planetsRouter = express.Router();


planetsRouter.get('/' ,httpGetAllPlanets);


export default planetsRouter;