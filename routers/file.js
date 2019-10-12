const express = require('express');
const router = express.Router();

const uuidv1 = require('uuid/v1');
const multer = require('multer');
let path = require('path');


let getFileType = function (mimeType) {
    if (mimeType === "image/jpeg") {
        return ".jpg";
    } else if (mimeType === "image/png") {
        return ".png";
    } else if (mimeType === "image/jpg") {
        return ".jpg";
    } else if (mimeType === "application/pdf") {
        return ".pdf";
    } else {
        return undefined;
    }
};


let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, callback) {
        let filename = uuidv1() + getFileType(file.mimetype);
        callback(null, filename);
    }
});


let upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        console.log(file);
        let ext = getFileType(file.mimetype);
        console.log("Ext is " + ext);
        if (ext === ".jpg" || ext === ".jpeg" ||
            ext === '.png' || ext === '.pdf') {
            callback(null, true)
        } else {
            callback(new Error('Restricted MimeType'));
        }
    },
    limits: {
        "fieldSize": 10485760
    }
});



router.post('/upload', async function (request, response) {
    const result = await new Promise(function (resolve) {
        try {
            upload.any()(request, response, function(err) {
                if(err) {
                    console.log(err);
                    resolve(undefined);
                    return;
                }
                let data = [];
                for (let i = 0; i < request.files.length; i++) {
                    data[i] = {
                        'filename': request.files[i].filename,
                        'resType': request.files[i].mimetype
                    };
                }
                resolve(data);
            });
        } catch (error) {
            console.log(error);
            resolve(undefined);
        }
    });
    if (!result) {
        response.status(500).json({'error': true, 'message': 'Something is wrong', 'data': []});
        return;
    }
    response.status(200).json({'error': false, 'message': 'Successfully', 'data': result});
});

module.exports = router;