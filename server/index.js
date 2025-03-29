const express = require('express');
const sqlite = require('sqlite-async')
const app = express()
const PORT = process.env.PORT || 3000
let db
createDatabase()
  .then((_db) => {
    db = _db
    console.log('Database ready')
    addData(db)
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
    opening_hours TEXT,
    image_url TEXT
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
      date INTEGER NOT NULL,
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


async function addData(db) {
  const defaultOpeningHours = JSON.stringify({
    open: '10:00',
    close: '22:00'
  });

  const nightHours = JSON.stringify({
    open: '23:00',
    close: '05:00'
  });

  const closedRestaurantHours = JSON.stringify({
    open: '00:00',
    close: '00:00'
  });

  const weekendOnlyHours = JSON.stringify({
    open: '11:00',
    close: '23:00'
  });

  const restaurants = [
    {
      id: 'tasty-corner',
      name: 'The Tasty Corner',
      rating: 4,
      description: 'Welcome to The Tasty Corner, where culinary excellence meets comfort. Our restaurant offers a unique blend of traditional and modern cuisine, prepared with the finest ingredients by our expert chefs.',
      cuisine: 'French',
      priceRange: 'moderate',
      address: '123 Main St, City',
      openingHours: defaultOpeningHours,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      reviews: [
        {
          rating: 5,
          comment: 'Amazing food and great service!',
          date: '2024-04-01'
        },
        {
          rating: 4,
          comment: 'Good atmosphere but a bit pricey.',
          date: '2024-03-30'
        }
      ]
    },
    {
      id: 'golden-plate',
      name: 'Golden Plate Bistro',
      rating: 5,
      description: 'Experience luxury dining at its finest. Golden Plate Bistro combines French culinary techniques with local ingredients to create unforgettable dishes.',
      cuisine: 'French',
      priceRange: 'luxury',
      address: '456 Elm St, City',
      openingHours: defaultOpeningHours,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
      reviews: [
        {
          rating: 5,
          comment: 'Absolutely perfect evening! The wine pairing was exceptional.',
          date: '2024-04-02'
        },
        {
          rating: 4,
          comment: 'Beautiful presentation and exquisite flavors.',
          date: '2024-03-31'
        }
      ]
    },
    {
      id: 'spice-garden',
      name: 'Spice Garden',
      rating: 4,
      description: 'Authentic Indian cuisine in a warm, welcoming atmosphere. Our chefs bring traditional recipes to life with modern techniques.',
      cuisine: 'Indian',
      priceRange: 'moderate',
      address: '789 Oak St, City',
      openingHours: defaultOpeningHours,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
      reviews: [
        {
          rating: 5,
          comment: 'Best butter chicken in town!',
          date: '2024-04-03'
        },
        {
          rating: 3,
          comment: 'Good food but service was slow.',
          date: '2024-03-30'
        }
      ]
    },
    {
      id: 'ocean-view',
      name: 'Ocean View Seafood',
      rating: 5,
      description: 'Fresh seafood with stunning ocean views. Our daily catch is prepared to perfection with Mediterranean influences.',
      cuisine: 'Mediterranean',
      priceRange: 'luxury',
      address: '101 Pine St, City',
      openingHours: defaultOpeningHours,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
      reviews: [
        {
          rating: 5,
          comment: 'Fresh seafood and amazing sunset views!',
          date: '2024-04-04'
        },
        {
          rating: 5,
          comment: 'Perfect date night spot.',
          date: '2024-04-05'
        }
      ]
    },
    {
      id: 'urban-grill',
      name: 'Urban Grill House',
      rating: 4,
      description: 'Modern steakhouse with a focus on premium cuts and craft cocktails. Our dry-aged beef is a must-try.',
      cuisine: 'American',
      priceRange: 'moderate',
      address: '202 Maple St, City',
      openingHours: defaultOpeningHours,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
      reviews: [
        {
          rating: 5,
          comment: 'Best steak in the city!',
          date: '2024-04-06'
        },
        {
          rating: 4,
          comment: 'Great atmosphere, slightly expensive.',
          date: '2024-04-07'
        }
      ]
    },
    {
      id: 'sushi-master',
      name: 'Sushi Master',
      rating: 5,
      description: 'Authentic Japanese cuisine with master sushi chefs. Experience the art of sushi-making in an intimate setting.',
      cuisine: 'Japanese',
      priceRange: 'luxury',
      address: '303 Birch St, City',
      openingHours: defaultOpeningHours,
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
      reviews: [
        {
          rating: 5,
          comment: 'Omakase experience was incredible!',
          date: '2024-04-08'
        },
        {
          rating: 4,
          comment: 'Fresh fish and perfect rice.',
          date: '2024-04-09'
        }
      ]
    },
    {
      id: 'pizza-paradise',
      name: 'Pizza Paradise',
      rating: 4,
      description: 'Neapolitan-style pizza made in traditional wood-fired ovens. Fresh ingredients and authentic Italian recipes.',
      cuisine: 'Italian',
      priceRange: 'budget',
      address: '404 Cedar St, City',
      openingHours: nightHours,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      reviews: [
        {
          rating: 4,
          comment: 'Authentic Italian pizza!',
          date: '2024-04-10'
        },
        {
          rating: 3,
          comment: 'Good pizza but limited seating.',
          date: '2024-04-11'
        }
      ]
    },
    {
      id: 'thai-spice',
      name: 'Thai Spice Kitchen',
      rating: 4,
      description: 'Authentic Thai cuisine with bold flavors and fresh ingredients. Our curries are made from scratch daily.',
      cuisine: 'Thai',
      priceRange: 'moderate',
      address: '505 Elm St, City',
      openingHours: weekendOnlyHours,
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
      reviews: [
        {
          rating: 5,
          comment: 'Best Pad Thai in town!',
          date: '2024-04-12'
        },
        {
          rating: 4,
          comment: 'Spicy but delicious!',
          date: '2024-04-13'
        }
      ]
    },
    {
      id: 'veggie-delight',
      name: 'Veggie Delight',
      rating: 4,
      description: 'Plant-based cuisine that will change your mind about vegetarian food. Creative dishes made with seasonal ingredients.',
      cuisine: 'Vegetarian',
      priceRange: 'budget',
      address: '606 Maple St, City',
      openingHours: defaultOpeningHours,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      reviews: [
        {
          rating: 5,
          comment: 'Even meat-lovers will love this place!',
          date: '2024-04-14'
        },
        {
          rating: 4,
          comment: 'Great vegan options.',
          date: '2024-04-15'
        }
      ]
    },
    {
      id: 'taco-fiesta',
      name: 'Taco Fiesta',
      rating: 4,
      description: 'Authentic Mexican street food with a modern twist. Our tacos are made with fresh tortillas and premium ingredients.',
      cuisine: 'Mexican',
      priceRange: 'budget',
      address: '707 Elm St, City',
      openingHours: defaultOpeningHours,
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
      reviews: [
        {
          rating: 4,
          comment: 'Authentic Mexican flavors!',
          date: '2024-04-16'
        },
        {
          rating: 3,
          comment: 'Good tacos but service could be better.',
          date: '2024-04-17'
        }
      ]
    }
  ]; 

  for (const restaurant of restaurants) {
    const id = await db.run(
      `INSERT OR IGNORE INTO restaurants (name, description, cuisine, price_range, address, opening_hours, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurant.name,
        restaurant.description,
        restaurant.cuisine,
        restaurant.priceRange,
        restaurant.address,
        restaurant.openingHours,
        restaurant.imageUrl
      ]
    );

    // for (const review of restaurant.reviews) {
    //   await db.run(
    //     `INSERT INTO reviews (restaurant_id, review, rating, date)
    //      VALUES (?, ?, ?, ?)`,
    //     [
    //       id,
    //       review.comment,
    //       review.rating,
    //       review.date
    //     ]
    //   );
    // }
  }
}