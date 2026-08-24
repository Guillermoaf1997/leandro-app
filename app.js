// VARIABLES Y ESTADO
let appState = {
  isSleeping: false,
  sleepStartTime: null,
  lastSleepEndTime: new Date(),
  timerInterval: null,
  logs: [],
  growth: [],
  teeth: []
};

// COLA OFFLINE (Sincronización en lote)
let syncQueue = JSON.parse(localStorage.getItem("leandro_sync_queue") || '{"records":[],"growth":[],"teeth":[]}');

let chartSleepInst = null, chartFeedInst = null, chartDiaperInst = null;
let audioCtx = null, noiseNode = null, gainNode = null;

// UTILIDADES
function generateUUID() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  initSettings();
  initTabs();
  initSleepTracker();
  initNightMode();
  initNoisePlayer();
  initPediatricExporter();
  initTeethMap();
  initModal();
  initGrowthForm();
  loadData();
  
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    processSyncQueue();
    loadData();
  }
});
setInterval(processSyncQueue, 30000); // Intenta enviar cola pendiente cada 30s
setInterval(loadData, 60000);

// AJUSTES Y SEGURIDAD (URL Oculta y Fecha Nacimiento)
function initSettings() {
  const modal = document.getElementById("settings-modal");
  const btnOpen = document.getElementById("btn-settings");
  const btnClose = document.getElementById("settings-close");
  const form = document.getElementById("settings-form");
  
  const storedUrl = localStorage.getItem("leandro_api_url") || "";
  const storedDate = localStorage.getItem("leandro_birth_date") || "";
  
  document.getElementById("set-api-url").value = storedUrl;
  document.getElementById("set-birthdate").value = storedDate;

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

// SINCRONIZACIÓN CORREGIDA (CORS + Cola Offline)
async function processSyncQueue() {
  const url = localStorage.getItem("leandro_api_url");
  if (!url || (syncQueue.records.length === 0 && syncQueue.growth.length === 0 && syncQueue.teeth.length === 0)) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      // Content-Type crudo previene el preflight OPTIONS de CORS que falla en Apps Script
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "sync", data: syncQueue })
    });
    
    if (res.ok) {
      syncQueue = { records: [], growth: [], teeth: [] };
      localStorage.setItem("leandro_sync_queue", JSON.stringify(syncQueue));
    }
  } catch (err) {
    console.warn("Offline: Los datos se enviarán cuando haya conexión.");
  }
}

async function loadData() {
  const url = localStorage.getItem("leandro_api_url");
  
  // Cargar de caché local primero para velocidad
  try {
    const cachedLogs = localStorage.getItem("leandro_logs");
    if(cachedLogs) {
      appState.logs = JSON.parse(cachedLogs);
      renderTimeline(); updateHydrationWidget();
    }
  } catch(e) {}

  if (!url) return;

  try {
    const res = await fetch(url + "?action=getData");
    if(!res.ok) throw new Error("Fetch failed");
    const json = await res.json();
    
    if(json.records) {
      // Deduplicación basada en UUID (id) en lugar de fechas inestables
      const remoteKeys = new Set(json.records.map(r => r.id));
      const unsyncedLocal = appState.logs.filter(l => !remoteKeys.has(l.id) && syncQueue.records.find(q => q.id === l.id));
      appState.logs = [...json.records, ...unsyncedLocal];
      localStorage.setItem("leandro_logs", JSON.stringify(appState.logs));
    }
    if(json.growth) appState.growth = json.growth;
    if(json.teeth) appState.teeth = json.teeth;
    
    renderTimeline();
    updateHydrationWidget();
    refreshTeethUI();
    if(document.querySelector(".tab-btn.active")?.dataset.tab === 'tab-stats') renderCharts();
  } catch(err) {
    console.warn("Usando caché offline.");
  }
}

function saveToQueueAndState(type, data) {
  if (type === 'record') {
    appState.logs.push(data);
    syncQueue.records.push(data);
    localStorage.setItem("leandro_logs", JSON.stringify(appState.logs));
    renderTimeline(); updateHydrationWidget();
  } else if (type === 'growth') {
    appState.growth.push(data);
    syncQueue.growth.push(data);
  } else if (type === 'tooth') {
    appState.teeth.push(data);
    syncQueue.teeth.push(data);
  }
  
  localStorage.setItem("leandro_sync_queue", JSON.stringify(syncQueue));
  processSyncQueue();
}

// VENTANAS DE SUEÑO DINÁMICAS (Por edad)
function getWakeWindowThreshold() {
  const bdStr = localStorage.getItem("leandro_birth_date");
  if(!bdStr) return 60; // Default si no hay ajuste
  const bd = new Date(bdStr);
  const ageMonths = (new Date() - bd) / (1000 * 60 * 60 * 24 * 30.44);
  
  if(ageMonths < 1.5) return 60;
  if(ageMonths < 3) return 90;
  if(ageMonths < 6) return 120;
  if(ageMonths < 9) return 180;
  return 240;
}

function startWakeWindowTimer() {
  setInterval(() => {
    const badge = document.getElementById("wake-window-badge");
    if(!badge) return;
    
    if(appState.isSleeping) {
      badge.textContent = "Durmiendo...";
      badge.className = "badge badge-optimal";
      return;
    }
    
    const diffMins = Math.floor((new Date() - new Date(appState.lastSleepEndTime)) / 60000);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    badge.textContent = `Despierto: ${hrs}h ${mins}m`;

    const maxMins = getWakeWindowThreshold();
    if(diffMins < (maxMins - 30)) badge.className = "badge badge-optimal";
    else if(diffMins <= maxMins) badge.className = "badge badge-alert";
    else badge.className = "badge badge-overtired";
  }, 10000);
}

// FORMULARIOS ESPECÍFICOS MEJORADOS
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
  // Para evitar que los reportes cambien de día al verlos en otro huso horario, 
  // podríamos enviarlo crudo o fiarnos del frontend. Se envía como ISO string.
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

// DESARROLLO Y DENTICIÓN OFFLINE
function initGrowthForm() {
  const form = document.getElementById("growth-form");
  if(!form) return;
  form.onsubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      fecha: new Date().toISOString(),
      peso: parseFloat(document.getElementById("growth-weight").value) || "",
      talla: parseFloat(document.getElementById("growth-height").value) || "",
      perimetro: parseFloat(document.getElementById("growth-head").value) || ""
    };
    saveToQueueAndState('growth', payload);
    alert("Medición guardada en la cola de sincronización.");
    form.reset();
  };
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
  
  // Encontrar el último estado de cada diente
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

// CONTROL DE SUEÑO
function initSleepTracker() {
  const sleepBtn = document.getElementById("btn-toggle-sleep");
  if(!sleepBtn) return;
  
  try {
    const savedState = localStorage.getItem("leandro_sleep_state");
    if(savedState) {
      const data = JSON.parse(savedState);
      appState.isSleeping = !!data.isSleeping;
      appState.sleepStartTime = data.sleepStartTime ? new Date(data.sleepStartTime) : null;
      appState.lastSleepEndTime = data.lastSleepEndTime ? new Date(data.lastSleepEndTime) : new Date();
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
    
    try {
      localStorage.setItem("leandro_sleep_state", JSON.stringify({
        isSleeping: appState.isSleeping,
        sleepStartTime: appState.sleepStartTime,
        lastSleepEndTime: appState.lastSleepEndTime
      }));
    } catch(e) {}
    updateSleepUI();
  });
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

// RESTO DE FUNCIONES VISUALES SIMILARES
function initNightMode() {
  const btn = document.getElementById("btn-night-mode");
  if(localStorage.getItem("leandro_night_mode") === "true") document.body.classList.add("night-mode");
  btn?.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    localStorage.setItem("leandro_night_mode", document.body.classList.contains("night-mode"));
  });
}

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
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
           l.categoria === 'hygiene' && 
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
    const d = new Date(l.fechaInicio || l.fechainicio);
    return !isNaN(d) && d.toDateString() === todayStr;
  });

  todayLogs.forEach(log => {
    const start = new Date(log.fechaInicio || log.fechainicio);
    const startMins = start.getHours() * 60 + start.getMinutes();
    const leftPct = (startMins / 1440) * 100;
    
    let durationMins = log.unidad === 'min' ? (parseFloat(log.valor) || 15) : 15;
    const widthPct = Math.max((durationMins / 1440) * 100, 1.5);

    const block = document.createElement("div");
    block.className = `timeline-block bg-${log.categoria || 'activity'}`;
    block.style.left = `${leftPct}%`;
    block.style.width = `${widthPct}%`;
    container.appendChild(block);

    const item = document.createElement("div");
    item.className = "text-sm";
    item.style.padding = "6px 0";
    item.style.borderBottom = "1px solid var(--border-color)";
    item.innerHTML = `<strong>${start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</strong> - ${log.subtipo} ${log.valor ? `(${log.valor} ${log.unidad})` : ''}`;
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
  // Simplificado para la generación
}
