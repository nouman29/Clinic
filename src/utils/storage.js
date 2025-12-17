import seed from "../data/db.json";
import { deepClone, generateId } from "./helpers";

const STORAGE_KEY = "clinic_db";

const readStore = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return deepClone(seed);
  }
  try {
    return JSON.parse(existing);
  } catch (error) {
    console.error("Failed to parse storage, resetting", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return deepClone(seed);
  }
};

const writeStore = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getPatients = () => {
  const store = readStore();
  return store.patients || [];
};

export const addPatient = (patient) => {
  const store = readStore();
  const newPatient = { id: generateId(), ...patient };
  store.patients = [...(store.patients || []), newPatient];
  writeStore(store);
  return newPatient;
};

export const updatePatient = (id, updates) => {
  const store = readStore();
  store.patients = (store.patients || []).map((p) => (p.id === id ? { ...p, ...updates } : p));
  writeStore(store);
  return store.patients.find((p) => p.id === id);
};

export const deletePatient = (id) => {
  const store = readStore();
  store.patients = (store.patients || []).filter((p) => p.id !== id);
  store.prescriptions = (store.prescriptions || []).filter((rx) => rx.patientId !== id);
  writeStore(store);
};

export const getPrescriptionsByPatient = (patientId) => {
  const store = readStore();
  return (store.prescriptions || []).filter((rx) => rx.patientId === patientId);
};

export const getPrescriptions = () => {
  const store = readStore();
  return store.prescriptions || [];
};

export const addPrescription = (prescription) => {
  const store = readStore();
  const newRx = { id: generateId(), ...prescription };
  store.prescriptions = [...(store.prescriptions || []), newRx];
  writeStore(store);
  return newRx;
};

export const updatePrescription = (id, updates) => {
  const store = readStore();
  store.prescriptions = (store.prescriptions || []).map((rx) => (rx.id === id ? { ...rx, ...updates } : rx));
  writeStore(store);
  return store.prescriptions.find((rx) => rx.id === id);
};

export const deletePrescription = (id) => {
  const store = readStore();
  store.prescriptions = (store.prescriptions || []).filter((rx) => rx.id !== id);
  writeStore(store);
};

export const getDoctorProfile = () => {
  const store = readStore();
  return store.doctor || { fee: "150" };
};

export const updateDoctorProfile = (updates) => {
  const store = readStore();
  store.doctor = { ...(store.doctor || {}), ...updates };
  writeStore(store);
  return store.doctor;
};
