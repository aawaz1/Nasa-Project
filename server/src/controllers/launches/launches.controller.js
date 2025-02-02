import {abortLaunchById, scheduleNewLaunch, existsLaunchWithId, getAllLaunches} from '../../models/launches/launches.model.js';
import { getPagination } from '../../services/query.js';


const httpGetAllLaunches = async (req,res) => {
    console.log(req.query);
    const {skip , limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip , limit);
    return res.status(200).json(launches);
}

const httpAddNewLaunch = async (req,res) => {
    const launch = req.body
    console.log(launch , 'laaas')

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error : "Missing required launch property"
        })
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)){
        return res.status(400).json({
            error : "Invalid launch date"
        })
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
};

const httpAbortLaunch = async (req,res) => {
    const launchId = Number(req.params.id);

    const existLaunch = await existsLaunchWithId(launchId)

    if(!existLaunch){
        return res.status(404).json({
            error : "Launch not found"
        });}

    const aborted = await abortLaunchById(launchId);
   
   
   

    return res.status(200).json({
        acknowledged : true
    });
}

export {httpGetAllLaunches , httpAddNewLaunch ,httpAbortLaunch}