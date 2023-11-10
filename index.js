const express = require('express')
const mysql = require('mysql2')
const bookRoutes = require('./routes/book')
const authorRoutes = require('./routes/author')
const authRoutes = require('./routes/auth')
const dbConfig = require('./config/database')
const authenticateJWT = require('./middleware/auth')
const pool = mysql.createPool(dbConfig)
const cors = require('cors')


pool.on('error', (err) => {
    console.log(err)
})

const app = express()
const PORT = 8000

app.use(express.json())
app.use(express.urlencoded({
     extended: true
}))

//Membuat parameter harus diawali : awal
app.get('/contohparameter/:username/:jurusan/:rombel', (req,res) => {
    res.json(req.params)
})

app.get('/contohparam', (req,res) => {
    res.json(req.query)
})

app.get('/',(req,res) => 
{res.write('hellow world'); 
res.end()})

app.use(cors())
app.use('/auth', authRoutes)
app.use('/book', authenticateJWT, bookRoutes)
app.use('/author', authorRoutes)

app.listen(PORT, () => {
    console.log(`server berjalan di http://localhost:${PORT}`)
})
