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
console.log(MongoClient);
app.get('/',(req,res)=>{
    res.send("hello")
})

const uri = "mongodb+srv://raihan:862@cluster0.5av9x.mongodb.net/Creative-Agency?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect( err => {
        const Services_List = client.db("Creative-Agency").collection("Services-List");
        const Admin_List = client.db("Creative-Agency").collection("Admin-List");
        const Order_List = client.db("Creative-Agency").collection("Order-List");
        const Review_List = client.db("Creative-Agency").collection("Review-List");
    
        app.post('/addService', (req, res) => {
            
            const file = req.files.file
            const title = req.body.title
            const description = req.body.description
            const filePath = `${__dirname}/images/${file.name}`;
            file.mv(filePath, error => {
                if (error) {
                    res.status(500).send("failed")
                }
               const image= imgProcess(file,filePath)
               Services_List.insertOne({title,description,image})
                .then(result=>{
                 
                  res.status(200).send("Successfull")
                    })
                
                .catch(error=>{})
            })
            
        })
    
        app.get('/getService',(req,res)=>{
            console.log("come");
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
            Order_List.find()
            .toArray((err,document)=>{   
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
           
            const filePath = `${__dirname}/images/${file.name}`;
            file.mv(filePath, error => {
                if (error) {
                    res.status(500).send("failed")
                }
               const image= imgProcess(file,filePath)
               Order_List.insertOne({name,email,serviceName,description,price,image,status,serviceDescription,serviceImage})
                .then(result=>{
                 
                  res.status(200).send("Successfull")
                    })
                
                .catch(error=>{})
            })      
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
                res.send(404).send("Failed to Inser")
            })
            
        })
    
        app.get('/getUserReview',(req,res)=>{
            Review_List.find()
            .toArray((err,document)=>{
               
                res.send(document)
            })
        })
    
 
})

app.listen(5000, (req, res) => {
    
})

const imgProcess=(file,filePath)=>{
    
        const newImg = fs.readFileSync(filePath);
        const encImg = newImg.toString('base64')

     const   img={
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        } 
        return img
        

 
}