
var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const fs = require('fs');
var tempimg = "";
//get data
router.get('/', (req, res) => {
    connection.query('SELECT * FROM CategoryTbl', function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.redirect('/errpage');
        }
        if (results) {
            var op = {
                flag: 0,
                success: "true",
                status: 200,
                data: results,
                message: "Redirected"
            }
            res.render('category', { op });
        }
    });
})

//add category
router.post('/add', async (req, res) => {
    let imgfile = req.files.categoryImage;
    let fname = Date.now() + req.files.categoryImage.name;
    await imgfile.mv('./public/images/category/' + fname, (err) => {
        if (err) {
            res.redirect('/errpage');
        }
        else {
            let CategoryName = req.body.txtCategoryName;
            let sql = "INSERT INTO CategoryTbl(CategoryName,Img,IsActive) VALUES(?,?,?)"
            let data = [CategoryName, fname, 0];
            connection.query(sql, data, (error, results, fields) => {
                if (error) {
                    res.redirect('/errpage');
                }
                else {
                    var op = {
                        flag: 2,
                        success: "true",
                        status: 200,
                        data: results,
                        message: "Category Added"
                    }
                    res.redirect('/category');
                    // res.send({ op })
                }
            })
        }
    })
})

//edit data page
router.get('/edit/:id', (req, res) => {
    let cid = req.params.id;
    const sql = 'SELECT * FROM CategoryTbl WHERE CategoryId = ?';
    connection.query('SELECT * FROM CategoryTbl WHERE CategoryId = ?', [cid], function (error, results, fields) {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            
            if (results.length > 0) {
                tempimg = results[0].Img;
                var op = {
                    flag: 1,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
            }
            else {
                var op = {
                    flag: 0,
                    success: "false",
                    status: 200,
                    data: results,
                    message: "Category Not Available"
                }
            }
            res.render('category', { op });
        }

    });
})

//edit submit
router.post('/edit', async (req, res) => {
    const CategoryName = req.body.txtCategoryName;
    const cid = req.body.txtCategoryId;
    var sql = "";
    if (!req.files) {
        console.log("File not found");
        sql = "UPDATE CategoryTbl SET CategoryName = ? WHERE CategoryId = ?";
        connection.query(sql, [CategoryName, cid], (error, results, fields) => {
            if (error) {
                res.redirect('/errpage');
            }
            else {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
                res.redirect('/category');
            }
        })
    }
    else {
        // console.log(tempimg);
        imgfile = req.files.categoryImage;
        fname = Date.now() + req.files.categoryImage.name;
        const rmpath = './public/images/category/' + tempimg;
        // console.log(rmpath);
        fs.unlink(rmpath, (err) => {
            if (err) {
                // console.log('delete error')
                res.redirect('/errpage')
            }
            else {
                imgfile.mv('./public/images/category/' + fname, (err1) => {
                    if (err1) {
                        // console.log("move erro")
                        res.redirect('/errpage')
                    }
                    else {
                        // console.log("File deleted")
                        sql = "UPDATE CategoryTbl SET CategoryName = ?, Img = ? WHERE CategoryId = ?";
                        // console.log([CategoryName, fname, cid])
                        connection.query(sql, [CategoryName, fname, cid], (error, results, fields) => {
                            if (error) {
                                res.redirect('/errpage');
                            }
                            else {
                                var op = {
                                    flag: 0,
                                    success: "true",
                                    status: 200,
                                    data: results,
                                    message: "Redirected"
                                }
                            }
                            res.redirect('/category');
                        })

                    }
                })

            }
        })
    }
})

//IsActive Status change
router.post('/isactive', (req, res) => {
    let categoryid = req.body.categoryid;
    let val = req.body.val;
    let tempval
    if (val == 0) {
        tempval = 1;
    }
    else {
        tempval = 0
    }
    connection.query('UPDATE CategoryTbl SET IsActive = ? WHERE CategoryId = ?', [tempval, categoryid], (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            res.send("updated");
        }
    })
})

module.exports = router;