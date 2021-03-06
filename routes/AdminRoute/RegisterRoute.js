var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const md5 = require('md5');
//get data
router.get('/', (req, res) => {

    var op = {
        flag: 1,
        success: "true",
        message: "Registered Successfully"
    }
    res.render('register', { op })
})

//Customer List
router.get('/clist', (req, res) => {
    connection.query('SELECT u.UserId,u.UserName,u.Email,u.Password,u.ContactNo,u.Address,a.AreaName FROM UserTbl u,AreaTbl a WHERE u.AreaId = a.AreaId AND u.RoleId=? ORDER BY CreatedAt DESC', [1], function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            // res.send({ op })
            res.redirect('/errpage');
        }
        else {
            if (results) {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
            }
            // res.send(results);
            res.render('customer', { op });
        }
    });
})

//Installer List
router.get('/ilist', (req, res) => {
    connection.query('SELECT u.UserId,u.UserName,u.Email,u.Password,u.ContactNo,u.Address,a.AreaName FROM UserTbl u,AreaTbl a WHERE u.AreaId = a.AreaId AND u.RoleId=? ORDER BY CreatedAt DESC', [2], function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.redirect('/errpage');
        }
        else {
            if (results) {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
            }
            res.render('installer', { op });
        }
    });
})


//add Database
router.post('/add', (req, res) => {
    let username = req.body.txtUsername;
    let email = req.body.txtEmail;
    let cno = req.body.txtContactNo
    let password = req.body.txtPassword;
    let address = req.body.txtAddress;
    let areaid = req.body.cmbArea
    let roleid = req.body.cmbRole;
    let val = [username, email, cno, address, password, areaid, roleid];
    connection.query('INSERT INTO UserTbl(UserName,Email,ContactNo,Address,Password,AreaId,RoleId) VALUES(?,?,?,?,?,?,?)', val, function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            // res.send(error)
            res.redirect('/errpage');
        }
        if (results) {
            var op = {
                flag: 0,
                success: "true",
                status: 200,
                data: results,
                message: "Registered Successfully"
            }
            res.render('register', { op });
        }

    });
})

router.post('/checkemail',(req,res)=>{
    const ckemail = req.body.emailadd;
    connection.query('SELECT * FROM UserTbl WHERE Email = ?',[ckemail],(error,results)=>{
        if(error){
            res.redirect('/errpage')
        }
        else{
            if (results.length > 0)
            {
                res.send({
                    status: 200,
                    op : 1
                })
            }
            else{
                res.send({
                    status: 200,
                    op : 0
                })
            }

        }
    })

})

module.exports = router;