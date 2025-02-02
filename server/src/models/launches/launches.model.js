import launchesDatabase from './launches.mongo.js';
import planets from '../planets/planets.mongo.js';
import axios from 'axios';
import { response } from 'express';


const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";


async function populateLaunches(){
    console.log("Downlaoding Launch Data")
    const response = await axios.post(SPACEX_API_URL , {
        query : {},
        options : {
            pagination : false,
            populate : [
                {
                    path : 'rocket',
                    select :  {
                        name : 1
                    }
                },
                {
                    path : 'payloads',
                    select :  {
                        'customers' : 1
                    }
                }
            ]
        }
    });

    if(response.status !== 200){
        console.log("Problem downloading launch data");
    }
    const launchDocs  = response.data.docs;
    for(const launchDoc of launchDocs ){
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((paylaod) => {
            return paylaod['customers']
        })
        const launch = {
            flightNumber : launchDoc['flight_number'],
            mission : launchDoc['name'],
            rocket : launchDoc['rocket']['name'],
            launchDate : launchDoc['date_local'],
            upcoming : launchDoc['upcoming'],
            success : launchDoc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`)

         await saveLaunch(launch);


    }


}

async function loadLaunchData(){
  const firstLaunch =   await findLaunch({
        flightNumber : 1,
        rocket : "Falcon 1",
        mission : 'FalconSat',

    });
    if(firstLaunch){
        console.log('Launch data already loaded')
        
    }else{
        await populateLaunches()
    }
   
  


}


// launches.set(launch.flightNumber , launch);

async function getLatestFlightNumber() {
    // Find the most recent launch, sorting by flightNumber in descending order
    const latestLaunch = await launchesDatabase.findOne().sort({ flightNumber: -1 });

    // If no launches are found, return the default flight number
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    // Return the flight number of the most recent launch
    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip , limit){
    const launches =   await launchesDatabase.find({} , {
    "__v" : 0, "_id" : 0,
    })
    .sort({flightNumber : 1})
    .skip(skip)
    .limit(limit);

  
   
    return launches;
  
} 

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName : launch.target,

    });

    if(!planet){
        throw new Error("No matching planet  found")
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch ,{
        success : true,
        upcoming : true,
        customers :  ['Zero to Mastery' , 'NASA'],
        flightNumber : newFlightNumber

    });

    await saveLaunch(newLaunch);

}



async function saveLaunch(launch){

 


    await launchesDatabase.findOneAndUpdate({
        flightNumber : launch.flightNumber,

    
    } ,launch , {
        upsert : true,
    })

}

async function abortLaunchById(launchId) {
   return await launchesDatabase.updateOne({
        flightNumber  : launchId,
    } , {
        upcoming : false,
        success : false,
    })
  

    // return aborted.ok === 1 && aborted.nModified === 1;
   

    
};


async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);

}



async function existsLaunchWithId(launchId){
  
    return await  findLaunch({
        flightNumber : launchId
    });
};



export  { getAllLaunches  ,
    scheduleNewLaunch,
     existsLaunchWithId  ,
     abortLaunchById,
     loadLaunchData,
    };

