const mongoose = require('mongoose');

const DB = process.env.DATABASE;


mongoose.set('strictQuery', false);

mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    serverSelectionTimeoutMS: 10000,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log(err);
})