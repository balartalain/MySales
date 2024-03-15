import RNFS from 'react-native-fs';

const dirPictures = `${RNFS.DocumentDirectoryPath}/images`;

const moveAttachment = async (filePath, newFilepath) => {
  return new Promise((resolve, reject) => {
    RNFS.mkdir(dirPictures)
      .then(() => {
        RNFS.moveFile(filePath, newFilepath)
          .then(() => {
            //console.log('FILE MOVED', filePath, newFilepath);
            resolve(true);
          })
          .catch((error) => {
            console.log('moveFile error', error);
            reject(error);
          });
      })
      .catch((err) => {
        console.log('mkdir error', err);
        reject(err);
      });
  });
};
const saveImage = async (target, newName) => {
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}${month}${year}_${hours}${minutes}${seconds}`;
  }
  try {
    // set new image name and filepath
    const newImageName = `${newName.replace(/ /g, '')}_${formatDate(new Date())}.jpg`;
    const newFilepath = `${dirPictures}/${newImageName}`;
    // move and save image to new filepath
    await moveAttachment(target, newFilepath);
    return newFilepath;
  } catch (error) {
    console.log(error);
  }
};
async function readDirectory(dir) {
  return new Promise((resolve, reject) => {
    RNFS.readdir(dir)
      .then((files) => {
        resolve(files);
      })
      .catch(reject);
  });
}

const FS = {
  saveImage,
  readDirectory,
};
export default FS;
