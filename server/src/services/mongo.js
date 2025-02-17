import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL 

mongoose.connection.once("open" , () => {
    console.log("MongoDB connection is ready");
});


mongoose.connection.on("error" ,(err) => {
    console.error(err);

});


async function mongoConnect(){
    await mongoose.connect(MONGO_URL);

};

async function mongoDisConnect(){
    await mongoose.disconnect(MONGO_URL);

}

export {mongoConnect , mongoDisConnect}