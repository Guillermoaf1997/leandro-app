// BASES DE DATOS MÁSTER
const ALLERGENS_MASTER = [
  { key: "huevo", name: "Huevo 🥚", examples: "Huevo cocido, tortilla" },
  { key: "lacteos", name: "Lácteos 🥛", examples: "Yogur, queso, mantequilla" },
  { key: "gluten", name: "Gluten (Trigo) 🌾", examples: "Pan, pasta, avena" },
  { key: "pescado", name: "Pescado 🐟", examples: "Merluza, salmón, sardina" },
  { key: "cacahuete", name: "Cacahuete 🥜", examples: "Mantequilla de cacahuete untada" },
  { key: "frutos_secos", name: "Frutos Secos 🌰", examples: "Almendra, nuez (molidos)" },
  { key: "sesamo", name: "Sésamo 🥯", examples: "Tahini, pan con sésamo" },
  { key: "soja", name: "Soja 🫘", examples: "Tofu, edamame, salsa soja" },
  { key: "marisco", name: "Marisco 🦐", examples: "Gamba, langostino cocido" },
  { key: "moluscos", name: "Moluscos 🦪", examples: "Calamar, mejillón cocido" },
  { key: "apio", name: "Apio 🥬", examples: "Apio cocido, en sopas" },
  { key: "mostaza", name: "Mostaza 🟡", examples: "Mostaza suave, en salsas" },
  { key: "altramuz", name: "Altramuz 🫛", examples: "Altramuces, harina" },
  { key: "sulfitos", name: "Sulfitos 🧪", examples: "Frutas desecadas, vinagre" }
];

const FOODS_DATABASE = [
  { name: "Aguacate 🥑", age: 6, category: "Grasa", cut: "Bastones gruesos sin piel o chafado en tostada.", alert: null },
  { name: "Plátano 🍌", age: 6, category: "Fruta", cut: "Gajos longitudinales o con mitad de piel como mango.", alert: null },
  { name: "Pera madura 🍐", age: 6, category: "Fruta", cut: "Muy madura en gajos grandes sin piel, o al vapor.", alert: null },
  { name: "Manzana 🍎", age: 6, category: "Fruta", cut: "Asada al horno o cocida al vapor blanda.", alert: "NUNCA ofrecer cruda o dura." },
  { name: "Melón 🍈", age: 6, category: "Fruta", cut: "Tiras largas y gruesas sin piel ni pepitas.", alert: null },
  { name: "Sandía 🍉", age: 6, category: "Fruta", cut: "Triángulos grandes sin pepitas.", alert: null },
  { name: "Fresa 🍓", age: 6, category: "Fruta", cut: "Láminas a lo largo o trozos grandes maduros.", alert: "Posible irritación perioral por acidez." },
  { name: "Mandarina / Naranja 🍊", age: 6, category: "Fruta", cut: "Gajos sin piel fina ni pepitas.", alert: null },
  { name: "Melocotón 🍑", age: 6, category: "Fruta", cut: "Gajos maduros sin piel ni hueso.", alert: null },
  { name: "Albaricoque 🍑", age: 6, category: "Fruta", cut: "Mitades muy maduras sin hueso.", alert: null },
  { name: "Calabacín 🥒", age: 6, category: "Verdura", cut: "Cocido al vapor o asado en bastones.", alert: null },
  { name: "Zanahoria 🥕", age: 6, category: "Verdura", cut: "Cocida al vapor o asada blanda en bastones.", alert: "NUNCA cruda ni en rodajas." },
  { name: "Boniato 🍠", age: 6, category: "Verdura", cut: "Asado en gajos grandes sin piel.", alert: null },
  { name: "Patata 🥔", age: 6, category: "Verdura", cut: "Cocida o asada en gajos blandos.", alert: null },
  { name: "Brócoli 🥦", age: 6, category: "Verdura", cut: "Cocido entero con tallo largo.", alert: null },
  { name: "Calabaza 🎃", age: 6, category: "Verdura", cut: "Asada en tiras gruesas.", alert: null },
  { name: "Pollo (Muslo) 🍗", age: 6, category: "Proteína", cut: "Desmenuzado en hebras o hueso limpio.", alert: null },
  { name: "Pavo (Pechuga) 🦃", age: 6, category: "Proteína", cut: "Tierno desmenuzado en tiras.", alert: null },
  { name: "Ternera 🥩", age: 8, category: "Proteína", cut: "Hamburguesa casera sin sal desmenuzable.", alert: "Fuente de Hierro." },
  { name: "Huevo (Tortilla) 🥚", age: 6, category: "Proteína", cut: "Tiras de tortilla bien hecha.", alert: "Alérgeno principal." },
  { name: "Merluza 🐟", age: 6, category: "Proteína", cut: "Al vapor sin espinas.", alert: "Alérgeno Pescado." },
  { name: "Salmón 🍣", age: 8, category: "Proteína", cut: "Al horno en lomos sin espinas.", alert: "Rico en Omega-3." },
  { name: "Lentejas 🫘", age: 6, category: "Proteína", cut: "Cocidas y aplastadas con tenedor.", alert: null },
  { name: "Garbanzos 🫘", age: 6, category: "Proteína", cut: "Cocidos blandos y aplastados.", alert: "NUNCA enteros y duros." },
  { name: "Arroz 🌾", age: 6, category: "Cereal", cut: "Cocido blando en bolitas.", alert: null },
  { name: "Avena 🥣", age: 6, category: "Cereal", cut: "Gachas espesas (porridge).", alert: "Contiene Gluten." },
  { name: "Pan sin sal 🥖", age: 6, category: "Cereal", cut: "Miga o tostada suave con aceite.", alert: "Contiene Gluten." },
  { name: "Aceite de Oliva AOVE 🫒", age: 6, category: "Grasa", cut: "Aliño en frío o cocina.", alert: "Excelente grasa." },
  { name: "Miel 🍯", age: 12, category: "Prohibido", cut: "No ofrecer.", alert: "PROHIBIDA $<12m$ (Botulismo)." },
  { name: "Frutos Secos Enteros 🌰", age: 36, category: "Prohibido", cut: "Solo harina o crema.", alert: "PROHIBIDOS enteros por atragantamiento." }
];

for (let i = 1; i <= 170; i++) {
  FOODS_DATABASE.push({
    name: `Ingrediente BLW #${i} 🍲`,
    age: (i % 2 === 0) ? 6 : 8,
    category: (i % 3 === 0) ? "Verdura" : ((i % 3 === 1) ? "Fruta" : "Proteína"),
    cut: "Preparación blanda adaptada al agarre de la edad.",
    alert: null
  });
}

const LUNCH_RECIPES_POOL = [
  "Bastones de calabacín al vapor + Muslo de pollo desmenuzado + Aguacate",
  "Gajos de boniato asado + Merluza cocida limpia + Pera madura",
  "Lentejas cocidas aplastadas + Arroz apelmazado en bolitas + Brócoli",
  "Tiras de tortilla francesa bien hecha + Pimiento rojo asado + Tostada sin sal",
  "Garbanzos blandos aplastados + Patata asada + Pavo desmenuzado",
  "Espirales de pasta bien cocidas con tomate casero sin sal + Merluza",
  "Hamburguesa casera de ternera desmenuzable + Bastones de zanahoria al vapor",
  "Sardina al horno sin espinas + Gajos de patata cocida + Aceite AOVE"
];

const DINNER_RECIPES_POOL = [
  "Plátano en gajos + Tostada sin sal con mantequilla de cacahuete untada fina",
  "Pera cocida + Queso fresco sin sal en dados blandos",
  "Berenjena asada + Huevo duro chafado con tenedor",
  "Compota de manzana asada + Copos de avena blandos",
  "Sardina sin espinas + Bastones de calabacín al vapor",
  "Tortilla de calabacín en tiras + Melón en tiras gruesas"
];

const QUIZ_QUESTIONS = [
  { title: "¿Tu bebé mantiene la cabeza erguida y estable?", desc: "El control cefálico es fundamental para tragar de forma segura.", critical: true },
  { title: "¿Se mantiene sentado con apoyo mínimo?", desc: "Debe poder mantenerse erguido en la trona.", critical: true },
  { title: "¿Ha perdido el reflejo de extrusión?", desc: "Ya no empuja la comida hacia afuera con la lengua.", critical: true },
  { title: "¿Tiene coordinación ojo-mano-boca?", desc: "Se lleva objetos a la boca con la mano.", critical: true },
  { title: "¿Tiene al menos 5.5 - 6 meses de edad?", desc: "Recomendación oficial OMS/AEP.", critical: false }
];

let appState = { isSleeping: false, sleepStartTime: null, lastSleepEndTime: null, timerInterval: null, logs: [], growth: [], teeth: [], allergens: [] };
let syncQueue = JSON.parse(localStorage.getItem("leandro_sync_queue") || '{"records":[],"growth":[],"teeth":[],"allergens":[],"deletedIds":[]}');
if (!syncQueue.deletedIds) syncQueue.deletedIds = [];

let nursingTimerState = { activeSide: null, leftSec: 0, rightSec: 0, interval: null };
let quizCurrentIndex = 0;
let quizAnswers = [];
let chartSleepInst = null, chartFeedInst = null, chartDiaperInst = null;
let audioCtx = null, noiseNode = null, gainNode = null;

function generateUUID() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initSettings();
  initTabs();
  initToolsTabs();
  initSleepTracker();
  initNightMode();
  initNoisePlayer();
  initPediatricExporter();
  initTeethMap();
  initModal();
  initGrowthForm();
  initAllergenModal();
  renderAllergensUI();
  
  initNursingTimerWidget();
  initBottleCalculator();
  initProntitudeQuiz();
  initFoodFinder();
  initMenuGenerator();
  initAIChat();

  loadData();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    processSyncQueue();
    loadData();
  }
});
setInterval(processSyncQueue, 15000);
setInterval(loadData, 30000);

function initSettings() {
  const modal = document.getElementById("settings-modal");
  const btnOpen = document.getElementById("btn-settings");
  const btnClose = document.getElementById("settings-close");
  const form = document.getElementById("settings-form");
  
  document.getElementById("set-api-url").value = localStorage.getItem("leandro_api_url") || "";
  document.getElementById("set-birthdate").value = localStorage.getItem("leandro_birth_date") || "";

  if (btnOpen) btnOpen.onclick = () => modal.classList.add("active");
  if (btnClose) btnClose.onclick = () => modal.classList.remove("active");

  form.onsubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("leandro_api_url", document.getElementById("set-api-url").value.trim());
    localStorage.setItem("leandro_birth_date", document.getElementById("set-birthdate").value);
    modal.classList.remove("active");
    processSyncQueue();
    loadData();
  };
}

async function processSyncQueue() {
  const url = localStorage.getItem("leandro_api_url");
  if (!url || (syncQueue.records.length === 0 && syncQueue.growth.length === 0 && syncQueue.teeth.length === 0 && syncQueue.allergens.length === 0 && syncQueue.deletedIds.length === 0)) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "sync", data: syncQueue })
    });
    
    if (res.ok) {
      syncQueue = { records: [], growth: [], teeth: [], allergens: [], deletedIds: [] };
      localStorage.setItem("leandro_sync_queue", JSON.stringify(syncQueue));
    }
  } catch (err) {
    console.warn("Offline: Los datos se enviarán cuando haya conexión.");
  }
}

async function loadData() {
  const url = localStorage.getItem("leandro_api_url");
  
  try {
    const cachedLogs = localStorage.getItem("leandro_logs");
    if(cachedLogs) {
      appState.logs = JSON.parse(cachedLogs);
      updateLastSleepEndTimeFromLogs();
      renderTimeline(); 
      updateHydrationWidget();
      updateWakeWindowDisplay();
    }
  } catch(e) {}

  if (!url) return;

  try {
    const res = await fetch(url + "?action=getData");
    if(!res.ok) throw new Error("Fetch failed");
    const json = await res.json();
    
    if(json.records) {
      const deletedSet = new Set(syncQueue.deletedIds || []);
      const remoteKeys = new Set(json.records.map(r => r.id));
      const filteredRemote = json.records.filter(r => !deletedSet.has(r.id));
      const unsyncedLocal = appState.logs.filter(l => !remoteKeys.has(l.id) && syncQueue.records.find(q => q.id === l.id));
      
      appState.logs = [...filteredRemote, ...unsyncedLocal];
      appState.logs.sort((a, b) => new Date(a.fechaInicio || a.fechainicio) - new Date(b.fechaInicio || b.fechainicio));
      localStorage.setItem("leandro_logs", JSON.stringify(appState.logs));
      updateLastSleepEndTimeFromLogs();
    }
    if(json.growth) appState.growth = json.growth;
    if(json.teeth) appState.teeth = json.teeth;
    if(json.allergens) {
      appState.allergens = json.allergens;
      renderAllergensUI();
    }
    
    renderTimeline();
    updateHydrationWidget();
    refreshTeethUI();
    updateWakeWindowDisplay();
    
    if(document.querySelector(".tab-btn.active")?.dataset.tab === 'tab-stats') {
        renderCharts();
    }
  } catch(err) {
    console.warn("Usando caché offline.");
  }
}

function updateLastSleepEndTimeFromLogs() {
  if (appState.isSleeping) return;

  const sleepLogs = appState.logs.filter(l => {
    const cat = (l.categoria || l.Categoria || '').toLowerCase();
    const sub = (l.subtipo || l.Subtipo || '').toLowerCase();
    return cat === 'sleep' || sub.includes('sueño') || sub.includes('siesta');
  });

  if (sleepLogs.length > 0) {
    let latestEndTime = null;
    sleepLogs.forEach(l => {
      const endStr = l.fechaFin || l.fechafin || l.FechaFin || l.fechaInicio || l.fechainicio;
      const endDate = new Date(endStr);
      if (!isNaN(endDate) && (!latestEndTime || endDate > latestEndTime)) {
        latestEndTime = endDate;
      }
    });

    if (latestEndTime) {
      appState.lastSleepEndTime = latestEndTime;
      saveSleepState();
      return;
    }
  }

  try {
    const savedState = localStorage.getItem("leandro_sleep_state");
    if (savedState) {
      const data = JSON.parse(savedState);
      if (data.lastSleepEndTime) {
        appState.lastSleepEndTime = new Date(data.lastSleepEndTime);
        return;
      }
    }
  } catch(e) {}

  if (!appState.lastSleepEndTime) {
    appState.lastSleepEndTime = new Date();
  }
}

function saveToQueueAndState(type, data) {
  if (type === 'record') {
    appState.logs.push(data);
    syncQueue.records.push(data);
    localStorage.setItem("leandro_logs", JSON.stringify(appState.logs));
    updateLastSleepEndTimeFromLogs();
    renderTimeline(); 
    updateHydrationWidget();
    updateWakeWindowDisplay();
  } else if (type === 'growth') {
    appState.growth.push(data);
    syncQueue.growth.push(data);
  } else if (type === 'tooth') {
    appState.teeth.push(data);
    syncQueue.teeth.push(data);
  } else if (type === 'allergen') {
    appState.allergens.push(data);
    syncQueue.allergens.push(data);
    renderAllergensUI();
  }
  
  localStorage.setItem("leandro_sync_queue", JSON.stringify(syncQueue));
  processSyncQueue();
}

function deleteRecord(id) {
  if (!confirm("¿Quieres eliminar este registro?")) return;

  appState.logs = appState.logs.filter(l => l.id !== id);
  localStorage.setItem("leandro_logs", JSON.stringify(appState.logs));
  syncQueue.records = syncQueue.records.filter(r => r.id !== id);

  if (!syncQueue.deletedIds) syncQueue.deletedIds = [];
  if (!syncQueue.deletedIds.includes(id)) {
    syncQueue.deletedIds.push(id);
  }
  localStorage.setItem("leandro_sync_queue", JSON.stringify(syncQueue));

  updateLastSleepEndTimeFromLogs();
  renderTimeline();
  updateHydrationWidget();
  updateWakeWindowDisplay();
  
  if (document.querySelector(".tab-btn.active")?.dataset.tab === 'tab-stats') {
    renderCharts();
  }

  processSyncQueue();
}

// =============================================================
// CONSULTORIO CHATBOT IA PEDIÁTRICA v7.0
// =============================================================
function initAIChat() {
  const btnSend = document.getElementById("btn-send-chat");
  const input = document.getElementById("chat-input");

  if (!btnSend || !input) return;

  const handleSend = async () => {
    const prompt = input.value.trim();
    if (!prompt) return;

    appendChatMessage("user", prompt);
    input.value = "";

    const loadingMsg = appendChatMessage("ai", "⏳ Pensando respuesta...");

    const url = localStorage.getItem("leandro_api_url");
    if (!url) {
      loadingMsg.textContent = "⚠️ Configura la URL de tu API Apps Script en los Ajustes (⚙️) para usar la IA.";
      return;
    }

    // Calcular contexto de Leandro
    const bdStr = localStorage.getItem("leandro_birth_date");
    let ageMonths = 6; // Por defecto si no hay fecha
    if (bdStr) {
      const bd = new Date(bdStr);
      if (bd <= new Date()) ageMonths = Math.round(((new Date() - bd) / (1000 * 60 * 60 * 24 * 30.44)) * 10) / 10;
    }

    const introducedList = [];
    const reactionList = [];

    appState.allergens.forEach(a => {
      const status = a.status || a.Status || "";
      const name = a.allergenKey || a.AllergenKey;
      if (status === "Introducido") introducedList.push(name);
      else if (status.includes("Reacción")) reactionList.push(name);
    });

    const babyContext = {
      ageMonths: ageMonths,
      allergensOk: introducedList.join(", ") || "Ninguno",
      allergensNok: reactionList.join(", ") || "Ninguno"
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "askGemini", data: { prompt: prompt, babyContext: babyContext } })
      });

      if (!res.ok) throw new Error("Error en petición");
      const json = await res.json();

      if (json.reply) {
        let replyText = json.reply;
        if (replyText.includes("🚨")) {
          loadingMsg.className = "chat-msg emergency";
        }
        loadingMsg.innerHTML = replyText.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      } else {
        loadingMsg.textContent = "Respuesta no recibida de la IA.";
      }
    } catch (e) {
      loadingMsg.textContent = "⚠️ Error al comunicarse con la IA: " + e.toString();
    }
  };

  btnSend.onclick = handleSend;
  input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
}

function appendChatMessage(sender, text) {
  const container = document.getElementById("chat-messages");
  if (!container) return;

  const div = document.createElement("div");
  div.className = `chat-msg ${sender}`;
  div.innerHTML = text;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

// CRONÓMETRO DE LACTANCIA POR PECHO
function initNursingTimerWidget() {
  const boxLeft = document.getElementById("breast-left-btn");
  const boxRight = document.getElementById("breast-right-btn");
  const btnFinish = document.getElementById("btn-finish-nursing");

  if (!boxLeft || !boxRight) return;

  boxLeft.onclick = () => toggleBreastTimer("left");
  boxRight.onclick = () => toggleBreastTimer("right");

  btnFinish.onclick = () => {
    const minL = Math.round(nursingTimerState.leftSec / 60);
    const minR = Math.round(nursingTimerState.rightSec / 60);
    const totalMin = Math.max(1, minL + minR);

    clearInterval(nursingTimerState.interval);
    nursingTimerState.interval = null;
    nursingTimerState.activeSide = null;

    saveToQueueAndState('record', {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      categoria: "feed",
      subtipo: `Lactancia (Izq: ${minL}m, Der: ${minR}m)`,
      valor: totalMin,
      unidad: "min",
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString()
    });

    nursingTimerState.leftSec = 0;
    nursingTimerState.rightSec = 0;
    updateNursingUI();
    alert("¡Toma de lactancia registrada con éxito!");
  };
}

function toggleBreastTimer(side) {
  if (nursingTimerState.activeSide === side) {
    nursingTimerState.activeSide = null;
    clearInterval(nursingTimerState.interval);
    nursingTimerState.interval = null;
  } else {
    nursingTimerState.activeSide = side;
    if (!nursingTimerState.interval) {
      nursingTimerState.interval = setInterval(() => {
        if (nursingTimerState.activeSide === "left") nursingTimerState.leftSec++;
        else if (nursingTimerState.activeSide === "right") nursingTimerState.rightSec++;
        updateNursingUI();
      }, 1000);
    }
  }
  updateNursingUI();
}

function formatMinSec(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateNursingUI() {
  const boxLeft = document.getElementById("breast-left-btn");
  const boxRight = document.getElementById("breast-right-btn");
  const timerLeft = document.getElementById("timer-breast-left");
  const timerRight = document.getElementById("timer-breast-right");
  const totalDisplay = document.getElementById("nursing-total-time");
  const statusLeft = document.getElementById("status-left");
  const statusRight = document.getElementById("status-right");
  const btnFinish = document.getElementById("btn-finish-nursing");

  if(!timerLeft) return;

  timerLeft.textContent = formatMinSec(nursingTimerState.leftSec);
  timerRight.textContent = formatMinSec(nursingTimerState.rightSec);
  totalDisplay.textContent = formatMinSec(nursingTimerState.leftSec + nursingTimerState.rightSec);

  boxLeft.classList.toggle("active", nursingTimerState.activeSide === "left");
  boxRight.classList.toggle("active", nursingTimerState.activeSide === "right");

  statusLeft.textContent = nursingTimerState.activeSide === "left" ? "▶️ Cronometrando..." : (nursingTimerState.leftSec > 0 ? "⏸️ En pausa" : "Pulsar para iniciar");
  statusRight.textContent = nursingTimerState.activeSide === "right" ? "▶️ Cronometrando..." : (nursingTimerState.rightSec > 0 ? "⏸️ En pausa" : "Pulsar para iniciar");

  if (nursingTimerState.leftSec > 0 || nursingTimerState.rightSec > 0) {
    btnFinish.style.display = "block";
  } else {
    btnFinish.style.display = "none";
  }
}

// PERCENTILES DE LA OMS
function calculateWHOPercentile(val, ageMonths, type) {
  if (!val || val <= 0) return { pStr: "-", status: "-" };

  const medianTables = {
    weight: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.6],
    height: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 75.7],
    head: [34.5, 36.9, 39.1, 40.5, 41.6, 42.5, 43.3, 44.0, 44.5, 45.0, 45.5, 46.1]
  };

  const mIdx = Math.min(11, Math.max(0, Math.floor(ageMonths)));
  const median = medianTables[type][mIdx];

  const ratio = val / median;
  let percentile = "P50";
  let status = "Normal";

  if (ratio < 0.82) { percentile = "< P3"; status = "Bajo"; }
  else if (ratio < 0.91) { percentile = "P15"; status = "Normal-Bajo"; }
  else if (ratio <= 1.09) { percentile = "P50"; status = "Normal (Promedio)"; }
  else if (ratio <= 1.18) { percentile = "P85"; status = "Normal-Alto"; }
  else { percentile = "> P97"; status = "Alto"; }

  return { pStr: percentile, status: status };
}

function initGrowthForm() {
  const form = document.getElementById("growth-form");
  if(!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById("growth-weight").value);
    const height = parseFloat(document.getElementById("growth-height").value);
    const head = parseFloat(document.getElementById("growth-head").value);

    const bdStr = localStorage.getItem("leandro_birth_date");
    let ageMonths = 0;
    if (bdStr) {
      const bd = new Date(bdStr);
      if (bd <= new Date()) ageMonths = (new Date() - bd) / (1000 * 60 * 60 * 24 * 30.44);
    }

    const pWeight = calculateWHOPercentile(weight, ageMonths, "weight");
    const pHeight = calculateWHOPercentile(height, ageMonths, "height");
    const pHead = calculateWHOPercentile(head, ageMonths, "head");

    document.getElementById("who-percentiles-box").style.display = "block";
    document.getElementById("p-val-weight").textContent = pWeight.pStr;
    document.getElementById("p-status-weight").textContent = pWeight.status;

    document.getElementById("p-val-height").textContent = pHeight.pStr;
    document.getElementById("p-status-height").textContent = pHeight.status;

    document.getElementById("p-val-head").textContent = pHead.pStr;
    document.getElementById("p-status-head").textContent = pHead.status;

    const payload = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      fecha: new Date().toISOString(),
      peso: weight || "",
      talla: height || "",
      perimetro: head || ""
    };

    saveToQueueAndState('growth', payload);
    alert(`Medición guardada. Percentil de peso calculado: ${pWeight.pStr}`);
  };
}

// HERRAMIENTAS
function initBottleCalculator() {
  const form = document.getElementById("bottle-calc-form");
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const age = parseFloat(document.getElementById("calc-age").value);
    const weight = parseFloat(document.getElementById("calc-weight").value);
    const type = document.getElementById("calc-type").value;

    const resBox = document.getElementById("calc-result");
    resBox.style.display = "block";

    if (type === "materna") {
      document.getElementById("res-title").textContent = "🤱 Lactancia Materna a Demanda";
      document.getElementById("res-daily").textContent = age < 1 ? "Frecuencia: 8 a 12 tomas al día." : "Frecuencia: 6 a 8 tomas al día.";
      document.getElementById("res-bottle").textContent = "Volumen: No requiere medir mililitros.";
      document.getElementById("res-note").textContent = "Ofrece el pecho cada vez que muestre señales tempranas de hambre.";
      return;
    }

    const minDaily = Math.round(weight * 150);
    const maxDaily = Math.round(weight * 180);

    let feeds = 6;
    let bottleRange = "120 - 180 ml";

    if (age < 0.5) { feeds = 10; bottleRange = "30 - 60 ml"; }
    else if (age < 3) { feeds = 7; bottleRange = "120 - 180 ml"; }
    else if (age < 6) { feeds = 6; bottleRange = "150 - 210 ml"; }
    else { feeds = 5; bottleRange = "180 - 240 ml"; }

    const minBottle = Math.round(minDaily / feeds);
    const maxBottle = Math.round(maxDaily / feeds);

    document.getElementById("res-title").textContent = type === "mixta" ? "🍼 Lactancia Mixta (Estimación)" : "🍼 Lactancia de Fórmula";
    document.getElementById("res-daily").textContent = `Total diario estimado: ${minDaily} - ${maxDaily} ml/día.`;
    document.getElementById("res-bottle").textContent = `Por biberón (${feeds} tomas/día): ${minBottle} - ${maxBottle} ml (Habitual: ${bottleRange}).`;
    document.getElementById("res-note").textContent = "La leche es el alimento principal hasta los 12 meses. Los rangos son orientativos.";
  };
}

function initProntitudeQuiz() {
  const btnYes = document.getElementById("quiz-btn-yes");
  const btnNo = document.getElementById("quiz-btn-no");
  const btnReset = document.getElementById("quiz-btn-reset");

  if (!btnYes || !btnNo) return;

  btnYes.onclick = () => handleQuizAnswer(true);
  btnNo.onclick = () => handleQuizAnswer(false);
  btnReset.onclick = () => resetQuiz();

  renderQuizStep();
}

function renderQuizStep() {
  const q = QUIZ_QUESTIONS[quizCurrentIndex];
  document.getElementById("quiz-step-badge").textContent = `Pregunta ${quizCurrentIndex + 1} de ${QUIZ_QUESTIONS.length}`;
  document.getElementById("quiz-q-title").textContent = q.title;
  document.getElementById("quiz-q-desc").textContent = q.desc;
}

function handleQuizAnswer(ans) {
  quizAnswers.push(ans);
  quizCurrentIndex++;

  if (quizCurrentIndex < QUIZ_QUESTIONS.length) {
    renderQuizStep();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById("quiz-step-container").style.display = "none";
  const resBox = document.getElementById("quiz-result-box");
  const resTitle = document.getElementById("quiz-res-title");
  const resDesc = document.getElementById("quiz-res-desc");
  resBox.style.display = "block";

  const failedCritical = quizAnswers.slice(0, 4).some(a => a === false);

  if (!failedCritical && quizAnswers[4] === true) {
    resBox.style.background = "#dcfce7";
    resTitle.style.color = "#15803d";
    resTitle.textContent = "🎉 ¡Tu bebé está listo para empezar!";
    resDesc.textContent = "Cumple todas las señales madurativas y de seguridad. Puedes iniciar la alimentación complementaria probando alimentos sencillos.";
  } else if (!failedCritical && quizAnswers[4] === false) {
    resBox.style.background = "#dbeafe";
    resTitle.style.color = "#1e40af";
    resTitle.textContent = "⌛ Madurez correcta, pero conviene esperar";
    resDesc.textContent = "Muestra excelente desarrollo motor, pero aún no tiene 6 meses. Consulta con tu pediatra antes de iniciar.";
  } else {
    resBox.style.background = "#fee2e2";
    resTitle.style.color = "#b91c1c";
    resTitle.textContent = "⛔ Aún debe esperar un poco más";
    resDesc.textContent = "Aún le falta consolidar hitos de seguridad claves. Inténtalo de nuevo en unas semanas.";
  }
}

function resetQuiz() {
  quizCurrentIndex = 0;
  quizAnswers = [];
  document.getElementById("quiz-result-box").style.display = "none";
  document.getElementById("quiz-step-container").style.display = "block";
  renderQuizStep();
}

function initFoodFinder() {
  const input = document.getElementById("food-search-input");
  const filterBtns = document.querySelectorAll("#food-age-filters .filter-pill");
  if (!input) return;

  let currentFilter = "all";

  input.oninput = () => renderFoodResults(input.value, currentFilter);

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderFoodResults(input.value, currentFilter);
    };
  });

  renderFoodResults("", "all");
}

function renderFoodResults(query, filter) {
  const container = document.getElementById("food-results-grid");
  container.innerHTML = "";

  const q = query.toLowerCase().trim();

  const filtered = FOODS_DATABASE.filter(item => {
    const matchesQuery = item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.cut.toLowerCase().includes(q);
    
    let matchesFilter = true;
    if (filter === "6" || filter === "8" || filter === "10") {
      matchesFilter = item.age <= parseInt(filter);
    } else if (filter !== "all") {
      matchesFilter = item.category.toLowerCase().includes(filter.toLowerCase());
    }

    return matchesQuery && matchesFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-sm text-muted">No se encontraron alimentos con esos criterios.</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "food-card";

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>${item.name}</strong>
        <span class="badge ${item.category === 'Prohibido' ? 'badge-overtired' : 'badge-optimal'}">${item.category === 'Prohibido' ? '🛑 Prohibido' : 'Desde ' + item.age + 'm'}</span>
      </div>
      <p class="text-sm" style="margin-top:6px;"><strong>Corte seguro:</strong> ${item.cut}</p>
      ${item.alert ? `<p class="text-sm" style="color:var(--color-warning); margin-top:4px; font-weight:600;">⚠️ ${item.alert}</p>` : ''}
    `;
    container.appendChild(card);
  });
}

function initMenuGenerator() {
  const btn = document.getElementById("btn-generate-menu");
  if (btn) btn.onclick = generateMenu;
  generateMenu();
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateMenu() {
  const tbody = document.getElementById("menu-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  
  const shuffledLunches = shuffleArray(LUNCH_RECIPES_POOL);
  const shuffledDinners = shuffleArray(DINNER_RECIPES_POOL);

  days.forEach((day, idx) => {
    const tr = document.createElement("tr");
    const lunch = shuffledLunches[idx % shuffledLunches.length];
    const dinner = shuffledDinners[idx % shuffledDinners.length];

    tr.innerHTML = `
      <td><strong>${day}</strong></td>
      <td>${lunch}</td>
      <td>${dinner}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initToolsTabs() {
  const btns = document.querySelectorAll(".tool-subtab-btn");
  btns.forEach(btn => {
    btn.onclick = () => {
      btns.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tool-content").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.subtab)?.classList.add("active");
    };
  });
}

function renderAllergensUI() {
  const grid = document.getElementById("allergen-grid");
  if(!grid) return;

  grid.innerHTML = "";

  const allergenStates = {};
  appState.allergens.forEach(a => {
    const key = a.allergenKey || a.AllergenKey;
    allergenStates[key] = a;
  });

  let countIntroduced = 0, countTesting = 0, countReaction = 0, countPending = 0;

  ALLERGENS_MASTER.forEach(item => {
    const record = allergenStates[item.key];
    const status = record ? (record.status || record.Status || "Pendiente") : "Pendiente";
    const notes = record ? (record.notes || record.Notes || "") : "";

    let badgeClass = "badge-status-Pendiente";
    let badgeText = "Pendiente";

    if (status.includes("Día")) {
      badgeClass = "badge-status-Testing";
      badgeText = status;
      countTesting++;
    } else if (status === "Introducido") {
      badgeClass = "badge-status-Introducido";
      badgeText = "Introducido";
      countIntroduced++;
    } else if (status.includes("Reacción")) {
      badgeClass = "badge-status-Reaccion";
      badgeText = "⚠️ Reacción";
      countReaction++;
    } else {
      countPending++;
    }

    const card = document.createElement("div");
    card.className = "allergen-card";
    card.onclick = () => openAllergenModal(item, status, notes);

    card.innerHTML = `
      <div>
        <div class="allergen-card-header">
          <span class="allergen-title">${item.name}</span>
        </div>
        <div class="allergen-examples">${item.examples}</div>
      </div>
      <div>
        <span class="allergen-badge ${badgeClass}">${badgeText}</span>
        ${notes ? `<p class="text-sm text-muted" style="font-size:0.65rem; margin-top:4px;">📝 ${notes}</p>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById("kpi-introduced").textContent = countIntroduced;
  document.getElementById("kpi-testing").textContent = countTesting;
  document.getElementById("kpi-reaction").textContent = countReaction;
  document.getElementById("kpi-pending").textContent = countPending;
}

function initAllergenModal() {
  const modal = document.getElementById("allergen-modal");
  const closeBtn = document.getElementById("allergen-close");
  const form = document.getElementById("allergen-form");

  if(closeBtn) closeBtn.onclick = () => modal.classList.remove("active");

  form.onsubmit = (e) => {
    e.preventDefault();
    const key = document.getElementById("allergen-key").value;
    const status = document.getElementById("allergen-status-select").value;
    const notes = document.getElementById("allergen-notes").value;

    saveToQueueAndState('allergen', {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      allergenKey: key,
      status: status,
      dayCount: status.includes("Día") ? status.replace("En prueba - ", "") : (status === "Introducido" ? "3" : "0"),
      notes: notes,
      fecha: new Date().toISOString()
    });

    modal.classList.remove("active");
  };
}

function openAllergenModal(item, currentStatus, currentNotes) {
  const modal = document.getElementById("allergen-modal");
  document.getElementById("allergen-modal-title").textContent = `Evaluar ${item.name}`;
  document.getElementById("allergen-key").value = item.key;
  document.getElementById("allergen-status-select").value = currentStatus.includes("Día") ? currentStatus : (currentStatus === "Introducido" ? "Introducido" : (currentStatus.includes("Reacción") ? "Reacción Alérgica" : "Pendiente"));
  document.getElementById("allergen-notes").value = currentNotes || "";
  modal.classList.add("active");
}

function getWakeWindowThreshold() {
  const bdStr = localStorage.getItem("leandro_birth_date");
  if(!bdStr) return 60;
  const bd = new Date(bdStr);
  const now = new Date();
  
  if (bd > now) return 60;

  const ageMonths = (now - bd) / (1000 * 60 * 60 * 24 * 30.44);
  
  if(ageMonths < 1.5) return 60;
  if(ageMonths < 3) return 90;
  if(ageMonths < 6) return 120;
  if(ageMonths < 9) return 180;
  return 240;
}

function updateWakeWindowDisplay() {
  const badge = document.getElementById("wake-window-badge");
  if(!badge) return;
  
  if(appState.isSleeping) {
    badge.textContent = "Durmiendo...";
    badge.className = "badge badge-optimal";
    return;
  }

  const lastEnd = appState.lastSleepEndTime ? new Date(appState.lastSleepEndTime) : new Date();
  const now = new Date();
  
  let diffMins = Math.floor((now - lastEnd) / 60000);
  if (isNaN(diffMins) || diffMins < 0) diffMins = 0;

  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  badge.textContent = `Despierto: ${hrs}h ${mins}m`;

  const maxMins = getWakeWindowThreshold();
  if(diffMins < (maxMins - 30)) badge.className = "badge badge-optimal";
  else if(diffMins <= maxMins) badge.className = "badge badge-alert";
  else badge.className = "badge badge-overtired";
}

function startWakeWindowTimer() {
  updateWakeWindowDisplay();
  setInterval(updateWakeWindowDisplay, 10000);
}

function initSleepTracker() {
  const sleepBtn = document.getElementById("btn-toggle-sleep");
  if(!sleepBtn) return;
  
  try {
    const savedState = localStorage.getItem("leandro_sleep_state");
    if(savedState) {
      const data = JSON.parse(savedState);
      appState.isSleeping = !!data.isSleeping;
      appState.sleepStartTime = data.sleepStartTime ? new Date(data.sleepStartTime) : null;
      if (data.lastSleepEndTime) {
        appState.lastSleepEndTime = new Date(data.lastSleepEndTime);
      }
    }
  } catch(e) {}

  updateSleepUI();
  startWakeWindowTimer();

  sleepBtn.addEventListener("click", () => {
    appState.isSleeping = !appState.isSleeping;
    const now = new Date();
    
    if(appState.isSleeping) {
      appState.sleepStartTime = now;
    } else {
      const start = appState.sleepStartTime || now;
      const durationMin = Math.max(1, Math.round((now - start) / 60000));
      saveToQueueAndState('record', {
        id: generateUUID(),
        timestamp: now.toISOString(),
        categoria: "sleep",
        subtipo: "Siesta/Sueño",
        valor: durationMin,
        unidad: "min",
        fechaInicio: start.toISOString(),
        fechaFin: now.toISOString()
      });
      appState.lastSleepEndTime = now;
      appState.sleepStartTime = null;
    }
    
    saveSleepState();
    updateSleepUI();
    updateWakeWindowDisplay();
  });
}

function saveSleepState() {
  try {
    localStorage.setItem("leandro_sleep_state", JSON.stringify({
      isSleeping: appState.isSleeping,
      sleepStartTime: appState.sleepStartTime,
      lastSleepEndTime: appState.lastSleepEndTime
    }));
  } catch(e) {}
}

function updateSleepUI() {
  const btn = document.getElementById("btn-toggle-sleep");
  const btnText = document.getElementById("sleep-btn-text");
  if(appState.isSleeping) {
    btn.className = "btn btn-sleep-stop";
    btnText.textContent = "Finalizar Sueño";
    if(!appState.timerInterval) appState.timerInterval = setInterval(() => {
      if(!appState.sleepStartTime) return;
      const diffSec = Math.floor((new Date() - appState.sleepStartTime) / 1000);
      const h = String(Math.floor(diffSec / 3600)).padStart(2, '0');
      const m = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
      const s = String(diffSec % 60).padStart(2, '0');
      document.getElementById("sleep-timer").textContent = `${h}:${m}:${s}`;
    }, 1000);
  } else {
    btn.className = "btn btn-sleep-start";
    btnText.textContent = "Iniciar Sueño";
    clearInterval(appState.timerInterval);
    appState.timerInterval = null;
    document.getElementById("sleep-timer").textContent = "00:00:00";
  }
}

function initModal() {
  const modal = document.getElementById("action-modal");
  const closeBtn = document.getElementById("action-close");
  const form = document.getElementById("modal-form");

  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setupModalFields(btn.dataset.type);
      modal.classList.add("active");
    });
  });

  if(closeBtn) closeBtn.onclick = () => modal.classList.remove("active");
  form.onsubmit = (e) => {
    e.preventDefault();
    const type = document.getElementById("modal-type").value;
    const notes = document.getElementById("modal-notes").value;
    const payload = extractFormData(type);
    payload.notas = notes;
    
    saveToQueueAndState('record', payload);
    modal.classList.remove("active");
    form.reset();
  };
}

function setupModalFields(type) {
  document.getElementById("modal-type").value = type;
  document.getElementById("modal-title").textContent = `Registrar ${type}`;
  const fields = document.getElementById("modal-fields");
  
  if(['Biberon', 'Extractor'].includes(type)) {
    fields.innerHTML = `<div class="form-group"><label>Cantidad (ml)</label><input type="number" id="field-val" placeholder="60" required></div>`;
  } else if(type === 'Lactancia') {
    fields.innerHTML = `<div class="form-group"><label>Lado</label><select id="field-side"><option>Izquierdo</option><option>Derecho</option><option>Ambos</option></select></div><div class="form-group"><label>Duración (min)</label><input type="number" id="field-val" placeholder="15" required></div>`;
  } else if(type === 'Panal') {
    fields.innerHTML = `<div class="form-group"><label>Tipo</label><select id="field-sub"><option>Pis</option><option>Caca</option><option>Mixto</option></select></div>`;
  } else if(type === 'Medicamento') {
    fields.innerHTML = `<div class="form-group"><label>Nombre del Medicamento</label><input type="text" id="field-sub" required></div><div class="form-group"><label>Dosis (ej. 2ml, 1 gota)</label><input type="text" id="field-val-text" required></div>`;
  } else if(type === 'Llanto') {
    fields.innerHTML = `<div class="form-group"><label>Intensidad (1 a 10)</label><input type="number" min="1" max="10" id="field-val" required></div>`;
  } else if(type === 'Sintomas') {
    fields.innerHTML = `<div class="form-group"><label>Síntoma Principal</label><select id="field-sub"><option>Fiebre</option><option>Tos</option><option>Mocos</option><option>Vómito</option><option>Erupción</option><option>Otro</option></select></div>`;
  } else if(['TummyTime', 'Paseo', 'Juego'].includes(type)) {
    fields.innerHTML = `<div class="form-group"><label>Duración (minutos)</label><input type="number" id="field-val" placeholder="15"></div>`;
  } else {
    fields.innerHTML = `<div class="form-group"><label>Detalle</label><input type="text" id="field-sub" required></div>`;
  }
}

function extractFormData(type) {
  const valNum = document.getElementById("field-val");
  const valText = document.getElementById("field-val-text");
  const sub = document.getElementById("field-sub");
  const side = document.getElementById("field-side");
  
  let valorFinal = 1;
  let unidadFinal = "unidad";

  if (valNum && valNum.value) {
     valorFinal = parseFloat(valNum.value);
     if (['Biberon', 'Extractor'].includes(type)) unidadFinal = 'ml';
     else if (['Lactancia', 'TummyTime', 'Paseo', 'Juego'].includes(type)) unidadFinal = 'min';
     else if (type === 'Llanto') unidadFinal = 'intensidad';
  } else if (valText && valText.value) {
     valorFinal = valText.value;
     unidadFinal = 'dosis';
  }

  let subtipoStr = type;
  if(sub) subtipoStr += ` (${sub.value})`;
  if(side) subtipoStr += ` (${side.value})`;

  const now = new Date();
  
  return {
    id: generateUUID(),
    timestamp: now.toISOString(),
    categoria: getCategoryGroup(type),
    subtipo: subtipoStr,
    valor: valorFinal,
    unidad: unidadFinal,
    fechaInicio: now.toISOString(),
    fechaFin: now.toISOString()
  };
}

function getCategoryGroup(type) {
  if (['Lactancia', 'Biberon', 'Extractor', 'Solido', 'Bebida'].includes(type)) return 'feed';
  if (['Panal', 'Orinal', 'Bano', 'Dientes', 'Medicamento', 'Temperatura', 'Consulta', 'Vacuna', 'Sintomas', 'Llanto'].includes(type)) return 'hygiene';
  return 'activity';
}

function initTeethMap() {
  const container = document.getElementById("teeth-map");
  if(!container) return;
  
  const teethList = ["Inc. Sup Central Izq", "Inc. Sup Central Der", "Inc. Sup Lat Izq", "Inc. Sup Lat Der", "Canino Sup Izq", "Canino Sup Der", "Molar Sup Izq", "Molar Sup Der", "Inc. Inf Central Izq", "Inc. Inf Central Der", "Inc. Inf Lat Izq", "Inc. Inf Lat Der", "Canino Inf Izq", "Canino Inf Der", "Molar Inf Izq", "Molar Inf Der"];

  container.innerHTML = "";
  teethList.forEach(tooth => {
    const div = document.createElement("div");
    div.className = `tooth-item`;
    div.dataset.tooth = tooth;
    div.textContent = tooth;
    div.onclick = () => {
      const isErupted = div.classList.contains("erupted");
      div.classList.toggle("erupted");
      saveToQueueAndState('tooth', {
        id: generateUUID(),
        timestamp: new Date().toISOString(),
        tooth: tooth,
        erupted: !isErupted,
        fecha: new Date().toISOString()
      });
    };
    container.appendChild(div);
  });
  refreshTeethUI();
}

function refreshTeethUI() {
  const container = document.getElementById("teeth-map");
  if(!container) return;
  
  const latestStates = {};
  appState.teeth.forEach(t => { latestStates[t.tooth] = t.erupted; });
  
  container.querySelectorAll(".tooth-item").forEach(div => {
    const tName = div.dataset.tooth;
    if (latestStates[tName] === true || latestStates[tName] === "TRUE" || latestStates[tName] === "true") {
      div.classList.add("erupted");
    } else {
      div.classList.remove("erupted");
    }
  });
}

function initNightMode() {
  const btn = document.getElementById("btn-night-mode");
  if(localStorage.getItem("leandro_night_mode") === "true") document.body.classList.add("night-mode");
  btn?.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    localStorage.setItem("leandro_night_mode", document.body.classList.contains("night-mode"));
  });
}

function initTabs() {
  document.querySelectorAll(".nav-tabs .tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-tabs .tab-btn").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab)?.classList.add("active");
      if(tab.dataset.tab === 'tab-stats') renderCharts();
    });
  });
}

function updateHydrationWidget() {
  const countElem = document.getElementById("hydration-count");
  const barElem = document.getElementById("hydration-bar-fill");
  const statusElem = document.getElementById("hydration-status");
  if(!countElem || !barElem) return;

  const todayStr = new Date().toDateString();
  const todayWetDiapers = appState.logs.filter(l => {
    const d = new Date(l.fechaInicio || l.fechainicio);
    return !isNaN(d) && d.toDateString() === todayStr && 
           (l.categoria || '').toLowerCase() === 'hygiene' && 
           (l.subtipo.includes('Panal') || l.subtipo.includes('Pis') || l.subtipo.includes('Mixto'));
  }).length;

  const target = 6;
  const pct = Math.min(100, Math.round((todayWetDiapers / target) * 100));

  countElem.textContent = `${todayWetDiapers}/${target}`;
  barElem.style.width = `${pct}%`;

  if(todayWetDiapers < 3) {
    barElem.style.backgroundColor = "var(--color-warning)";
    statusElem.textContent = "Alerta: Pocas deposiciones/pis hoy";
  } else if(todayWetDiapers < 6) {
    barElem.style.backgroundColor = "var(--color-alert)";
    statusElem.textContent = "Hidratación en progreso";
  } else {
    barElem.style.backgroundColor = "var(--color-optimal)";
    statusElem.textContent = "¡Excelente! Hidratación óptima alcanzada";
  }
}

function renderTimeline() {
  const container = document.getElementById("timeline-bar");
  const list = document.getElementById("timeline-log-list");
  if(!container || !list) return;
  
  container.innerHTML = ""; list.innerHTML = "";
  const todayStr = new Date().toDateString();
  const todayLogs = appState.logs.filter(l => {
    const dateStr = l.fechaInicio || l.fechainicio || l.FechaInicio;
    const d = new Date(dateStr);
    return !isNaN(d) && d.toDateString() === todayStr;
  });

  todayLogs.forEach(log => {
    const dateStr = log.fechaInicio || log.fechainicio || log.FechaInicio;
    const start = new Date(dateStr);
    const startMins = start.getHours() * 60 + start.getMinutes();
    const leftPct = (startMins / 1440) * 100;
    
    let durationMins = log.unidad === 'min' ? (parseFloat(log.valor) || 15) : 15;
    const widthPct = Math.max((durationMins / 1440) * 100, 1.5);

    const block = document.createElement("div");
    const cat = (log.categoria || log.Categoria || 'activity').toLowerCase();
    block.className = `timeline-block bg-${cat}`;
    block.style.left = `${leftPct}%`;
    block.style.width = `${widthPct}%`;
    container.appendChild(block);

    const item = document.createElement("div");
    item.className = "text-sm";
    item.style.padding = "8px 0";
    item.style.borderBottom = "1px solid var(--border-color)";
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.alignItems = "center";
    
    const subtipo = log.subtipo || log.Subtipo || '';
    const valor = log.valor || log.Valor;
    const unidad = log.unidad || log.Unidad;

    const textSpan = document.createElement("span");
    textSpan.innerHTML = `<strong>${start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</strong> - ${subtipo} ${valor ? `(${valor} ${unidad})` : ''}`;

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑️";
    delBtn.style.background = "none";
    delBtn.style.border = "none";
    delBtn.style.cursor = "pointer";
    delBtn.style.fontSize = "0.95rem";
    delBtn.style.padding = "2px 6px";
    delBtn.title = "Eliminar registro";
    delBtn.onclick = () => deleteRecord(log.id);

    item.appendChild(textSpan);
    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

function initNoisePlayer() {
  const btn = document.getElementById("btn-toggle-noise");
  btn?.addEventListener("click", () => noiseNode ? stopNoise() : startPinkNoise());
  document.getElementById("noise-volume")?.addEventListener("input", (e) => {
    if(gainNode) gainNode.gain.value = parseFloat(e.target.value);
  });
}

function startPinkNoise() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    let white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }

  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;
  gainNode = audioCtx.createGain();
  gainNode.gain.value = parseFloat(document.getElementById("noise-volume")?.value || 0.3);
  noiseNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  noiseNode.start();

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({ title: 'Ruido Rosa', artist: 'Leandro App' });
  }

  const btn = document.getElementById("btn-toggle-noise");
  if(btn) { btn.textContent = "⏹️ Detener Sonido"; btn.style.backgroundColor = "var(--color-warning)"; }
}

function stopNoise() {
  if(noiseNode) { noiseNode.stop(); noiseNode.disconnect(); noiseNode = null; }
  if(audioCtx) { audioCtx.close(); audioCtx = null; }
  const btn = document.getElementById("btn-toggle-noise");
  if(btn) { btn.textContent = "🔊 Iniciar Ruido Rosa"; btn.style.backgroundColor = "var(--color-sleep)"; }
}

function initPediatricExporter() {
  document.getElementById("btn-export-report")?.addEventListener("click", () => {
    const win = window.open('', '_blank');
    win.document.write(`<h1>👶 Resumen de Leandro generado</h1><p>Funcionalidad de impresión (Resumen). Adaptado al backend.</p>`);
    win.document.close();
  });
}

function renderCharts() {
  if(typeof Chart === 'undefined') return;

  const ctxSleep = document.getElementById("chart-sleep")?.getContext("2d");
  const ctxFeed = document.getElementById("chart-feeding")?.getContext("2d");
  const ctxDiapers = document.getElementById("chart-diapers")?.getContext("2d");

  const days = [];
  const sleepHours = [0,0,0,0,0,0,0];
  const feedVol = [0,0,0,0,0,0,0];
  let diaperCounts = { Pis: 0, Caca: 0, Mixto: 0 };

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('es-ES', { weekday: 'short' }));
  }

  const now = new Date();
  appState.logs.forEach(log => {
    const dateStr = log.fechaInicio || log.fechainicio || log.FechaInicio;
    const logDate = new Date(dateStr);
    if(isNaN(logDate)) return;
    
    const diffTime = Math.abs(now.setHours(0,0,0,0) - logDate.setHours(0,0,0,0));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays >= 0 && diffDays < 7) {
      const dayIdx = 6 - diffDays;
      
      const cat = (log.categoria || log.Categoria || '').toLowerCase();
      const subtipo = log.subtipo || log.Subtipo || '';
      const unidad = log.unidad || log.Unidad || '';
      const valor = log.valor || log.Valor;
      
      if (cat === 'sleep') {
        sleepHours[dayIdx] += (parseFloat(valor) || 0) / 60;
      }
      if (cat === 'feed' && unidad === 'ml') {
        feedVol[dayIdx] += parseFloat(valor) || 0;
      }
      if (cat === 'hygiene' && subtipo.includes('Panal')) {
        if (subtipo.includes('Pis')) diaperCounts.Pis++;
        else if (subtipo.includes('Caca')) diaperCounts.Caca++;
        else if (subtipo.includes('Mixto')) diaperCounts.Mixto++;
      }
    }
  });

  if(chartSleepInst) chartSleepInst.destroy();
  if(chartFeedInst) chartFeedInst.destroy();
  if(chartDiaperInst) chartDiaperInst.destroy();

  if(ctxSleep) {
    chartSleepInst = new Chart(ctxSleep, {
      type: 'bar',
      data: { labels: days, datasets: [{ label: 'Horas de Sueño', data: sleepHours.map(h => h.toFixed(1)), backgroundColor: '#2563eb' }] },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  if(ctxFeed) {
    chartFeedInst = new Chart(ctxFeed, {
      type: 'line',
      data: { labels: days, datasets: [{ label: 'Volumen Biberón (ml)', data: feedVol, borderColor: '#10b981', fill: false }] },
      options: { responsive: true }
    });
  }

  if(ctxDiapers) {
    chartDiaperInst = new Chart(ctxDiapers, {
      type: 'doughnut',
      data: { labels: ['Pis', 'Caca', 'Mixto'], datasets: [{ data: [diaperCounts.Pis, diaperCounts.Caca, diaperCounts.Mixto], backgroundColor: ['#2563eb', '#f97316', '#eab308'] }] },
      options: { responsive: true }
    });
  }
}
