export const currentUser = {
  id: "u1",
  name: "Eli",
  handle: "@eli",
  avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=eli&backgroundColor=f59e0b",
  stats: { meals: 47, friends: 23, avgSpend: 38 },
  venmo: "@eli-v",
  cashapp: "$eli",
};

export const friends = [
  {
    id: "f1",
    name: "Sofia",
    handle: "@sofia",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=sofia&backgroundColor=ea580c",
    venmo: "@sofia-v",
  },
  {
    id: "f2",
    name: "Marcus",
    handle: "@marcus",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=marcus&backgroundColor=16a34a",
    venmo: "@marcus-v",
  },
  {
    id: "f3",
    name: "Jade",
    handle: "@jade",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=jade&backgroundColor=7c3aed",
    venmo: "@jade-v",
  },
  {
    id: "f4",
    name: "Tyler",
    handle: "@tyler",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=tyler&backgroundColor=0891b2",
    venmo: "@tyler-v",
  },
];

export const pastMeals = [
  {
    id: "m1",
    restaurant: "Fuego & Sol Mexican",
    date: "Aug 28",
    total: 127.5,
    your_share: 31.88,
    party: ["eli", "f1", "f2", "f3"],
    emoji: "🌮",
    status: "paid",
    split_method: "even",
    items: ["Street Tacos x3", "Guac & Chips", "Margarita", "Enchiladas"],
    photos: [],
  },
  {
    id: "m2",
    restaurant: "Sushi Roku",
    date: "Aug 22",
    total: 210.0,
    your_share: 52.5,
    party: ["eli", "f4", "f1"],
    emoji: "🍣",
    status: "paid",
    split_method: "by_item",
    items: ["Omakase Set", "Sake", "Edamame", "Dragon Roll", "Toro Nigiri x4"],
    photos: [],
  },
  {
    id: "m3",
    restaurant: "Brunch Bar",
    date: "Aug 15",
    total: 89.0,
    your_share: 22.25,
    party: ["eli", "f2", "f3"],
    emoji: "🥞",
    status: "paid",
    split_method: "gamble",
    winner: "Sofia",
    items: ["Avocado Toast", "Mimosa Carafe", "Eggs Benedict", "Cold Brew x2"],
    photos: [],
  },
];

export const receiptItems = [
  { id: "i1", name: "Spicy Tuna Roll", price: 18.0, assignedTo: [] as string[] },
  { id: "i2", name: "Wagyu Sliders (x2)", price: 32.0, assignedTo: [] as string[] },
  { id: "i3", name: "Truffle Fries", price: 14.0, assignedTo: [] as string[] },
  { id: "i4", name: "Calamari", price: 16.0, assignedTo: [] as string[] },
  { id: "i5", name: "Craft Cocktail x2", price: 28.0, assignedTo: [] as string[] },
  { id: "i6", name: "Caesar Salad", price: 13.0, assignedTo: [] as string[] },
  { id: "i7", name: "Ribeye Steak", price: 54.0, assignedTo: [] as string[] },
  { id: "i8", name: "Crème Brûlée", price: 12.0, assignedTo: [] as string[] },
];

export const receiptTotal = receiptItems.reduce((s, i) => s + i.price, 0); // 187

export const gambleModes = [
  {
    id: "plinko",
    name: "Plinko",
    emoji: "🎯",
    description: "Drop balls — where they land = what you owe",
    risk: "Medium",
  },
  {
    id: "roulette",
    name: "Roulette",
    emoji: "🎡",
    description: "Spin the wheel — your slice = your share",
    risk: "Medium",
  },
  {
    id: "coinflip",
    name: "Coin Flip",
    emoji: "🪙",
    description: "Heads wins — loser pays double",
    risk: "High",
  },
  {
    id: "halfoff",
    name: "Half-Off Roulette",
    emoji: "💸",
    description: "One random person gets 50% off",
    risk: "Low",
  },
];

export const splitMethods = [
  {
    id: "even",
    name: "Split Even",
    emoji: "⚖️",
    description: "Divide the total equally among everyone",
  },
  {
    id: "by_item",
    name: "By Item",
    emoji: "🍽️",
    description: "Assign each item to the person who ordered it",
  },
  {
    id: "custom",
    name: "Custom",
    emoji: "✏️",
    description: "Enter a custom amount for each person",
  },
  {
    id: "gamble",
    name: "Gamble Pay",
    emoji: "🎲",
    description: "Play a game to decide who owes what",
  },
];

export const paymentMethods = [
  { id: "venmo", name: "Venmo", color: "#008CFF", emoji: "💙" },
  { id: "cashapp", name: "Cash App", color: "#00C244", emoji: "💚" },
  { id: "applepay", name: "Apple Pay", color: "#000000", emoji: "🍎" },
  { id: "zelle", name: "Zelle", color: "#6B21A8", emoji: "💜" },
];

export const tableMessages = [
  { id: "msg1", sender: "Sofia", text: "omg that wagyu 😭", time: "8:47 PM", type: "message" },
  { id: "msg2", sender: "Marcus", text: "someone order the truffle fries again pls", time: "8:49 PM", type: "message" },
  { id: "msg3", sender: "system", text: "Eli started the check", time: "9:12 PM", type: "system" },
  { id: "msg4", sender: "Jade", text: "finally lol", time: "9:12 PM", type: "message" },
  { id: "msg5", sender: "system", text: "✅ All payments received — Meal ended", time: "9:28 PM", type: "system" },
];
