Main Code ->

Backend (Node.js with Express) -> javascript

// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const shippingRouter = require('./routes/shipping');
const documentRouter = require('./routes/document');
const queryRouter = require('./routes/query');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route Definitions
app.use('/api/shipping', shippingRouter);
app.use('/api/documents', documentRouter);
app.use('/api/query', queryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

Shipping Router Example (Automated Shipping API) -> javascript

// routes/shipping.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Example Endpoint: Get Carrier Rates
router.post('/getRates', async (req, res) => {
    const { origin, destination, weight } = req.body;
    
    try {
        const response = await axios.post('https://api.shipping.com/rates', {
            origin,
            destination,
            weight
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rates' });
    }
});

module.exports = router;

Document Management Router -> javascript

// routes/document.js
const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const s3 = new AWS.S3();

// Example: Upload Document
router.post('/upload', (req, res) => {
    const file = req.files.file; // Assuming multer is used for file uploads
    const params = {
        Bucket: 'your-s3-bucket',
        Key: file.name,
        Body: file.data
    };
    
    s3.upload(params, (err, data) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(data);
    });
});

module.exports = router;

Query Management Router -> javascript

// routes/query.js
const express = require('express');
const router = express.Router();
const queries = [];

// Example: Create New Query
router.post('/new', (req, res) => {
    const { issue, orderId } = req.body;
    const newQuery = { id: queries.length + 1, issue, orderId, status: 'open' };
    queries.push(newQuery);
    res.status(200).json(newQuery);
});

// Example: Update Query Status
router.put('/update/:id', (req, res) => {
    const queryId = req.params.id;
    const { status } = req.body;
    const query = queries.find(q => q.id == queryId);

    if (query) {
        query.status = status;
        res.status(200).json(query);
    } else {
        res.status(404).json({ message: 'Query not found' });
    }
});

module.exports = router;

Frontend (React.js) -> javascript

// App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [rates, setRates] = useState(null);

  const fetchRates = async () => {
    try {
      const response = await axios.post('/api/shipping/getRates', { origin, destination, weight });
      setRates(response.data);
    } catch (error) {
      console.error('Error fetching rates', error);
    }
  };

  return (
    <div className="App">
      <h1>Shipping Rate Checker</h1>
      <input type="text" placeholder="Origin" value={origin} onChange={e => setOrigin(e.target.value)} />
      <input type="text" placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} />
      <input type="number" placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} />
      <button onClick={fetchRates}>Get Rates</button>

      {rates && (
        <div>
          <h2>Rates</h2>
          <pre>{JSON.stringify(rates, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
-------------------------------------------------------------------------------------------------------------x--------------------------------------------------------------------------------------------------------
Demo Full Explanation ->

Project Directory Structure -> Java 

FreshFruits-Platform/
│
├── backend/
│   ├── routes/
│   │   ├── shipping.js
│   │   ├── document.js
│   │   └── query.js
│   ├── models/
│   │   └── Query.js
│   ├── controllers/
│   │   ├── shippingController.js
│   │   ├── documentController.js
│   │   └── queryController.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Shipping.js
│   │   │   ├── DocumentUpload.js
│   │   │   └── QueryManager.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
├── Dockerfile
└── README.md

Backend Setup
1. Installing Dependencies -> bash

cd backend
npm init -y
npm install express mongoose axios dotenv multer aws-sdk cors

2. Environment Configuration (.env file) -> makefile

PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/FreshFruitsDB
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
S3_BUCKET=<your-bucket-name>

3.  Backend Code (Simplified) -> javascript

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shippingRouter = require('./routes/shipping');
const documentRouter = require('./routes/document');
const queryRouter = require('./routes/query');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error", err));

// Define routes
app.use('/api/shipping', shippingRouter);
app.use('/api/documents', documentRouter);
app.use('/api/query', queryRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

routes/shipping.js (Shipping Rate Retrieval): -> javascript

const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

// Fetch shipping rates
router.post('/getRates', shippingController.getRates);

module.exports = router;

controllers/shippingController.js (Shipping API Logic): -> javascript

const axios = require('axios');

exports.getRates = async (req, res) => {
  const { origin, destination, weight } = req.body;

  try {
    const response = await axios.post('https://api.shipping.com/getRates', {
      origin, destination, weight
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rates' });
  }
};

routes/document.js (Document Upload to AWS S3): -> javascript

const express = require('express');
const router = express.Router();
const multer = require('multer');
const documentController = require('../controllers/documentController');

// File upload using multer
const upload = multer();

router.post('/upload', upload.single('file'), documentController.uploadFile);

module.exports = router;

controllers/documentController.js (Document Upload Logic): -> javascript

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.uploadFile = (req, res) => {
  const file = req.file;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: file.originalname,
    Body: file.buffer,
  };

  s3.upload(params, (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: 'File uploaded successfully', data });
  });
};


routes/query.js (Query Management): -> javascript

const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// Create a new query
router.post('/new', queryController.createQuery);

// Update a query status
router.put('/update/:id', queryController.updateQueryStatus);

module.exports = router;


controllers/queryController.js (Query Logic): -> javascript

const Query = require('../models/Query');

// Create a new query
exports.createQuery = async (req, res) => {
  const { issue, orderId } = req.body;

  const newQuery = new Query({
    issue,
    orderId,
    status: 'open',
  });

  try {
    const savedQuery = await newQuery.save();
    res.status(200).json(savedQuery);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update query status
exports.updateQueryStatus = async (req, res) => {
  const { status } = req.body;
  const queryId = req.params.id;

  try {
    const updatedQuery = await Query.findByIdAndUpdate(queryId, { status }, { new: true });
    res.status(200).json(updatedQuery);
  } catch (err) {
    res.status(500).json(err);
  }
};


models/Query.js (MongoDB Schema for Queries): -> javascript

const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  issue: String,
  orderId: String,
  status: { type: String, default: 'open' },
});

module.exports = mongoose.model('Query', querySchema);


Frontend Setup
1. Installing Dependencies -> bash

cd frontend
npx create-react-app .
npm install axios

2. Frontend Code -> javascript

import React from 'react';
import Shipping from './components/Shipping';
import DocumentUpload from './components/DocumentUpload';
import QueryManager from './components/QueryManager';

function App() {
  return (
    <div className="App">
      <h1>FreshFruits Ltd. Export Platform</h1>
      <Shipping />
      <DocumentUpload />
      <QueryManager />
    </div>
  );
}

export default App;

components/Shipping.js (Shipping Rate Checker): -> javascript

import React, { useState } from 'react';
import axios from 'axios';

function Shipping() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [rates, setRates] = useState(null);

  const fetchRates = async () => {
    try {
      const response = await axios.post('/api/shipping/getRates', { origin, destination, weight });
      setRates(response.data);
    } catch (error) {
      console.error('Error fetching rates', error);
    }
  };

  return (
    <div>
      <h2>Shipping Rate Checker</h2>
      <input type="text" placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
      <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
      <input type="number" placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <button onClick={fetchRates}>Get Rates</button>

      {rates && <pre>{JSON.stringify(rates, null, 2)}</pre>}
    </div>
  );
}

export default Shipping;

components/DocumentUpload.js (Document Upload): -> javascript

import React, { useState } from 'react';
import axios from 'axios';

function DocumentUpload() {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <div>
      <h2>Upload Export Documents</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
}

export default DocumentUpload;

components/QueryManager.js (Query Management): -> javascript

import React, { useState } from 'react';
import axios from 'axios';

function QueryManager() {
  const [issue, setIssue] = useState('');
  const [orderId, setOrderId] = useState('');
  const [queryId, setQueryId] = useState('');
  const [status, setStatus] = useState('');

  const createQuery = async () => {
    try {
      await axios.post('/api/query/new', { issue, orderId });
      alert('Query created successfully');
    } catch (error) {
      console.error('Error creating query', error);
    }
  };

  const updateQuery = async () => {
    try {
      await axios.put(`/api/query/update/${queryId}`, { status });
      alert('Query updated successfully');
    } catch (error) {
      console.error('Error updating query', error);
    }
  };

  return (
    <div>
      <h2>Query Management</h2>
      <input type="text" placeholder="Issue" value={issue} onChange={(e) => setIssue(e.target.value)} />
      <input type="text" placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
      <button onClick={createQuery}>Create Query</button>

      <input type="text" placeholder="Query ID" value={queryId} onChange={(e) => setQueryId(e.target.value)} />
      <input type="text" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
      <button onClick={updateQuery}>Update Query</button>
    </div>
  );
}

export default QueryManager;

Docker Setup ->
Dockerfile (Backend and Frontend) -> dockerfile
# Backend Dockerfile
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend/ .

# Expose port
EXPOSE 3000

# Start backend server
CMD ["npm", "start"]

docker-compose.yml (For Both Frontend and Backend) -> yaml

version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - backend/.env
    depends_on:
      - mongo

  frontend:
    build:
      context: frontend
    dockerfile: Dockerfile
    ports:
      - "3001:3001"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example

-------------------------------------------------------------------------------------------------------------------------------x----------------------------------------------------------------------------------------------------------------

Deployment Steps ->

Build and Start the Application: -> bash

docker-compose up --build

Access the Frontend ->

Go to http://localhost:3001 in your browser.

Backend ->

The backend will be running on http://localhost:3000.

Conclusion: ->

This platform provides FreshFruits Ltd. with the following key features: ->

i) Shipping Rate Checker: Compare rates from various carriers.
ii) Document Management: Upload and manage export documents.
iii) Query Management: Handle customer or shipment-related issues efficiently.
---------------------------------------------------------------------------------------------------------------------------x------------------------------------------------------------------------------------------------------------------------
