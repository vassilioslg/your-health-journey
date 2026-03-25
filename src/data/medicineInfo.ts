// Patient-facing medication information (demo/mock data)

export interface SideEffectsByCategory {
  common: string[];
  lessCommon: string[];
  urgent: string[];
}

export interface MedicineInfo {
  name: string;
  whatIsItFor: string;
  howToTake: string;
  commonSideEffects: string[];
  sideEffectsByCategory: SideEffectsByCategory;
  whenToCall: string;
  sideEffectDuration: string;
  foodAndDrink: string;
  missedDose: string;
  warnings: string[];
  storage: string;
}

const medicineInfoMap: Record<string, MedicineInfo> = {
  Metformin: {
    name: "Metformin",
    whatIsItFor: "Used to control high blood sugar in type 2 diabetes. It helps your body respond better to insulin.",
    howToTake: "Take with meals to reduce stomach upset. Swallow whole with water — do not crush or chew.",
    commonSideEffects: ["Nausea", "Diarrhea", "Stomach pain", "Loss of appetite", "Metallic taste"],
    sideEffectsByCategory: {
      common: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
      lessCommon: ["Loss of appetite", "Headache", "Muscle pain"],
      urgent: ["Severe muscle pain", "Difficulty breathing", "Unusual fatigue", "Yellowing of skin"],
    },
    whenToCall: "Call your pharmacist if stomach issues persist for more than 2 weeks. Seek urgent care for breathing difficulty or severe muscle pain.",
    sideEffectDuration: "Stomach side effects typically improve within 2-4 weeks as your body adjusts.",
    foodAndDrink: "Avoid excessive alcohol — it increases the risk of a rare but serious condition called lactic acidosis.",
    missedDose: "Take it as soon as you remember. If it's almost time for your next dose, skip the missed one — do not double up.",
    warnings: ["Tell your doctor if you have kidney problems", "Stay hydrated, especially during illness", "Inform your doctor before any surgery or imaging tests with contrast dye"],
    storage: "Store at room temperature, away from moisture and heat.",
  },
  Lisinopril: {
    name: "Lisinopril",
    whatIsItFor: "Used to treat high blood pressure and heart failure. It relaxes blood vessels so blood flows more easily.",
    howToTake: "Take once daily at the same time each day, with or without food.",
    commonSideEffects: ["Dry cough", "Dizziness", "Headache", "Fatigue", "Nausea"],
    sideEffectsByCategory: {
      common: ["Dry cough", "Dizziness", "Headache"],
      lessCommon: ["Fatigue", "Nausea", "Rash"],
      urgent: ["Swelling of face/lips/tongue", "Fainting", "Severe dizziness", "Chest pain"],
    },
    whenToCall: "Persistent cough — speak with your pharmacist. Swelling of face or tongue — call 999 immediately.",
    sideEffectDuration: "Dry cough may persist while taking the medication. Dizziness usually improves within a few days.",
    foodAndDrink: "Avoid potassium supplements and salt substitutes unless directed by your doctor.",
    missedDose: "Take it as soon as you remember. Skip if it's near your next dose.",
    warnings: ["May cause dizziness — stand up slowly", "Do not use if pregnant", "Tell your doctor if you experience swelling of face, lips, or tongue"],
    storage: "Store at room temperature away from light and moisture.",
  },
  Atorvastatin: {
    name: "Atorvastatin",
    whatIsItFor: "Used to lower cholesterol and reduce the risk of heart disease and stroke.",
    howToTake: "Take once daily, usually in the evening. Can be taken with or without food.",
    commonSideEffects: ["Muscle aches", "Joint pain", "Diarrhea", "Nausea", "Headache"],
    sideEffectsByCategory: {
      common: ["Muscle aches", "Joint pain", "Mild digestive issues"],
      lessCommon: ["Headache", "Difficulty sleeping", "Dizziness"],
      urgent: ["Severe muscle pain/weakness", "Dark urine", "Yellowing of eyes/skin", "Unusual fatigue"],
    },
    whenToCall: "Unexplained muscle pain — contact your doctor within 24 hours. Dark urine or yellowing skin — seek urgent care.",
    sideEffectDuration: "Mild muscle aches may come and go. Report persistent muscle symptoms to your doctor.",
    foodAndDrink: "Avoid large amounts of grapefruit or grapefruit juice — it can increase side effects.",
    missedDose: "Take it as soon as you remember. If it's almost time for the next dose, skip the missed one.",
    warnings: ["Report unexplained muscle pain or weakness immediately", "Regular blood tests may be needed to check liver function", "Tell your doctor about all other medications you take"],
    storage: "Store at room temperature, away from moisture.",
  },
  Amlodipine: {
    name: "Amlodipine",
    whatIsItFor: "Used to treat high blood pressure and chest pain (angina). It relaxes blood vessels.",
    howToTake: "Take once daily at the same time, with or without food.",
    commonSideEffects: ["Swelling of ankles/feet", "Dizziness", "Flushing", "Fatigue"],
    sideEffectsByCategory: {
      common: ["Swelling of ankles/feet", "Dizziness", "Flushing"],
      lessCommon: ["Fatigue", "Nausea", "Palpitations"],
      urgent: ["Severe dizziness", "Rapid heartbeat", "Chest pain", "Fainting"],
    },
    whenToCall: "Persistent swelling — speak with your doctor. Chest pain or fainting — call 999 immediately.",
    sideEffectDuration: "Ankle swelling may persist but is usually harmless. Dizziness typically improves within a week.",
    foodAndDrink: "Avoid grapefruit juice as it may increase the drug's effects.",
    missedDose: "Take as soon as you remember. Skip if near next dose.",
    warnings: ["May cause dizziness — avoid driving until you know how it affects you", "Do not stop suddenly without consulting your doctor"],
    storage: "Store at room temperature.",
  },
  Omeprazole: {
    name: "Omeprazole",
    whatIsItFor: "Used to reduce stomach acid. Treats heartburn, acid reflux (GERD), and stomach ulcers.",
    howToTake: "Take 30 minutes before a meal, usually in the morning. Swallow whole — do not crush or chew.",
    commonSideEffects: ["Headache", "Nausea", "Diarrhea", "Stomach pain", "Gas"],
    sideEffectsByCategory: {
      common: ["Headache", "Nausea", "Diarrhea", "Gas"],
      lessCommon: ["Dizziness", "Constipation", "Dry mouth"],
      urgent: ["Severe diarrhea with fever", "Joint pain", "Skin rash with peeling"],
    },
    whenToCall: "Severe or watery diarrhea — contact your doctor immediately. Joint pain or rash — seek medical advice.",
    sideEffectDuration: "Most side effects are mild and resolve within the first week of use.",
    foodAndDrink: "No specific food restrictions, but take before eating for best effect.",
    missedDose: "Take as soon as you remember. If almost time for next dose, skip the missed one.",
    warnings: ["Long-term use may affect calcium and magnesium levels", "Tell your doctor if you experience severe diarrhea", "Not intended for immediate heartburn relief"],
    storage: "Store at room temperature in a dry place.",
  },
  Ibuprofen: {
    name: "Ibuprofen",
    whatIsItFor: "Used to relieve pain, reduce inflammation, and lower fever.",
    howToTake: "Take with food or milk to prevent stomach upset. Use the lowest effective dose for the shortest time.",
    commonSideEffects: ["Stomach upset", "Nausea", "Dizziness", "Headache", "Mild heartburn"],
    sideEffectsByCategory: {
      common: ["Stomach upset", "Nausea", "Mild heartburn"],
      lessCommon: ["Dizziness", "Headache", "Rash"],
      urgent: ["Black/bloody stools", "Vomiting blood", "Severe stomach pain", "Difficulty breathing"],
    },
    whenToCall: "Black stools or vomiting blood — seek emergency care. Persistent stomach pain — contact your doctor.",
    sideEffectDuration: "Stomach upset usually resolves once you stop taking it. Always take with food.",
    foodAndDrink: "Take with food. Avoid alcohol as it increases stomach bleeding risk.",
    missedDose: "Take as needed for pain. Do not exceed the recommended daily dose.",
    warnings: ["Do not take if you have a history of stomach ulcers", "Avoid if you have kidney disease", "Can increase blood pressure — monitor regularly"],
    storage: "Store at room temperature.",
  },
  Amoxicillin: {
    name: "Amoxicillin",
    whatIsItFor: "An antibiotic used to treat bacterial infections such as ear infections, throat infections, and urinary tract infections.",
    howToTake: "Take at evenly spaced intervals throughout the day. Can be taken with or without food. Complete the full course even if you feel better.",
    commonSideEffects: ["Diarrhea", "Nausea", "Skin rash", "Vomiting"],
    sideEffectsByCategory: {
      common: ["Diarrhea", "Nausea", "Vomiting"],
      lessCommon: ["Skin rash", "Headache", "Stomach cramps"],
      urgent: ["Severe rash or hives", "Difficulty breathing", "Swelling of face/throat", "Severe watery diarrhea"],
    },
    whenToCall: "Rash or difficulty breathing — stop taking and seek emergency care (possible allergic reaction).",
    sideEffectDuration: "Digestive side effects usually resolve within a few days of completing the course.",
    foodAndDrink: "No specific food restrictions. Stay well hydrated.",
    missedDose: "Take as soon as you remember. If near next dose, skip the missed one. Do not double up.",
    warnings: ["Tell your doctor if you are allergic to penicillin", "Complete the full course to prevent antibiotic resistance", "Contact your doctor if you develop a severe rash or difficulty breathing"],
    storage: "Store at room temperature. Keep liquid forms refrigerated.",
  },
  Sertraline: {
    name: "Sertraline",
    whatIsItFor: "Used to treat depression, anxiety, panic attacks, and OCD. It helps improve mood and energy levels.",
    howToTake: "Take once daily, in the morning or evening, with or without food.",
    commonSideEffects: ["Nausea", "Dizziness", "Drowsiness", "Dry mouth", "Insomnia", "Diarrhea"],
    sideEffectsByCategory: {
      common: ["Nausea", "Dizziness", "Drowsiness", "Insomnia"],
      lessCommon: ["Dry mouth", "Diarrhea", "Tremor", "Sweating"],
      urgent: ["Thoughts of self-harm", "Severe agitation", "Seizures", "Unusual bleeding"],
    },
    whenToCall: "Thoughts of self-harm — seek immediate help. Severe agitation or seizures — call 999.",
    sideEffectDuration: "Initial side effects (nausea, dizziness) usually improve within 1-2 weeks. Full benefits may take 4-6 weeks.",
    foodAndDrink: "Avoid alcohol as it may worsen side effects.",
    missedDose: "Take as soon as you remember. Skip if near next dose. Do not double up.",
    warnings: ["Do not stop suddenly — taper off under medical supervision", "May take 4–6 weeks to feel the full effect", "Report any thoughts of self-harm to your doctor immediately"],
    storage: "Store at room temperature away from moisture.",
  },
  Levothyroxine: {
    name: "Levothyroxine",
    whatIsItFor: "Used to treat an underactive thyroid (hypothyroidism). Replaces the hormone your thyroid isn't making enough of.",
    howToTake: "Take on an empty stomach, 30–60 minutes before breakfast, with a full glass of water.",
    commonSideEffects: ["Usually well-tolerated at correct dose", "Hair loss (temporary)", "Headache", "Weight changes"],
    sideEffectsByCategory: {
      common: ["Hair loss (temporary)", "Headache"],
      lessCommon: ["Weight changes", "Nervousness", "Sweating"],
      urgent: ["Rapid heartbeat", "Chest pain", "Shortness of breath", "Severe headache"],
    },
    whenToCall: "Rapid heartbeat or chest pain — seek medical attention immediately. Persistent hair loss — discuss with your doctor.",
    sideEffectDuration: "Hair loss is usually temporary and resolves within a few months. Other effects indicate dose adjustment may be needed.",
    foodAndDrink: "Avoid calcium, iron supplements, and antacids within 4 hours of taking this medication.",
    missedDose: "Take as soon as you remember. If near next dose, skip the missed one.",
    warnings: ["Regular blood tests are needed to check thyroid levels", "Do not switch brands without consulting your doctor", "Tell your doctor if you experience rapid heartbeat or chest pain"],
    storage: "Store at room temperature, away from light and moisture.",
  },
  Losartan: {
    name: "Losartan",
    whatIsItFor: "Used to treat high blood pressure and protect the kidneys in diabetes patients.",
    howToTake: "Take once or twice daily, with or without food, at the same time each day.",
    commonSideEffects: ["Dizziness", "Stuffy nose", "Back pain", "Fatigue", "Diarrhea"],
    sideEffectsByCategory: {
      common: ["Dizziness", "Stuffy nose", "Back pain"],
      lessCommon: ["Fatigue", "Diarrhea", "Muscle cramps"],
      urgent: ["Swelling of face/lips/tongue", "Fainting", "Severe dizziness", "Dark urine"],
    },
    whenToCall: "Swelling of face or tongue — call 999 immediately. Persistent dizziness — contact your doctor.",
    sideEffectDuration: "Dizziness usually improves within the first week as your body adjusts.",
    foodAndDrink: "Avoid potassium-rich foods in excess (bananas, oranges) and salt substitutes.",
    missedDose: "Take as soon as you remember. Skip if near next dose.",
    warnings: ["Do not use if pregnant", "May cause dizziness — be careful when standing up", "Stay hydrated"],
    storage: "Store at room temperature.",
  },
};

// Generate generic info for medicines not in the detailed map
export function getMedicineInfo(name: string): MedicineInfo {
  if (medicineInfoMap[name]) return medicineInfoMap[name];

  return {
    name,
    whatIsItFor: "This medication has been prescribed by your doctor for your specific condition. Follow their instructions.",
    howToTake: "Take exactly as prescribed by your doctor. Do not change the dose without consulting them.",
    commonSideEffects: ["Nausea", "Headache", "Dizziness", "Fatigue"],
    sideEffectsByCategory: {
      common: ["Nausea", "Headache", "Dizziness"],
      lessCommon: ["Fatigue", "Stomach upset", "Dry mouth"],
      urgent: ["Severe allergic reaction", "Difficulty breathing", "Unusual bleeding"],
    },
    whenToCall: "Contact your doctor if you experience any unusual or severe symptoms.",
    sideEffectDuration: "Most mild side effects improve within a few days. Consult your doctor if they persist.",
    foodAndDrink: "Ask your pharmacist about any food or drink interactions.",
    missedDose: "Take as soon as you remember. If it's almost time for your next dose, skip the missed one. Do not take a double dose.",
    warnings: ["Follow your doctor's instructions carefully", "Report any unusual symptoms to your doctor", "Do not share this medication with others"],
    storage: "Store at room temperature, away from moisture and heat.",
  };
}