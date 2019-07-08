var express = require('express');
var router = express.Router();
var connection = require('../conn/connection')
var moment = require('moment')
var upload = require('../middleware/uploadImage')
const {BASE_URL} = require('../config/Config')

router.get('/:limit/:offset', function(req, res, next) {
    var query;
    var limit = req.params.limit;
    var offset = req.params.offset;
    query = "SELECT title, content, image FROM article LIMIT "+offset+","+limit;
    connection.query(query,function (err,rows,fields) {
        console.log(err)
        res.json(rows)
    });
});

router.post('/', upload.single('image'), async function (req, res) {
    var body = req.body
    var uploaddata = req.file
    var image = BASE_URL +"images/"+ uploaddata.filename
    var sql = "INSERT INTO article (title, content, image) VALUES (?,?,?)";
    await connection.query(sql, [body.title, body.content,  image] ,function (err, result) {
        if (err) throw err;
        res.json({
            status:'success',
            data:{
                title: body.title, 
                content: body.content, 
                image: image}
        });
    });
});

router.put('/', function (req,res) {
    var body = req.body;
    var sql = "UPDATE article SET title = ?, content= ?, image= ? where id= ?";
    connection.query(sql, [body.title, body.content, body.image, body.id] ,function (err, result) {
        if (err) throw err;
        res.json({
            status:'success',
            data:body
        });
    });
});

router.delete('/:id',function (req,res) {
    var id = req.params.id;
    var sql = "DELETE FROM article where id = "+id;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.affectedRows > 0){
            res.json({
                status:'success'
            });
        }else {
            res.json({
                status:'failed'
            });
        }

    });
})

module.exports = router;