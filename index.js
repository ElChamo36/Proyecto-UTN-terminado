require('dotenv').config();
const express = require('express');
const app = express();
const Port = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const nodemailer = require('nodemailer');


//Traemos librería para conexión a la base de datos
const mysql = require('mysql2');
const { url } = require('inspector');


//Creamos la configuración de la conexión con la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    port: 3306 
});


//Conectamos a la database
conexion.connect((error) => {
    if (error){
        console.log("error")
    }else{
        console.log("Tu conexion con base de datos fue exitosa")
    }
});




//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));


//Configuramos el Motor de Plantillas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


//Routes----------------------------------------------------
//GETS para el usuario:
app.get('/', (req, res) =>{
    res.render('index')
});


app.get('/galeria', (req, res) =>{
    res.render('galeria')
});


app.get('/formulario', (req, res) =>{
    res.render('formulario')
});


app.get('/turismo', (req, res) =>{
    res.render('turismo')
});

app.get('/error', (req, res) =>{
    res.render('error')
});

//GETS para el administrador: serían /administrador y /reservas
app.get('/administrador', (req, res) => {  
    conexion.query('SELECT * FROM cliente', (err, result) =>{
        if(err){
            console.log(err)
        }else{
            res.render('administrador', {result})
        }
    });
});


app.get('/reservas', (req, res) => {
    conexion.query('SELECT * FROM reservas', (err, reserva) => {
        if(err){
            console.log(err);
        }else{
            res.render('reservas', {reserva: reserva,})
        }
    });
});



//Configuramos la ruta post del formulario
/*Los datos los va a sacar desde los inputs, los cuales tienen que tener como atributo name el 
nombre de la variable que estoy describiendo en las constantes.
El method del formulario tiene que ser post*/ 

//Ruta post para usuarios
app.post('/formulario', (req, res) => {
    const {nombre, apellido, fecha_ingreso_consulta, fecha_egreso_consulta, dni, mail, telefono} = req.body;
    
        conexion.query("insert into cliente (nombre, apellido, fecha_ingreso_consulta, fecha_egreso_consulta, dni, mail, telefono) values (?, ?, ?, ?, ?, ?, ?);", [nombre, apellido,fecha_ingreso_consulta, fecha_egreso_consulta, dni, mail, telefono], (err, result) =>{
            if(err){
                console.log(err)
            }else{              
                async function main() {
                    
                    let transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth:{
                            user: "cabaniasuiza@gmail.com",
                            pass: process.env.PG
                        }
                    });
                    let info = await transporter.sendMail({
                        from: "cabaniasuiza@gmail.com",
                        to: mail,
                        subject: "Nuevo mensaje de contacto",
                        html:`Gracias por visitar nuestra página de CABAÑA SUIZA!!!   
                            En instantes te respondemos tu consulta ${nombre} ${apellido}.`
                    });
                console.log("Tu consulta se realizó con éxito")
                res.render ('enviado', {título: "Mail enviado a CABAÑA SUIZA, desde: ",
                nombre, mail}) ;
                }
                main().catch(console.err);
            }           
        })
    });



//Ruta post para que el administrador ingrese una reserva
    app.post('/administrador', (req, res) => {
        const {nombre_reserva, apellido_reserva, dni_reserva, mail_reserva, telefono_reserva, fecha_ingreso_reserva, fecha_egreso_reserva, seña, monto, total_noches} = req.body;
        
            conexion.query("insert into reservas (nombre_reserva, apellido_reserva, dni_reserva, mail_reserva, telefono_reserva, fecha_ingreso_reserva, fecha_egreso_reserva, seña, monto, total_noches) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [nombre_reserva, apellido_reserva, dni_reserva, mail_reserva, telefono_reserva, fecha_ingreso_reserva, fecha_egreso_reserva, seña, monto, total_noches], (err, reserva) =>{
                if(err){
                    console.log(err)
                }else{
                    console.log("Tu reserva se realizó con éxito")
                    res.render("administrador")
                }           
            })
        
        });

//Ruta PUT y DELETE para que el administrador realice un UPDATE y DELETE  
app.post('/reservas', (req, res) => {
    const {fecha_ingreso_reserva, fecha_egreso_reserva, id_reserva} = req.body;
    conexion.query("UPDATE reservas SET fecha_ingreso_reserva= ?, fecha_egreso_reserva= ?  WHERE id_reserva = ?", [fecha_ingreso_reserva, fecha_egreso_reserva, id_reserva], (err, result) =>{
        if (fecha_ingreso_reserva == undefined && fecha_egreso_reserva == undefined){
            conexion.query("DELETE FROM reservas where id_reserva = ?;", id_reserva, (err, result) =>{
                if(err){
                    console.log(err);
                }else{
                    res.send("Reserva borrada con éxito");
                }
            })
        }else{
            res.send("Actualización exitosa")
            console.log(id_reserva + fecha_ingreso_reserva + fecha_egreso_reserva);
        }
    })
});



//Cierre de la conexión
// conexion.end();


//Configuración del servidor
app.listen(Port, () =>{
    console.log(`Servidor está trabajando en el Puerto ${Port}`);
});

app.on('error', (err) =>{
    console.log(`Error en la ejecución del Servidor ${error}`);
});