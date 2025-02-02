import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';
import planets from './planets.mongo.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

const habitalPLanets = []

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    const planetPromises = [];

    fs.createReadStream(path.join(__dirname, '..', '..','..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          habitalPLanets.push(data)
           savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      })
      .on('end', async () => {
        try {
          // await Promise.all(planetPromises);
          const countPlanetsFound = (await getAllPlanets()).length;
          console.log(`${countPlanetsFound} habitable planets found!`);

          resolve();
        } catch (err) {
          console.error('Error saving planets:', err);
          reject(err);
        }
      });
  });
}

async function getAllPlanets() {
  const allPlanets = await planets.find({} , {
    "_id" : 0 , "__v" : 0,
  });

  return allPlanets;
}


async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save planet: ${err}`);
  }
}

export {
 
  loadPlanetsData,
  getAllPlanets,
};
