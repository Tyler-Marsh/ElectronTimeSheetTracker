

const { signAsync } = require('@electron/osx-sign');
require("dotenv").config();

/**
 * [Asynchronously signs the package passed to the function]
 * @param signObject { app: path where to find the .app
 * platform: 'mas' for app store else 'darwin',
 * entitlements?: location for entitlements or blank,
 * identity: signing identity,
 * type: distribution or development
 * provisioningProfile?: path to .provisionprofile
 * 
 * ]}  
 * 
 * @return {Promise<boolean}
 * 
 */
 async function  sign(signObject) {

   // "identity": "Apple Distribution",
   // "platform": "mas",
   // "type": "distribution",
   // "hardened-runtime": true,
   // "entitlements": "entitlements.plist",
   // "entitlements-inherit":"entitlements.plist",
   // "signature-flags": "library"

   /*
{
        app: newpath,
        hardenedRuntime:true,
        identity: "Developer ID Application: Tyler Marsh (K69BH68ST8)",
        entitlements: "entitlements.plist",
        preAutoEntitlements: false,
        // identity: "Apple Distribution",
        platform: 'darwin',
        type: "distribution",
        // only pass provisioning profile if it is for development?
        provisioningProfile: "ScopeSoftware.provisionprofile"

      }
   */
    
    const result =   await signAsync(signObject).then(res => {return true})
      .catch(err => {console.log("SIGN ASYNC CATCH FIRED OFF "), console.log(err)}).then(err => {return false});
     return result;
   }
   
  //sign();

module.exports = sign;