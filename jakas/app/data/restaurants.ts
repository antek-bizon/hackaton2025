export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  description: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

export const restaurants: Restaurant[] = [
  {
    id: 'tasty-corner',
    name: 'The Tasty Corner',
    rating: 8,
    description: 'Welcome to The Tasty Corner, where culinary excellence meets comfort. Our restaurant offers a unique blend of traditional and modern cuisine, prepared with the finest ingredients by our expert chefs.',
    reviews: [
      {
        id: '1',
        author: 'John Doe',
        rating: 9,
        comment: 'Amazing food and great service!',
      },
      {
        id: '2',
        author: 'Jane Smith',
        rating: 7,
        comment: 'Good atmosphere but a bit pricey.',
      },
    ],
  },
  {
    id: 'golden-plate',
    name: 'Golden Plate Bistro',
    rating: 9,
    description: 'Experience luxury dining at its finest. Golden Plate Bistro combines French culinary techniques with local ingredients to create unforgettable dishes.',
    reviews: [
      {
        id: '3',
        author: 'Michael Brown',
        rating: 10,
        comment: 'Absolutely perfect evening! The wine pairing was exceptional.',
      },
      {
        id: '4',
        author: 'Sarah Wilson',
        rating: 8,
        comment: 'Beautiful presentation and exquisite flavors.',
      },
    ],
  },
  {
    id: 'spice-garden',
    name: 'Spice Garden',
    rating: 7,
    description: 'Authentic Indian cuisine in a warm, welcoming atmosphere. Our chefs bring traditional recipes to life with modern techniques.',
    reviews: [
      {
        id: '5',
        author: 'David Lee',
        rating: 8,
        comment: 'Best butter chicken in town!',
      },
      {
        id: '6',
        author: 'Emma Davis',
        rating: 6,
        comment: 'Good food but service was slow.',
      },
    ],
  },
  {
    id: 'ocean-view',
    name: 'Ocean View Seafood',
    rating: 9,
    description: 'Fresh seafood with stunning ocean views. Our daily catch is prepared to perfection with Mediterranean influences.',
    reviews: [
      {
        id: '7',
        author: 'Robert Taylor',
        rating: 9,
        comment: 'Fresh seafood and amazing sunset views!',
      },
      {
        id: '8',
        author: 'Lisa Anderson',
        rating: 9,
        comment: 'Perfect date night spot.',
      },
    ],
  },
  {
    id: 'urban-grill',
    name: 'Urban Grill House',
    rating: 8,
    description: 'Modern steakhouse with a focus on premium cuts and craft cocktails. Our dry-aged beef is a must-try.',
    reviews: [
      {
        id: '9',
        author: 'James Wilson',
        rating: 9,
        comment: 'Best steak in the city!',
      },
      {
        id: '10',
        author: 'Maria Garcia',
        rating: 7,
        comment: 'Great atmosphere, slightly expensive.',
      },
    ],
  },
  {
    id: 'sushi-master',
    name: 'Sushi Master',
    rating: 9,
    description: 'Authentic Japanese cuisine with master sushi chefs. Experience the art of sushi-making in an intimate setting.',
    reviews: [
      {
        id: '11',
        author: 'Thomas Chen',
        rating: 10,
        comment: 'Omakase experience was incredible!',
      },
      {
        id: '12',
        author: 'Sophie Kim',
        rating: 8,
        comment: 'Fresh fish and perfect rice.',
      },
    ],
  },
  {
    id: 'pizza-paradise',
    name: 'Pizza Paradise',
    rating: 7,
    description: 'Neapolitan-style pizza made in traditional wood-fired ovens. Fresh ingredients and authentic Italian recipes.',
    reviews: [
      {
        id: '13',
        author: 'Alex Thompson',
        rating: 8,
        comment: 'Authentic Italian pizza!',
      },
      {
        id: '14',
        author: 'Rachel Green',
        rating: 6,
        comment: 'Good pizza but limited seating.',
      },
    ],
  },
  {
    id: 'thai-spice',
    name: 'Thai Spice Kitchen',
    rating: 8,
    description: 'Authentic Thai cuisine with bold flavors and fresh ingredients. Our curries are made from scratch daily.',
    reviews: [
      {
        id: '15',
        author: 'Kevin Wong',
        rating: 9,
        comment: 'Best Pad Thai in town!',
      },
      {
        id: '16',
        author: 'Amanda White',
        rating: 7,
        comment: 'Spicy but delicious!',
      },
    ],
  },
  {
    id: 'veggie-delight',
    name: 'Veggie Delight',
    rating: 8,
    description: 'Plant-based cuisine that will change your mind about vegetarian food. Creative dishes made with seasonal ingredients.',
    reviews: [
      {
        id: '17',
        author: 'Laura Smith',
        rating: 9,
        comment: 'Even meat-lovers will love this place!',
      },
      {
        id: '18',
        author: 'Chris Johnson',
        rating: 7,
        comment: 'Great vegan options.',
      },
    ],
  },
  {
    id: 'taco-fiesta',
    name: 'Taco Fiesta',
    rating: 7,
    description: 'Authentic Mexican street food with a modern twist. Our tacos are made with fresh tortillas and premium ingredients.',
    reviews: [
      {
        id: '19',
        author: 'Carlos Rodriguez',
        rating: 8,
        comment: 'Authentic Mexican flavors!',
      },
      {
        id: '20',
        author: 'Nina Patel',
        rating: 6,
        comment: 'Good tacos but service could be better.',
      },
    ],
  },
]; 