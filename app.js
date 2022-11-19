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
    }
}).single('imageUpload');



app.get('/', (req, res) => {
    return res.render('index', { msgType: ''});
})


//Image upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
            return res.render('index', { msg: err, msgType: 'error' });
        } else {
            return res.render('index', {msg: 'Image uploaded successfully.', msgType: 'success' });
        }
    })
})


const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));