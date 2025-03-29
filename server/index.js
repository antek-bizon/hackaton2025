
const express = require('express');
const sqlite = require('sqlite-async')
const app = express()
const PORT = process.env.PORT || 3000
let db
createDatabase()
  .then((_db) => {
    db = _db
    console.log('Database ready')
  })

async function createDatabase() {
  const db = await sqlite.Database.open('./db.sql')
  await db.run(`CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    cuisine TEXT,
    price_range TEXT,
    address TEXT,
    openingHours TEXT,
    image_url: TEXT,
  )`)
  await Promise.all([
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      review TEXT NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 10),
      data TEXT,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    )`),
    db.run(`CREATE TABLE IF NOT EXISTS cache (
      restaurant_id INTEGER NOT NULL,
      result TEXT NOT NULL,
      creation_date INTEGER NOT NULL,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
      )`),
    db.run(`CREATE TABLE IF NOT EXISTS queue (
        restaurant_id INTEGER NOT NULL,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
        )`)
  ])
  return db
}

async function makeAIRequest() {
  // TODO
  return JSON.stringify({ todo: 'todo' })
}

function jsonResponse({ message = 'Success', status = 200, data = {} }) {
  return { message, status, data }
}

async function getRestaurantScore(id) {
  const caches = await db.all('SELECT * FROM cache WHERE restaurant_id = ?', [id])
  if (caches.length > 0) {
    return jsonResponse({ data: caches[0] })
  }
  const queue_items = await db.all('SELECT * FROM queue WHERE restaurant_id = ?', [id])

  if (queue_items.length < 1) {
    // If not in cache or queue make a request to AI
    const reviews = db.all('SELECT * FROM reviews WHERE restaurant_id = ?')
    const result = Promise.all([
      db.run('INSERT INTO queue VALUES (?)', [id]),
      makeAIRequest(reviews)]).then((results) => {
        db.run('INSERT INTO cache VALUES (?, ?, ?)'[id, results[1], Date.now()])
      })
  }

  return jsonResponse({ message: 'Please wait, your request is still in progress' })
}

function handleError(res, err) {
  console.error(`[SERVER] Error: ${err.message}`);
  res.status(500).send(jsonResponse({ message: 'Something went wrong!', status: 500 }))
}

app.get('/api/restaurants', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM restaurants', [])
    res.json(rows)
  } catch (err) {
    handleError(res, err)
  }
})


app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const id = req.params.id
    const does_exist = await db.all('SELECT id FROM restaurants WHERE id = ?', [id])
    if (does_exist.length > 0) {
      const result = await getRestaurantScore(id)
      res.json(result)
    } else {
      res.status(400).json(jsonResponse({ message: 'Invalid restaurant id', status: 400 }))
    }
  } catch (err) {
    handleError(res, err)
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
