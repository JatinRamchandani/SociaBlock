const express=require('express');
const path=require('path')
const bodyParser=require('body-parser');
const app=express();
const fs=require('fs');
const mysql=require('mysql');
const Joi=require('joi');
const multer=require('multer'); 

app.use('/public',express.static(path.join(__dirname,'static')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine','ejs');


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

app.get('/',(req,res)=>{
    console.log(req.params);
   res.sendFile(path.join(__dirname,'static','UserRegForm.html'));
})

app.post('/signup',(req,res)=>{
    
    let user=req.body;
    let userFName=req.body.fname
    let sql='INSERT INTO users SET ?';

    let sql2 = "CREATE TABLE "+userFName+" (id INT AUTO_INCREMENT PRIMARY KEY, Image VARCHAR(255))";

    let query=db.query(sql,user,(err,result)=>{
        if(err) throw err;
        console.log(req.body);
        res.sendFile(path.join(__dirname,'static','UserRegForm.html'));
      
    })
    db.query(sql2,(err, result)=>{
        if (err) throw err;
        console.log("Table created");
      })
})

app.get('/loginForm',(req,res)=>{
    console.log(req.params);
    res.sendFile(path.join(__dirname,'static','login.html'));
});



app.get('/login',(req,res)=>{
    let Email=req.query.Email;
    let Password=req.query.Password;
    var sql="SELECT FName,LName,Email,Profiles FROM users WHERE Email = ? AND Password = ?";
    db.query(sql,[Email,Password],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render("profile",{username:result});
    });
});



app.get("/search",(req,res)=>{
    let nuser=req.query.searchuser;

    var sql="SELECT FName,LName,Email,Profiles FROM users WHERE FName= ? ";
    db.query(sql,nuser,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render("others",{username:result});
        
    })
})


const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

  const upload = multer({
    dest: "./images"
  });


app.post("/upload",upload.single("image"),(req,res)=>{
    var tempPath = req.file.path;
    let email=req.body.finder;

    let pathnew=tempPath.substr(7,tempPath.length);

    sql= 'UPDATE users SET Profiles=? WHERE Email= ?';
    const targetPath = path.join(__dirname, "./images/:tempPath.jpg");
    db.query(sql,[pathnew,email],(err,result)=>{
        if(err) throw err;
        console.log(result);
    });

         res
            .status(200)
            .sendFile(path.join(__dirname,'static','login.html'));
    

    // if (path.extname(req.file.originalname).toLowerCase() === ".jpeg") {
    //     fs.rename(tempPath, targetPath, err => {
    //       if (err) return handleError(err, res);
  
    //       res
    //         .status(200)
    //         .contentType("text/plain")
    //         .send("File uploaded!");
    //     });
    //   } else {
    //     fs.unlink(tempPath, err => {
    //       if (err) return handleError(err, res);
  
    //       res
    //         .status(403)
    //         .contentType("text/plain")
    //         .end("Only .png files are allowed!");
    //     });
    //   }
});

app.get("/images/:id", (req, res) => {
    let s1 = "./images/" + req.params.id;
    res.sendFile(path.join(__dirname, s1));
  });


app.get("/photos/:name/:profile",(req,res)=>{
    let para=req.params.name;
    let photo=req.params.profile;
    res.render("photos",{username:para,userphoto:photo});
})


app.post("/uploadphotos/:name",upload.single("image"),(req,res)=>{
    let newtempPath = req.file.path;
    let toAdd=req.params.name;

    let newpathnew=newtempPath.substr(7,newtempPath.length);

    sql= 'INSERT INTO '+ toAdd +' SET Image = ?';
    const targetPath = path.join(__dirname, "./individualImages/:newtempPath.jpg");
    db.query(sql,newpathnew,(err,result)=>{
        if(err) throw err;
        console.log(result);
    });

         res
            .status(200)
            .render("photos");
})



app.listen(3000);
















