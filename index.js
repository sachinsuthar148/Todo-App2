const express = require("express");
const methodOverride= require("method-override");
const mongoose  = require("mongoose");
const { type } = require("os");
const path=require('path');

const app= express();

main().then(()=>{
    console.log("DataBase connected successfully");
}).catch((err)=>{
    console.log(err);
})

async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/todoAPP")
}

app.set("views","ejs");
app.set("views",path.join(__dirname,"views"));




app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));



const todoSchema= new mongoose.Schema({
    date:{
        type:Date,
        default: new Date(),
    },
    content:{
        type:String,
        required: true
    }
});

const TodoModel = mongoose.model("TODO",todoSchema);

//Root route
app.get("/",  async (req,res)=>{
    
    let lists= await TodoModel.find({});

    res.render("index.ejs",{lists});
})

//new route
app.get("/new",async (req,res)=>{
    res.render("new.ejs");
});

//new list
app.post("/", async (req, res)=>{
    let {content} = req.body;
    let Data = new TodoModel({
        content: content
    })
    await Data.save();
    console.log("Data saved");
    res.redirect("/")
});


app.delete("/:id", async (req,res)=>{
    let {id}= req.params;
    console.log(id);
    let deletelist= await TodoModel.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/");
})

app.listen(8080,()=>{
    console.log("sever is running on port 8080");
})