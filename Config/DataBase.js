//  MongoDB Atlas Information
//********************************************************************************************//
// Account email-username : zezomodebode@gmail.com
// Account password : Zzz123123@#!@!#
// Project name : Anubis Gym
// Cluster name : Anubis-Cluster
// Cluster Username : Anubis-Gym-Username2004
// Cluster Password : Anubis-Gym582004-Password

const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://Anubis-Gym-Username2004:Anubis-Gym582004-Password@anubis-cluster.m0jso3k.mongodb.net/?retryWrites=true&w=majority&appName=Anubis-Cluster';

// Connect to MongoDB Atlas
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((error) => {
        console.error('MongoDB Connection error:', error);
    });

module.exports = mongoose;
