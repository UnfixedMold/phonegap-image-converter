var fs = require('fs')
const sharp = require('sharp')
const imageConfigs = require('./image-config.json')

const createSubDirSynch = path => {

    // Creating directory

    const createDir = (pathsArr, prevPath, i) => {

        if (i >= pathsArr.length - 1) {
            return 0;
        }

        i++;
        prevPath += '/' + pathsArr[i];

        if (!fs.existsSync(prevPath)) {
            fs.mkdirSync(prevPath);
        }

        createDir(pathsArr, prevPath, i);
    };

    // Parsing path into single directories

    path = path.split('/');

    // Recursively creating all directories in path

    createDir(path, '.', -1);
};

async function main() {

    async function resizeImage(inputBuffer, { w, h }) {
        const image = sharp(inputBuffer)

        const resizedFileBuffer = await image.limitInputPixels(false)
            .resize(w, h)
            .toBuffer()

        return resizedFileBuffer
    }

    async function convertImage(inputFileBuffer, outputFileName, dimensios) {

        const resizedFileBuffer = await resizeImage(inputFileBuffer, dimensios)

        const dirPath = outputFileName.split('/').slice(0, -1).join('/')

        createSubDirSynch(dirPath)

        fs.writeFileSync(outputFileName, resizedFileBuffer)
    }

    const sourceIconPath = './assets/icon.png';

    const sourceIconBuffer = fs.readFileSync(sourceIconPath)

    // Converting icons for android

    imageConfigs.icons.android.forEach(async ({ fileName, dimensions }) => {
        await convertImage(sourceIconBuffer, './res/icons/android/' + fileName, dimensions)
    });

    // Converting icons for ios

    imageConfigs.icons.ios.forEach(async ({ fileName, dimensions }) => {
        await convertImage(sourceIconBuffer, './res/icons/ios/' + fileName, dimensions)
    });

    const sourceScreenPath = './assets/screen.png';

    const sourceScreenBuffer = fs.readFileSync(sourceScreenPath)

    // Converting splashscreens for android

    imageConfigs.screens.android.forEach(async ({ fileName, dimensions }) => {
        await convertImage(sourceScreenBuffer, './res/screens/android/' + fileName, dimensions)
    });

    // Converting splashscreens for ios

    imageConfigs.screens.ios.forEach(async ({ fileName, dimensions }) => {
        await convertImage(sourceScreenBuffer, './res/screens/ios/' + fileName, dimensions)
    });

}

main();



