const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const fs = require('fs-extra')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const objectid = require('mongodb').ObjectId
const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('doctors'))
app.use(fileUpload())
const uname = process.env.USER_NAME;
const pass = process.env.PASSWORD;
const dbname = process.env.DATABASE_NAME;
const collection1 = process.env.COLLECTION1
const collection2 = process.env.COLLECTION2
const collection3 = process.env.COLLECTION3
const collection4 = process.env.COLLECTION4
 
app.get('/',(req,res)=>{
    res.send("hello")
})

const uri = `mongodb+srv://${uname}:${pass}@cluster0.5av9x.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect( err => {
        const Services_List = client.db(dbname).collection(collection1);
        const Admin_List = client.db(dbname).collection(collection2);
        const Order_List = client.db(dbname).collection(collection3);
        const Review_List = client.db(dbname).collection(collection4);
    
        app.post('/addService', (req, res) => {
            
            const file = req.files.file
            const title = req.body.title
            const description = req.body.description
               const image= imgProcess(file)
               Services_List.insertOne({title,description,image})
                .then(result=>{
                  res.status(200).send("Successfull")
                    })
                
                .catch(error=>{})
            })
            
     
    
        app.get('/getService',(req,res)=>{
           
            Services_List.find()
            .toArray((err,document)=>{
                res.send(document)
            })
        })
    
        //Admin list
        app.post('/addAdmin',(req,res)=>{
            const email = req.body;
            Admin_List.insertOne(email)
            .then(res.status(200).send("successfull"))
        })
        app.get('/getAdmin',(req,res)=>{
            const email = req.query.email;
            Admin_List.find({email:email})
            .toArray((err,document)=>{
                res.send(document.length>0)
            })
        })
        
        //order
    
        app.get('/getUserOrder',(req,res)=>{
             
            const email = req.query.email
            Order_List.find({email:email})
            .toArray((err,document)=>{
                res.send(document)
            })
        })
    
        app.get('/getOrder',(req,res)=>{
            Order_List.find(
                {},{projection:{serviceImage:0,image:0}}
            )
            .toArray((err,document)=>{ 
                // const newDAta=[]
                // document.map(data=>{
                //     delete data.image
                //     delete data.serviceImage
                //     newDAta.push(data)
                // })
              
                res.send(document)
                
            })
        })
        
    app.patch('/updateOrderStatus/:id',(req,res)=>{
    
        const id = req.params.id
        const status = req.body.status
        
        Order_List.updateOne(
            {_id:objectid(id)},
            {
                $set:{"status":status}
            }).then(result=>res.send("cdc"))
            .catch(err=>{})
        
    })
        app.post('/addOrder', (req, res) => {
            
            const file = req.files.file
            const name = req.body.name
            const email = req.body.email
            const serviceName = req.body.serviceName
    
            const description = req.body.description
            const price = req.body.price
            const serviceDescription = req.body.serviceDescription;
            const serviceImage =req.body.image
            const status = req.body.status
           
           
               const image= imgProcess(file)
               Order_List.insertOne({name,email,serviceName,description,price,image,status,serviceDescription,serviceImage})
                .then(result=>{
                 
                  res.status(200).send("Successfull")
                    })
                
                .catch(error=>{})
            })      
       
    
    
        //review
        app.post("/addReview",(req,res)=>{
            
            const name = req.body.name
            const email = req.body.email
            const companyName = req.body.companyName
            const description = req.body.description
            const photoUrl = req.body.photo
    
            Review_List.insertOne({name,email,companyName,description,photoUrl})
            .then(result=>{
                result.
                res.status(200).send("added Successfully")
            })
            .catch(err=>{
                res.status(404).send("Failed to Inser")
            })
            
        })
    
        app.get('/getUserReview',(req,res)=>{
            Review_List.find()
            .toArray((err,document)=>{
               
                res.send(document)
            })
        })
    
 
})

app.listen(process.env.PORT || 5000, (req, res) => {
    
})

const imgProcess=(file)=>{
    
        const newImg = file.data
        const encImg = newImg.toString('base64')

     const   img={
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        } 
        return img
        

 
}