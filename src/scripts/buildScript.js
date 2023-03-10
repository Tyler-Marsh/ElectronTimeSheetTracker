const sign = require('./justSign')
require('dotenv').config();
const path = require('path');
const makeUni = require('./makeUniversal');
const myNotarize = require('./notarize');
const Make = require('./makerPKG');

// need to come up with arguments to specify 'mas' or 'darwin'
// = platform? console.log(process.argv[2])
// if not 'mas' then notarize
async function buildScript() {

const platform = process.argv[2];


const shouldThrow = platform !== 'mas' && platform !== 'darwin' ? true: false;

if (shouldThrow) {
   // console.error("first argument should be 'mas' || 'darwin'")
   throw new Error("first argument should be 'mas' || 'darwin'");
}

const signIdentity = platform === 'mas' ? process.env.masIdentity : process.env.darwinIdentity;
// make the universal first
const x64Path = path.resolve("..", "..", "out", "simpletimesheets-darwin-arm64", "simpletimesheets.app");
const arm64Path = path.resolve("..", "..", "out", "simpletimesheets-darwin-x64","simpletimesheets.app");
const uniPath = path.join(__dirname,"..", "..", "out","universal", "simpletimesheets.app");


// identity : "Developer ID Installer: Tyler Marsh (K69BH68ST8)"
await makeUni();
console.log("Universal app made");

// I learned  vscode didnt like my comments so i redid them to @return {Promise<boolean>}
// to get the triple dots underneath to go away.

/* 
entitlements: "entitlements.plist",
        preAutoEntitlements: false,
        // identity: "Apple Distribution",
        platform: 'darwin',
        type: "distribution",
        // only pass provisioning profile if it is for development?
        provisioningProfile: "ScopeSoftware.provisionprofile"
*/


await sign({app: uniPath, platform: platform, identity: signIdentity, 
   hardenedRuntime:true,
   entitlements: 'entitlements-1.plist'});

console.log('App signed');

console.log('Flattening the file to .pkg format');

// Developer ID Instalaler so I can notarize the app.
// it had the apple intaller sign on the make
await Make('Developer ID Installer: Tyler Marsh (K69BH68ST8)', platform);


// if (platform === 'darwin') {
//    console.log('Notarizing');
//    await myNotarize({
//    appBundleId:'Scope-Software.timesheet',
//    appPath: uniPath,
//    appleId: process.env.appleIdEmail,
//    appleIdPassword: process.env.appleIdPassword,
//   });
//   console.log('Successfully notarized the app');
// }

}



buildScript();

// get the proper file in the working directory
// refernce the appropriate provisionprofile and entitlements.plist



// {
//     appBundleId: 'Scope-Software.timesheet',
//     appPath: '/Users/marshtyler/Desktop/MyProjects/newTimsheet/out/universal/simpletimesheets.app',
//     appleId: process.env.appleIdEmail,
//     appleIdPassword: process.env.appleIdPassword
//sign({app: './/app', platform: platform, identity: 'Apple Distribution', type: "Distribution"});