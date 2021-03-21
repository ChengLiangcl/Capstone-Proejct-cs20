/**
 * 这个我为了实现前端交互，简单从google上学习，搭的一个后端框架
 * 这个框架里的内容，也就是咱们项目后端负责文件上传要实现的内容。
 */

// import three packages: express, express-fileupload, cors
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

// create express application
const app = express();

// middle ware
app.use(express.static('public')); //to access the files in public folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());

// file upload api
// 这个'/upload/'是后端服务器的路径，比如说，后端服务器地址是localhost:4500
// 那么这个上传界面的路径就是 localhost:4500/upload
app.post('/upload', (req, res) => {

    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    
    // accessing the file 这一步是获取到要上传的文件
    const myFile = req.files.file;
    console.log(myFile);

    //  mv() method places the file inside public directory
    // 注意这个public， 你可以在左侧文件结构里看到一个 public 的文件夹
    // 是用来存放上传的文件的。
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        // 这里是返回的上传文件的信息， 可以存取到后台 datasetfile 数据表单中
        // 也用来转给前端，前端主要想知道文件名和size
        return res.send({name: myFile.name, size: myFile.size});
    });
})


app.listen(4500, () => {
    console.log('server is running at port 4500');
})
