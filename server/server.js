
const express=require('express');
const fs=require('fs');
const path=require('path');
const bodyParser=require('body-parser');
const cors=require('cors');
const multer=require('multer');

const DATA_FILE=path.join(__dirname,'..','data','store.json');
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||'swagmoneyfinesser';
const PUBLIC_DIR=path.join(__dirname,'..','public');

const upload=multer({dest:path.join(PUBLIC_DIR,'models')});

function load(){try{return JSON.parse(fs.readFileSync(DATA_FILE));}catch(e){return {about:'',products:[],banner:{}};}}
function save(d){fs.writeFileSync(DATA_FILE,JSON.stringify(d,null,2));}

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_DIR));

function auth(req,res,next){if(req.body.password!==ADMIN_PASSWORD)return res.status(403).json({});next();}

app.get('/api/store',(r,s)=>s.json(load()));

app.post('/api/about',auth,(r,s)=>{let d=load();d.about=r.body.about;save(d);s.json({ok:1});});

app.post('/api/products',auth,(r,s)=>{let d=load();d.products.push(r.body);save(d);s.json({ok:1});});
app.delete('/api/products/:id',auth,(r,s)=>{let d=load();d.products=d.products.filter(p=>p.id!=r.params.id);save(d);s.json({ok:1});});

app.post('/api/banner',auth,(r,s)=>{let d=load();d.banner=r.body;save(d);s.json({ok:1});});

app.post('/api/model',upload.single('model'),(r,s)=>{
 if(r.body.password!==ADMIN_PASSWORD)return s.status(403).json({});
 s.json({ok:1,file:'/models/'+r.file.filename});
});

app.get('/product/:id',(r,s)=>s.sendFile(path.join(PUBLIC_DIR,'product.html')));

app.listen(3000);
