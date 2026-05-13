import multer from 'multer';

import path from 'path';



const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/');

    },

   filename: (req, file, cb) => {

    const sanitizedName = file.originalname
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.-]/g, '');

    cb(
        null,
        `${Date.now()}-${sanitizedName}`
    );

}

});



const fileFilter = (req, file, cb) => {

    const allowedExtensions = /pdf|doc|docx|tex|txt/;

    const extensionValid = allowedExtensions.test(
        file.originalname.toLowerCase()
    );

    if (extensionValid) {

        cb(null, true);

    }
    else {

        cb(
            new Error(
                'Only PDF, DOC, DOCX, TEX, and TXT files are allowed'
            )
        );

    }

};



const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});



export default upload;