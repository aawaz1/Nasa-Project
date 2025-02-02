import {getAllPlanets} from "../../models/planets/planets.model.js"


const httpGetAllPlanets = async(req ,res) => {
    
    const planetsList = await getAllPlanets();
    console.log( "planets" , planetsList , "planets")
    res.status(200).json(planetsList);
}


export {httpGetAllPlanets}