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

export const situations: Situation[] = [...coreSituations, ...additionalSituations];
