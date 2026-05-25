export type SituationLevel = "A1" | "A2" | "B1";

export type SituationCategory =
  | "airport"
  | "passport"
  | "hotel"
  | "restaurant"
  | "taxi"
  | "directions"
  | "shopping"
  | "payment"
  | "emergency"
  | "small-talk";

export type Situation = {
  id: string;
  level: SituationLevel;
  category: SituationCategory;
  image: string;
  prompt: string;
  targetMeaning: string;
  acceptableAnswers: string[];
  rescuePhrases: string[];
  followUpQuestion: string;
  idealAnswer: string;
};

export const situations: Situation[] = [
  {
    id: "hotel-checkin-001",
    level: "A2",
    category: "hotel",
    image: "/images/hotel.svg",
    prompt: "You are checking in at a hotel.",
    targetMeaning: "Say that you want to check in or that you have a reservation.",
    acceptableAnswers: [
      "I'd like to check in, please.",
      "I have a reservation.",
      "I have a reservation under Majed.",
      "I booked a room for two nights."
    ],
    rescuePhrases: ["Could you speak more slowly, please?", "Sorry, could you say that again?"],
    followUpQuestion: "Can I see your passport?",
    idealAnswer: "Sure, here it is."
  },
  {
    id: "hotel-key-002",
    level: "A2",
    category: "hotel",
    image: "/images/hotel.svg",
    prompt: "Your room key is not working.",
    targetMeaning: "Explain that the room key does not work and ask for help.",
    acceptableAnswers: [
      "My room key isn't working.",
      "Could you help me with my room key?",
      "The key card doesn't open my door.",
      "I think my key card has a problem."
    ],
    rescuePhrases: ["Could you check it, please?", "Could you repeat that, please?"],
    followUpQuestion: "What is your room number?",
    idealAnswer: "My room number is 412."
  },
  {
    id: "airport-checkin-003",
    level: "A2",
    category: "airport",
    image: "/images/airport.svg",
    prompt: "You are at the airline check-in desk.",
    targetMeaning: "Say that you want to check in for your flight.",
    acceptableAnswers: [
      "I'd like to check in for my flight.",
      "I'm checking in for my flight to London.",
      "Here is my passport.",
      "I have a flight today."
    ],
    rescuePhrases: ["Could you say that again?", "Where should I go next?"],
    followUpQuestion: "Do you have any bags to check?",
    idealAnswer: "Yes, I have one bag to check."
  },
  {
    id: "passport-control-004",
    level: "A2",
    category: "passport",
    image: "/images/passport.svg",
    prompt: "The passport officer asks why you are visiting.",
    targetMeaning: "Give a simple reason for your visit.",
    acceptableAnswers: [
      "I'm here for tourism.",
      "I'm visiting for a holiday.",
      "I'm here for a short business trip.",
      "I'm visiting my family."
    ],
    rescuePhrases: ["Could you repeat the question, please?", "I don't understand. Could you say it slowly?"],
    followUpQuestion: "How long will you stay?",
    idealAnswer: "I will stay for one week."
  },
  {
    id: "baggage-lost-005",
    level: "A2",
    category: "airport",
    image: "/images/airport.svg",
    prompt: "Your suitcase did not arrive.",
    targetMeaning: "Say that your bag is missing and ask for help.",
    acceptableAnswers: [
      "My suitcase didn't arrive.",
      "I can't find my bag.",
      "My luggage is missing.",
      "Could you help me find my suitcase?"
    ],
    rescuePhrases: ["Where is the baggage office?", "Could you help me fill out the form?"],
    followUpQuestion: "Can you describe your bag?",
    idealAnswer: "It is a black suitcase with a red tag."
  },
  {
    id: "restaurant-menu-006",
    level: "A1",
    category: "restaurant",
    image: "/images/restaurant.svg",
    prompt: "You sit down in a restaurant and need the menu.",
    targetMeaning: "Ask politely for the menu.",
    acceptableAnswers: [
      "Could I have the menu, please?",
      "Can I see the menu, please?",
      "May I have a menu, please?",
      "Could you bring me the menu?"
    ],
    rescuePhrases: ["Could you give me a minute?", "Could you recommend something?"],
    followUpQuestion: "Would you like anything to drink?",
    idealAnswer: "Yes, water, please."
  },
  {
    id: "restaurant-bill-007",
    level: "A1",
    category: "restaurant",
    image: "/images/restaurant.svg",
    prompt: "You finished eating and want to pay.",
    targetMeaning: "Ask for the bill or check.",
    acceptableAnswers: [
      "Could I have the bill, please?",
      "Can I get the check, please?",
      "I'd like to pay, please.",
      "Could you bring the bill?"
    ],
    rescuePhrases: ["Do you take cards?", "Can I pay by card?"],
    followUpQuestion: "Would you like to pay by cash or card?",
    idealAnswer: "By card, please."
  },
  {
    id: "taxi-airport-008",
    level: "A1",
    category: "taxi",
    image: "/images/taxi.svg",
    prompt: "You get into a taxi and need to go to the airport.",
    targetMeaning: "Tell the driver your destination.",
    acceptableAnswers: [
      "To the airport, please.",
      "Could you take me to the airport?",
      "I need to go to the airport.",
      "Please take me to the airport."
    ],
    rescuePhrases: ["How long will it take?", "How much will it cost?"],
    followUpQuestion: "Which terminal?",
    idealAnswer: "Terminal two, please."
  },
  {
    id: "taxi-receipt-009",
    level: "A2",
    category: "taxi",
    image: "/images/taxi.svg",
    prompt: "You paid for a taxi and need a receipt.",
    targetMeaning: "Ask for a receipt politely.",
    acceptableAnswers: [
      "Could I have a receipt, please?",
      "Can I get a receipt?",
      "May I have a receipt, please?",
      "I need a receipt, please."
    ],
    rescuePhrases: ["Could you write the amount?", "Could you say the price again?"],
    followUpQuestion: "Do you need it printed?",
    idealAnswer: "Yes, printed, please."
  },
  {
    id: "directions-station-010",
    level: "A2",
    category: "directions",
    image: "/images/directions.svg",
    prompt: "You are on the street and need the train station.",
    targetMeaning: "Ask for directions to the train station.",
    acceptableAnswers: [
      "Excuse me, where is the train station?",
      "How can I get to the train station?",
      "Could you tell me the way to the train station?",
      "Is the train station near here?"
    ],
    rescuePhrases: ["Could you show me on the map?", "Should I turn left or right?"],
    followUpQuestion: "Do you want to walk or take a taxi?",
    idealAnswer: "I'd like to walk."
  },
  {
    id: "shopping-size-011",
    level: "A1",
    category: "shopping",
    image: "/images/shopping.svg",
    prompt: "You are buying a shirt and need a different size.",
    targetMeaning: "Ask if they have another size.",
    acceptableAnswers: [
      "Do you have this in a medium?",
      "Do you have a larger size?",
      "Could I try a smaller size?",
      "Do you have this in another size?"
    ],
    rescuePhrases: ["Can I try it on?", "Where is the fitting room?"],
    followUpQuestion: "What size do you need?",
    idealAnswer: "I need a medium, please."
  },
  {
    id: "shopping-return-012",
    level: "A2",
    category: "shopping",
    image: "/images/shopping.svg",
    prompt: "You bought something yesterday and want to return it.",
    targetMeaning: "Say that you want to return the item.",
    acceptableAnswers: [
      "I'd like to return this, please.",
      "Can I return this item?",
      "I bought this yesterday, but I want to return it.",
      "This doesn't fit. Can I return it?"
    ],
    rescuePhrases: ["I have the receipt.", "What is your return policy?"],
    followUpQuestion: "Do you have the receipt?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "payment-card-013",
    level: "A1",
    category: "payment",
    image: "/images/payment.svg",
    prompt: "You are at the cashier and want to pay by card.",
    targetMeaning: "Ask or say that you want to pay by card.",
    acceptableAnswers: [
      "Can I pay by card?",
      "I'd like to pay by card.",
      "Do you take cards?",
      "Card, please."
    ],
    rescuePhrases: ["Is contactless okay?", "Can I have a receipt?"],
    followUpQuestion: "Credit or debit?",
    idealAnswer: "Credit, please."
  },
  {
    id: "payment-price-014",
    level: "A1",
    category: "payment",
    image: "/images/payment.svg",
    prompt: "You want to know the price.",
    targetMeaning: "Ask how much something costs.",
    acceptableAnswers: [
      "How much is it?",
      "How much does this cost?",
      "What's the price?",
      "Could you tell me the price?"
    ],
    rescuePhrases: ["Could you write it down?", "Is tax included?"],
    followUpQuestion: "It is twenty dollars. Is that okay?",
    idealAnswer: "Yes, that's okay."
  },
  {
    id: "emergency-pharmacy-015",
    level: "A2",
    category: "emergency",
    image: "/images/emergency.svg",
    prompt: "You have a headache and need help at a pharmacy.",
    targetMeaning: "Explain that you have a headache and ask for medicine.",
    acceptableAnswers: [
      "I have a headache. Do you have any medicine?",
      "Could you give me something for a headache?",
      "I need medicine for a headache.",
      "My head hurts. Can you help me?"
    ],
    rescuePhrases: ["How often should I take it?", "Are there any side effects?"],
    followUpQuestion: "Are you allergic to anything?",
    idealAnswer: "No, I'm not allergic to anything."
  },
  {
    id: "emergency-police-016",
    level: "A2",
    category: "emergency",
    image: "/images/emergency.svg",
    prompt: "You lost your wallet and need help.",
    targetMeaning: "Say that you lost your wallet and ask what to do.",
    acceptableAnswers: [
      "I lost my wallet.",
      "My wallet is missing.",
      "Could you help me? I lost my wallet.",
      "What should I do? I lost my wallet."
    ],
    rescuePhrases: ["Where is the police station?", "Can I file a report?"],
    followUpQuestion: "Where did you last see it?",
    idealAnswer: "I last saw it at the cafe."
  },
  {
    id: "smalltalk-weather-017",
    level: "A1",
    category: "small-talk",
    image: "/images/small-talk.svg",
    prompt: "Someone says the weather is nice today.",
    targetMeaning: "Reply naturally to a simple weather comment.",
    acceptableAnswers: [
      "Yes, it's beautiful today.",
      "It is nice, isn't it?",
      "Yes, the weather is great.",
      "I agree. It's a lovely day."
    ],
    rescuePhrases: ["Sorry, could you say that again?", "I'm still learning English."],
    followUpQuestion: "Do you like warm weather?",
    idealAnswer: "Yes, I like warm weather."
  },
  {
    id: "smalltalk-intro-018",
    level: "A1",
    category: "small-talk",
    image: "/images/small-talk.svg",
    prompt: "You meet someone for the first time.",
    targetMeaning: "Introduce yourself politely.",
    acceptableAnswers: [
      "Hi, my name is Majed.",
      "Nice to meet you. I'm Majed.",
      "Hello, I'm Majed.",
      "It's nice to meet you."
    ],
    rescuePhrases: ["Could you repeat your name?", "How do you spell that?"],
    followUpQuestion: "Where are you from?",
    idealAnswer: "I'm from Saudi Arabia."
  },
  {
    id: "restaurant-coffee-019",
    level: "A1",
    category: "restaurant",
    image: "/images/restaurant.svg",
    prompt: "You are ordering coffee.",
    targetMeaning: "Order a coffee politely.",
    acceptableAnswers: [
      "I'd like a coffee, please.",
      "Can I have a coffee, please?",
      "Could I get a latte, please?",
      "One coffee, please."
    ],
    rescuePhrases: ["Can I have it to go?", "Could I have it without sugar?"],
    followUpQuestion: "For here or to go?",
    idealAnswer: "To go, please."
  },
  {
    id: "phone-repeat-020",
    level: "A2",
    category: "small-talk",
    image: "/images/small-talk.svg",
    prompt: "You are on the phone and did not hear clearly.",
    targetMeaning: "Ask the other person to repeat what they said.",
    acceptableAnswers: [
      "Could you repeat that, please?",
      "Sorry, I didn't catch that.",
      "Could you say that again?",
      "Sorry, could you speak more slowly?"
    ],
    rescuePhrases: ["The line is not clear.", "Could you text me the address?"],
    followUpQuestion: "Can you hear me now?",
    idealAnswer: "Yes, I can hear you now."
  }
];
