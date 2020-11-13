const express = require('express');
const mysql = require('mysql');
const hbs =  require('hbs');
const bodyParser = require('body-parser');

const app = express();
const port = 6700;

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var koneksi =  mysql.createConnection({
   host: 'localhost',
   user: 'Azizi',
   password: '1945',
   database: 'DB_PEMBAYARANSPPKU'
});

koneksi.connect((err) => {
   if(err) throw err;
   console.log("Koneksi Database Berhasil Terkoneksi");
});

app.get('/data', (req, res) => {
    res.render(__dirname + '/views/data.hbs')
 })

app.get('/login', (req, res) => {
    res.render(__dirname + '/views/login.hbs')
 })

//LOGIN===================================================>
app.get('/login', (req, res) => {
   koneksi.query('SELECT * FROM USER', (err, hasil) => {
    if(err) throw err;
    res.render('login.hbs', {
        judulhalaman: 'LOGIN HERE !!!',
        data: hasil
      });
   });
});

app.post('/login', (req, res) => {
  var USERNAME = req.body.inputusername;
  var PASSWORD = req.body.inpupassword;
   koneksi.query('INSERT INTO USER( USERNAME, PASSWORD ) VALUES( ?, ? )',
        [  USERNAME, PASSWORD  ],
            (err, hasil) => {
                if(err) throw err;
                res.redirect('/login');
                }
          )
});

//DATA===================================================>
app.get('/data', (req, res) => {
   koneksi.query('SELECT * FROM PEMBAYARAN', (err, hasil) => {
    if(err) throw err;
    res.render('data.hbs', {
        judulhalaman: 'DATA PEMBAYARAN',
        data: hasil
      });
   });
});

app.post('/data', (req, res) => {
   var SISWA = req.body.inputsiswa;
   var BULAN = req.body.inputbulan;
   var JUMLAH = req.body.inputjumlah;
   var TANGGAL = req.body.inputtanggal;
   koneksi.query('INSERT INTO PEMBAYARAN( SISWA, BULAN, JUMLAH, TANGGAL_TRANSAKSI ) VALUES( ?, ?, ?, ? )',
         [  SISWA, BULAN, JUMLAH, TANGGAL],
             (err, hasil) => {
                 if(err) throw err;
                 res.redirect('/data');
                 }
           )
 });

app.get('/hapus-barang/:SISWA', (req, res) => {
  var SISWA = req.params.SISWA;
  koneksi.query("DELETE FROM PEMBAYARAN WHERE SISWA=?", 
         [ SISWA ], (err, hasil) => {
            if(err) throw err;
            res.redirect('/data');
      }
  );
});
  
app.listen(port, () => {
    console.log(`App berjalan pada port ${port}`);
})