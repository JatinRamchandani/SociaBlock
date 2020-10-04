const express=require('express');
const path=require('path')
const bodyParser=require('body-parser');
const app=express();
const fs=require('fs');
const mysql=require('mysql');
const Joi=require('joi');

app.use('/public',express.static(path.join(__dirname,'static')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:"showMe"
});



db.connect((err)=>{
    if(err){
       console.log(err);
    }

    else{
        console.log('mysql connected..')
    }

})


app.get('/login',(req,res)=>{
    let Email=req.header.Email;
    let Password=req.header.Password;
    var sql="SELECT Name FROM `users` WHERE `Email`='"+Email+"' and Password = '"+Password+"'";
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});


app.get('/',(req,res)=>{
    console.log(req.params);
   res.sendFile(path.join(__dirname,'static','UserRegForm.html'));
})


// app.post('/',(req,res)=>{
//    console.log(req.body);
//     const schema=Joi.object().keys({
//         name:Joi.string().trim().required(),
//         Email:Joi.string().trim().email().required(),
//         password:Joi.string().min(5).max(10).required()

//     });
//     schema.validate(req.body);
//     //database work here
//     res.json({success:true});
// })
app.listen(3000);



app.post('/signup',(req,res)=>{
    
    let user=req.body;
    let sql='INSERT INTO users SET ?';

    let query=db.query(sql,user,(err,result)=>{
        if(err) throw err;
        console.log(req.body);
         res.send("success");
      
    })
})

app.get('/LoginForm',(req,res)=>{
    console.log(req.params);
    res.sendFile(path.join(__dirname,'static','login.html'));
})











