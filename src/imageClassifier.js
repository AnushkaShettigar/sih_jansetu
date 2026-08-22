// imageClassifier.js
// Drop this into your React project's src/ folder.
// Also copy model.json, weights.bin, and metadata.json into public/model/
// (weights.bin doesn't need separate loading — model.json references it by
// filename internally, so TF.js fetches it automatically as long as all three
// files sit in the same folder).

import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "/model/model.json";
const METADATA_URL = "/model/metadata.json";

// Raw labels from Teachable Machine -> clean display names.
// Fixes typos/casing without needing to retrain the model.
const CATEGORY_DISPLAY_NAMES = {
  "Pothholes": "Pothole",
  "garbages": "Garbage Not Collected",
  "leakage": "Water Leakage",
  "waterclogging": "Drainage / Waterlogging",
  "public infra dmg": "Damaged Public Infrastructure",
  "clean road and infra": "Normal Street",
};

let model = null;

// Call once when the report page/app loads (e.g. in a useEffect)
export async function loadClassifierModel() {
  if (!model) {
    model = await tmImage.load(MODEL_URL, METADATA_URL);
  }
  return model;
}

// Call with an <img> or <video> element right after a photo is captured
export async function classifyImage(imageElement) {
  if (!model) {
    throw new Error("Model not loaded yet — call loadClassifierModel() first");
  }
  const predictions = await model.predict(imageElement);
  predictions.sort((a, b) => b.probability - a.probability);

  const top = predictions[0];
  return {
    rawLabel: top.className,                                   // exact model output, e.g. "Pothholes"
    category: CATEGORY_DISPLAY_NAMES[top.className] || top.className, // clean name for UI + backend
    confidence: top.probability,
    allPredictions: predictions,                                // full ranked list, useful for debugging
  };
}
