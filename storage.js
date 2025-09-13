const STORAGE_KEY = "newtab_lite_v1";

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Save failed", e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Load failed", e);
    return null;
  }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

function migrateState(transformFn) {
  const s = loadState();
  if (s) {
    const ns = transformFn(s);
    saveState(ns);
  }
}

window.NTLStorage = { saveState, loadState, clearState, migrateState };
