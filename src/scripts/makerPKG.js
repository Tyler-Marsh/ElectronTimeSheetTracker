const base = require('@electron-forge/maker-base');
const theMakerDMG = require('@electron-forge/maker-pkg');
var _electronOsxSign = require("electron-osx-sign");


async function Make(identity, platform) {
// 
let result;
try {


    result = await _electronOsxSign.flatAsync({app :'/Users/marshtyler/Desktop/MyProjects/newTimsheet/out/universal/simpletimesheets.app',
        pkg: '/Users/marshtyler/Desktop/MyProjects/newTimsheet/out/universal/simpletimesheets.pkg',
        appBundleId: 'Scope-Software.timesheet',
        //identity: '3rd Party Mac Developer Installer: Tyler Marsh (K69BH68ST8)',
        identity : identity,
        // try below identity?
        platform: platform,
        type: "distribution",
    })


// identity: '3rd Party Mac Developer Installer: Tyler Marsh (K69BH68ST8)',
// type: 'distribution',
// arch: 'universal',
// appBundleId: 'Scope-Software.timesheet',
// app: '/Users/marshtyler/Desktop/MyProjects/newTimsheet/out/simpletimesheets-darwin-arm64/simpletimesheets.app',
// pkg: '/Users/marshtyler/Desktop/MyProjects/newTimsheet/out/make/simpletimesheets-1.0.0.pkg',
// platform: 'darwin'

console.log("THE RESULT: "+ result);
return true;
}
catch(err) {
    console.log(err)
    throw new Error (err)
}
}

module.exports = Make;
// dir , makeDir , appName , packageJSON , targetPlatform

// alias) type FlatOptions = {
//     readonly identityValidation?: boolean;
//     readonly install?: string;
//     readonly pkg?: string;
//     readonly scripts?: string;
//     readonly app: string;
//     readonly identity?: string;
//     readonly platform?: ElectronMacPlatform;
//     readonly keychain?: string;
// }
// export default class MakerDMG extends MakerBase<MakerPKGConfig> {
//     name: string;
//     defaultPlatforms: ForgePlatform[];
//     isSupportedOnCurrentPlatform(): boolean;
//     make({ dir, makeDir, appName, packageJSON, targetPlatform }: MakerOptions): Promise<string[]>;
// }
//makerPKG.default

// export default class MakerDMG extends MakerBase<MakerPKGConfig> {
//     name: string;
//     defaultPlatforms: ForgePlatform[];
//     isSupportedOnCurrentPlatform(): boolean;
//     make({ dir, makeDir, appName, packageJSON, targetPlatform }: MakerOptions): Promise<string[]>;
// }
//# sourceMappingURL=MakerPKG.d.ts.map

// 

// // eslint-disable-next-line import/prefer-default-export
// export interface MakerPKGConfig {
//     /**
//      * Name of certificate to use when signing.
//      *
//      * Default to be selected with respect to platform from keychain or keychain
//      * by system default.
//      */
//     identity?: string;
//     /**
//      * Flag to enable/disable validation for signing identity. If enabled, the
//      * identity provided will be validated in the keychain specified.
//      *
//      * Default: `true`.
//      */
//     'identity-validation'?: boolean;
//     /**
//      * Path to install the bundle. Default to `/Applications`.
//      */
//     install?: string;
//     /**
//      * The keychain name.
//      *
//      * Default: System default keychain.
//      */
//     keychain?: string;
//     /**
//      * Path to a directory containing pre and/or post install scripts
//      */
//     scripts?: string;
//   }
  

