const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const cors = require('cors');




const app = express();

app.use(cors());

app.use(express.json());
const port = process.env.PORT || 3000;
const connectionString = process.env.MONGODB_URI;

async function createServer() {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db('MedLInk');
     
    
    app.get('/medicines', async (req, res) => {
      try {
        const database = client.db("MedLInk");
        const collection = database.collection("medicines");
        
       
        const medicines = await collection.find({}).toArray();
        
        res.status(200).json(medicines);
      } catch (error) {
        console.error("Error fetching forms:", error);
        res.status(500).json({ message: "Error fetching forms" });
      }
    });

    app.post('/medicines/add', async (req, res) => {
        try {
          
          const { name, desc, type, manu } = req.body;
      
          
          console.log('Received data:', { name, desc, type, manu });
      
          
          if (!name || !desc || !type || !manu) {
            return res.status(400).json({ message: "All fields (name, desc, type, manu) are required" });
          }
      
          const database = client.db("MedLInk");
          const medications = database.collection("medicines");
      
          
          const newMedication = { name, desc, type, manu };
      
          const result = await medications.insertOne(newMedication);
      
          if (result.acknowledged) {
            res.status(201).json({ 
              message: "Medication added successfully", 
              id: result.insertedId,
              medication: newMedication
            });
          } else {
            res.status(400).json({ message: "Failed to add medication" });
          }
        } catch (error) {
          console.error('Error adding medication:', error);
          res.status(500).json({ message: "Internal server error" });
        }
      });
   
    

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

createServer();