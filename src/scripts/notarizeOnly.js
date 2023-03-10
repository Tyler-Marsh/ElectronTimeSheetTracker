const { notarize } = require('electron-notarize');
const path = require('path');
require('dotenv').config();

const uniPath = path.join(__dirname,"..", "..", "out","universal", "simpletimesheets.pkg")

async function note() {

    const notarizeResult = await myNotarize();
    console.log(notarizeResult);

    

}

async function myNotarize() {
    const notarizeResult = await notarize({
            appBundleId:'Scope-Software.timesheet',
            appPath: uniPath,
            appleId: process.env.appleIdEmail,
            appleIdPassword: process.env.appleIdPassword,
           });

    return notarizeResult;
    }

note()