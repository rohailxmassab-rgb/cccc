import { Category, MenuItem } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Burgers', icon: '🍔' },
  { id: '2', name: 'Pizza', icon: '🍕' },
  { id: '3', name: 'BBQ', icon: '🍖' },
  { id: '4', name: 'Drinks', icon: '🍹' },
  { id: '5', name: 'Desserts', icon: '🍰' },
  { id: '6', name: 'Fast Food', icon: '🍟' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'b1',
    name: 'Cyber Burger',
    description: 'A 24-hour aged wagyu beef patty with neon-infused cheddar and floating onion rings.',
    price: 24.99,
    category: 'Burgers',
    image: '/images/futuristic_burger_1779737076810.png',
    ingredients: ['Wagyu Beef', 'Neon Cheddar', 'Gluten-free floating bun', 'Secret sauce'],
    ratings: 4.9,
    available: true,
    isPopular: true,
  },
  {
    id: 'p1',
    name: 'Neon Quattro',
    description: 'Four-cheese pizza with glowing truffle oil and a carbonized thin crust.',
    price: 32.00,
    category: 'Pizza',
    image: '/images/neon_pizza_1779737100582.png',
    ingredients: ['Mozzarella', 'Gorgonzola', 'Parmesan', 'Glow Truffle'],
    ratings: 4.8,
    available: true,
    isPopular: true,
  },
  {
    id: 'd1',
    name: 'Zero Gravity Elixir',
    description: 'A molecular cocktail that stays suspended in air, infused with citrus and mint.',
    price: 18.50,
    category: 'Drinks',
    image: '/images/cyber_glow_drink_1779737123579.png',
    ingredients: ['Micro-bubbles', 'Citrus Peel', 'Ionized Water', 'Mint Leaf'],
    ratings: 5.0,
    available: true,
  },
];
