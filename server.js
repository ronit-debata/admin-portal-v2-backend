const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");

const app = express();
const mongoclient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const url = "mongodb+srv://ronit:ronit123@cluster0.rcs55.mongodb.net/admin-portal?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

app.post("/students", async (req, res) => {
  console.log(req.body);
  try {
    let con = await mongoclient.connect(url);
    let db = con.db("admin-panel");
    await db.collection("students").insertOne(req.body);
    await con.close();
    res.send({message : "success"});
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/students", async (req, res) => {
  try {
    let con = await mongoclient.connect(url);
    let db = con.db("admin-panel");
    let students = await db.collection("students").find().toArray();
    await con.close();
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }  
});

app.get("/students/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let o_id = new ObjectId(id);
    let con = await mongoclient.connect(url);
    let db = con.db("admin-panel");
    let student = await db.collection("students").find({_id : o_id}).toArray();
    await con.close();
    res.send(student[0]);
  } catch (error) {
    res.status(500).send(error);
  }  
});

app.put("/students/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let o_id = new ObjectId(id);
    let con = await mongoclient.connect(url);
    let db = con.db("admin-panel");
    await db.collection("students").findOneAndUpdate({_id : o_id}, {$set : req.body});
    await con.close();
    res.send({message : "success"});
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let o_id = new ObjectId(id);
    let con = await mongoclient.connect(url);
    let db = con.db("admin-panel");
    await db.collection("students").deleteOne({_id : o_id});
    await con.close();
    res.send({message : "success"});
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
