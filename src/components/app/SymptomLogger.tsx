import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircle, AlertTriangle, CheckCircle2, Info, Clock,
  Send, Pill, Activity, X, ChevronDown, ChevronUp, Lightbulb, Brain
} from "lucide-react";

// Comprehensive symptom database with medication links
const symptomDatabase: Record<string, {
  medications: string[];
  severity: "high" | "moderate" | "low";
  explanation: string;
  advice: string;
}[]> = {
  "dizzy": [
    { medications: ["Lisinopril", "Losartan", "Amlodipine"], severity: "moderate", explanation: "Dizziness is common with blood pressure medications, especially when standing up quickly (orthostatic hypotension).", advice: "Rise slowly from sitting/lying positions. If persistent or severe, contact your doctor." },
    { medications: ["Atorvastatin", "Rosuvastatin", "Simvastatin"], severity: "low", explanation: "Less common side effect of statins.", advice: "Usually mild and temporary. Monitor and report if it worsens." },
    { medications: ["Sertraline", "Fluoxetine", "Escitalopram"], severity: "moderate", explanation: "SSRIs can cause dizziness, especially in the first weeks or with dose changes.", advice: "Avoid sudden position changes. Should improve within 1-2 weeks." },
    { medications: ["Gabapentin", "Pregabalin"], severity: "moderate", explanation: "Dizziness is one of the most common side effects of gabapentinoids.", advice: "Usually improves over time. Avoid driving until you know how it affects you." },
  ],
  "dizziness": [
    { medications: ["Lisinopril", "Losartan", "Amlodipine"], severity: "moderate", explanation: "Dizziness is common with blood pressure medications, especially when standing up quickly.", advice: "Rise slowly from sitting/lying positions. If persistent or severe, contact your doctor." },
    { medications: ["Metformin"], severity: "moderate", explanation: "Dizziness with Metformin could signal low blood sugar (hypoglycemia).", advice: "Check your blood sugar. Have a sugary snack if needed." },
  ],
  "nausea": [
    { medications: ["Metformin"], severity: "moderate", explanation: "Nausea is one of the most common side effects of Metformin, especially in early weeks.", advice: "Take with food. Symptoms usually improve within 2-4 weeks. Talk to your pharmacist about extended-release options." },
    { medications: ["Sertraline", "Fluoxetine", "Escitalopram", "Paroxetine"], severity: "moderate", explanation: "Nausea is very common when starting SSRIs and usually resolves within 1-2 weeks.", advice: "Take with food. Ginger tea may help. If persistent after 2 weeks, speak with your doctor." },
    { medications: ["Ibuprofen", "Naproxen", "Diclofenac"], severity: "moderate", explanation: "NSAIDs commonly irritate the stomach lining causing nausea.", advice: "Always take with food or milk. Consider a stomach-protecting medication." },
    { medications: ["Amoxicillin", "Azithromycin", "Doxycycline"], severity: "low", explanation: "Antibiotics frequently cause nausea by disrupting gut bacteria.", advice: "Take with food. Consider a probiotic supplement during your course." },
    { medications: ["Omeprazole", "Pantoprazole"], severity: "low", explanation: "Paradoxically, PPIs can cause mild nausea in some patients.", advice: "Usually resolves quickly. Take 30 minutes before meals." },
  ],
  "headache": [
    { medications: ["Lisinopril", "Losartan", "Amlodipine"], severity: "low", explanation: "Headaches can occur with blood pressure medications as your body adjusts.", advice: "Stay hydrated. Use paracetamol if needed. Usually resolves within a few days." },
    { medications: ["Metformin"], severity: "low", explanation: "Less common side effect of Metformin.", advice: "Monitor and stay hydrated." },
    { medications: ["Omeprazole", "Pantoprazole"], severity: "low", explanation: "Headache is a common side effect of proton pump inhibitors.", advice: "Usually mild and temporary. Stay hydrated." },
    { medications: ["Levothyroxine"], severity: "moderate", explanation: "Headaches with Levothyroxine may indicate the dose is too high.", advice: "Report to your doctor — dose adjustment may be needed." },
    { medications: ["Sertraline", "Fluoxetine"], severity: "low", explanation: "Headaches are common when starting or adjusting SSRI doses.", advice: "Usually improves within 1-2 weeks. Stay hydrated." },
  ],
  "muscle pain": [
    { medications: ["Atorvastatin", "Rosuvastatin", "Simvastatin"], severity: "high", explanation: "Muscle pain is a well-known side effect of statins. In rare cases, it can indicate rhabdomyolysis — a serious condition.", advice: "Contact your doctor within 24 hours. If accompanied by dark urine or severe weakness, seek urgent care." },
  ],
  "muscle ache": [
    { medications: ["Atorvastatin", "Rosuvastatin", "Simvastatin"], severity: "high", explanation: "Muscle aches are a well-known side effect of statins. In rare cases, it can indicate rhabdomyolysis.", advice: "Contact your doctor within 24 hours. If accompanied by dark urine or severe weakness, seek urgent care." },
  ],
  "cough": [
    { medications: ["Lisinopril", "Enalapril", "Ramipril"], severity: "moderate", explanation: "A persistent dry cough is a very common side effect of ACE inhibitors — affecting up to 15% of patients.", advice: "Speak with your pharmacist. Your doctor may switch you to an ARB (like Losartan) which doesn't cause cough." },
  ],
  "dry cough": [
    { medications: ["Lisinopril", "Enalapril", "Ramipril"], severity: "moderate", explanation: "A persistent dry cough is a very common side effect of ACE inhibitors.", advice: "Speak with your pharmacist. Your doctor may switch you to an ARB (like Losartan) which doesn't cause cough." },
  ],
  "stomach": [
    { medications: ["Metformin"], severity: "moderate", explanation: "GI discomfort is the most common side effect of Metformin.", advice: "Take with meals. If persistent beyond 2 weeks, ask about extended-release Metformin." },
    { medications: ["Ibuprofen", "Naproxen", "Aspirin"], severity: "moderate", explanation: "NSAIDs can irritate or damage the stomach lining.", advice: "Always take with food. Avoid alcohol. Consider a PPI for stomach protection." },
  ],
  "diarrhea": [
    { medications: ["Metformin"], severity: "moderate", explanation: "Diarrhea is a common GI side effect of Metformin.", advice: "Take with meals. Usually improves over time. Consider extended-release formulation." },
    { medications: ["Amoxicillin", "Azithromycin", "Cephalexin"], severity: "moderate", explanation: "Antibiotics disrupt gut bacteria, commonly causing diarrhea.", advice: "Stay hydrated. Consider probiotics. Contact doctor if severe or bloody." },
  ],
  "fatigue": [
    { medications: ["Lisinopril", "Losartan", "Amlodipine", "Metoprolol"], severity: "low", explanation: "Fatigue can occur with blood pressure medications as your body adjusts to lower BP.", advice: "Usually improves within 1-2 weeks. Ensure adequate sleep and hydration." },
    { medications: ["Atorvastatin", "Rosuvastatin"], severity: "moderate", explanation: "Unusual fatigue with statins could signal liver concerns.", advice: "If persistent, request liver function tests from your doctor." },
    { medications: ["Metformin"], severity: "moderate", explanation: "Fatigue with Metformin could indicate low blood sugar or vitamin B12 deficiency.", advice: "Check blood sugar levels. Ask your doctor about B12 supplementation." },
    { medications: ["Sertraline", "Fluoxetine", "Paroxetine"], severity: "moderate", explanation: "SSRIs can cause fatigue or drowsiness, especially initially.", advice: "Try taking your dose at bedtime instead. Should improve over weeks." },
    { medications: ["Levothyroxine"], severity: "moderate", explanation: "Ongoing fatigue with Levothyroxine may mean your dose needs adjusting.", advice: "Get your thyroid levels (TSH) checked." },
  ],
  "rash": [
    { medications: ["Lisinopril", "Enalapril"], severity: "moderate", explanation: "Skin rash may indicate an allergic reaction to ACE inhibitors.", advice: "Contact your doctor. If accompanied by swelling of face/lips, seek emergency care." },
    { medications: ["Amoxicillin", "Penicillin", "Cephalexin"], severity: "high", explanation: "Rash with antibiotics can indicate an allergic reaction.", advice: "Stop taking and contact your doctor immediately. Seek emergency care if breathing is affected." },
    { medications: ["Lamotrigine"], severity: "high", explanation: "Rash with Lamotrigine can rarely be a sign of Stevens-Johnson syndrome — a medical emergency.", advice: "Stop taking and seek emergency medical care immediately." },
  ],
  "swelling": [
    { medications: ["Lisinopril", "Enalapril"], severity: "high", explanation: "Swelling (angioedema) is a serious, potentially life-threatening side effect of ACE inhibitors.", advice: "If face, lips, tongue, or throat are swelling — call emergency services immediately." },
    { medications: ["Amlodipine", "Nifedipine"], severity: "moderate", explanation: "Ankle/foot swelling is a common side effect of calcium channel blockers.", advice: "Elevate your feet when resting. Speak with your doctor if bothersome." },
    { medications: ["Ibuprofen", "Naproxen"], severity: "moderate", explanation: "NSAIDs can cause fluid retention and swelling.", advice: "Reduce salt intake. If severe, contact your doctor." },
  ],
  "breathing": [
    { medications: ["Metformin"], severity: "high", explanation: "Difficulty breathing with Metformin could indicate lactic acidosis — a rare but serious condition.", advice: "Seek urgent medical care immediately." },
    { medications: ["Lisinopril", "Enalapril"], severity: "high", explanation: "Breathing difficulty with ACE inhibitors may indicate angioedema.", advice: "Call emergency services immediately." },
  ],
  "shortness of breath": [
    { medications: ["Metoprolol", "Atenolol", "Propranolol"], severity: "moderate", explanation: "Beta-blockers can cause breathing difficulties, especially in asthma patients.", advice: "Contact your doctor. Do not stop suddenly without medical advice." },
  ],
  "chest pain": [
    { medications: ["Lisinopril", "Atorvastatin"], severity: "high", explanation: "Chest pain requires immediate evaluation. It may not be medication-related.", advice: "Call emergency services immediately." },
  ],
  "insomnia": [
    { medications: ["Atorvastatin", "Rosuvastatin"], severity: "low", explanation: "Some patients report sleep difficulties with statins.", advice: "Try taking your statin in the morning instead of evening. Discuss with your pharmacist." },
    { medications: ["Sertraline", "Fluoxetine", "Escitalopram"], severity: "moderate", explanation: "SSRIs can disrupt sleep, especially when taken in the evening.", advice: "Switch to morning dosing. Practice good sleep hygiene." },
    { medications: ["Prednisone", "Methylprednisolone"], severity: "moderate", explanation: "Steroids commonly cause insomnia and restlessness.", advice: "Take your dose in the morning. This usually resolves when the course ends." },
    { medications: ["Albuterol"], severity: "low", explanation: "Albuterol can cause stimulation that affects sleep.", advice: "Avoid using close to bedtime if possible." },
  ],
  "metallic taste": [
    { medications: ["Metformin"], severity: "low", explanation: "Metallic taste is a common side effect of Metformin.", advice: "Usually temporary. Sugar-free mints or gum can help." },
    { medications: ["Lisinopril", "Captopril"], severity: "low", explanation: "ACE inhibitors can alter taste perception.", advice: "Usually mild and improves over time." },
  ],
  "constipation": [
    { medications: ["Oxycodone", "Hydrocodone", "Tramadol", "Morphine"], severity: "moderate", explanation: "Opioids slow gut motility, making constipation very common.", advice: "Increase fluid and fiber intake. Ask about a stool softener." },
    { medications: ["Amlodipine", "Verapamil", "Diltiazem"], severity: "low", explanation: "Calcium channel blockers can slow bowel movements.", advice: "Stay hydrated and increase dietary fiber." },
    { medications: ["Ferrous Sulfate"], severity: "moderate", explanation: "Iron supplements commonly cause constipation.", advice: "Take with vitamin C. Increase water and fiber intake." },
  ],
  "weight gain": [
    { medications: ["Sertraline", "Paroxetine", "Mirtazapine"], severity: "low", explanation: "Some antidepressants can cause weight gain over time.", advice: "Monitor your weight. Discuss alternatives if significant weight change occurs." },
    { medications: ["Prednisone", "Prednisolone"], severity: "moderate", explanation: "Corticosteroids increase appetite and promote fluid retention.", advice: "Watch your salt and calorie intake. Weight usually normalizes after stopping." },
    { medications: ["Insulin Glargine", "Insulin Lispro", "Glipizide"], severity: "low", explanation: "Insulin and some diabetes medications can cause weight gain.", advice: "Focus on diet and exercise. Discuss with your doctor." },
  ],
  "dry mouth": [
    { medications: ["Sertraline", "Fluoxetine", "Paroxetine"], severity: "low", explanation: "Dry mouth is a common side effect of SSRIs.", advice: "Sip water frequently. Sugar-free gum can help stimulate saliva." },
    { medications: ["Hydroxyzine", "Diphenhydramine", "Cetirizine"], severity: "low", explanation: "Antihistamines commonly cause dry mouth.", advice: "Stay hydrated. Use sugar-free lozenges." },
    { medications: ["Oxybutynin", "Solifenacin"], severity: "moderate", explanation: "Anticholinergic medications frequently cause dry mouth.", advice: "Sip water often. Avoid caffeine and alcohol." },
  ],
  "blurred vision": [
    { medications: ["Metformin"], severity: "moderate", explanation: "Vision changes with Metformin may indicate blood sugar fluctuations.", advice: "Check your blood sugar. Contact your doctor if it persists." },
    { medications: ["Gabapentin", "Pregabalin"], severity: "low", explanation: "Blurred vision is a known side effect of gabapentinoids.", advice: "Usually improves over time. Avoid driving if affected." },
    { medications: ["Hydroxyzine", "Diphenhydramine"], severity: "low", explanation: "Antihistamines can cause blurred vision.", advice: "Avoid driving. Usually temporary." },
  ],
  "anxiety": [
    { medications: ["Albuterol"], severity: "low", explanation: "Albuterol can cause jitteriness and anxiety-like symptoms.", advice: "These effects are usually short-lived after each use." },
    { medications: ["Levothyroxine"], severity: "moderate", explanation: "Anxiety with Levothyroxine may indicate the dose is too high (hyperthyroidism symptoms).", advice: "Get your thyroid levels checked. Dose adjustment may be needed." },
    { medications: ["Prednisone"], severity: "moderate", explanation: "Corticosteroids can cause mood changes including anxiety and agitation.", advice: "Usually resolves when the course ends. Speak with your doctor if severe." },
  ],
  "depression": [
    { medications: ["Metoprolol", "Atenolol", "Propranolol"], severity: "moderate", explanation: "Beta-blockers have been associated with depressive symptoms in some patients.", advice: "Report mood changes to your doctor. Alternative medications may be available." },
    { medications: ["Prednisone", "Prednisolone"], severity: "moderate", explanation: "Corticosteroids can cause mood swings and depression.", advice: "Speak with your doctor, especially for long courses." },
  ],
  "joint pain": [
    { medications: ["Atorvastatin", "Rosuvastatin"], severity: "moderate", explanation: "Joint pain can occur with statins and should be monitored.", advice: "Report to your doctor. They may adjust the type or dose of statin." },
    { medications: ["Levothyroxine"], severity: "low", explanation: "Joint pain can occur if thyroid dose isn't optimal.", advice: "Get your thyroid levels checked at your next appointment." },
  ],
  "bruising": [
    { medications: ["Aspirin", "Clopidogrel", "Warfarin", "Rivaroxaban", "Apixaban"], severity: "moderate", explanation: "Blood thinners make bruising more likely by reducing clotting ability.", advice: "Avoid injuries. If bruising is excessive or you notice blood in stool/urine, contact your doctor." },
    { medications: ["Prednisone", "Prednisolone"], severity: "low", explanation: "Long-term steroids thin the skin, making bruising easier.", advice: "Be gentle with your skin. Report unusual bruising to your doctor." },
    { medications: ["Ibuprofen", "Naproxen"], severity: "low", explanation: "NSAIDs affect platelet function and can increase bruising.", advice: "Avoid taking with other blood thinners." },
  ],
  "tremor": [
    { medications: ["Albuterol"], severity: "low", explanation: "Tremor is a common side effect of bronchodilators.", advice: "Usually mild and temporary after each use." },
    { medications: ["Levothyroxine"], severity: "moderate", explanation: "Tremor with Levothyroxine suggests the dose may be too high.", advice: "Contact your doctor for a dose review." },
    { medications: ["Sertraline", "Fluoxetine"], severity: "low", explanation: "SSRIs can occasionally cause tremor.", advice: "Usually mild. Report to your doctor if bothersome." },
  ],
  "heartburn": [
    { medications: ["Ibuprofen", "Naproxen", "Aspirin"], severity: "moderate", explanation: "NSAIDs can cause or worsen heartburn by irritating the stomach lining.", advice: "Take with food. Consider using a PPI for protection. Speak with your pharmacist." },
    { medications: ["Alendronate"], severity: "moderate", explanation: "Bisphosphonates can irritate the esophagus.", advice: "Take with a full glass of water and remain upright for 30 minutes after." },
  ],
  "appetite loss": [
    { medications: ["Metformin"], severity: "low", explanation: "Reduced appetite is common with Metformin, especially initially.", advice: "Eat small, frequent meals. Usually improves over time." },
    { medications: ["Sertraline", "Fluoxetine"], severity: "low", explanation: "SSRIs can suppress appetite, especially in the first few weeks.", advice: "Try to maintain regular meals. Should stabilize over time." },
    { medications: ["Methylphenidate", "Amphetamine"], severity: "moderate", explanation: "Stimulant medications commonly suppress appetite.", advice: "Eat a good breakfast before your dose. Have a nutritious dinner." },
  ],
  "drowsiness": [
    { medications: ["Gabapentin", "Pregabalin"], severity: "moderate", explanation: "Drowsiness is one of the most common side effects of gabapentinoids.", advice: "Avoid driving until you know how it affects you. Usually improves over time." },
    { medications: ["Hydroxyzine", "Diphenhydramine"], severity: "moderate", explanation: "Antihistamines are well-known for causing drowsiness.", advice: "Avoid driving or operating machinery. Consider taking at bedtime." },
    { medications: ["Trazodone"], severity: "moderate", explanation: "Trazodone causes significant drowsiness, which is why it's often used for sleep.", advice: "Take at bedtime. Avoid driving for several hours after taking." },
    { medications: ["Quetiapine", "Olanzapine"], severity: "moderate", explanation: "Antipsychotics commonly cause sedation.", advice: "Take at bedtime. Avoid driving until adjusted." },
  ],
  "mood swings": [
    { medications: ["Prednisone", "Prednisolone", "Dexamethasone"], severity: "moderate", explanation: "Corticosteroids are well-known for causing mood changes, irritability, and emotional instability.", advice: "These effects usually resolve when the course ends. Speak with your doctor if severe." },
    { medications: ["Levothyroxine"], severity: "low", explanation: "Mood changes may indicate thyroid dose needs adjustment.", advice: "Get your thyroid levels checked." },
  ],
  "tingling": [
    { medications: ["Metformin"], severity: "moderate", explanation: "Tingling or numbness can indicate vitamin B12 deficiency caused by long-term Metformin use.", advice: "Ask your doctor about B12 level testing and supplementation." },
    { medications: ["Gabapentin", "Pregabalin"], severity: "low", explanation: "Paradoxically, nerve pain medications can sometimes cause tingling.", advice: "Monitor and report to your doctor." },
  ],
  "numbness": [
    { medications: ["Metformin"], severity: "moderate", explanation: "Numbness in hands or feet can indicate B12 deficiency from long-term Metformin use.", advice: "Request B12 testing from your doctor. Supplementation may be needed." },
  ],
  "hair loss": [
    { medications: ["Levothyroxine"], severity: "low", explanation: "Temporary hair loss can occur when starting or changing Levothyroxine dose.", advice: "Usually temporary (2-3 months). Should resolve once your body adjusts." },
    { medications: ["Atorvastatin", "Rosuvastatin"], severity: "low", explanation: "Hair loss is a rare side effect of statins.", advice: "Report to your doctor if significant." },
    { medications: ["Methotrexate"], severity: "moderate", explanation: "Hair thinning is a known side effect of Methotrexate.", advice: "Folic acid supplementation may help. Discuss with your doctor." },
  ],
  "frequent urination": [
    { medications: ["Furosemide", "Hydrochlorothiazide", "Chlorthalidone"], severity: "low", explanation: "Diuretics work by increasing urine output — this is the intended effect.", advice: "Take in the morning to avoid nighttime bathroom trips. Stay hydrated." },
    { medications: ["Dapagliflozin", "Empagliflozin"], severity: "low", explanation: "SGLT2 inhibitors work by excreting sugar through urine, increasing frequency.", advice: "This is expected. Maintain good hygiene to prevent urinary infections." },
    { medications: ["Metformin"], severity: "low", explanation: "Metformin can increase urination frequency in some patients.", advice: "Stay hydrated. Report if excessive." },
  ],
  "palpitations": [
    { medications: ["Albuterol"], severity: "moderate", explanation: "Bronchodilators can cause heart palpitations due to stimulant effects.", advice: "Usually short-lived. If persistent or accompanied by chest pain, seek medical care." },
    { medications: ["Levothyroxine"], severity: "moderate", explanation: "Palpitations may indicate your thyroid dose is too high.", advice: "Contact your doctor for a dose review and thyroid level check." },
  ],
  "sweating": [
    { medications: ["Sertraline", "Fluoxetine", "Venlafaxine"], severity: "low", explanation: "Excessive sweating is a common side effect of SSRIs and SNRIs.", advice: "Wear breathable clothing. Stay hydrated. Discuss with your doctor if bothersome." },
    { medications: ["Metformin"], severity: "moderate", explanation: "Sweating with Metformin could be a sign of low blood sugar.", advice: "Check your blood sugar level. Have a sugary snack if low." },
  ],
};

// Interaction risks
const interactionAlerts: {
  symptom: string;
  drugs: string[];
  alert: string;
  severity: "high" | "moderate";
}[] = [
  { symptom: "dizzy", drugs: ["Metformin", "Lisinopril"], alert: "Dizziness while taking Metformin + Lisinopril together could indicate hypoglycemia — Lisinopril can enhance Metformin's blood sugar-lowering effect.", severity: "high" },
  { symptom: "dizziness", drugs: ["Metformin", "Lisinopril"], alert: "Dizziness while taking Metformin + Lisinopril together could indicate hypoglycemia — Lisinopril can enhance Metformin's blood sugar-lowering effect.", severity: "high" },
  { symptom: "muscle pain", drugs: ["Atorvastatin"], alert: "Muscle pain with statins requires attention. If you're also consuming grapefruit, it can significantly increase Atorvastatin levels and worsen muscle side effects.", severity: "high" },
  { symptom: "fatigue", drugs: ["Metformin", "Lisinopril"], alert: "Combined fatigue effects: Lisinopril lowers blood pressure while Metformin can affect blood sugar. Together they may amplify fatigue — check both BP and glucose levels.", severity: "moderate" },
  { symptom: "bruising", drugs: ["Aspirin", "Ibuprofen"], alert: "Taking Aspirin and Ibuprofen together significantly increases bleeding risk. Ibuprofen can also reduce Aspirin's heart-protective effect.", severity: "high" },
  { symptom: "nausea", drugs: ["Metformin", "Ibuprofen"], alert: "Both Metformin and Ibuprofen can cause GI distress. Together they may significantly worsen stomach symptoms.", severity: "moderate" },
  { symptom: "drowsiness", drugs: ["Gabapentin", "Hydroxyzine"], alert: "Combining Gabapentin with Hydroxyzine amplifies sedation. Avoid driving or machinery. Risk of excessive sedation.", severity: "high" },
  { symptom: "swelling", drugs: ["Amlodipine", "Ibuprofen"], alert: "NSAIDs like Ibuprofen can worsen the fluid retention caused by Amlodipine and may reduce its blood pressure-lowering effect.", severity: "moderate" },
];

// Intelligent reasoning for unrecognized symptoms
const intelligentReasoning: {
  keywords: string[];
  reasoning: string;
  relatedMedCategories: { category: string; meds: string[]; explanation: string }[];
  generalAdvice: string;
}[] = [
  {
    keywords: ["cold", "chills", "shivering", "fever"],
    reasoning: "Feeling cold or having chills could be related to your medications affecting your metabolism, blood pressure, or immune response.",
    relatedMedCategories: [
      { category: "Blood pressure medications", meds: ["Lisinopril", "Losartan", "Metoprolol", "Amlodipine"], explanation: "BP medications lower blood pressure which can reduce circulation to extremities, causing cold sensations." },
      { category: "Thyroid medications", meds: ["Levothyroxine"], explanation: "If your thyroid dose isn't optimal, feeling cold is a classic hypothyroid symptom." },
      { category: "Diabetes medications", meds: ["Metformin", "Insulin Glargine"], explanation: "Low blood sugar episodes can cause chills and shivering." },
    ],
    generalAdvice: "Monitor your temperature. If you have a fever above 38°C/100.4°F, contact your doctor as some medications can affect immune response.",
  },
  {
    keywords: ["hungry", "appetite increase", "craving", "eating more"],
    reasoning: "Increased hunger or appetite changes can be a medication side effect affecting your metabolism or blood sugar regulation.",
    relatedMedCategories: [
      { category: "Steroids", meds: ["Prednisone", "Prednisolone", "Dexamethasone"], explanation: "Corticosteroids are well-known for significantly increasing appetite and cravings." },
      { category: "Diabetes medications", meds: ["Insulin Glargine", "Glipizide", "Metformin"], explanation: "Blood sugar fluctuations from diabetes medications can trigger hunger signals." },
      { category: "Antidepressants", meds: ["Mirtazapine", "Paroxetine"], explanation: "Some antidepressants increase appetite as a side effect." },
    ],
    generalAdvice: "Track your eating patterns. If you're on steroids, this is very common and usually resolves after the course. For diabetes medications, check your blood sugar when unusually hungry.",
  },
  {
    keywords: ["thirsty", "thirst", "dry throat", "dehydrated"],
    reasoning: "Excessive thirst can be caused by medications affecting fluid balance, blood sugar, or salivation.",
    relatedMedCategories: [
      { category: "Diuretics", meds: ["Furosemide", "Hydrochlorothiazide"], explanation: "Diuretics increase urination, which can lead to dehydration and thirst." },
      { category: "Diabetes medications", meds: ["Dapagliflozin", "Empagliflozin"], explanation: "SGLT2 inhibitors cause glucose excretion through urine, increasing fluid loss." },
      { category: "Anticholinergics", meds: ["Oxybutynin", "Hydroxyzine"], explanation: "These medications reduce saliva production, causing dry mouth and thirst." },
    ],
    generalAdvice: "Increase water intake. If thirst is excessive and persistent, it's worth checking your blood sugar and kidney function.",
  },
  {
    keywords: ["confused", "confusion", "foggy", "brain fog", "forgetful", "memory"],
    reasoning: "Cognitive changes like confusion or brain fog can be medication-related, especially with drugs that affect the central nervous system.",
    relatedMedCategories: [
      { category: "Sedating medications", meds: ["Gabapentin", "Pregabalin", "Hydroxyzine", "Diphenhydramine"], explanation: "These medications cross the blood-brain barrier and can impair cognition." },
      { category: "Blood pressure medications", meds: ["Metoprolol", "Atenolol", "Clonidine"], explanation: "Beta-blockers and central-acting agents can cause mental fogginess." },
      { category: "Thyroid medications", meds: ["Levothyroxine"], explanation: "Under- or over-treated thyroid conditions can cause cognitive symptoms." },
      { category: "Statins", meds: ["Atorvastatin", "Simvastatin"], explanation: "Some patients report cognitive effects with statins, though evidence is mixed." },
    ],
    generalAdvice: "Note when the fog is worst (after doses?). If it's significantly impacting daily life, discuss with your doctor — dose or medication changes may help.",
  },
  {
    keywords: ["dizzy when standing", "lightheaded", "faint", "fainting", "black out"],
    reasoning: "Feeling faint when standing suggests orthostatic hypotension, which is commonly caused by blood pressure medications.",
    relatedMedCategories: [
      { category: "Blood pressure medications", meds: ["Lisinopril", "Losartan", "Amlodipine", "Doxazosin", "Prazosin", "Tamsulosin"], explanation: "These medications lower blood pressure, and the drop can be most noticeable when standing." },
      { category: "Diuretics", meds: ["Furosemide", "Hydrochlorothiazide"], explanation: "Dehydration from diuretics worsens the blood pressure drop on standing." },
    ],
    generalAdvice: "Stand up slowly — sit on the edge of the bed first. Stay hydrated. If you actually faint, seek medical attention.",
  },
  {
    keywords: ["itching", "itchy", "itch", "hives"],
    reasoning: "Itching or hives can indicate an allergic reaction to a medication, which should be taken seriously.",
    relatedMedCategories: [
      { category: "Antibiotics", meds: ["Amoxicillin", "Penicillin", "Cephalexin", "Sulfamethoxazole"], explanation: "Allergic reactions to antibiotics are common and can cause itching/hives." },
      { category: "Pain medications", meds: ["Ibuprofen", "Naproxen", "Oxycodone"], explanation: "NSAIDs and opioids can cause histamine release and itching." },
      { category: "Blood pressure medications", meds: ["Lisinopril", "Enalapril"], explanation: "ACE inhibitors can cause allergic-type reactions." },
    ],
    generalAdvice: "If mild, an antihistamine may help. If accompanied by swelling, difficulty breathing, or spreading rapidly — seek emergency care immediately.",
  },
  {
    keywords: ["cramp", "cramps", "leg cramp", "muscle cramp", "spasm"],
    reasoning: "Muscle cramps can be related to electrolyte imbalances caused by certain medications.",
    relatedMedCategories: [
      { category: "Diuretics", meds: ["Furosemide", "Hydrochlorothiazide"], explanation: "Diuretics can deplete potassium, magnesium, and calcium — all of which can cause cramps." },
      { category: "Statins", meds: ["Atorvastatin", "Rosuvastatin", "Simvastatin"], explanation: "Statins can cause muscle-related symptoms including cramps." },
      { category: "Diabetes medications", meds: ["Insulin Glargine", "Metformin"], explanation: "Electrolyte shifts from diabetes management can contribute to cramping." },
    ],
    generalAdvice: "Stay hydrated and consider foods rich in potassium (bananas) and magnesium. If you're on a diuretic, ask about electrolyte monitoring.",
  },
  {
    keywords: ["nightmares", "bad dreams", "vivid dreams", "night terrors"],
    reasoning: "Vivid or disturbing dreams can be a side effect of medications that affect the central nervous system.",
    relatedMedCategories: [
      { category: "Beta-blockers", meds: ["Metoprolol", "Propranolol", "Atenolol"], explanation: "Beta-blockers are well-known for causing vivid dreams and nightmares." },
      { category: "Antidepressants", meds: ["Sertraline", "Fluoxetine", "Paroxetine", "Venlafaxine"], explanation: "SSRIs/SNRIs can alter REM sleep patterns, causing vivid dreams." },
      { category: "Sleep medications", meds: ["Zolpidem"], explanation: "Sleep aids can paradoxically cause unusual dreams." },
    ],
    generalAdvice: "Try taking the medication at a different time of day. If nightmares are significantly disrupting your sleep, discuss alternatives with your doctor.",
  },
  {
    keywords: ["ringing", "tinnitus", "ear ringing", "ears ringing"],
    reasoning: "Ringing in the ears (tinnitus) can be a side effect of several medication classes.",
    relatedMedCategories: [
      { category: "NSAIDs", meds: ["Aspirin", "Ibuprofen", "Naproxen"], explanation: "High-dose NSAIDs, especially aspirin, are a well-known cause of tinnitus." },
      { category: "Diuretics", meds: ["Furosemide"], explanation: "Loop diuretics like Furosemide can cause temporary tinnitus, especially at high doses." },
      { category: "Antibiotics", meds: ["Azithromycin", "Vancomycin"], explanation: "Some antibiotics can affect hearing, especially at high doses or with kidney impairment." },
    ],
    generalAdvice: "If tinnitus is new and you recently started or changed a medication, report it to your doctor promptly.",
  },
];

interface LogEntry {
  id: string;
  symptom: string;
  timestamp: Date;
  matches: typeof symptomDatabase[string];
  interactionAlerts: typeof interactionAlerts;
  intelligentInsight?: {
    reasoning: string;
    relatedMedCategories: { category: string; meds: string[]; explanation: string }[];
    generalAdvice: string;
  };
}

const severityConfig = {
  high: { bg: "bg-danger/10", border: "border-danger/20", text: "text-danger", label: "High Risk" },
  moderate: { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning", label: "Moderate" },
  low: { bg: "bg-success/10", border: "border-success/20", text: "text-success", label: "Low Risk" },
};

const SymptomLogger = () => {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const analyzeSymptom = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed || trimmed.length > 200) return;

    // Find matching side effects
    const matches: typeof symptomDatabase[string] = [];
    const matchedInteractions: typeof interactionAlerts = [];

    Object.entries(symptomDatabase).forEach(([keyword, effects]) => {
      if (trimmed.includes(keyword)) {
        effects.forEach((e) => {
          if (!matches.some((m) => m.medications.join() === e.medications.join() && m.explanation === e.explanation)) {
            matches.push(e);
          }
        });
      }
    });

    interactionAlerts.forEach((ia) => {
      if (trimmed.includes(ia.symptom)) {
        matchedInteractions.push(ia);
      }
    });

    // Sort by severity
    const severityOrder = { high: 0, moderate: 1, low: 2 };
    matches.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Intelligent reasoning for unrecognized/partial symptoms
    let intelligentInsight: LogEntry["intelligentInsight"] = undefined;
    if (matches.length === 0) {
      for (const reasoning of intelligentReasoning) {
        if (reasoning.keywords.some((kw) => trimmed.includes(kw))) {
          intelligentInsight = {
            reasoning: reasoning.reasoning,
            relatedMedCategories: reasoning.relatedMedCategories,
            generalAdvice: reasoning.generalAdvice,
          };
          break;
        }
      }
      // Fallback: provide general context-based reasoning
      if (!intelligentInsight) {
        intelligentInsight = {
          reasoning: `"${input.trim()}" isn't in our standard side-effects database, but that doesn't mean it's unrelated to your medications. Many drugs can cause unexpected symptoms through indirect effects on your body.`,
          relatedMedCategories: [
            { category: "General medication effects", meds: [], explanation: "Any medication can cause individual reactions not listed in common side effects. Your body chemistry is unique." },
            { category: "Drug interactions", meds: [], explanation: "Combinations of medications can produce symptoms that neither drug would cause alone." },
            { category: "Timing & lifestyle factors", meds: [], explanation: "Symptoms may relate to when you take medications, food interactions, hydration levels, or sleep patterns." },
          ],
          generalAdvice: "Keep a note of when this symptom occurs (time of day, relation to doses, food intake). Share this log with your doctor or pharmacist — they can determine if it's medication-related.",
        };
      }
    }

    const entry: LogEntry = {
      id: Date.now().toString(),
      symptom: input.trim(),
      timestamp: new Date(),
      matches,
      interactionAlerts: matchedInteractions,
      intelligentInsight,
    };

    setLogs([entry, ...logs]);
    setExpandedLog(entry.id);
    setInput("");
  };

  const removeLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
    if (expandedLog === id) setExpandedLog(null);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const quickSymptoms = [
    "Dizzy", "Nausea", "Headache", "Muscle pain", "Fatigue", "Cough",
    "Insomnia", "Drowsiness", "Constipation", "Dry mouth", "Brain fog", "Cramps",
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Symptom Log</h1>
        <p className="text-sm text-muted-foreground">
          Log how you're feeling — we'll analyze it against your medications
        </p>
      </div>

      {/* Input area */}
      <div className="mb-6 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold">How are you feeling?</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. I'm feeling dizzy and nauseous..."
            value={input}
            maxLength={200}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeSymptom()}
            className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <Button variant="hero" size="default" onClick={analyzeSymptom} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {/* Quick symptom chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {quickSymptoms.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Log entries */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No symptoms logged yet</p>
          <p className="text-xs text-muted-foreground/60">
            Describe how you're feeling and we'll analyze it
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {logs.map((log) => {
            const isExpanded = expandedLog === log.id;
            const hasHighRisk =
              log.matches.some((m) => m.severity === "high") ||
              log.interactionAlerts.some((ia) => ia.severity === "high");
            const hasMatches = log.matches.length > 0;
            const hasInsight = !!log.intelligentInsight;

            return (
              <div
                key={log.id}
                className={`rounded-2xl border shadow-sm transition-all ${
                  hasHighRisk ? "border-danger/30 bg-danger/5" : hasInsight && !hasMatches ? "border-accent/30 bg-accent/5" : "bg-card"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      hasHighRisk ? "bg-danger/10" : hasMatches ? "bg-warning/10" : hasInsight ? "bg-accent/10" : "bg-success/10"
                    }`}
                  >
                    {hasHighRisk ? (
                      <AlertTriangle className="h-5 w-5 text-danger" />
                    ) : hasMatches ? (
                      <Info className="h-5 w-5 text-warning" />
                    ) : hasInsight ? (
                      <Brain className="h-5 w-5 text-accent" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">"{log.symptom}"</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(log.timestamp)}</span>
                      <span>•</span>
                      {hasMatches ? (
                        <span>
                          {log.matches.length} match{log.matches.length !== 1 ? "es" : ""}
                        </span>
                      ) : hasInsight ? (
                        <span className="text-accent font-medium">AI insight available</span>
                      ) : (
                        <span>No matches</span>
                      )}
                      {log.interactionAlerts.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-danger font-medium">
                            {log.interactionAlerts.length} interaction risk{log.interactionAlerts.length !== 1 ? "s" : ""}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeLog(log.id); }}
                      className="p-1 text-muted-foreground hover:text-danger"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 animate-fade-in">
                    {/* Interaction alerts first */}
                    {log.interactionAlerts.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-danger">
                          <AlertTriangle className="h-3.5 w-3.5" /> Interaction Risks
                        </h4>
                        <div className="flex flex-col gap-2">
                          {log.interactionAlerts.map((ia, i) => {
                            const config = severityConfig[ia.severity];
                            return (
                              <div key={i} className={`rounded-xl ${config.bg} ${config.border} border p-3`}>
                                <div className="mb-1 flex items-center gap-2">
                                  <Pill className={`h-4 w-4 ${config.text}`} />
                                  <span className="text-xs font-bold">{ia.drugs.join(" + ")}</span>
                                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.text}`}>
                                    {config.label}
                                  </span>
                                </div>
                                <p className="text-xs leading-relaxed">{ia.alert}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Side effect matches */}
                    {log.matches.length > 0 ? (
                      <div>
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          <Pill className="h-3.5 w-3.5" /> Possible Side Effects
                        </h4>
                        <div className="flex flex-col gap-2">
                          {log.matches.map((match, i) => {
                            const config = severityConfig[match.severity];
                            return (
                              <div key={i} className={`rounded-xl ${config.bg} ${config.border} border p-3`}>
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="text-xs font-bold">{match.medications.join(", ")}</span>
                                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.text}`}>
                                    {config.label}
                                  </span>
                                </div>
                                <p className="mb-1.5 text-xs leading-relaxed">{match.explanation}</p>
                                <p className="text-xs font-medium text-muted-foreground">💡 {match.advice}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : log.intelligentInsight ? (
                      /* Intelligent reasoning for unknown symptoms */
                      <div>
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                          <Brain className="h-3.5 w-3.5" /> Intelligent Analysis
                        </h4>
                        <div className="mb-3 rounded-xl bg-accent/10 border border-accent/20 p-3">
                          <p className="text-xs leading-relaxed">{log.intelligentInsight.reasoning}</p>
                        </div>
                        {log.intelligentInsight.relatedMedCategories.length > 0 && (
                          <div className="flex flex-col gap-2 mb-3">
                            {log.intelligentInsight.relatedMedCategories.map((cat, i) => (
                              <div key={i} className="rounded-xl border bg-muted/30 p-3">
                                <div className="mb-1 flex items-center gap-2">
                                  <Lightbulb className="h-3.5 w-3.5 text-accent" />
                                  <span className="text-xs font-bold">{cat.category}</span>
                                  {cat.meds.length > 0 && (
                                    <span className="ml-auto text-[10px] text-muted-foreground">{cat.meds.join(", ")}</span>
                                  )}
                                </div>
                                <p className="text-xs leading-relaxed text-muted-foreground">{cat.explanation}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="rounded-xl bg-primary/5 border border-primary/10 p-3">
                          <p className="text-xs font-medium">💡 {log.intelligentInsight.generalAdvice}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl bg-success/10 p-3">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <p className="text-sm">No known side effects or interaction risks found for your current medications.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SymptomLogger;
