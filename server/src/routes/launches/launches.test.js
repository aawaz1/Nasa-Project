import request from 'supertest';
import  app from '../../app';
import { mongoConnect , mongoDisConnect } from '../../services/mongo.js';
import { loadPlanetsData } from '../../models/planets/planets.model.js';


describe("launches API" , () => {

    beforeAll( async () => {
       await mongoConnect();
       await loadPlanetsData();
    });

    afterAll(async () => {
        await mongoDisConnect();

    })

    describe(' Test GET launches' , () => {
        test('It should respond with 200 Success', async () => {
            const response = await  request(app)
            .get('/v1/launches')
            .expect('Content-Type' ,/json/)
            .expect(200)
        },10000)
    } );
    
    
    describe('Test POST Launches' , () => {
        const completeLaunchData = {
            mission : "USS Enterprise",
            rocket : "NCC 1701-D",
            target : "Kepler-442 b",
            launchDate : "January 4  , 2028"
    
        }
    
        const launchDataWithoutDate = {
            mission : "USS Enterprise",
            rocket : "NCC 1701-D",
            target : "Kepler-442 b"
           
        };
    
        const launchDateWithInvalidDate = {
            mission : "USS Enterprise",
            rocket : "NCC 1701-D",
            target : "Kepler-186  f",
            launchDate : "root"
    
        }
    
    
        test('It should respond with 200 Success', async() => {
            const response =  await request(app)
            .post("/v1/launches")
            .send(completeLaunchData)
            .expect('Content-Type' ,/json/)
            .expect(201);
    
            const requestDate = new  Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new  Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate)
    
            expect(response.body).toMatchObject(launchDataWithoutDate)
            
        });
    
        test('It should catch missing required properties', async() => {
            const response = await  request(app)
            .post("/v1/launches")
            .send(launchDataWithoutDate)
            .expect('Content-Type' ,/json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error : "Missing required launch property"
            })
            
    
          
        });
    
        test('It should catch invalid date', async () => {
            const response = await  request(app)
            .post("/v1/launches")
            .send(launchDateWithInvalidDate)
            .expect('Content-Type' ,/json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error : "Invalid launch date"
            })
          
        });
    
    })

})

