export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Restaurant {
  id: string;
  name: string;
  rating: Rating;
  description: string;
  cuisine: string;
  priceRange: 'budget' | 'moderate' | 'luxury';
  address: string;
  isOpen: boolean;
  imageUrl: string;
  reviews: {
    rating: Rating;
    comment: string;
    date: string;
  }[];
}

export const restaurants: Restaurant[] = [
  {
    id: 'tasty-corner',
    name: 'The Tasty Corner',
    rating: 4,
    description: 'Welcome to The Tasty Corner, where culinary excellence meets comfort. Our restaurant offers a unique blend of traditional and modern cuisine, prepared with the finest ingredients by our expert chefs.',
    cuisine: 'French',
    priceRange: 'moderate',
    address: '123 Main St, City',
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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
    isOpen: true,
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