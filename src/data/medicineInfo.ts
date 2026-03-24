// Patient-facing medication information (demo/mock data)
export interface MedicineInfo {
  name: string;
  whatIsItFor: string;
  howToTake: string;
  commonSideEffects: string[];
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
    foodAndDrink: "Ask your pharmacist about any food or drink interactions.",
    missedDose: "Take as soon as you remember. If it's almost time for your next dose, skip the missed one. Do not take a double dose.",
    warnings: ["Follow your doctor's instructions carefully", "Report any unusual symptoms to your doctor", "Do not share this medication with others"],
    storage: "Store at room temperature, away from moisture and heat.",
  };
}
