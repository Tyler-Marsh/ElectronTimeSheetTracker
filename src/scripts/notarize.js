const { notarize } = require('electron-notarize');
//const buildOutput = require('path').join(__dirname, '..','out','simpletimesheets-darwin-arm64', 'simpletimesheets.app');
// const buildOutput = require('path').join("Users", 'marshtyler', 'Desktop', 
// 'MyProjects', 'newTimsheet', 'out', 'simpletimesheets-darwin-arm64','simpletimesheets.app')

//     console.log('Notarizing...');
// async function notarizeTask() {
/* SIGN FIRST  */

// "arch": "universal",
// "appBundleId": "Scope-Software.timesheet",
// "icon": "./src/icon.icns",
// "osxSign": {
//   "entitlements": "entitlements.plist",
//   "entitlements-inherit": "entitlements.plist",
//   "identity": "Developer ID Application: Tyler Marsh (K69BH68ST8)",
//   "hardenedRuntime": true,
//   "signature-flags": "library",
//   "gatekeeper-assess": true,
//   "platform": "mas"
// },
// "osxNotarize": {
//   "appleId": "marsh.tyler5@gmail.com",
//   "appleIdPassword": "lnnk-ddfs-snvj-efcl"
// }

//  async function  sign() {
    
//  const result =   await signAsync({
//      app: '/Users/marshtyler/Desktop/MyProjects/newTimsheet/out/universal/uni.app',
//      hardenedRuntime:true,
//      identity: process.env.identity,
//      platform: 'mas',

//    })
//    console.log("result "+result);
//    return "ran"
// }

//@param  {[type]} arg1 [description]
/**
 * @param appBundleId: the bundle id on assigned
 * @param appPath: path to the .app file
 * @param appleId: email associated with the app
 * @param appleIdPassword: Apple 3rd party password not main
 */
async function myNotarize(config) {
  const notarizeResult = await  notarize(config).then(res => {return true}).catch((e) => {
        console.error(e);
        throw e;
    });

}

module.exports = myNotarize