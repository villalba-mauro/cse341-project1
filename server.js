const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Variable global para la base de datos
let db;

// Función para conectar a MongoDB
async function connectToDatabase() {
  try {
    console.log('Intentando conectar a MongoDB...');
    
    // Crear cliente de MongoDB usando la URI del archivo .env
    const client = new MongoClient(process.env.MONGODB_URI);
    
    // Conectar al cliente
    await client.connect();
    console.log('✅ Conectado exitosamente a MongoDB Atlas');
    
    // Seleccionar la base de datos
    db = client.db('contactsDB');
    
    // Hacer la conexión disponible globalmente para las rutas
    global.db = db;
    
    console.log('📦 Base de datos "contactsDB" seleccionada');
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    
    // Ayuda para errores comunes
    if (error.message.includes('authentication failed')) {
      console.log('💡 Verifica tu username y password en el archivo .env');
    } else if (error.message.includes('connection')) {
      console.log('💡 Verifica tu conexión a internet y Network Access en MongoDB Atlas');
    }
    
    // Terminar la aplicación si no se puede conectar
    process.exit(1);
  }
}

// Step 2: Ruta Hello World (como requiere la tarea)
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Step 4: Usar las rutas de contacts (archivo separado)
app.use('/', require('./routes/contacts'));

// Función para iniciar el servidor
async function startServer() {
  // Primero conectar a la base de datos
  await connectToDatabase();
  
  // Luego iniciar el servidor
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌐 Visit: http://localhost:${port}`);
    console.log(`📋 API endpoints available:`);
    console.log(`   GET /              - Hello World`);
    console.log(`   GET /contacts      - Get all contacts`);
    console.log(`   GET /contacts/:id  - Get contact by ID`);
  });
}

// Iniciar la aplicación
console.log('🎯 Starting CSE341 Project 1 - Contacts API...');
startServer();
