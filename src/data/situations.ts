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

const categoryImages: Record<SituationCategory, string> = {
  airport: "/images/airport.svg",
  passport: "/images/passport.svg",
  hotel: "/images/hotel.svg",
  restaurant: "/images/restaurant.svg",
  taxi: "/images/taxi.svg",
  directions: "/images/directions.svg",
  shopping: "/images/shopping.svg",
  payment: "/images/payment.svg",
  emergency: "/images/emergency.svg",
  "small-talk": "/images/small-talk.svg"
};

const defaultRescuePhrases = [
  "Could you say that again, please?",
  "Could you speak more slowly, please?"
];

type SituationSeed = Omit<Situation, "image" | "rescuePhrases"> & {
  rescuePhrases?: string[];
};

function createSituation(seed: SituationSeed): Situation {
  return {
    ...seed,
    image: categoryImages[seed.category],
    rescuePhrases: seed.rescuePhrases ?? defaultRescuePhrases
  };
}

const coreSituations: Situation[] = [
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

const additionalSituations: Situation[] = ([
  {
    id: "airport-security-021",
    level: "A2",
    category: "airport",
    prompt: "Security asks you to remove your laptop.",
    targetMeaning: "Confirm that you understand and will take out the laptop.",
    acceptableAnswers: ["Sure, I'll take it out.", "Do I need to take out my laptop?", "Okay, here is my laptop.", "Should I put it in a separate tray?"],
    followUpQuestion: "Do you have any liquids?",
    idealAnswer: "Yes, they are in this bag."
  },
  {
    id: "airport-gate-022",
    level: "A1",
    category: "airport",
    prompt: "You cannot find your boarding gate.",
    targetMeaning: "Ask where the gate is.",
    acceptableAnswers: ["Where is gate B12?", "Could you tell me where my gate is?", "How do I get to gate B12?", "Is this the way to gate B12?"],
    followUpQuestion: "Can I see your boarding pass?",
    idealAnswer: "Sure, here it is."
  },
  {
    id: "airport-delay-023",
    level: "A2",
    category: "airport",
    prompt: "You see your flight may be delayed.",
    targetMeaning: "Ask if the flight is delayed.",
    acceptableAnswers: ["Is my flight delayed?", "Has the flight been delayed?", "Do you know when the flight will leave?", "Is there a new departure time?"],
    followUpQuestion: "What is your flight number?",
    idealAnswer: "It is flight 218."
  },
  {
    id: "airport-seat-024",
    level: "A2",
    category: "airport",
    prompt: "You want an aisle seat on the plane.",
    targetMeaning: "Ask for an aisle seat politely.",
    acceptableAnswers: ["Could I have an aisle seat, please?", "Do you have any aisle seats?", "I'd prefer an aisle seat, please.", "Can I change to an aisle seat?"],
    followUpQuestion: "Do you prefer front or back?",
    idealAnswer: "Near the front, please."
  },
  {
    id: "airport-boarding-025",
    level: "A1",
    category: "airport",
    prompt: "You want to know if boarding has started.",
    targetMeaning: "Ask if boarding has started.",
    acceptableAnswers: ["Has boarding started?", "Are we boarding now?", "Is it time to board?", "When does boarding start?"],
    followUpQuestion: "What group are you in?",
    idealAnswer: "I'm in group three."
  },
  {
    id: "airport-connection-026",
    level: "A2",
    category: "airport",
    prompt: "You have a connecting flight soon.",
    targetMeaning: "Ask where to go for your connecting flight.",
    acceptableAnswers: ["Where do I go for my connecting flight?", "I have a connection. Which way should I go?", "How can I get to the transfer area?", "Where is the transfer desk?"],
    followUpQuestion: "How much time do you have?",
    idealAnswer: "I have forty minutes."
  },
  {
    id: "airport-bag-weight-027",
    level: "A2",
    category: "airport",
    prompt: "Your bag is over the weight limit.",
    targetMeaning: "Ask what you can do about the heavy bag.",
    acceptableAnswers: ["What can I do?", "Can I pay for the extra weight?", "Is my bag too heavy?", "Can I move some items to my carry-on?"],
    followUpQuestion: "Would you like to pay the extra fee?",
    idealAnswer: "How much is the fee?"
  },
  {
    id: "airport-wifi-028",
    level: "A1",
    category: "airport",
    prompt: "You need Wi-Fi at the airport.",
    targetMeaning: "Ask how to connect to Wi-Fi.",
    acceptableAnswers: ["How can I connect to the Wi-Fi?", "Is there free Wi-Fi here?", "What's the Wi-Fi network?", "Do I need a password for the Wi-Fi?"],
    followUpQuestion: "Do you have a local phone number?",
    idealAnswer: "No, I don't."
  },
  {
    id: "passport-stay-029",
    level: "A1",
    category: "passport",
    prompt: "The officer asks how long you will stay.",
    targetMeaning: "Say how long you will stay.",
    acceptableAnswers: ["I will stay for one week.", "I'm staying for five days.", "Only three nights.", "I plan to stay for ten days."],
    followUpQuestion: "Where will you stay?",
    idealAnswer: "I will stay at a hotel."
  },
  {
    id: "passport-address-030",
    level: "A2",
    category: "passport",
    prompt: "The officer asks where you are staying.",
    targetMeaning: "Say your accommodation simply.",
    acceptableAnswers: ["I'm staying at a hotel.", "I will stay with my friend.", "Here is the hotel address.", "I'm staying in the city center."],
    followUpQuestion: "Do you have the address?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "passport-return-ticket-031",
    level: "A2",
    category: "passport",
    prompt: "The officer asks for your return ticket.",
    targetMeaning: "Say you have a return ticket and can show it.",
    acceptableAnswers: ["Yes, I have a return ticket.", "Sure, here is my return ticket.", "I can show it on my phone.", "My return flight is next Friday."],
    followUpQuestion: "When is your return flight?",
    idealAnswer: "It is next Friday."
  },
  {
    id: "passport-job-032",
    level: "A2",
    category: "passport",
    prompt: "The officer asks what you do for work.",
    targetMeaning: "Say your job or role briefly.",
    acceptableAnswers: ["I'm a teacher.", "I work at a university.", "I'm a student.", "I work in administration."],
    followUpQuestion: "Are you here for work?",
    idealAnswer: "No, I'm here for tourism."
  },
  {
    id: "passport-business-033",
    level: "A2",
    category: "passport",
    prompt: "You are visiting for a short business meeting.",
    targetMeaning: "Explain that you are visiting for business.",
    acceptableAnswers: ["I'm here for a business meeting.", "I'm visiting for work.", "I have a short business trip.", "I'm attending a meeting."],
    followUpQuestion: "How long is the meeting?",
    idealAnswer: "It is two days."
  },
  {
    id: "passport-declare-034",
    level: "A2",
    category: "passport",
    prompt: "The officer asks if you have anything to declare.",
    targetMeaning: "Say that you have nothing to declare.",
    acceptableAnswers: ["No, nothing to declare.", "I don't have anything to declare.", "No, I only have personal items.", "Nothing, just my clothes."],
    followUpQuestion: "Are these your bags?",
    idealAnswer: "Yes, they are mine."
  },
  {
    id: "passport-alone-035",
    level: "A1",
    category: "passport",
    prompt: "The officer asks if you are traveling alone.",
    targetMeaning: "Say whether you are traveling alone or with someone.",
    acceptableAnswers: ["Yes, I'm traveling alone.", "No, I'm with my family.", "I'm traveling with my friend.", "I'm here by myself."],
    followUpQuestion: "Where is your family?",
    idealAnswer: "They are waiting outside."
  },
  {
    id: "passport-first-visit-036",
    level: "A1",
    category: "passport",
    prompt: "The officer asks if this is your first visit.",
    targetMeaning: "Answer if it is your first visit.",
    acceptableAnswers: ["Yes, this is my first visit.", "No, I have been here before.", "It's my first time here.", "I visited once before."],
    followUpQuestion: "When did you visit before?",
    idealAnswer: "I visited last year."
  },
  {
    id: "passport-family-037",
    level: "A2",
    category: "passport",
    prompt: "You are visiting family abroad.",
    targetMeaning: "Say that you are visiting family.",
    acceptableAnswers: ["I'm visiting my family.", "I'm here to see my relatives.", "My brother lives here.", "I'm staying with my family."],
    followUpQuestion: "What is your relative's address?",
    idealAnswer: "I have it on my phone."
  },
  {
    id: "hotel-wifi-038",
    level: "A1",
    category: "hotel",
    prompt: "You need the hotel Wi-Fi password.",
    targetMeaning: "Ask for the Wi-Fi password.",
    acceptableAnswers: ["What's the Wi-Fi password?", "Could I have the Wi-Fi password?", "How can I connect to the Wi-Fi?", "Is there Wi-Fi in the room?"],
    followUpQuestion: "What is your room number?",
    idealAnswer: "My room number is 412."
  },
  {
    id: "hotel-breakfast-039",
    level: "A1",
    category: "hotel",
    prompt: "You want to know breakfast time.",
    targetMeaning: "Ask what time breakfast is.",
    acceptableAnswers: ["What time is breakfast?", "When does breakfast start?", "Is breakfast included?", "Where is breakfast served?"],
    followUpQuestion: "Do you have any allergies?",
    idealAnswer: "No, I don't."
  },
  {
    id: "hotel-late-checkout-040",
    level: "A2",
    category: "hotel",
    prompt: "You want to check out later than usual.",
    targetMeaning: "Ask for late checkout.",
    acceptableAnswers: ["Could I have a late checkout?", "Can I check out later?", "Is late checkout possible?", "Could I stay until two o'clock?"],
    followUpQuestion: "What time would you like?",
    idealAnswer: "At two o'clock, please."
  },
  {
    id: "hotel-towels-041",
    level: "A1",
    category: "hotel",
    prompt: "You need extra towels in your room.",
    targetMeaning: "Ask for extra towels.",
    acceptableAnswers: ["Could I have extra towels, please?", "Can you send more towels to my room?", "I need two more towels.", "Could you bring some towels?"],
    followUpQuestion: "What is your room number?",
    idealAnswer: "Room 412, please."
  },
  {
    id: "hotel-noisy-room-042",
    level: "A2",
    category: "hotel",
    prompt: "Your hotel room is too noisy.",
    targetMeaning: "Explain the noise problem and ask for help.",
    acceptableAnswers: ["My room is very noisy.", "Could I change rooms?", "There is too much noise in my room.", "Can you help me with a quieter room?"],
    followUpQuestion: "Would you like another room?",
    idealAnswer: "Yes, please."
  },
  {
    id: "hotel-aircon-043",
    level: "A2",
    category: "hotel",
    prompt: "The air conditioner in your room is not working.",
    targetMeaning: "Say the air conditioner is not working and ask for repair.",
    acceptableAnswers: ["The air conditioner isn't working.", "Could someone check the air conditioner?", "My room is too hot.", "Can you send someone to fix it?"],
    followUpQuestion: "Are you in the room now?",
    idealAnswer: "Yes, I'm in the room."
  },
  {
    id: "hotel-taxi-044",
    level: "A2",
    category: "hotel",
    prompt: "You need a taxi from the hotel.",
    targetMeaning: "Ask the hotel to call or book a taxi.",
    acceptableAnswers: ["Could you call a taxi for me?", "Can you book a taxi to the airport?", "I need a taxi, please.", "Could you arrange a taxi?"],
    followUpQuestion: "What time do you need it?",
    idealAnswer: "At seven o'clock, please."
  },
  {
    id: "hotel-bags-045",
    level: "A2",
    category: "hotel",
    prompt: "You checked out but want to leave your bags at the hotel.",
    targetMeaning: "Ask if the hotel can keep your bags.",
    acceptableAnswers: ["Can I leave my bags here?", "Could you keep my luggage for a few hours?", "May I store my bags here?", "Can I pick them up later?"],
    followUpQuestion: "When will you come back?",
    idealAnswer: "I will come back at five."
  },
  {
    id: "restaurant-table-046",
    level: "A1",
    category: "restaurant",
    prompt: "You need a table for two people.",
    targetMeaning: "Ask for a table for two.",
    acceptableAnswers: ["A table for two, please.", "Do you have a table for two?", "Can we get a table for two?", "We need a table for two people."],
    followUpQuestion: "Do you have a reservation?",
    idealAnswer: "No, we don't."
  },
  {
    id: "restaurant-water-047",
    level: "A1",
    category: "restaurant",
    prompt: "You want some water in a restaurant.",
    targetMeaning: "Ask for water politely.",
    acceptableAnswers: ["Could I have some water, please?", "Can I get water, please?", "Water, please.", "Could you bring us some water?"],
    followUpQuestion: "Still or sparkling?",
    idealAnswer: "Still, please."
  },
  {
    id: "restaurant-allergy-048",
    level: "A2",
    category: "restaurant",
    prompt: "You need to tell the waiter about a food allergy.",
    targetMeaning: "Say that you are allergic to something.",
    acceptableAnswers: ["I'm allergic to nuts.", "I have a nut allergy.", "Does this have nuts in it?", "I can't eat peanuts."],
    followUpQuestion: "Would you like another dish?",
    idealAnswer: "Yes, what do you recommend?"
  },
  {
    id: "restaurant-recommend-049",
    level: "A2",
    category: "restaurant",
    prompt: "You want the waiter to recommend a dish.",
    targetMeaning: "Ask for a recommendation.",
    acceptableAnswers: ["What do you recommend?", "Could you recommend something?", "What's popular here?", "What is your best dish?"],
    followUpQuestion: "Do you like spicy food?",
    idealAnswer: "Not too spicy, please."
  },
  {
    id: "restaurant-order-050",
    level: "A1",
    category: "restaurant",
    prompt: "You are ready to order food.",
    targetMeaning: "Say that you are ready to order.",
    acceptableAnswers: ["I'm ready to order.", "Can I order now?", "I'd like to order, please.", "We are ready, please."],
    followUpQuestion: "What would you like?",
    idealAnswer: "I'd like the chicken, please."
  },
  {
    id: "restaurant-wrong-order-051",
    level: "A2",
    category: "restaurant",
    prompt: "The waiter brought the wrong food.",
    targetMeaning: "Politely say the order is wrong.",
    acceptableAnswers: ["I think this isn't my order.", "Sorry, I ordered chicken.", "This is not what I ordered.", "Could you check my order, please?"],
    followUpQuestion: "What did you order?",
    idealAnswer: "I ordered the chicken."
  },
  {
    id: "restaurant-takeaway-052",
    level: "A2",
    category: "restaurant",
    prompt: "You want to take the rest of your food with you.",
    targetMeaning: "Ask for the food to go.",
    acceptableAnswers: ["Could I take this to go?", "Can I have a box, please?", "Could you pack this for me?", "I'd like to take the rest with me."],
    followUpQuestion: "Would you like a bag?",
    idealAnswer: "Yes, please."
  },
  {
    id: "taxi-hotel-053",
    level: "A1",
    category: "taxi",
    prompt: "You get into a taxi and need to go to your hotel.",
    targetMeaning: "Tell the driver to take you to the hotel.",
    acceptableAnswers: ["To this hotel, please.", "Could you take me to my hotel?", "I need to go to this hotel.", "Here is the hotel address."],
    followUpQuestion: "Do you have the address?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "taxi-price-054",
    level: "A1",
    category: "taxi",
    prompt: "You want to know the taxi price before leaving.",
    targetMeaning: "Ask about the estimated price.",
    acceptableAnswers: ["How much will it cost?", "About how much is it?", "Can you give me an estimate?", "What is the fare to the airport?"],
    followUpQuestion: "Do you want to use the meter?",
    idealAnswer: "Yes, please."
  },
  {
    id: "taxi-card-055",
    level: "A1",
    category: "taxi",
    prompt: "You want to pay the taxi driver by card.",
    targetMeaning: "Ask if card payment is possible.",
    acceptableAnswers: ["Can I pay by card?", "Do you take cards?", "Is card okay?", "I'd like to pay by card."],
    followUpQuestion: "Credit or debit?",
    idealAnswer: "Credit, please."
  },
  {
    id: "taxi-stop-056",
    level: "A1",
    category: "taxi",
    prompt: "You want the taxi driver to stop here.",
    targetMeaning: "Ask the driver to stop at this place.",
    acceptableAnswers: ["You can stop here, please.", "Please stop here.", "This is fine, thank you.", "Could you drop me here?"],
    followUpQuestion: "On this side?",
    idealAnswer: "Yes, on this side, please."
  },
  {
    id: "taxi-slower-057",
    level: "A2",
    category: "taxi",
    prompt: "The taxi driver is driving too fast.",
    targetMeaning: "Ask the driver to slow down politely.",
    acceptableAnswers: ["Could you drive a little slower, please?", "Please slow down.", "Could you go more slowly?", "I'm not comfortable. Could you slow down?"],
    followUpQuestion: "Is everything okay?",
    idealAnswer: "Yes, thank you."
  },
  {
    id: "taxi-address-058",
    level: "A1",
    category: "taxi",
    prompt: "You want to show the driver the address on your phone.",
    targetMeaning: "Say that the address is on your phone.",
    acceptableAnswers: ["Here is the address.", "I have the address on my phone.", "Can I show you the address?", "This is where I need to go."],
    followUpQuestion: "Is this the right place?",
    idealAnswer: "Yes, that's right."
  },
  {
    id: "taxi-wait-059",
    level: "A2",
    category: "taxi",
    prompt: "You need the taxi driver to wait for five minutes.",
    targetMeaning: "Ask the driver to wait briefly.",
    acceptableAnswers: ["Could you wait five minutes?", "Can you wait here, please?", "I'll be back in five minutes.", "Please wait for me here."],
    followUpQuestion: "How long will you be?",
    idealAnswer: "Only five minutes."
  },
  {
    id: "taxi-luggage-060",
    level: "A1",
    category: "taxi",
    prompt: "You need help putting luggage in the taxi.",
    targetMeaning: "Ask for help with luggage.",
    acceptableAnswers: ["Could you help me with my bags?", "Can you help with the luggage?", "This bag is heavy. Could you help?", "Could you put this in the trunk?"],
    followUpQuestion: "How many bags do you have?",
    idealAnswer: "I have two bags."
  },
  {
    id: "directions-museum-061",
    level: "A2",
    category: "directions",
    prompt: "You want to find the museum.",
    targetMeaning: "Ask for directions to the museum.",
    acceptableAnswers: ["Where is the museum?", "How can I get to the museum?", "Is the museum near here?", "Could you tell me the way to the museum?"],
    followUpQuestion: "Do you want to walk?",
    idealAnswer: "Yes, I'd like to walk."
  },
  {
    id: "directions-restroom-062",
    level: "A1",
    category: "directions",
    prompt: "You need to find the restroom.",
    targetMeaning: "Ask where the restroom is.",
    acceptableAnswers: ["Where is the restroom?", "Where are the toilets?", "Could you tell me where the bathroom is?", "Is there a restroom near here?"],
    followUpQuestion: "Do you need help finding it?",
    idealAnswer: "Yes, please."
  },
  {
    id: "directions-bus-063",
    level: "A1",
    category: "directions",
    prompt: "You need the bus stop.",
    targetMeaning: "Ask where the bus stop is.",
    acceptableAnswers: ["Where is the bus stop?", "Is there a bus stop near here?", "How can I get to the bus stop?", "Which way is the bus stop?"],
    followUpQuestion: "Which bus do you need?",
    idealAnswer: "I need bus number five."
  },
  {
    id: "directions-pharmacy-064",
    level: "A2",
    category: "directions",
    prompt: "You need to find a pharmacy.",
    targetMeaning: "Ask where the nearest pharmacy is.",
    acceptableAnswers: ["Where is the nearest pharmacy?", "Is there a pharmacy near here?", "How can I get to a pharmacy?", "Could you show me a pharmacy on the map?"],
    followUpQuestion: "Is it urgent?",
    idealAnswer: "No, it's not urgent."
  },
  {
    id: "directions-hotel-065",
    level: "A2",
    category: "directions",
    prompt: "You are lost and need to get back to your hotel.",
    targetMeaning: "Ask how to get back to your hotel.",
    acceptableAnswers: ["How can I get back to my hotel?", "I'm lost. Can you help me find my hotel?", "Which way is this hotel?", "Could you show me the way to my hotel?"],
    followUpQuestion: "Do you have the hotel address?",
    idealAnswer: "Yes, I have it here."
  },
  {
    id: "directions-atm-066",
    level: "A1",
    category: "directions",
    prompt: "You need an ATM.",
    targetMeaning: "Ask where the nearest ATM is.",
    acceptableAnswers: ["Where is the nearest ATM?", "Is there an ATM near here?", "I need an ATM. Where can I find one?", "Can you tell me where an ATM is?"],
    followUpQuestion: "Do you need a bank too?",
    idealAnswer: "No, just an ATM."
  },
  {
    id: "directions-ticket-067",
    level: "A2",
    category: "directions",
    prompt: "You need to find the ticket machine.",
    targetMeaning: "Ask where the ticket machine is.",
    acceptableAnswers: ["Where is the ticket machine?", "How can I buy a ticket?", "Is there a ticket machine here?", "Could you show me where to buy a ticket?"],
    followUpQuestion: "Do you need a one-way ticket?",
    idealAnswer: "Yes, one-way, please."
  },
  {
    id: "directions-left-right-068",
    level: "A2",
    category: "directions",
    prompt: "You did not understand the directions clearly.",
    targetMeaning: "Ask if you should turn left or right.",
    acceptableAnswers: ["Should I turn left or right?", "Sorry, do I go left?", "Could you say that again?", "Which way should I turn?"],
    followUpQuestion: "Do you see the bank?",
    idealAnswer: "Yes, I see it."
  },
  {
    id: "directions-walking-069",
    level: "A2",
    category: "directions",
    prompt: "You want to know if a place is close enough to walk.",
    targetMeaning: "Ask if you can walk there.",
    acceptableAnswers: ["Can I walk there?", "Is it close enough to walk?", "How long does it take on foot?", "Is it far from here?"],
    followUpQuestion: "Do you want a taxi instead?",
    idealAnswer: "No, walking is fine."
  },
  {
    id: "shopping-price-070",
    level: "A1",
    category: "shopping",
    prompt: "You want to know the price of a jacket.",
    targetMeaning: "Ask how much the jacket costs.",
    acceptableAnswers: ["How much is this jacket?", "What's the price of this jacket?", "How much does this cost?", "Could you tell me the price?"],
    followUpQuestion: "Would you like to try it on?",
    idealAnswer: "Yes, please."
  },
  {
    id: "shopping-try-on-071",
    level: "A1",
    category: "shopping",
    prompt: "You want to try on a jacket.",
    targetMeaning: "Ask if you can try it on.",
    acceptableAnswers: ["Can I try this on?", "Could I try it on?", "Where can I try this on?", "May I try this jacket?"],
    followUpQuestion: "What size is it?",
    idealAnswer: "It's a medium."
  },
  {
    id: "shopping-color-072",
    level: "A1",
    category: "shopping",
    prompt: "You want the same shirt in another color.",
    targetMeaning: "Ask if another color is available.",
    acceptableAnswers: ["Do you have this in another color?", "Do you have it in blue?", "Is there a different color?", "Can I see other colors?"],
    followUpQuestion: "What color would you like?",
    idealAnswer: "Blue, please."
  },
  {
    id: "shopping-discount-073",
    level: "A2",
    category: "shopping",
    prompt: "You want to ask if there is a discount.",
    targetMeaning: "Ask politely about a discount.",
    acceptableAnswers: ["Is there a discount?", "Do you have any discounts?", "Is this on sale?", "Can I get a discount?"],
    followUpQuestion: "Do you have a membership card?",
    idealAnswer: "No, I don't."
  },
  {
    id: "shopping-receipt-074",
    level: "A1",
    category: "shopping",
    prompt: "You need a receipt after buying something.",
    targetMeaning: "Ask for a receipt.",
    acceptableAnswers: ["Could I have a receipt, please?", "Can I get a receipt?", "I need a receipt, please.", "May I have the receipt?"],
    followUpQuestion: "Printed or by email?",
    idealAnswer: "Printed, please."
  },
  {
    id: "shopping-exchange-075",
    level: "A2",
    category: "shopping",
    prompt: "You want to exchange an item.",
    targetMeaning: "Say that you want to exchange the item.",
    acceptableAnswers: ["I'd like to exchange this.", "Can I exchange this item?", "This is the wrong size. Can I exchange it?", "I want to change this for another size."],
    followUpQuestion: "Do you have the receipt?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "shopping-out-stock-076",
    level: "A2",
    category: "shopping",
    prompt: "The item you want is not on the shelf.",
    targetMeaning: "Ask if the item is available or in stock.",
    acceptableAnswers: ["Do you have this in stock?", "Is this available?", "Do you have more in the back?", "When will this be available?"],
    followUpQuestion: "What size do you need?",
    idealAnswer: "I need a large."
  },
  {
    id: "shopping-fitting-room-077",
    level: "A1",
    category: "shopping",
    prompt: "You need the fitting room.",
    targetMeaning: "Ask where the fitting room is.",
    acceptableAnswers: ["Where is the fitting room?", "Where can I try this on?", "Is there a fitting room?", "Could you show me the fitting room?"],
    followUpQuestion: "How many items do you have?",
    idealAnswer: "I have two items."
  },
  {
    id: "payment-declined-078",
    level: "A2",
    category: "payment",
    prompt: "Your card was declined.",
    targetMeaning: "Ask to try another card or pay another way.",
    acceptableAnswers: ["Can I try another card?", "Could I pay with a different card?", "Can I pay in cash instead?", "Let me try again, please."],
    followUpQuestion: "Do you have another card?",
    idealAnswer: "Yes, I do."
  },
  {
    id: "payment-cash-079",
    level: "A1",
    category: "payment",
    prompt: "You want to pay in cash.",
    targetMeaning: "Say that you want to pay cash.",
    acceptableAnswers: ["I'd like to pay in cash.", "Can I pay cash?", "Cash, please.", "I'll pay with cash."],
    followUpQuestion: "Do you need change?",
    idealAnswer: "Yes, please."
  },
  {
    id: "payment-split-080",
    level: "A2",
    category: "payment",
    prompt: "You and a friend want to split the bill.",
    targetMeaning: "Ask to split the bill.",
    acceptableAnswers: ["Can we split the bill?", "Could we pay separately?", "Can we split it two ways?", "We'd like separate bills, please."],
    followUpQuestion: "Two cards?",
    idealAnswer: "Yes, two cards."
  },
  {
    id: "payment-email-receipt-081",
    level: "A2",
    category: "payment",
    prompt: "You want the receipt by email.",
    targetMeaning: "Ask for an email receipt.",
    acceptableAnswers: ["Can you email me the receipt?", "Could I get the receipt by email?", "Please send the receipt to my email.", "Can I have an electronic receipt?"],
    followUpQuestion: "What is your email address?",
    idealAnswer: "I'll type it here."
  },
  {
    id: "payment-contactless-082",
    level: "A1",
    category: "payment",
    prompt: "You want to use contactless payment.",
    targetMeaning: "Ask if contactless payment is accepted.",
    acceptableAnswers: ["Is contactless okay?", "Can I tap my card?", "Do you accept contactless?", "Can I pay with my phone?"],
    followUpQuestion: "Apple Pay or card?",
    idealAnswer: "Apple Pay, please."
  },
  {
    id: "payment-refund-083",
    level: "A2",
    category: "payment",
    prompt: "You want to know when a refund will arrive.",
    targetMeaning: "Ask how long the refund takes.",
    acceptableAnswers: ["How long does the refund take?", "When will I get the refund?", "How many days does it take?", "Will it go back to my card?"],
    followUpQuestion: "Did you pay by card?",
    idealAnswer: "Yes, I paid by card."
  },
  {
    id: "payment-currency-084",
    level: "A2",
    category: "payment",
    prompt: "You want to know if you can pay in another currency.",
    targetMeaning: "Ask about paying in another currency.",
    acceptableAnswers: ["Can I pay in dollars?", "Do you accept euros?", "Can I pay in another currency?", "What currencies do you accept?"],
    followUpQuestion: "Do you have local currency?",
    idealAnswer: "No, I don't."
  },
  {
    id: "payment-atm-withdraw-085",
    level: "A2",
    category: "payment",
    prompt: "You need to withdraw cash from an ATM.",
    targetMeaning: "Ask where you can withdraw cash.",
    acceptableAnswers: ["Where can I withdraw cash?", "Is there an ATM nearby?", "I need to get cash.", "Can you show me the nearest ATM?"],
    followUpQuestion: "Do you need directions?",
    idealAnswer: "Yes, please."
  },
  {
    id: "emergency-doctor-086",
    level: "A2",
    category: "emergency",
    prompt: "You need to see a doctor.",
    targetMeaning: "Say that you need a doctor or appointment.",
    acceptableAnswers: ["I need to see a doctor.", "Can I make an appointment with a doctor?", "I don't feel well. I need a doctor.", "Could you help me find a doctor?"],
    followUpQuestion: "Is it urgent?",
    idealAnswer: "No, but I need help today."
  },
  {
    id: "emergency-fever-087",
    level: "A2",
    category: "emergency",
    prompt: "You have a fever and need medicine.",
    targetMeaning: "Explain that you have a fever and ask for help.",
    acceptableAnswers: ["I have a fever.", "Do you have medicine for a fever?", "I feel hot and sick.", "Could you give me something for a fever?"],
    followUpQuestion: "How long have you had it?",
    idealAnswer: "Since yesterday."
  },
  {
    id: "emergency-ambulance-088",
    level: "A2",
    category: "emergency",
    prompt: "Someone needs an ambulance.",
    targetMeaning: "Ask someone to call an ambulance.",
    acceptableAnswers: ["Please call an ambulance.", "We need an ambulance.", "Can you call emergency services?", "It's an emergency. Please call for help."],
    followUpQuestion: "What happened?",
    idealAnswer: "Someone is hurt."
  },
  {
    id: "emergency-lost-phone-089",
    level: "A2",
    category: "emergency",
    prompt: "You lost your phone.",
    targetMeaning: "Say that your phone is lost and ask for help.",
    acceptableAnswers: ["I lost my phone.", "My phone is missing.", "Could you help me find my phone?", "I can't find my phone."],
    followUpQuestion: "Where did you last use it?",
    idealAnswer: "At the cafe."
  },
  {
    id: "emergency-police-station-090",
    level: "A2",
    category: "emergency",
    prompt: "You need the nearest police station.",
    targetMeaning: "Ask where the police station is.",
    acceptableAnswers: ["Where is the nearest police station?", "I need to find a police station.", "Can you show me the police station?", "How can I report this?"],
    followUpQuestion: "What happened?",
    idealAnswer: "I lost my wallet."
  },
  {
    id: "emergency-injury-091",
    level: "A2",
    category: "emergency",
    prompt: "You have a small injury and need help.",
    targetMeaning: "Say you are hurt and ask for help.",
    acceptableAnswers: ["I hurt my hand.", "Can you help me? I'm injured.", "I need a bandage.", "Do you have first aid?"],
    followUpQuestion: "Is it bleeding?",
    idealAnswer: "A little, yes."
  },
  {
    id: "emergency-instructions-092",
    level: "A2",
    category: "emergency",
    prompt: "You need to know how to take medicine.",
    targetMeaning: "Ask how often to take the medicine.",
    acceptableAnswers: ["How often should I take this?", "When should I take the medicine?", "Should I take it with food?", "How many times a day?"],
    followUpQuestion: "Do you understand the label?",
    idealAnswer: "Not completely."
  },
  {
    id: "emergency-allergy-093",
    level: "A2",
    category: "emergency",
    prompt: "You may be having an allergic reaction.",
    targetMeaning: "Say that you are allergic or having a reaction.",
    acceptableAnswers: ["I think I'm having an allergic reaction.", "I'm allergic to this.", "My skin is itchy.", "I need help. I have an allergy."],
    followUpQuestion: "Are you having trouble breathing?",
    idealAnswer: "No, but I feel bad."
  },
  {
    id: "smalltalk-how-are-you-094",
    level: "A1",
    category: "small-talk",
    prompt: "Someone asks how you are.",
    targetMeaning: "Reply naturally to how are you.",
    acceptableAnswers: ["I'm good, thanks. How are you?", "I'm fine, thank you.", "Good, thanks. And you?", "I'm doing well, thanks."],
    followUpQuestion: "How was your day?",
    idealAnswer: "It was good, thank you."
  },
  {
    id: "smalltalk-where-from-095",
    level: "A1",
    category: "small-talk",
    prompt: "Someone asks where you are from.",
    targetMeaning: "Say where you are from.",
    acceptableAnswers: ["I'm from Saudi Arabia.", "I come from Saudi Arabia.", "I'm from Taif.", "I'm Saudi."],
    followUpQuestion: "Is this your first time here?",
    idealAnswer: "Yes, it is."
  },
  {
    id: "smalltalk-hobbies-096",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks what you like to do.",
    targetMeaning: "Talk briefly about a hobby.",
    acceptableAnswers: ["I like reading.", "I enjoy walking.", "I like watching movies.", "I enjoy learning English."],
    followUpQuestion: "How often do you do that?",
    idealAnswer: "A few times a week."
  },
  {
    id: "smalltalk-weekend-097",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks about your weekend plans.",
    targetMeaning: "Say a simple weekend plan.",
    acceptableAnswers: ["I'm going to relax.", "I plan to visit my family.", "I might go shopping.", "I don't have any plans yet."],
    followUpQuestion: "That sounds nice. With family?",
    idealAnswer: "Yes, with my family."
  },
  {
    id: "smalltalk-compliment-098",
    level: "A1",
    category: "small-talk",
    prompt: "Someone compliments your English.",
    targetMeaning: "Thank them naturally.",
    acceptableAnswers: ["Thank you. I'm still learning.", "Thanks, that's kind of you.", "Thank you. I practice every day.", "Thanks. I'm trying to improve."],
    followUpQuestion: "How long have you studied English?",
    idealAnswer: "For about one year."
  },
  {
    id: "smalltalk-coffee-099",
    level: "A2",
    category: "small-talk",
    prompt: "A colleague invites you for coffee.",
    targetMeaning: "Accept or politely respond to the invitation.",
    acceptableAnswers: ["Sure, I'd love to.", "That sounds good.", "Yes, coffee would be nice.", "Thanks, maybe after the meeting."],
    followUpQuestion: "Do you prefer coffee or tea?",
    idealAnswer: "Coffee, please."
  },
  {
    id: "smalltalk-goodbye-100",
    level: "A1",
    category: "small-talk",
    prompt: "You are leaving after a friendly conversation.",
    targetMeaning: "Say goodbye naturally.",
    acceptableAnswers: ["It was nice talking to you.", "See you later.", "Have a nice day.", "Nice to meet you. Goodbye."],
    followUpQuestion: "See you next time?",
    idealAnswer: "Yes, see you next time."
  }
] satisfies SituationSeed[]).map(createSituation);

const stageOneExpansionSituations: Situation[] = ([
  {
    id: "airport-bag-drop-101",
    level: "A2",
    category: "airport",
    prompt: "You need to drop off your checked bag.",
    targetMeaning: "Ask where to drop off your checked bag.",
    acceptableAnswers: ["Where can I drop off my bag?", "Is this the bag drop counter?", "I need to check this bag.", "Where do I leave my suitcase?"],
    followUpQuestion: "Do you already have your boarding pass?",
    idealAnswer: "Yes, I have it on my phone."
  },
  {
    id: "airport-terminal-102",
    level: "A1",
    category: "airport",
    prompt: "You need to know which terminal your flight uses.",
    targetMeaning: "Ask which terminal you need.",
    acceptableAnswers: ["Which terminal do I need?", "What terminal is my flight from?", "Is this the right terminal?", "Where is terminal two?"],
    followUpQuestion: "What is your airline?",
    idealAnswer: "I'm flying with British Airways."
  },
  {
    id: "airport-liquid-bag-103",
    level: "A2",
    category: "airport",
    prompt: "Security asks about liquids in your bag.",
    targetMeaning: "Say that your liquids are in a small bag or ask what to do.",
    acceptableAnswers: ["My liquids are in this bag.", "Do I need to take out my liquids?", "I only have this small bottle.", "Should I put this in a tray?"],
    followUpQuestion: "Is the bottle under one hundred milliliters?",
    idealAnswer: "Yes, it is under one hundred."
  },
  {
    id: "airport-window-seat-104",
    level: "A2",
    category: "airport",
    prompt: "You want a window seat.",
    targetMeaning: "Ask for a window seat politely.",
    acceptableAnswers: ["Could I have a window seat, please?", "Do you have a window seat?", "I'd prefer a window seat.", "Can I change to a window seat?"],
    followUpQuestion: "Do you mind sitting near the back?",
    idealAnswer: "No, that's fine."
  },
  {
    id: "airport-priority-line-105",
    level: "A2",
    category: "airport",
    prompt: "You are not sure if you can use the priority line.",
    targetMeaning: "Ask if you can use this line.",
    acceptableAnswers: ["Can I use this line?", "Is this line for my ticket?", "Am I in the right line?", "Is this priority only?"],
    followUpQuestion: "Can I see your boarding pass?",
    idealAnswer: "Sure, here it is."
  },
  {
    id: "airport-charging-phone-106",
    level: "A1",
    category: "airport",
    prompt: "Your phone battery is low at the airport.",
    targetMeaning: "Ask where you can charge your phone.",
    acceptableAnswers: ["Where can I charge my phone?", "Is there a charging station?", "Can I charge my phone here?", "Where is a power outlet?"],
    followUpQuestion: "Do you need a charger?",
    idealAnswer: "No, I have one."
  },
  {
    id: "airport-lounge-107",
    level: "A2",
    category: "airport",
    prompt: "You want to know if you can enter the lounge.",
    targetMeaning: "Ask about lounge access.",
    acceptableAnswers: ["Can I use the lounge?", "Do I have lounge access?", "Where is the lounge?", "Is this ticket enough for the lounge?"],
    followUpQuestion: "Do you have a membership card?",
    idealAnswer: "No, just this ticket."
  },
  {
    id: "airport-final-call-108",
    level: "A2",
    category: "airport",
    prompt: "You hear a final call and are worried it is your flight.",
    targetMeaning: "Ask if the announcement is for your flight.",
    acceptableAnswers: ["Is that my flight?", "Was that the final call for flight 218?", "Do I need to board now?", "Is my gate closing?"],
    followUpQuestion: "What is your flight number?",
    idealAnswer: "It is flight 218."
  },
  {
    id: "airport-oversized-bag-109",
    level: "A2",
    category: "airport",
    prompt: "You have an oversized bag.",
    targetMeaning: "Ask where to take an oversized bag.",
    acceptableAnswers: ["Where do I take this oversized bag?", "Is there a special counter for this bag?", "Can I check this large bag here?", "Where is oversized baggage?"],
    followUpQuestion: "What is inside the bag?",
    idealAnswer: "It is sports equipment."
  },
  {
    id: "airport-customs-form-110",
    level: "A2",
    category: "airport",
    prompt: "You need help with an airport form.",
    targetMeaning: "Ask for help completing the form.",
    acceptableAnswers: ["Could you help me with this form?", "What should I write here?", "I don't understand this part.", "Can you show me how to fill this out?"],
    followUpQuestion: "Do you have your passport?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "airport-arrivals-pickup-111",
    level: "A1",
    category: "airport",
    prompt: "You are looking for the arrivals pickup area.",
    targetMeaning: "Ask where the pickup area is.",
    acceptableAnswers: ["Where is the pickup area?", "Where can my driver pick me up?", "How do I get to arrivals pickup?", "Is this the way to the pickup point?"],
    followUpQuestion: "Are you using a taxi or a private car?",
    idealAnswer: "A private car."
  },
  {
    id: "airport-missed-flight-112",
    level: "A2",
    category: "airport",
    prompt: "You missed your flight.",
    targetMeaning: "Say that you missed your flight and ask what to do.",
    acceptableAnswers: ["I missed my flight. What can I do?", "Can I get another flight?", "I was late for my flight.", "Could you help me rebook?"],
    followUpQuestion: "What was your destination?",
    idealAnswer: "London."
  },
  {
    id: "airport-seatbelt-help-113",
    level: "A1",
    category: "airport",
    prompt: "You are on the plane and need help with the seatbelt.",
    targetMeaning: "Ask the flight attendant for help with the seatbelt.",
    acceptableAnswers: ["Could you help me with the seatbelt?", "How do I fasten this seatbelt?", "I need help with this, please.", "Can you show me how this works?"],
    followUpQuestion: "Is it too tight?",
    idealAnswer: "Yes, a little."
  },
  {
    id: "airport-meal-choice-114",
    level: "A1",
    category: "airport",
    prompt: "The flight attendant asks which meal you want.",
    targetMeaning: "Choose a meal politely.",
    acceptableAnswers: ["Chicken, please.", "I'd like the vegetarian meal.", "Could I have the pasta?", "Do you have a fish option?"],
    followUpQuestion: "Would you like a drink?",
    idealAnswer: "Water, please."
  },
  {
    id: "airport-landing-card-115",
    level: "A2",
    category: "airport",
    prompt: "You are unsure how to answer a landing card question.",
    targetMeaning: "Ask what a question on the landing card means.",
    acceptableAnswers: ["What does this question mean?", "Could you explain this part?", "I'm not sure what to write here.", "Can you help me with this question?"],
    followUpQuestion: "Which line is confusing?",
    idealAnswer: "This line here."
  },
  {
    id: "passport-purpose-tourism-116",
    level: "A1",
    category: "passport",
    prompt: "The officer asks the purpose of your visit.",
    targetMeaning: "Say that you are visiting for tourism.",
    acceptableAnswers: ["I'm here for tourism.", "I'm visiting as a tourist.", "I'm here for a holiday.", "I came for sightseeing."],
    followUpQuestion: "How long will you stay?",
    idealAnswer: "For one week."
  },
  {
    id: "passport-hotel-name-117",
    level: "A2",
    category: "passport",
    prompt: "The officer asks for the name of your hotel.",
    targetMeaning: "Say your hotel name or offer to show it.",
    acceptableAnswers: ["I'm staying at the City Hotel.", "Here is my hotel booking.", "I can show you the hotel name.", "The hotel is called Central Inn."],
    followUpQuestion: "Do you have the address?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "passport-funds-118",
    level: "A2",
    category: "passport",
    prompt: "The officer asks if you have enough money for your stay.",
    targetMeaning: "Say that you have enough money or a card.",
    acceptableAnswers: ["Yes, I have enough money.", "I have a credit card.", "I have cash and a card.", "Yes, I can pay for my stay."],
    followUpQuestion: "Can you show your booking?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "passport-travel-insurance-119",
    level: "A2",
    category: "passport",
    prompt: "The officer asks about travel insurance.",
    targetMeaning: "Say whether you have travel insurance.",
    acceptableAnswers: ["Yes, I have travel insurance.", "I can show it on my phone.", "No, I don't have it.", "I bought insurance online."],
    followUpQuestion: "Can I see the document?",
    idealAnswer: "Yes, one moment."
  },
  {
    id: "passport-invitation-letter-120",
    level: "A2",
    category: "passport",
    prompt: "The officer asks for an invitation letter.",
    targetMeaning: "Say you have or do not have an invitation letter.",
    acceptableAnswers: ["Yes, I have an invitation letter.", "I can show it to you.", "I don't have a letter.", "My friend invited me by email."],
    followUpQuestion: "Who invited you?",
    idealAnswer: "My friend invited me."
  },
  {
    id: "passport-school-visit-121",
    level: "A2",
    category: "passport",
    prompt: "You are visiting for a short course.",
    targetMeaning: "Explain that you are visiting for study or a course.",
    acceptableAnswers: ["I'm here for a short course.", "I'm attending an English course.", "I'm here to study for two weeks.", "I have a training course."],
    followUpQuestion: "Where is the course?",
    idealAnswer: "At this school."
  },
  {
    id: "passport-conference-122",
    level: "A2",
    category: "passport",
    prompt: "You are attending a conference.",
    targetMeaning: "Say that you are attending a conference.",
    acceptableAnswers: ["I'm attending a conference.", "I'm here for a conference.", "I came for a work conference.", "The conference is for three days."],
    followUpQuestion: "Do you have registration proof?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "passport-items-gifts-123",
    level: "A2",
    category: "passport",
    prompt: "The officer asks if you are carrying gifts.",
    targetMeaning: "Say that you have small gifts or personal items.",
    acceptableAnswers: ["I have some small gifts.", "Only personal items.", "These are gifts for my family.", "Nothing for sale, just gifts."],
    followUpQuestion: "What are the gifts?",
    idealAnswer: "Some dates and perfume."
  },
  {
    id: "passport-language-help-124",
    level: "A2",
    category: "passport",
    prompt: "You do not understand the officer's question.",
    targetMeaning: "Ask the officer to repeat or speak slowly.",
    acceptableAnswers: ["Could you repeat that, please?", "Could you speak more slowly?", "Sorry, I don't understand.", "Can you say that again?"],
    followUpQuestion: "Do you need an interpreter?",
    idealAnswer: "No, slowly is okay."
  },
  {
    id: "passport-biometric-125",
    level: "A1",
    category: "passport",
    prompt: "The officer asks you to put your fingers on the scanner.",
    targetMeaning: "Confirm and comply with the fingerprint request.",
    acceptableAnswers: ["Okay, like this?", "Sure, I will put my fingers here.", "Do you need my right hand?", "Is this correct?"],
    followUpQuestion: "Can you look at the camera?",
    idealAnswer: "Yes, of course."
  },
  {
    id: "passport-camera-126",
    level: "A1",
    category: "passport",
    prompt: "The officer asks you to look at the camera.",
    targetMeaning: "Confirm that you will look at the camera.",
    acceptableAnswers: ["Okay.", "Sure.", "Should I look here?", "Yes, of course."],
    followUpQuestion: "Please remove your glasses.",
    idealAnswer: "Sure, one moment."
  },
  {
    id: "passport-visa-question-127",
    level: "A2",
    category: "passport",
    prompt: "The officer asks about your visa.",
    targetMeaning: "Say that your visa is electronic or in your passport.",
    acceptableAnswers: ["My visa is electronic.", "It is in my passport.", "I applied online.", "I can show the visa on my phone."],
    followUpQuestion: "When did you apply?",
    idealAnswer: "Last month."
  },
  {
    id: "passport-friend-address-128",
    level: "A2",
    category: "passport",
    prompt: "You are staying with a friend and need to explain it.",
    targetMeaning: "Say that you will stay with a friend and can show the address.",
    acceptableAnswers: ["I'm staying with a friend.", "My friend lives here.", "I have my friend's address.", "I'll stay at my friend's apartment."],
    followUpQuestion: "Can I see the address?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "passport-transit-129",
    level: "A2",
    category: "passport",
    prompt: "You are only transiting through the country.",
    targetMeaning: "Say that you are in transit and have another flight.",
    acceptableAnswers: ["I'm only in transit.", "I have a connecting flight.", "I'm not staying here.", "My next flight is tonight."],
    followUpQuestion: "Where is your final destination?",
    idealAnswer: "My final destination is Toronto."
  },
  {
    id: "passport-bags-mine-130",
    level: "A1",
    category: "passport",
    prompt: "The officer asks if the bags are yours.",
    targetMeaning: "Say the bags are yours.",
    acceptableAnswers: ["Yes, they are mine.", "These are my bags.", "Yes, I packed them myself.", "This suitcase is mine."],
    followUpQuestion: "Did anyone give you anything to carry?",
    idealAnswer: "No, nobody did."
  },
  {
    id: "hotel-room-number-131",
    level: "A1",
    category: "hotel",
    prompt: "Reception asks for your room number.",
    targetMeaning: "Give your room number.",
    acceptableAnswers: ["My room number is 412.", "I'm in room 412.", "Room 412, please.", "It is room 412."],
    followUpQuestion: "Can I see your key card?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "hotel-early-checkin-132",
    level: "A2",
    category: "hotel",
    prompt: "You arrived early at the hotel.",
    targetMeaning: "Ask if early check-in is possible.",
    acceptableAnswers: ["Is early check-in possible?", "Can I check in early?", "My room is booked for today. Is it ready?", "Could I leave my bags if the room is not ready?"],
    followUpQuestion: "What is your name?",
    idealAnswer: "The booking is under Majed."
  },
  {
    id: "hotel-room-cleaning-133",
    level: "A2",
    category: "hotel",
    prompt: "You want your room cleaned.",
    targetMeaning: "Ask for room cleaning.",
    acceptableAnswers: ["Could you clean my room, please?", "Can housekeeping clean my room?", "My room needs cleaning.", "Could you send housekeeping?"],
    followUpQuestion: "What time is good for you?",
    idealAnswer: "After two o'clock, please."
  },
  {
    id: "hotel-do-not-disturb-134",
    level: "A2",
    category: "hotel",
    prompt: "You do not want housekeeping now.",
    targetMeaning: "Politely ask not to be disturbed.",
    acceptableAnswers: ["Please don't clean the room now.", "Could housekeeping come later?", "I don't need cleaning today.", "Please do not disturb me now."],
    followUpQuestion: "Would you like fresh towels?",
    idealAnswer: "Yes, towels would be nice."
  },
  {
    id: "hotel-safe-135",
    level: "A2",
    category: "hotel",
    prompt: "You cannot open the safe in your room.",
    targetMeaning: "Say the safe is not opening and ask for help.",
    acceptableAnswers: ["I can't open the safe.", "Could someone help me with the safe?", "The safe is locked.", "The safe in my room isn't working."],
    followUpQuestion: "Are your things inside?",
    idealAnswer: "Yes, my passport is inside."
  },
  {
    id: "hotel-shower-problem-136",
    level: "A2",
    category: "hotel",
    prompt: "The shower in your room is not working well.",
    targetMeaning: "Explain the shower problem and ask for repair.",
    acceptableAnswers: ["The shower isn't working.", "There is no hot water.", "Could someone fix the shower?", "The water is too cold in my room."],
    followUpQuestion: "What is your room number?",
    idealAnswer: "Room 412."
  },
  {
    id: "hotel-extra-blanket-137",
    level: "A1",
    category: "hotel",
    prompt: "You need an extra blanket.",
    targetMeaning: "Ask for an extra blanket.",
    acceptableAnswers: ["Could I have an extra blanket?", "Can you send a blanket to my room?", "I need another blanket, please.", "Could you bring me a blanket?"],
    followUpQuestion: "Do you need anything else?",
    idealAnswer: "No, thank you."
  },
  {
    id: "hotel-room-service-138",
    level: "A2",
    category: "hotel",
    prompt: "You want to order room service.",
    targetMeaning: "Ask if room service is available or place an order.",
    acceptableAnswers: ["Is room service available?", "I'd like to order room service.", "Can I order food to my room?", "Could I have the room service menu?"],
    followUpQuestion: "What would you like to order?",
    idealAnswer: "I'd like a sandwich."
  },
  {
    id: "hotel-gym-hours-139",
    level: "A1",
    category: "hotel",
    prompt: "You want to know the hotel gym hours.",
    targetMeaning: "Ask when the gym is open.",
    acceptableAnswers: ["What time is the gym open?", "When does the gym close?", "Is the gym open now?", "Where is the gym?"],
    followUpQuestion: "Do you need a towel?",
    idealAnswer: "Yes, please."
  },
  {
    id: "hotel-pool-hours-140",
    level: "A1",
    category: "hotel",
    prompt: "You want to know when the pool closes.",
    targetMeaning: "Ask about pool hours.",
    acceptableAnswers: ["What time does the pool close?", "Is the pool open now?", "When is the pool open?", "Where is the pool?"],
    followUpQuestion: "Do you need pool towels?",
    idealAnswer: "Yes, please."
  },
  {
    id: "hotel-laundry-141",
    level: "A2",
    category: "hotel",
    prompt: "You need laundry service.",
    targetMeaning: "Ask about laundry service.",
    acceptableAnswers: ["Do you have laundry service?", "Can I have these clothes washed?", "How long does laundry take?", "Where can I do laundry?"],
    followUpQuestion: "Do you need it today?",
    idealAnswer: "Yes, if possible."
  },
  {
    id: "hotel-print-ticket-142",
    level: "A2",
    category: "hotel",
    prompt: "You need to print a ticket at the hotel.",
    targetMeaning: "Ask if the hotel can print your ticket.",
    acceptableAnswers: ["Could you print this ticket for me?", "Can I print something here?", "I need to print my boarding pass.", "Do you have a printer I can use?"],
    followUpQuestion: "Can you email it to us?",
    idealAnswer: "Yes, I can email it."
  },
  {
    id: "hotel-wake-up-call-143",
    level: "A2",
    category: "hotel",
    prompt: "You need a wake-up call in the morning.",
    targetMeaning: "Ask for a wake-up call.",
    acceptableAnswers: ["Could I have a wake-up call at six?", "Can you wake me up at six?", "I need a wake-up call tomorrow.", "Please call my room at six in the morning."],
    followUpQuestion: "Six in the morning?",
    idealAnswer: "Yes, six a.m."
  },
  {
    id: "hotel-minibar-charge-144",
    level: "A2",
    category: "hotel",
    prompt: "You see a minibar charge you do not understand.",
    targetMeaning: "Ask about the charge politely.",
    acceptableAnswers: ["What is this minibar charge?", "I don't understand this charge.", "Could you check this charge, please?", "I didn't use the minibar."],
    followUpQuestion: "May I see your bill?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "hotel-checkout-bill-145",
    level: "A2",
    category: "hotel",
    prompt: "You are checking out and want to see the bill.",
    targetMeaning: "Ask for the hotel bill.",
    acceptableAnswers: ["Could I see the bill, please?", "I'd like to check out.", "Can I have the final bill?", "Could you print the receipt?"],
    followUpQuestion: "Did you use the minibar?",
    idealAnswer: "No, I didn't."
  },
  {
    id: "restaurant-reservation-146",
    level: "A2",
    category: "restaurant",
    prompt: "You have a restaurant reservation.",
    targetMeaning: "Say that you have a reservation.",
    acceptableAnswers: ["I have a reservation.", "I have a reservation under Majed.", "We booked a table for two.", "The reservation is for seven o'clock."],
    followUpQuestion: "For how many people?",
    idealAnswer: "For two people."
  },
  {
    id: "restaurant-no-reservation-147",
    level: "A2",
    category: "restaurant",
    prompt: "You do not have a restaurant reservation.",
    targetMeaning: "Ask if a table is available without a reservation.",
    acceptableAnswers: ["Do you have a table available?", "We don't have a reservation.", "Can we get a table for two?", "Is there a wait for a table?"],
    followUpQuestion: "Would you like to wait twenty minutes?",
    idealAnswer: "Yes, that's fine."
  },
  {
    id: "restaurant-vegetarian-148",
    level: "A2",
    category: "restaurant",
    prompt: "You want a vegetarian meal.",
    targetMeaning: "Ask for vegetarian options.",
    acceptableAnswers: ["Do you have vegetarian options?", "I'm vegetarian.", "Could I have something without meat?", "Which dishes are vegetarian?"],
    followUpQuestion: "Do you eat eggs?",
    idealAnswer: "Yes, eggs are okay."
  },
  {
    id: "restaurant-spicy-149",
    level: "A2",
    category: "restaurant",
    prompt: "You do not want spicy food.",
    targetMeaning: "Ask for food that is not spicy.",
    acceptableAnswers: ["Not spicy, please.", "Is this dish spicy?", "Could you make it mild?", "I don't want spicy food."],
    followUpQuestion: "Mild is okay?",
    idealAnswer: "Yes, mild is fine."
  },
  {
    id: "restaurant-without-onions-150",
    level: "A2",
    category: "restaurant",
    prompt: "You want your meal without onions.",
    targetMeaning: "Ask for the meal without onions.",
    acceptableAnswers: ["Could I have it without onions?", "No onions, please.", "Can you remove the onions?", "I don't want onions in it."],
    followUpQuestion: "Anything else to remove?",
    idealAnswer: "No, that's all."
  },
  {
    id: "restaurant-more-time-151",
    level: "A1",
    category: "restaurant",
    prompt: "The waiter comes but you are not ready to order.",
    targetMeaning: "Ask for more time.",
    acceptableAnswers: ["Could we have a few more minutes?", "I'm not ready yet.", "Can you come back in a minute?", "We need more time, please."],
    followUpQuestion: "Sure. Drinks first?",
    idealAnswer: "Water, please."
  },
  {
    id: "restaurant-drinks-first-152",
    level: "A1",
    category: "restaurant",
    prompt: "You want to order drinks first.",
    targetMeaning: "Order drinks before food.",
    acceptableAnswers: ["Could we order drinks first?", "I'd like water, please.", "Can we start with drinks?", "Just drinks for now, please."],
    followUpQuestion: "Still or sparkling water?",
    idealAnswer: "Still water, please."
  },
  {
    id: "restaurant-empty-plate-153",
    level: "A1",
    category: "restaurant",
    prompt: "You need an extra plate.",
    targetMeaning: "Ask for an extra plate.",
    acceptableAnswers: ["Could I have an extra plate?", "Can we get another plate?", "One more plate, please.", "Could you bring a small plate?"],
    followUpQuestion: "Anything else?",
    idealAnswer: "No, thank you."
  },
  {
    id: "restaurant-fork-154",
    level: "A1",
    category: "restaurant",
    prompt: "You need a fork.",
    targetMeaning: "Ask for a fork politely.",
    acceptableAnswers: ["Could I have a fork, please?", "Can I get a fork?", "I need a fork, please.", "Could you bring me a fork?"],
    followUpQuestion: "Do you need a knife too?",
    idealAnswer: "Yes, please."
  },
  {
    id: "restaurant-too-cold-155",
    level: "A2",
    category: "restaurant",
    prompt: "Your food is cold.",
    targetMeaning: "Politely say the food is cold.",
    acceptableAnswers: ["My food is cold.", "Could you warm this up, please?", "This is not hot.", "Could you check this dish?"],
    followUpQuestion: "Would you like a new plate?",
    idealAnswer: "Yes, please."
  },
  {
    id: "restaurant-too-salty-156",
    level: "A2",
    category: "restaurant",
    prompt: "The food is too salty.",
    targetMeaning: "Politely say the food is too salty.",
    acceptableAnswers: ["This is too salty.", "The dish is very salty.", "Could you check this, please?", "I can't eat this because it is too salty."],
    followUpQuestion: "Would you like something else?",
    idealAnswer: "Yes, please."
  },
  {
    id: "restaurant-seat-outside-157",
    level: "A2",
    category: "restaurant",
    prompt: "You want to sit outside.",
    targetMeaning: "Ask for an outside table.",
    acceptableAnswers: ["Can we sit outside?", "Do you have an outside table?", "I'd like to sit outside.", "Is there a table on the terrace?"],
    followUpQuestion: "Smoking or non-smoking?",
    idealAnswer: "Non-smoking, please."
  },
  {
    id: "restaurant-child-chair-158",
    level: "A2",
    category: "restaurant",
    prompt: "You need a high chair for a child.",
    targetMeaning: "Ask for a high chair.",
    acceptableAnswers: ["Could we have a high chair?", "Do you have a chair for a child?", "We need a high chair, please.", "Can you bring a baby chair?"],
    followUpQuestion: "How old is the child?",
    idealAnswer: "Two years old."
  },
  {
    id: "restaurant-food-late-159",
    level: "A2",
    category: "restaurant",
    prompt: "Your food is taking a long time.",
    targetMeaning: "Ask politely about the order.",
    acceptableAnswers: ["Could you check our order?", "Our food is taking a long time.", "Do you know when the food will be ready?", "We ordered a while ago."],
    followUpQuestion: "What did you order?",
    idealAnswer: "We ordered the chicken."
  },
  {
    id: "restaurant-tip-question-160",
    level: "A2",
    category: "restaurant",
    prompt: "You want to know if service is included.",
    targetMeaning: "Ask whether service or tip is included.",
    acceptableAnswers: ["Is service included?", "Is the tip included?", "Do I need to add a tip?", "Does this include service charge?"],
    followUpQuestion: "Would you like to add a tip?",
    idealAnswer: "Yes, ten percent, please."
  },
  {
    id: "taxi-meter-161",
    level: "A1",
    category: "taxi",
    prompt: "You want the taxi driver to use the meter.",
    targetMeaning: "Ask the driver to use the meter.",
    acceptableAnswers: ["Could you use the meter, please?", "Please use the meter.", "Is the meter on?", "Can we go by the meter?"],
    followUpQuestion: "Is cash okay?",
    idealAnswer: "Card is better, please."
  },
  {
    id: "taxi-open-trunk-162",
    level: "A1",
    category: "taxi",
    prompt: "You need the taxi trunk opened.",
    targetMeaning: "Ask the driver to open the trunk.",
    acceptableAnswers: ["Could you open the trunk?", "Can you open the boot?", "I need to put my bag in the trunk.", "Please open the trunk."],
    followUpQuestion: "Is this all your luggage?",
    idealAnswer: "Yes, just this bag."
  },
  {
    id: "taxi-air-conditioning-163",
    level: "A2",
    category: "taxi",
    prompt: "The taxi is too hot.",
    targetMeaning: "Ask the driver to turn on the air conditioning.",
    acceptableAnswers: ["Could you turn on the air conditioning?", "Can we use the AC?", "It's a bit hot. Could you turn on the AC?", "Could you make it cooler, please?"],
    followUpQuestion: "Is this temperature okay?",
    idealAnswer: "Yes, thank you."
  },
  {
    id: "taxi-music-down-164",
    level: "A2",
    category: "taxi",
    prompt: "The music in the taxi is too loud.",
    targetMeaning: "Ask the driver to lower the music.",
    acceptableAnswers: ["Could you turn the music down?", "The music is a bit loud.", "Could you lower the volume, please?", "Can you make it quieter?"],
    followUpQuestion: "Is that better?",
    idealAnswer: "Yes, thank you."
  },
  {
    id: "taxi-shortcut-165",
    level: "A2",
    category: "taxi",
    prompt: "You want to ask if there is a faster way.",
    targetMeaning: "Ask about a faster route.",
    acceptableAnswers: ["Is there a faster way?", "Can we take a quicker route?", "Is this the fastest route?", "Can we avoid traffic?"],
    followUpQuestion: "Do you mind taking the highway?",
    idealAnswer: "No, that's fine."
  },
  {
    id: "taxi-map-route-166",
    level: "A2",
    category: "taxi",
    prompt: "You want the driver to follow the route on your phone.",
    targetMeaning: "Ask the driver to follow your map route.",
    acceptableAnswers: ["Could you follow this route?", "Can we use this map?", "This route looks faster.", "Please follow the route on my phone."],
    followUpQuestion: "Is this your hotel?",
    idealAnswer: "Yes, that's the hotel."
  },
  {
    id: "taxi-wrong-way-167",
    level: "A2",
    category: "taxi",
    prompt: "You think the taxi is going the wrong way.",
    targetMeaning: "Ask politely if the route is correct.",
    acceptableAnswers: ["Is this the right way?", "I think my hotel is the other way.", "Are we going to this address?", "Could you check the route, please?"],
    followUpQuestion: "Can you show me the address?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "taxi-too-far-168",
    level: "A2",
    category: "taxi",
    prompt: "The taxi stops far from the entrance.",
    targetMeaning: "Ask to be dropped closer to the entrance.",
    acceptableAnswers: ["Could you drop me closer to the entrance?", "Can you stop near the door?", "Could we go a little farther?", "Please drop me at the entrance."],
    followUpQuestion: "This entrance here?",
    idealAnswer: "Yes, this one."
  },
  {
    id: "taxi-add-stop-169",
    level: "A2",
    category: "taxi",
    prompt: "You need to stop at a pharmacy before the hotel.",
    targetMeaning: "Ask to add a stop.",
    acceptableAnswers: ["Can we stop at a pharmacy first?", "Could you make one stop before the hotel?", "I need to stop here quickly.", "Please stop at the pharmacy on the way."],
    followUpQuestion: "How long will you need?",
    idealAnswer: "Only five minutes."
  },
  {
    id: "taxi-change-destination-170",
    level: "A2",
    category: "taxi",
    prompt: "You need to change your destination.",
    targetMeaning: "Tell the driver you need to go somewhere else.",
    acceptableAnswers: ["I need to change the destination.", "Can we go to this address instead?", "Please take me here instead.", "I want to go to a different place."],
    followUpQuestion: "Can I see the new address?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "taxi-no-cash-171",
    level: "A2",
    category: "taxi",
    prompt: "You do not have cash for the taxi.",
    targetMeaning: "Say that you do not have cash and ask about card payment.",
    acceptableAnswers: ["I don't have cash. Can I pay by card?", "Do you accept card?", "I only have a card.", "Can I pay with my phone?"],
    followUpQuestion: "Card is okay. Credit or debit?",
    idealAnswer: "Credit, please."
  },
  {
    id: "taxi-need-receipt-later-172",
    level: "A2",
    category: "taxi",
    prompt: "You forgot to ask for a taxi receipt.",
    targetMeaning: "Ask for the receipt after paying.",
    acceptableAnswers: ["Could I still get a receipt?", "I forgot the receipt. Can I have one?", "Can you print the receipt?", "Could you send me a receipt?"],
    followUpQuestion: "Do you want it by email?",
    idealAnswer: "Yes, please."
  },
  {
    id: "taxi-driver-wait-airport-173",
    level: "A2",
    category: "taxi",
    prompt: "You ask a driver to wait while you get your bags.",
    targetMeaning: "Ask the driver to wait while you collect luggage.",
    acceptableAnswers: ["Could you wait while I get my bags?", "Please wait here for a few minutes.", "I'll get my luggage and come back.", "Can you wait at this spot?"],
    followUpQuestion: "How many minutes?",
    idealAnswer: "About ten minutes."
  },
  {
    id: "taxi-share-ride-174",
    level: "A2",
    category: "taxi",
    prompt: "You want to know if another person can ride with you.",
    targetMeaning: "Ask if your friend can join the taxi.",
    acceptableAnswers: ["Can my friend come with me?", "Is it okay if we are two people?", "Can we share this taxi?", "My friend is coming too. Is that okay?"],
    followUpQuestion: "How many passengers?",
    idealAnswer: "Two passengers."
  },
  {
    id: "taxi-thanks-goodbye-175",
    level: "A1",
    category: "taxi",
    prompt: "You arrive and want to thank the driver.",
    targetMeaning: "Thank the driver and say goodbye.",
    acceptableAnswers: ["Thank you. Have a good day.", "Thanks for the ride.", "Thank you, goodbye.", "Thanks. This is perfect."],
    followUpQuestion: "Do you need the receipt?",
    idealAnswer: "Yes, please."
  },
  {
    id: "directions-subway-line-176",
    level: "A2",
    category: "directions",
    prompt: "You need to know which subway line to take.",
    targetMeaning: "Ask which subway line you need.",
    acceptableAnswers: ["Which subway line should I take?", "Do I take the red line?", "How do I get there by subway?", "Which train goes to the museum?"],
    followUpQuestion: "Where are you going?",
    idealAnswer: "I'm going to the museum."
  },
  {
    id: "directions-platform-177",
    level: "A1",
    category: "directions",
    prompt: "You need to find the right train platform.",
    targetMeaning: "Ask where the platform is.",
    acceptableAnswers: ["Where is platform three?", "Which platform do I need?", "Is this platform three?", "How do I get to platform three?"],
    followUpQuestion: "What is your destination?",
    idealAnswer: "Oxford."
  },
  {
    id: "directions-exit-178",
    level: "A1",
    category: "directions",
    prompt: "You need the exit in a station.",
    targetMeaning: "Ask where the exit is.",
    acceptableAnswers: ["Where is the exit?", "Which way is the exit?", "How do I get out?", "Is this the way out?"],
    followUpQuestion: "Which street do you need?",
    idealAnswer: "Main Street."
  },
  {
    id: "directions-elevator-179",
    level: "A1",
    category: "directions",
    prompt: "You need an elevator.",
    targetMeaning: "Ask where the elevator is.",
    acceptableAnswers: ["Where is the elevator?", "Is there an elevator here?", "I need the lift. Where is it?", "How can I get to the elevator?"],
    followUpQuestion: "Are you going up or down?",
    idealAnswer: "Up, please."
  },
  {
    id: "directions-information-desk-180",
    level: "A1",
    category: "directions",
    prompt: "You need the information desk.",
    targetMeaning: "Ask where the information desk is.",
    acceptableAnswers: ["Where is the information desk?", "Is there an information desk here?", "Can you show me the information desk?", "Where can I ask for help?"],
    followUpQuestion: "What do you need help with?",
    idealAnswer: "I need a map."
  },
  {
    id: "directions-nearest-bank-181",
    level: "A2",
    category: "directions",
    prompt: "You need the nearest bank.",
    targetMeaning: "Ask where the nearest bank is.",
    acceptableAnswers: ["Where is the nearest bank?", "Is there a bank near here?", "How can I get to a bank?", "Could you show me the bank on the map?"],
    followUpQuestion: "Do you need an ATM?",
    idealAnswer: "Yes, an ATM would help."
  },
  {
    id: "directions-taxi-stand-182",
    level: "A1",
    category: "directions",
    prompt: "You need a taxi stand.",
    targetMeaning: "Ask where to find taxis.",
    acceptableAnswers: ["Where is the taxi stand?", "Where can I get a taxi?", "Is there a taxi rank nearby?", "Which way to the taxis?"],
    followUpQuestion: "Are you going to the airport?",
    idealAnswer: "Yes, to the airport."
  },
  {
    id: "directions-tourist-office-183",
    level: "A2",
    category: "directions",
    prompt: "You want to find a tourist information office.",
    targetMeaning: "Ask where tourist information is.",
    acceptableAnswers: ["Where is the tourist information office?", "Is there a visitor center nearby?", "Where can I get a city map?", "Can you show me tourist information?"],
    followUpQuestion: "Do you need a map?",
    idealAnswer: "Yes, please."
  },
  {
    id: "directions-cross-street-184",
    level: "A2",
    category: "directions",
    prompt: "You are not sure where to cross the street.",
    targetMeaning: "Ask where you can cross safely.",
    acceptableAnswers: ["Where can I cross the street?", "Is there a crosswalk nearby?", "Can I cross here?", "Where is the pedestrian crossing?"],
    followUpQuestion: "Do you see the traffic light?",
    idealAnswer: "Yes, I see it."
  },
  {
    id: "directions-map-pin-185",
    level: "A2",
    category: "directions",
    prompt: "You want someone to check a location on your map.",
    targetMeaning: "Ask if the map location is correct.",
    acceptableAnswers: ["Is this the right place?", "Can you check this location?", "Am I going to the right address?", "Is this pin correct?"],
    followUpQuestion: "What place are you looking for?",
    idealAnswer: "My hotel."
  },
  {
    id: "directions-how-far-186",
    level: "A1",
    category: "directions",
    prompt: "You want to know how far a place is.",
    targetMeaning: "Ask about the distance.",
    acceptableAnswers: ["How far is it?", "Is it far from here?", "How long does it take?", "Is it nearby?"],
    followUpQuestion: "Are you walking?",
    idealAnswer: "Yes, I'm walking."
  },
  {
    id: "directions-wrong-street-187",
    level: "A2",
    category: "directions",
    prompt: "You think you are on the wrong street.",
    targetMeaning: "Ask if you are on the correct street.",
    acceptableAnswers: ["Is this the right street?", "Am I on the wrong street?", "Is this Main Street?", "Could you tell me where I am?"],
    followUpQuestion: "What address do you need?",
    idealAnswer: "This address here."
  },
  {
    id: "directions-bus-ticket-188",
    level: "A2",
    category: "directions",
    prompt: "You need to buy a bus ticket.",
    targetMeaning: "Ask where or how to buy a bus ticket.",
    acceptableAnswers: ["Where can I buy a bus ticket?", "Can I buy a ticket on the bus?", "How do I pay for the bus?", "Do I need a ticket before I board?"],
    followUpQuestion: "Where are you going?",
    idealAnswer: "To the city center."
  },
  {
    id: "directions-last-train-189",
    level: "A2",
    category: "directions",
    prompt: "You want to know the time of the last train.",
    targetMeaning: "Ask when the last train leaves.",
    acceptableAnswers: ["When is the last train?", "What time is the last train?", "Has the last train left?", "Is there another train tonight?"],
    followUpQuestion: "Which direction?",
    idealAnswer: "To the city center."
  },
  {
    id: "directions-meet-point-190",
    level: "A2",
    category: "directions",
    prompt: "You need a clear meeting point.",
    targetMeaning: "Ask where to meet someone.",
    acceptableAnswers: ["Where should we meet?", "Can we meet at the entrance?", "What is a good meeting point?", "I'll meet you by the ticket office."],
    followUpQuestion: "At what time?",
    idealAnswer: "At six o'clock."
  },
  {
    id: "shopping-gift-191",
    level: "A2",
    category: "shopping",
    prompt: "You want to buy a gift.",
    targetMeaning: "Ask for help choosing a gift.",
    acceptableAnswers: ["I'm looking for a gift.", "Could you recommend a gift?", "I need a gift for my friend.", "What would be a good gift?"],
    followUpQuestion: "Who is it for?",
    idealAnswer: "For my brother."
  },
  {
    id: "shopping-souvenir-192",
    level: "A1",
    category: "shopping",
    prompt: "You want to buy a small souvenir.",
    targetMeaning: "Ask where souvenirs are or say you want one.",
    acceptableAnswers: ["Where are the souvenirs?", "I'm looking for a souvenir.", "Do you have small gifts?", "I want something local."],
    followUpQuestion: "What price range?",
    idealAnswer: "Something not expensive."
  },
  {
    id: "shopping-tax-free-193",
    level: "A2",
    category: "shopping",
    prompt: "You want to ask about tax-free shopping.",
    targetMeaning: "Ask if tax-free shopping is available.",
    acceptableAnswers: ["Do you offer tax-free shopping?", "Can I get a tax refund form?", "Is this tax-free?", "How does the tax refund work?"],
    followUpQuestion: "Can I see your passport?",
    idealAnswer: "Sure, here it is."
  },
  {
    id: "shopping-warranty-194",
    level: "A2",
    category: "shopping",
    prompt: "You want to know if an item has a warranty.",
    targetMeaning: "Ask about the warranty.",
    acceptableAnswers: ["Does this have a warranty?", "How long is the warranty?", "Is there a guarantee?", "What happens if it stops working?"],
    followUpQuestion: "Do you want the extended warranty?",
    idealAnswer: "No, thank you."
  },
  {
    id: "shopping-open-box-195",
    level: "A2",
    category: "shopping",
    prompt: "You want to open the box and check the item.",
    targetMeaning: "Ask if you can open or check the item.",
    acceptableAnswers: ["Can I open the box?", "Could I check it first?", "Can I see it before I buy it?", "Is it okay to look inside?"],
    followUpQuestion: "Do you want to test it?",
    idealAnswer: "Yes, please."
  },
  {
    id: "shopping-bag-196",
    level: "A1",
    category: "shopping",
    prompt: "You need a shopping bag.",
    targetMeaning: "Ask for a bag.",
    acceptableAnswers: ["Could I have a bag, please?", "Can I get a bag?", "I need a bag, please.", "Do you have a bag?"],
    followUpQuestion: "Paper or plastic?",
    idealAnswer: "Paper, please."
  },
  {
    id: "shopping-delivery-197",
    level: "A2",
    category: "shopping",
    prompt: "You want the store to deliver an item.",
    targetMeaning: "Ask about delivery.",
    acceptableAnswers: ["Do you offer delivery?", "Can this be delivered to my hotel?", "How much is delivery?", "Can you send it to this address?"],
    followUpQuestion: "What is the delivery address?",
    idealAnswer: "I'll write it here."
  },
  {
    id: "shopping-pay-now-pickup-later-198",
    level: "A2",
    category: "shopping",
    prompt: "You want to pay now and pick up the item later.",
    targetMeaning: "Ask if you can pay now and collect later.",
    acceptableAnswers: ["Can I pay now and pick it up later?", "Could you hold this for me?", "Can I collect it this afternoon?", "I'd like to reserve this item."],
    followUpQuestion: "What time will you come back?",
    idealAnswer: "Around five o'clock."
  },
  {
    id: "shopping-closed-time-199",
    level: "A1",
    category: "shopping",
    prompt: "You want to know when the shop closes.",
    targetMeaning: "Ask the closing time.",
    acceptableAnswers: ["What time do you close?", "When does the shop close?", "Are you open tonight?", "How late are you open?"],
    followUpQuestion: "Do you need anything quickly?",
    idealAnswer: "Yes, just one item."
  },
  {
    id: "shopping-open-time-200",
    level: "A1",
    category: "shopping",
    prompt: "You want to know when the shop opens tomorrow.",
    targetMeaning: "Ask the opening time.",
    acceptableAnswers: ["What time do you open tomorrow?", "When do you open?", "Are you open in the morning?", "What are your opening hours?"],
    followUpQuestion: "Do you want to come back tomorrow?",
    idealAnswer: "Yes, I do."
  },
  {
    id: "shopping-find-brand-201",
    level: "A2",
    category: "shopping",
    prompt: "You are looking for a specific brand.",
    targetMeaning: "Ask if the store has a brand.",
    acceptableAnswers: ["Do you have this brand?", "I'm looking for this brand.", "Do you sell Nike here?", "Can you show me this brand?"],
    followUpQuestion: "What size do you need?",
    idealAnswer: "Size forty-two."
  },
  {
    id: "shopping-cheaper-option-202",
    level: "A2",
    category: "shopping",
    prompt: "You want a cheaper option.",
    targetMeaning: "Ask if there is a cheaper item.",
    acceptableAnswers: ["Do you have a cheaper option?", "Is there something less expensive?", "This is too expensive for me.", "Can you show me a cheaper one?"],
    followUpQuestion: "What is your budget?",
    idealAnswer: "Around thirty dollars."
  },
  {
    id: "shopping-card-membership-203",
    level: "A2",
    category: "shopping",
    prompt: "The cashier asks if you have a membership card.",
    targetMeaning: "Say whether you have a membership card.",
    acceptableAnswers: ["No, I don't have one.", "Yes, here it is.", "Can I sign up?", "I don't have a membership card."],
    followUpQuestion: "Would you like to join?",
    idealAnswer: "No, thank you."
  },
  {
    id: "shopping-damaged-item-204",
    level: "A2",
    category: "shopping",
    prompt: "You notice an item is damaged.",
    targetMeaning: "Say that the item is damaged.",
    acceptableAnswers: ["This item is damaged.", "There is a scratch here.", "Can I get another one?", "This one is broken."],
    followUpQuestion: "Would you like a new one?",
    idealAnswer: "Yes, please."
  },
  {
    id: "shopping-keep-receipt-205",
    level: "A1",
    category: "shopping",
    prompt: "The cashier asks if you want the receipt.",
    targetMeaning: "Say that you want to keep the receipt.",
    acceptableAnswers: ["Yes, please.", "Yes, I need the receipt.", "Could I keep the receipt?", "Please print it for me."],
    followUpQuestion: "Would you like a bag?",
    idealAnswer: "No, thank you."
  },
  {
    id: "payment-pin-code-206",
    level: "A1",
    category: "payment",
    prompt: "The cashier asks you to enter your PIN.",
    targetMeaning: "Confirm that you will enter your PIN.",
    acceptableAnswers: ["Okay, I'll enter it.", "Do I enter my PIN here?", "Sure.", "Like this?"],
    followUpQuestion: "Do you need a receipt?",
    idealAnswer: "Yes, please."
  },
  {
    id: "payment-wrong-amount-207",
    level: "A2",
    category: "payment",
    prompt: "You think the amount is wrong.",
    targetMeaning: "Politely ask about the amount.",
    acceptableAnswers: ["Is this the correct amount?", "I think the amount is wrong.", "Could you check the total?", "Why is it this price?"],
    followUpQuestion: "Did you buy two items?",
    idealAnswer: "No, only one."
  },
  {
    id: "payment-no-change-208",
    level: "A2",
    category: "payment",
    prompt: "You paid cash and need change.",
    targetMeaning: "Ask for your change.",
    acceptableAnswers: ["Could I have my change, please?", "Is there any change?", "I paid with cash.", "I think I need change back."],
    followUpQuestion: "How much did you give me?",
    idealAnswer: "I gave you fifty."
  },
  {
    id: "payment-machine-not-working-209",
    level: "A2",
    category: "payment",
    prompt: "The card machine is not working.",
    targetMeaning: "Ask to try again or pay another way.",
    acceptableAnswers: ["Can we try again?", "Is the machine working?", "Can I pay another way?", "Could I use another card reader?"],
    followUpQuestion: "Do you have cash?",
    idealAnswer: "No, only card."
  },
  {
    id: "payment-tap-again-210",
    level: "A1",
    category: "payment",
    prompt: "The cashier asks you to tap your card again.",
    targetMeaning: "Confirm and tap again.",
    acceptableAnswers: ["Okay, I'll tap again.", "Should I try again?", "Sure.", "Like this?"],
    followUpQuestion: "Do you want a printed receipt?",
    idealAnswer: "Yes, please."
  },
  {
    id: "payment-service-fee-211",
    level: "A2",
    category: "payment",
    prompt: "You see an extra service fee.",
    targetMeaning: "Ask what the service fee is.",
    acceptableAnswers: ["What is this service fee?", "Is this fee included?", "Could you explain this charge?", "Why is there an extra fee?"],
    followUpQuestion: "Would you still like to pay?",
    idealAnswer: "Yes, that's okay."
  },
  {
    id: "payment-deposit-212",
    level: "A2",
    category: "payment",
    prompt: "A hotel asks for a deposit.",
    targetMeaning: "Ask about the deposit and when it is returned.",
    acceptableAnswers: ["How much is the deposit?", "When will I get the deposit back?", "Can I pay the deposit by card?", "Is this deposit refundable?"],
    followUpQuestion: "Card or cash?",
    idealAnswer: "Card, please."
  },
  {
    id: "payment-prepay-213",
    level: "A2",
    category: "payment",
    prompt: "You need to know if you must pay in advance.",
    targetMeaning: "Ask if payment is required now.",
    acceptableAnswers: ["Do I need to pay now?", "Can I pay later?", "Is payment in advance required?", "Should I pay before or after?"],
    followUpQuestion: "Would you like to pay now?",
    idealAnswer: "Yes, I'll pay now."
  },
  {
    id: "payment-installments-214",
    level: "A2",
    category: "payment",
    prompt: "You want to ask if installments are possible.",
    targetMeaning: "Ask about paying in installments.",
    acceptableAnswers: ["Can I pay in installments?", "Do you offer monthly payments?", "Can I split the payment over time?", "Is there an installment plan?"],
    followUpQuestion: "Do you have a local card?",
    idealAnswer: "No, I don't."
  },
  {
    id: "payment-online-link-215",
    level: "A2",
    category: "payment",
    prompt: "You want a payment link.",
    targetMeaning: "Ask for a payment link.",
    acceptableAnswers: ["Can you send me a payment link?", "Could I pay online?", "Can I pay through a link?", "Please send the payment link to my phone."],
    followUpQuestion: "Email or phone number?",
    idealAnswer: "Phone number, please."
  },
  {
    id: "payment-foreign-card-216",
    level: "A2",
    category: "payment",
    prompt: "You want to know if a foreign card works.",
    targetMeaning: "Ask if international cards are accepted.",
    acceptableAnswers: ["Do you accept international cards?", "Will my foreign card work?", "Can I use this card here?", "Do you take Visa cards from abroad?"],
    followUpQuestion: "Is it Visa or Mastercard?",
    idealAnswer: "Visa."
  },
  {
    id: "payment-round-up-217",
    level: "A2",
    category: "payment",
    prompt: "The cashier asks if you want to round up for charity.",
    targetMeaning: "Accept or decline rounding up.",
    acceptableAnswers: ["No, thank you.", "Yes, that's fine.", "Sure, you can round it up.", "Not today, thanks."],
    followUpQuestion: "Do you want a receipt?",
    idealAnswer: "Yes, please."
  },
  {
    id: "payment-price-match-218",
    level: "A2",
    category: "payment",
    prompt: "You found a lower price online.",
    targetMeaning: "Ask if the store can match the price.",
    acceptableAnswers: ["Do you match online prices?", "Can you match this price?", "I found it cheaper online.", "Is price matching possible?"],
    followUpQuestion: "Can I see the online price?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "payment-coupon-219",
    level: "A2",
    category: "payment",
    prompt: "You have a coupon code.",
    targetMeaning: "Ask to use a coupon.",
    acceptableAnswers: ["Can I use this coupon?", "I have a discount code.", "Can you apply this coupon?", "Does this code still work?"],
    followUpQuestion: "Can I see the code?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "payment-bill-copy-220",
    level: "A2",
    category: "payment",
    prompt: "You need another copy of the bill.",
    targetMeaning: "Ask for a copy of the bill.",
    acceptableAnswers: ["Could I get another copy of the bill?", "Can you print the bill again?", "I need a copy for my records.", "Could you send me the bill by email?"],
    followUpQuestion: "Printed or email?",
    idealAnswer: "Email, please."
  },
  {
    id: "emergency-call-help-221",
    level: "A1",
    category: "emergency",
    prompt: "You need someone to call for help.",
    targetMeaning: "Ask someone to call for help.",
    acceptableAnswers: ["Please call for help.", "Can you help me?", "I need help now.", "Could you call emergency services?"],
    followUpQuestion: "What happened?",
    idealAnswer: "Someone fell."
  },
  {
    id: "emergency-chest-pain-222",
    level: "A2",
    category: "emergency",
    prompt: "You have chest pain.",
    targetMeaning: "Say that you have chest pain and need help.",
    acceptableAnswers: ["I have chest pain.", "My chest hurts.", "I need a doctor.", "Please help me. I have pain in my chest."],
    followUpQuestion: "Can you breathe normally?",
    idealAnswer: "Not very well."
  },
  {
    id: "emergency-dizzy-223",
    level: "A2",
    category: "emergency",
    prompt: "You feel dizzy.",
    targetMeaning: "Say that you feel dizzy and need to sit or get help.",
    acceptableAnswers: ["I feel dizzy.", "I need to sit down.", "I don't feel well.", "Can you help me? I feel light-headed."],
    followUpQuestion: "Do you need water?",
    idealAnswer: "Yes, please."
  },
  {
    id: "emergency-stomach-pain-224",
    level: "A2",
    category: "emergency",
    prompt: "You have stomach pain.",
    targetMeaning: "Say that your stomach hurts.",
    acceptableAnswers: ["My stomach hurts.", "I have stomach pain.", "Do you have medicine for stomach pain?", "I feel sick in my stomach."],
    followUpQuestion: "When did it start?",
    idealAnswer: "This morning."
  },
  {
    id: "emergency-prescription-225",
    level: "A2",
    category: "emergency",
    prompt: "You need to refill a prescription.",
    targetMeaning: "Ask to refill or get medicine from a prescription.",
    acceptableAnswers: ["I need to refill this prescription.", "Can I get this medicine?", "Here is my prescription.", "Do you have this medicine?"],
    followUpQuestion: "Do you have your ID?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "emergency-hospital-location-226",
    level: "A1",
    category: "emergency",
    prompt: "You need the nearest hospital.",
    targetMeaning: "Ask where the nearest hospital is.",
    acceptableAnswers: ["Where is the nearest hospital?", "I need a hospital.", "How can I get to the hospital?", "Is there a hospital near here?"],
    followUpQuestion: "Is it an emergency?",
    idealAnswer: "Yes, it is."
  },
  {
    id: "emergency-passport-lost-227",
    level: "A2",
    category: "emergency",
    prompt: "You lost your passport.",
    targetMeaning: "Say that you lost your passport and ask for help.",
    acceptableAnswers: ["I lost my passport.", "My passport is missing.", "Could you help me? I lost my passport.", "Where should I report a lost passport?"],
    followUpQuestion: "Do you have a copy?",
    idealAnswer: "Yes, on my phone."
  },
  {
    id: "emergency-card-stolen-228",
    level: "A2",
    category: "emergency",
    prompt: "Your bank card was stolen.",
    targetMeaning: "Say that your card was stolen.",
    acceptableAnswers: ["My card was stolen.", "I need to block my card.", "Someone stole my bank card.", "Can you help me call the bank?"],
    followUpQuestion: "Do you know your bank number?",
    idealAnswer: "I have it on my phone."
  },
  {
    id: "emergency-need-embassy-229",
    level: "A2",
    category: "emergency",
    prompt: "You need your embassy.",
    targetMeaning: "Ask where or how to contact your embassy.",
    acceptableAnswers: ["Where is my embassy?", "How can I contact the Saudi embassy?", "I need help from my embassy.", "Can you show me the embassy address?"],
    followUpQuestion: "What country are you from?",
    idealAnswer: "Saudi Arabia."
  },
  {
    id: "emergency-fire-alarm-230",
    level: "A2",
    category: "emergency",
    prompt: "You hear a fire alarm in a building.",
    targetMeaning: "Ask what to do or where to go.",
    acceptableAnswers: ["What should I do?", "Where is the exit?", "Is this a real alarm?", "Should we leave the building?"],
    followUpQuestion: "Can you use the stairs?",
    idealAnswer: "Yes, I can."
  },
  {
    id: "emergency-locked-out-231",
    level: "A2",
    category: "emergency",
    prompt: "You are locked out of your room.",
    targetMeaning: "Say that you are locked out and need help.",
    acceptableAnswers: ["I'm locked out of my room.", "I can't get into my room.", "My key is inside.", "Could you help me open my room?"],
    followUpQuestion: "What is your room number?",
    idealAnswer: "Room 412."
  },
  {
    id: "emergency-cut-finger-232",
    level: "A2",
    category: "emergency",
    prompt: "You cut your finger.",
    targetMeaning: "Say that you cut your finger and need first aid.",
    acceptableAnswers: ["I cut my finger.", "Do you have a bandage?", "My finger is bleeding.", "Can you help me with this cut?"],
    followUpQuestion: "Is it deep?",
    idealAnswer: "No, not deep."
  },
  {
    id: "emergency-sick-hotel-233",
    level: "A2",
    category: "emergency",
    prompt: "You feel sick in your hotel room.",
    targetMeaning: "Ask the hotel for medical help.",
    acceptableAnswers: ["I feel sick. Can you help me?", "Could you call a doctor?", "I need medical help.", "Can someone come to my room?"],
    followUpQuestion: "Do you need an ambulance?",
    idealAnswer: "No, a doctor is enough."
  },
  {
    id: "emergency-medicine-side-effect-234",
    level: "A2",
    category: "emergency",
    prompt: "You want to ask about medicine side effects.",
    targetMeaning: "Ask if the medicine has side effects.",
    acceptableAnswers: ["Does this medicine have side effects?", "Will this make me sleepy?", "Is it safe to take this?", "What side effects should I expect?"],
    followUpQuestion: "Are you taking other medicine?",
    idealAnswer: "No, I'm not."
  },
  {
    id: "emergency-insurance-card-235",
    level: "A2",
    category: "emergency",
    prompt: "The clinic asks for your insurance card.",
    targetMeaning: "Say you have insurance or ask if you can pay.",
    acceptableAnswers: ["Here is my insurance card.", "I don't have insurance. Can I pay?", "I have travel insurance.", "Can I show it on my phone?"],
    followUpQuestion: "Can I see your passport too?",
    idealAnswer: "Yes, here it is."
  },
  {
    id: "smalltalk-nice-to-meet-236",
    level: "A1",
    category: "small-talk",
    prompt: "Someone says it is nice to meet you.",
    targetMeaning: "Reply naturally to nice to meet you.",
    acceptableAnswers: ["Nice to meet you too.", "You too.", "It's nice to meet you too.", "Thank you, same here."],
    followUpQuestion: "How are you today?",
    idealAnswer: "I'm good, thank you."
  },
  {
    id: "smalltalk-job-237",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks what you do.",
    targetMeaning: "Say your job or work area simply.",
    acceptableAnswers: ["I'm a teacher.", "I work at a university.", "I work in education.", "I'm in administration."],
    followUpQuestion: "Do you enjoy it?",
    idealAnswer: "Yes, I do."
  },
  {
    id: "smalltalk-studies-238",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks what you are studying.",
    targetMeaning: "Say what you study.",
    acceptableAnswers: ["I'm studying English.", "I study at a university.", "I'm learning English now.", "I study education."],
    followUpQuestion: "Is it difficult?",
    idealAnswer: "A little, but I like it."
  },
  {
    id: "smalltalk-travel-239",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks if you like traveling.",
    targetMeaning: "Answer naturally about travel.",
    acceptableAnswers: ["Yes, I like traveling.", "I enjoy visiting new places.", "Yes, especially with my family.", "I like travel, but I don't travel often."],
    followUpQuestion: "Where did you go last?",
    idealAnswer: "I went to Dubai."
  },
  {
    id: "smalltalk-food-240",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks what food you like.",
    targetMeaning: "Talk briefly about food you like.",
    acceptableAnswers: ["I like rice and chicken.", "I enjoy Italian food.", "I like spicy food.", "My favorite food is kabsa."],
    followUpQuestion: "Do you cook?",
    idealAnswer: "Sometimes."
  },
  {
    id: "smalltalk-city-241",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks about your city.",
    targetMeaning: "Say something simple about your city.",
    acceptableAnswers: ["My city is beautiful.", "Taif has nice weather.", "It is a quiet city.", "There are many mountains near my city."],
    followUpQuestion: "Is it far from Riyadh?",
    idealAnswer: "Yes, it is far."
  },
  {
    id: "smalltalk-family-242",
    level: "A1",
    category: "small-talk",
    prompt: "Someone asks about your family.",
    targetMeaning: "Answer briefly about family.",
    acceptableAnswers: ["I have a big family.", "I live with my family.", "I have two brothers.", "My family is in Saudi Arabia."],
    followUpQuestion: "Do they live near you?",
    idealAnswer: "Yes, they do."
  },
  {
    id: "smalltalk-free-time-243",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks what you do in your free time.",
    targetMeaning: "Say a simple free-time activity.",
    acceptableAnswers: ["I read books.", "I walk with my friends.", "I watch movies.", "I spend time with my family."],
    followUpQuestion: "What kind of movies?",
    idealAnswer: "Mostly documentaries."
  },
  {
    id: "smalltalk-english-learning-244",
    level: "A2",
    category: "small-talk",
    prompt: "Someone asks why you are learning English.",
    targetMeaning: "Explain a reason for learning English.",
    acceptableAnswers: ["I need English for travel.", "I want to speak more fluently.", "English is useful for work.", "I enjoy learning languages."],
    followUpQuestion: "Do you practice every day?",
    idealAnswer: "Yes, I try to."
  },
  {
    id: "smalltalk-can-you-repeat-name-245",
    level: "A1",
    category: "small-talk",
    prompt: "You did not hear someone's name.",
    targetMeaning: "Ask them to repeat their name.",
    acceptableAnswers: ["Could you repeat your name?", "Sorry, what was your name?", "Can you say your name again?", "I didn't catch your name."],
    followUpQuestion: "It's James.",
    idealAnswer: "Nice to meet you, James."
  },
  {
    id: "smalltalk-keep-in-touch-246",
    level: "A2",
    category: "small-talk",
    prompt: "You want to keep in touch with someone.",
    targetMeaning: "Ask for contact or suggest staying in touch.",
    acceptableAnswers: ["Let's keep in touch.", "Can I have your number?", "Are you on WhatsApp?", "It would be nice to stay in touch."],
    followUpQuestion: "Do you use WhatsApp?",
    idealAnswer: "Yes, I do."
  },
  {
    id: "smalltalk-photo-247",
    level: "A2",
    category: "small-talk",
    prompt: "You want someone to take a photo of you.",
    targetMeaning: "Ask someone to take a photo.",
    acceptableAnswers: ["Could you take a photo of me?", "Can you take our picture?", "Would you mind taking a photo?", "Could you press this button?"],
    followUpQuestion: "Portrait or landscape?",
    idealAnswer: "Portrait, please."
  },
  {
    id: "smalltalk-sorry-late-248",
    level: "A2",
    category: "small-talk",
    prompt: "You arrive late to meet someone.",
    targetMeaning: "Apologize for being late.",
    acceptableAnswers: ["Sorry I'm late.", "I'm sorry for being late.", "The traffic was heavy.", "Sorry to keep you waiting."],
    followUpQuestion: "No problem. Are you okay?",
    idealAnswer: "Yes, thank you."
  },
  {
    id: "smalltalk-invitation-decline-249",
    level: "A2",
    category: "small-talk",
    prompt: "Someone invites you out but you are busy.",
    targetMeaning: "Politely decline an invitation.",
    acceptableAnswers: ["Thanks, but I'm busy tonight.", "I can't today, sorry.", "Maybe another time.", "I'd love to, but I have plans."],
    followUpQuestion: "Maybe tomorrow?",
    idealAnswer: "Tomorrow might work."
  },
  {
    id: "smalltalk-invitation-accept-250",
    level: "A2",
    category: "small-talk",
    prompt: "Someone invites you to join them.",
    targetMeaning: "Accept an invitation naturally.",
    acceptableAnswers: ["Sure, I'd love to.", "That sounds great.", "Yes, thank you.", "I'd be happy to join you."],
    followUpQuestion: "Can you come at seven?",
    idealAnswer: "Yes, seven is fine."
  }
] satisfies SituationSeed[]).map(createSituation);

export const situations: Situation[] = [...coreSituations, ...additionalSituations, ...stageOneExpansionSituations];
