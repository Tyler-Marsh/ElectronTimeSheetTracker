const { makeUniversalApp } = require('@electron/universal');
const path = require('path')

/**
 * [Async combines x64 and arm64 to make universal app]
 * @return {Promise<boolean}
 */
async function makeUniversal() {

const result = await makeUniversalApp({
  x64AppPath: path.join(__dirname,'..','..','out/simpletimesheets-darwin-x64/simpletimesheets.app'),
  arm64AppPath: path.join(__dirname,'..','..','out/simpletimesheets-darwin-arm64/simpletimesheets.app'),
  outAppPath: path.join(__dirname,'..','..','/out/universal/simpletimesheets.app'),
  x64ArchFiles: 'Contents/Resources/app/.webpack/main/native_modules/build/Release/better_sqlite3.node',
  force: true,
  // filesToSkip: [
  //   'product.json',
  //   'Credits.rtf',
  //   'CodeResources',
  //   'Contents',
  //   'fsevents.node',
  //   'Info.plist',  regressed with 11.4.2 internal builds
  //   '.npmrc',
  // ]
}).then(res => {return true}).catch(err => {throw new Error (err)});
return result;
}

module.exports = makeUniversal;