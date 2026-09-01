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

// PaymentStatus: "paid" | "not_paid" | "awaiting_cash"
export type PaymentStatus = "paid" | "not_paid" | "awaiting_cash";

// SplitMethod: "even" | "by_item" | "custom" | "plinko" | "roulette"
export type SplitMethod = "even" | "by_item" | "custom" | "plinko" | "roulette";

export interface MealReceiptLine {
  name: string;
  price: number;
}

export interface MealPerson {
  id: string;
  name: string;
  avatar: string;
  items: string[];
  amountPaid: number;
  paymentMethodId: string; // matches paymentMethods.id
  status: PaymentStatus;
}

export interface PastMeal {
  id: string;
  restaurant: string;
  date: string;
  scanned: boolean;
  receiptPhoto?: string; // url or null when not scanned
  receipt: {
    items: MealReceiptLine[];
    subtotal: number;
    tax: number;
    total: number;
  };
  people: MealPerson[];
  splitMethod: SplitMethod;
  loser?: string; // for plinko / roulette — the person who paid the most / lost
  yourShare: number;
  // party is a convenience list of person ids for the recent-meals summary
  party: string[];
}

export const pastMeals: PastMeal[] = [
  {
    id: "m1",
    restaurant: "Fuego & Sol Mexican",
    date: "Aug 28",
    scanned: true,
    receiptPhoto:
      "https://api.dicebear.com/7.x/shapes/svg?seed=receipt-fuego&backgroundColor=fff8f1",
    receipt: {
      items: [
        { name: "Street Tacos x3", price: 24 },
        { name: "Guac & Chips", price: 12 },
        { name: "Margarita x2", price: 22 },
        { name: "Enchiladas", price: 18 },
        { name: "Carne Asada", price: 32 },
        { name: "Horchata", price: 6 },
      ],
      subtotal: 114,
      tax: 13.5,
      total: 127.5,
    },
    people: [
      {
        id: "u1",
        name: "Eli",
        avatar: currentUser.avatar,
        items: ["Street Tacos x3", "Horchata"],
        amountPaid: 31.88,
        paymentMethodId: "applepay",
        status: "paid",
      },
      {
        id: "f1",
        name: "Sofia",
        avatar: friends[0].avatar,
        items: ["Carne Asada", "Margarita x2"],
        amountPaid: 31.88,
        paymentMethodId: "venmo",
        status: "paid",
      },
      {
        id: "f2",
        name: "Marcus",
        avatar: friends[1].avatar,
        items: ["Enchiladas", "Guac & Chips"],
        amountPaid: 31.87,
        paymentMethodId: "cashapp",
        status: "paid",
      },
      {
        id: "f3",
        name: "Jade",
        avatar: friends[2].avatar,
        items: ["Guac & Chips (share)"],
        amountPaid: 31.87,
        paymentMethodId: "zelle",
        status: "paid",
      },
    ],
    splitMethod: "even",
    yourShare: 31.88,
    party: ["u1", "f1", "f2", "f3"],
  },
  {
    id: "m2",
    restaurant: "Sushi Roku",
    date: "Aug 22",
    scanned: true,
    receiptPhoto:
      "https://api.dicebear.com/7.x/shapes/svg?seed=receipt-sushi&backgroundColor=fff8f1",
    receipt: {
      items: [
        { name: "Omakase Set", price: 95 },
        { name: "Sake", price: 24 },
        { name: "Edamame", price: 8 },
        { name: "Dragon Roll", price: 22 },
        { name: "Toro Nigiri x4", price: 44 },
      ],
      subtotal: 193,
      tax: 17,
      total: 210,
    },
    people: [
      {
        id: "u1",
        name: "Eli",
        avatar: currentUser.avatar,
        items: ["Dragon Roll", "Edamame"],
        amountPaid: 32,
        paymentMethodId: "applepay",
        status: "paid",
      },
      {
        id: "f4",
        name: "Tyler",
        avatar: friends[3].avatar,
        items: ["Omakase Set", "Sake"],
        amountPaid: 125.5,
        paymentMethodId: "venmo",
        status: "paid",
      },
      {
        id: "f1",
        name: "Sofia",
        avatar: friends[0].avatar,
        items: ["Toro Nigiri x4"],
        amountPaid: 52.5,
        paymentMethodId: "cashapp",
        status: "paid",
      },
    ],
    splitMethod: "by_item",
    yourShare: 32,
    party: ["u1", "f4", "f1"],
  },
  {
    id: "m3",
    restaurant: "Brunch Bar",
    date: "Aug 15",
    scanned: false, // manual entry — no receipt photo
    receipt: {
      items: [
        { name: "Avocado Toast", price: 16 },
        { name: "Mimosa Carafe", price: 32 },
        { name: "Eggs Benedict", price: 22 },
        { name: "Cold Brew x2", price: 12 },
      ],
      subtotal: 82,
      tax: 7,
      total: 89,
    },
    people: [
      {
        id: "u1",
        name: "Eli",
        avatar: currentUser.avatar,
        items: ["(rolled — winner)"],
        amountPaid: 0,
        paymentMethodId: "applepay",
        status: "paid",
      },
      {
        id: "f2",
        name: "Marcus",
        avatar: friends[1].avatar,
        items: ["(rolled)"],
        amountPaid: 22.25,
        paymentMethodId: "venmo",
        status: "paid",
      },
      {
        id: "f3",
        name: "Jade",
        avatar: friends[2].avatar,
        items: ["(lost — paid full)"],
        amountPaid: 44.5,
        paymentMethodId: "cash",
        status: "awaiting_cash",
      },
      {
        id: "f1",
        name: "Sofia",
        avatar: friends[0].avatar,
        items: ["(rolled)"],
        amountPaid: 22.25,
        paymentMethodId: "cashapp",
        status: "not_paid",
      },
    ],
    splitMethod: "plinko",
    loser: "Jade",
    yourShare: 0,
    party: ["u1", "f2", "f3", "f1"],
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

// Scanned restaurant name mock — surfaces on ItemsDetected
export const scannedRestaurantName = "Blue Plate Diner";

// Mock: the current user's per-person share of the current in-progress split.
// Used by the tip-phase screen. Kept as a stable number for prototype math.
export const currentUserShare = 12.5;

// Mock leader dashboard participants for the LeaderDashboard screen.
export interface LeaderDashboardParticipant {
  id: string;
  name: string;
  avatar: string;
  share: number;    // bill share (pre-tip)
  tip: number;      // their chosen tip amount
  paymentMethodId: string;
  status: PaymentStatus;
}

export const leaderDashboardParticipants: LeaderDashboardParticipant[] = [
  {
    id: currentUser.id,
    name: "Eli (you)",
    avatar: currentUser.avatar,
    share: 12.5,
    tip: 2.5,
    paymentMethodId: "applepay",
    status: "paid",
  },
  {
    id: friends[0].id,
    name: "Sofia",
    avatar: friends[0].avatar,
    share: 12.5,
    tip: 2.25,
    paymentMethodId: "venmo",
    status: "paid",
  },
  {
    id: friends[1].id,
    name: "Marcus",
    avatar: friends[1].avatar,
    share: 12.5,
    tip: 3.13,
    paymentMethodId: "cashapp",
    status: "not_paid",
  },
  {
    id: friends[2].id,
    name: "Jade",
    avatar: friends[2].avatar,
    share: 12.5,
    tip: 2,
    paymentMethodId: "cash",
    status: "awaiting_cash",
  },
];

export const gambleModes: {
  id: string;
  name: string;
  description: string;
  risk: string;
}[] = [
  {
    id: "plinko",
    name: "Plinko",
    description: "Drop balls — where they land = what you owe",
    risk: "Medium",
  },
  {
    id: "roulette",
    name: "Spin the Wheel",
    description: "Spin the wheel — your slice = your share",
    risk: "Medium",
  },
];

export const splitMethods = [
  {
    id: "even",
    name: "Split Even",
    description: "Divide the total equally among everyone",
  },
  {
    id: "by_item",
    name: "By Item",
    description: "Assign each item to the person who ordered it",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Enter a custom amount for each person",
  },
  {
    id: "gamble",
    name: "Gamble Pay",
    description: "Play a game to decide who owes what",
  },
];

export const paymentMethods: {
  id: string;
  name: string;
  color: string;
}[] = [
  { id: "applepay", name: "Apple Pay", color: "#000000" },
  { id: "cashapp", name: "Cash App", color: "#00C244" },
  { id: "venmo", name: "Venmo", color: "#008CFF" },
  { id: "zelle", name: "Zelle", color: "#6B21A8" },
  { id: "paypal", name: "PayPal", color: "#003087" },
  { id: "cash", name: "Cash", color: "#4b5563" },
];

export const splitMethodLabels: Record<SplitMethod, string> = {
  even: "Split evenly",
  by_item: "By item",
  custom: "Custom split",
  plinko: "Plinko",
  roulette: "Spin the Wheel",
};

// Mock notifications inbox
export interface InboxNotification {
  id: string;
  type: "added_to_split" | "time_to_pay" | "marked_as_paid" | "friend_request";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export const inboxNotifications: InboxNotification[] = [
  {
    id: "n1",
    type: "added_to_split",
    title: "Sofia added you to a split",
    body: "Fuego & Sol Mexican · 4 people",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    type: "time_to_pay",
    title: "Time to pay Marcus",
    body: "$31.88 for Brunch Bar · Tap to send",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n3",
    type: "marked_as_paid",
    title: "Jade marked you as paid",
    body: "Sushi Roku · $32.00",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n4",
    type: "friend_request",
    title: "Tyler added you as a friend",
    body: "You can now split meals together",
    time: "2d ago",
    unread: false,
  },
];
