var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// default route
app.get('/', function (req, res) {
    return res.send({
        error: true,
        message: 'Welcome to BOG Application'
    });
});


// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'bog_mapp',
    password: 'Qwerty@123456',
    database: 'bogmapp'
});


// connect to database
dbConn.connect();

/* GET */
// Retrieve all kaos
app.get('/bog/kaos/all', function (req, res, next) {
    dbConn.query('SELECT warna, ukuran, jumlah FROM bog_kaos ORDER BY created_date DESC',
        function (error, results) {
            if (error) throw error;
            return res.send(results);
        });
});

// Retrieve the latest data only (PAGE 4)
app.get('/bog/kaos/latest', function (req, res, next) {
    dbConn.query('SELECT warna, ukuran, jumlah FROM bog_kaos WHERE id_bog_kaos IN (SELECT * FROM(SELECT MAX(id_bog_kaos) FROM bog_kaos) as t)',
        function (error, results) {
            if (error) throw error;
            return res.send(results);
        });
});


/* POST */
//POST - Warna Baju (PAGE 1)
app.post('/bog/kaos/warna', function (req, res) {
    let warna = req.body.warna;
    if (!warna) {
    return res.status(400).send({ error:true, message: 'MOHON PERIKSA KEMBALI DATA YANG ANDA PILIH' });
    }
    dbConn.query("INSERT INTO bog_kaos SET ? ", { warna: warna }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'DATA WARNA BERHASIL DIPILIH' });
    });
    });


//POST - Ukuran Baju (PAGE 2)
app.post('/bog/kaos/ukuran', function (req, res) {
    let ukuran = req.body.ukuran;
    if (!ukuran) {
    return res.status(400).send({ error:true, message: 'MOHON PERIKSA KEMBALI DATA YANG ANDA PILIH' });
    }
    dbConn.query("UPDATE bog_kaos SET ? WHERE id_bog_kaos IN (SELECT * FROM(SELECT MAX(id_bog_kaos) FROM bog_kaos) as t)", { ukuran: ukuran }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'DATA WARNA BERHASIL DIPILIH' });
    });
    });

//POST - Jumlah Baju (PAGE 3)
app.post('/bog/kaos/jumlah', function (req, res) {
    let jumlah = req.body.jumlah;
    if (!jumlah) {
    return res.status(400).send({ error:true, message: 'MOHON PERIKSA KEMBALI DATA YANG ANDA PILIH' });
    }
    dbConn.query("UPDATE bog_kaos SET ? WHERE id_bog_kaos IN (SELECT * FROM(SELECT MAX(id_bog_kaos) FROM bog_kaos) as t)", { jumlah: jumlah }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'DATA WARNA BERHASIL DIPILIH' });
    });
    });


// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;