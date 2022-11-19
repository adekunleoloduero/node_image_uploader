const express = require('express');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const exp = require('constants');



const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

//View engine
app.set('view engine', 'ejs');
app.set('views', 'views');


//Multer configuration

//storage engine
const storage = multer.diskStorage({
    destination: './public/image_uploads',
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

//upload variable
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter: function(req, file, cb) {
        //Allowed file types
        const filetypes = /jpeg|jpg|png|gif/;

        //Check file extension
        const ext = filetypes.test(path.extname(file.originalname));

        //Check mime type
        const mimetype = filetypes.test(file.mimetype);

        if (ext && mimetype) {
            cb(null, true);
        } else {
            cb('File must be an image.');
        }
    }
}).single('imageUpload');



app.get('/', (req, res) => {
    return res.render('index', { msgType: ''});
})


//Image upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.render('index', { msg: err, msgType: 'error' });
        } else {
            if (req.file == undefined) {
                return res.render('index', { msg: 'You have not selected any file.', msgType: 'error' })
            } else {
                return res.render('index', {msg: 'Image uploaded successfully.', msgType: 'success', file: `/public/image_uploads/${req.file.filename}` });
            }
        }
    })
})


const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));