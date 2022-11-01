const { v4: uuidv4 } = require('uuid');
const path = require('path');

const uploadFile = (files, validExtensions = ['jpg', 'png', 'jfif'], directory = '') => {
    return new Promise((res, rej) => {

        const  { file } = files ;

        const nameFileCut = file.name.split('.');
        const extension = nameFileCut[ nameFileCut.length - 1];
    
        if( !validExtensions.includes(extension)) {
            return rej(`The extension ${extension} is not allowed, only ${validExtensions}`)
        }
    
              
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads', directory, tempName);
      
        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, (err) => {
          if (err) return rej(err);
      
          res(tempName);
        });
    })
};

module.exports = {
    uploadFile
}