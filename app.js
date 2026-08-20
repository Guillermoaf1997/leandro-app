// CONFIGURACIÓN GLOBAL (URL de tu Google Apps Script integrada)
const API_URL = "https://script.google.com/macros/s/AKfycbwfeq_wGQhlP1P8OeiHwHNcRiHYdIXB4nHdxUUvcJwr8UTYNrRJZGJ9giiyt7cuJnN2/exec";

// Estado de la aplicación
let appState = {
  isSleeping: false,
  sleepStartTime: null,
  lastSleepEndTime: new Date(),
  timerInterval: null,
  wakeInterval: null,
  logs: [],
  growth: []
};

let chartSleepInst = null;
let chartFeedInst = null;
let chartDiaperInst = null;

// Audio Context para Ruido Rosa sintetizado (sin archivos externos)
let audioCtx = null;
let noiseNode = null;
let gainNode = null;

// Inicialización segura
document.addEventListener("DOMContentLoaded", () => {
  try { initTabs(); } catch(e) { console.error("Error en initTabs:", e); }
  try { initSleepTracker(); } catch(e) { console.error("Error en initSleepTracker:", e); }
  try { initNightMode(); } catch(e) { console.error("Error en initNightMode:", e); }
  try { initNoisePlayer(); } catch(e) { console.error("Error en initNoisePlayer:", e); }
  try { initPediatricExporter(); } catch(e) { console.error("Error en initPediatricExporter:", e); }
  try { initTeethMap(); } catch(e) { console.error("Error en initTeethMap:", e); }
  try { initModal(); } catch(e) { console.error("Error en initModal:", e); }
  try { initGrowthForm(); } catch(e) { console.error("Error en initGrowthForm:", e); }
  try { loadData(); } catch(e) { console.error("Error en loadData:", e); }
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW offline ready'));
  }
});

// Sincronización en tiempo real
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") loadData();
});
setInterval(loadData, 60000);

// MODO TOMA NOCTURNA
function initNightMode() {
  const btn = document.getElementById("btn-night-mode");
  if(!btn) return;
  
  const savedNight = localStorage.getItem("leandro_night_mode") === "true";
  if(savedNight) document.body.classList.add("night-mode");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    const isNight = document.body.classList.contains("night-mode");
    localStorage.setItem("leandro_night_mode", isNight);
  });
}

// REPRODUCTOR DE RUIDO ROSA (ÚTERO) VÍA WEB AUDIO API
function initNoisePlayer() {
  const btn = document.getElementById("btn-toggle-noise");
  const volInput = document.getElementById("noise-volume");
  if(!btn) return;

  btn.addEventListener("click", () => {
    if(noiseNode) {
      stopNoise();
    } else {
      startPinkNoise();
    }
  });

  if(volInput) {
    volInput.addEventListener("input", (e) => {
      if(gainNode) gainNode.gain.value = parseFloat(e.target.value);
    });
  }
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
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11;
    b6 = white * 0.115926;
  }

  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  gainNode = audioCtx.createGain();
  const volVal = parseFloat(document.getElementById("noise-volume")?.value || 0.3);
  gainNode.gain.value = volVal;

  noiseNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  noiseNode.start();

  const btn = document.getElementById("btn-toggle-noise");
  if(btn) {
    btn.textContent = "⏹️ Detener Sonido";
    btn.style.backgroundColor = "var(--color-warning)";
  }
}

function stopNoise() {
  if(noiseNode) {
    noiseNode.stop();
    noiseNode.disconnect();
    noiseNode = null;
  }
  if(audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
  const btn = document.getElementById("btn-toggle-noise");
  if(btn) {
    btn.textContent = "🔊 Iniciar Ruido Rosa (Útero)";
    btn.style.backgroundColor = "var(--color-sleep)";
  }
}

// SEMÁFORO DE HIDRATACIÓN (6 PAÑALES/DÍA)
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

// EXPORTADOR DE FICHA PEDIÁTRICA
function initPediatricExporter() {
  const btn = document.getElementById("btn-export-report");
  if(!btn) return;

  btn.addEventListener("click", () => {
    const now = new Date();
    const last7Days = appState.logs.filter(l => {
      const d = new Date(l.fechaInicio || l.fechainicio);
      return !isNaN(d) && (now - d) <= (7 * 24 * 60 * 60 * 1000);
    });

    let totalSleepMins = 0;
    let totalFormulaMl = 0;
    let totalBreastFeeds = 0;
    let pisCount = 0;
    let cacaCount = 0;

    last7Days.forEach(l => {
      if (l.categoria === 'sleep') totalSleepMins += parseFloat(l.valor) || 0;
      if (l.categoria === 'feed') {
        if (l.subtipo.includes('Biberon')) totalFormulaMl += parseFloat(l.valor) || 0;
        if (l.subtipo.includes('Lactancia')) totalBreastFeeds++;
      }
      if (l.categoria === 'hygiene') {
        if (l.subtipo.includes('Pis')) pisCount++;
        if (l.subtipo.includes('Caca')) cacaCount++;
        if (l.subtipo.includes('Mixto')) { pisCount++; cacaCount++; }
      }
    });

    const avgSleepHrs = (totalSleepMins / 60 / 7).toFixed(1);
    const avgFormulaMl = Math.round(totalFormulaMl / 7);
    const avgBreastFeeds = (totalBreastFeeds / 7).toFixed(1);

    const latestGrowth = appState.growth.length > 0 ? appState.growth[appState.growth.length - 1] : null;

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Informe Pediatra - Leandro</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; color: #0f172a; line-height: 1.5; }
          h1 { color: #2563eb; font-size: 1.4rem; margin-bottom: 4px; }
          .section { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          td, th { padding: 8px; border-bottom: 1px solid #cbd5e1; text-align: left; font-size: 0.9rem; }
          .btn-print { padding: 10px 16px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>👶 Resumen Clínico Leandro</h1>
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 16px;">Generado el ${new Date().toLocaleDateString('es-ES')}</p>
        
        <div class="section">
          <h3>📊 Promedios Diarios (Últimos 7 días)</h3>
          <table>
            <tr><th>Métrica</th><th>Valor Promedio</th></tr>
            <tr><td>Horas de Sueño Totales</td><td>${avgSleepHrs} h/día</td></tr>
            <tr><td>Volumen Biberón</td><td>${avgFormulaMl} ml/día</td></tr>
            <tr><td>Tomas de Lactancia</td><td>${avgBreastFeeds} veces/día</td></tr>
            <tr><td>Pañales Mojados (Pis)</td><td>${pisCount} totales</td></tr>
            <tr><td>Deposiciones (Caca)</td><td>${cacaCount} totales</td></tr>
          </table>
        </div>

        <div class="section">
          <h3>📏 ÚLTIMA MEDICIÓN REGISTRADA</h3>
          ${latestGrowth ? `
            <p><strong>Fecha:</strong> ${new Date(latestGrowth.fecha).toLocaleDateString('es-ES')}</p>
            <p><strong>Peso:</strong> ${latestGrowth.peso} kg</p>
            <p><strong>Talla:</strong> ${latestGrowth.talla} cm</p>
            <p><strong>Perímetro Cefálico:</strong> ${latestGrowth.perimetro} cm</p>
          ` : '<p style="font-size: 0.85rem; color: #64748b;">No hay mediciones antropométricas registradas aún.</p>'}
        </div>

        <button onclick="window.print()" class="btn-print">🖨️ Imprimir / Descargar PDF</button>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(reportHtml);
    win.document.close();
  });
}

// NAVEGACIÓN Y TABS
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.tab);
      if(target) target.classList.add("active");
      if(tab.dataset.tab === 'tab-stats') renderCharts();
    });
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
      saveRecord({
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
  if(!btn || !btnText) return;
  
  if(appState.isSleeping) {
    btn.className = "btn btn-sleep-stop";
    btnText.textContent = "Finalizar Sueño";
    if(!appState.timerInterval) {
      appState.timerInterval = setInterval(updateSleepTimerDisplay, 1000);
    }
  } else {
    btn.className = "btn btn-sleep-start";
    btnText.textContent = "Iniciar Sueño";
    clearInterval(appState.timerInterval);
    appState.timerInterval = null;
    const timerElem = document.getElementById("sleep-timer");
    if(timerElem) timerElem.textContent = "00:00:00";
  }
}

function updateSleepTimerDisplay() {
  if(!appState.sleepStartTime) return;
  const diffSec = Math.floor((new Date() - appState.sleepStartTime) / 1000);
  const hrs = String(Math.floor(diffSec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
  const secs = String(diffSec % 60).padStart(2, '0');
  const timerElem = document.getElementById("sleep-timer");
  if(timerElem) timerElem.textContent = `${hrs}:${mins}:${secs}`;
}

function startWakeWindowTimer() {
  setInterval(() => {
    const badge = document.getElementById("wake-window-badge");
    if(!badge) return;
    
    if(appState.isSleeping) {
      badge.textContent = "Durmiendo...";
      return;
    }
    const diffMins = Math.floor((new Date() - new Date(appState.lastSleepEndTime)) / 60000);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    badge.textContent = `Despierto: ${hrs}h ${mins}m`;

    if(diffMins < 60) {
      badge.className = "badge badge-optimal";
    } else if(diffMins <= 90) {
      badge.className = "badge badge-alert";
    } else {
      badge.className = "badge badge-overtired";
    }
  }, 10000);
}

// MODAL DINÁMICO
function initModal() {
  const modal = document.getElementById("action-modal");
  const closeBtn = document.querySelector(".modal-close");
  const form = document.getElementById("modal-form");
  if(!modal || !form) return;

  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      setupModalFields(type);
      modal.classList.add("active");
    });
  });

  if(closeBtn) closeBtn.onclick = () => modal.classList.remove("active");
  window.onclick = (e) => { if (e.target === modal) modal.classList.remove("active"); };

  form.onsubmit = (e) => {
    e.preventDefault();
    const type = document.getElementById("modal-type").value;
    const notes = document.getElementById("modal-notes").value;
    const payload = extractFormData(type);
    payload.notas = notes;
    
    saveRecord(payload);
    modal.classList.remove("active");
    form.reset();
  };
}

function setupModalFields(type) {
  document.getElementById("modal-type").value = type;
  document.getElementById("modal-title").textContent = `Registrar ${type}`;
  const fieldsContainer = document.getElementById("modal-fields");
  fieldsContainer.innerHTML = "";

  if(type === 'Biberon' || type === 'Extractor') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Cantidad (ml)</label>
        <input type="number" id="field-val" placeholder="60" required>
      </div>`;
  } else if(type === 'Lactancia') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Lado</label>
        <select id="field-side"><option>Izquierdo</option><option>Derecho</option><option>Ambos</option></select>
      </div>
      <div class="form-group">
        <label>Duración (minutos)</label>
        <input type="number" id="field-val" placeholder="15" required>
      </div>`;
  } else if(type === 'Panal') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Tipo</label>
        <select id="field-sub"><option>Pis</option><option>Caca</option><option>Mixto</option></select>
      </div>`;
  } else if(type === 'Temperatura') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Temperatura (ºC)</label>
        <input type="number" step="0.1" id="field-val" placeholder="36.6" required>
      </div>`;
  } else {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Detalle / Nombre</label>
        <input type="text" id="field-sub" placeholder="Especificar..." required>
      </div>`;
  }
}

function extractFormData(type) {
  const valInput = document.getElementById("field-val");
  const subInput = document.getElementById("field-sub");
  const sideInput = document.getElementById("field-side");
  
  return {
    categoria: getCategoryGroup(type),
    subtipo: type + (subInput ? ` (${subInput.value})` : '') + (sideInput ? ` (${sideInput.value})` : ''),
    valor: valInput ? parseFloat(valInput.value) : 1,
    unidad: type === 'Biberon' || type === 'Extractor' ? 'ml' : (type === 'Temperatura' ? 'ºC' : 'unidad'),
    fechaInicio: new Date().toISOString(),
    fechaFin: new Date().toISOString()
  };
}

function getCategoryGroup(type) {
  if (type === 'Sueño') return 'sleep';
  if (['Lactancia', 'Biberon', 'Extractor', 'Solido', 'Bebida'].includes(type)) return 'feed';
  if (['Panal', 'Orinal', 'Bano', 'Dientes', 'Medicamento', 'Temperatura', 'Consulta', 'Vacuna', 'Sintomas', 'Llanto'].includes(type)) return 'hygiene';
  return 'activity';
}

// PERSISTENCIA Y TIMELINE
function saveRecord(recordData) {
  appState.logs.push(recordData);
  try { localStorage.setItem("leandro_logs", JSON.stringify(appState.logs)); } catch(e) {}
  
  renderTimeline();
  updateHydrationWidget();

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "addRecord", data: recordData })
  }).catch(err => console.warn("Guardado localmente en caché."));
}

async function loadData() {
  try {
    const cachedLogs = localStorage.getItem("leandro_logs");
    if(cachedLogs) {
      appState.logs = JSON.parse(cachedLogs);
      renderTimeline();
      updateHydrationWidget();
    }
  } catch(e) {}

  try {
    const res = await fetch(API_URL + "?action=getData");
    const json = await res.json();
    if(json && json.records && Array.isArray(json.records)) {
      const remoteKeys = new Set(json.records.map(r => r.fechainicio || r.fechaInicio));
      const unsyncedLocal = appState.logs.filter(l => !remoteKeys.has(l.fechaInicio));
      appState.logs = [...json.records, ...unsyncedLocal];
      localStorage.setItem("leandro_logs", JSON.stringify(appState.logs));
    }
    if(json && json.growth) appState.growth = json.growth;
    
    renderTimeline();
    updateHydrationWidget();
    
    const activeTab = document.querySelector(".tab-btn.active");
    if(activeTab && activeTab.dataset.tab === 'tab-stats') {
      renderCharts();
    }
  } catch(err) {
    console.warn("Usando caché offline.");
  }
}

function renderTimeline() {
  const container = document.getElementById("timeline-bar");
  const list = document.getElementById("timeline-log-list");
  if(!container || !list) return;
  
  container.innerHTML = "";
  list.innerHTML = "";

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
    block.title = `${log.subtipo} - ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    container.appendChild(block);

    const item = document.createElement("div");
    item.className = "text-sm";
    item.style.padding = "6px 0";
    item.style.borderBottom = "1px solid var(--border-color)";
    item.innerHTML = `<strong>${start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</strong> - ${log.subtipo} ${log.valor ? `(${log.valor} ${log.unidad})` : ''}`;
    list.appendChild(item);
  });
}

// DENTICIÓN Y ANTROPOMETRÍA
function initTeethMap() {
  const container = document.getElementById("teeth-map");
  if(!container) return;
  
  const teethList = [
    "Incisivo Sup Central Izq", "Incisivo Sup Central Der", "Incisivo Sup Lat Izq", "Incisivo Sup Lat Der",
    "Canino Sup Izq", "Canino Sup Der", "Molar Sup Izq", "Molar Sup Der",
    "Incisivo Inf Central Izq", "Incisivo Inf Central Der", "Incisivo Inf Lat Izq", "Incisivo Inf Lat Der",
    "Canino Inf Izq", "Canino Inf Der", "Molar Inf Izq", "Molar Inf Der"
  ];

  let savedTeeth = {};
  try { savedTeeth = JSON.parse(localStorage.getItem("leandro_teeth") || "{}"); } catch(e) {}

  container.innerHTML = "";
  teethList.forEach(tooth => {
    const div = document.createElement("div");
    div.className = `tooth-item ${savedTeeth[tooth] ? 'erupted' : ''}`;
    div.textContent = tooth;
    div.onclick = () => {
      savedTeeth[tooth] = !savedTeeth[tooth];
      try { localStorage.setItem("leandro_teeth", JSON.stringify(savedTeeth)); } catch(e) {}
      div.classList.toggle("erupted");
    };
    container.appendChild(div);
  });
}

function initGrowthForm() {
  const form = document.getElementById("growth-form");
  if(!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const payload = {
      fecha: new Date().toISOString(),
      peso: parseFloat(document.getElementById("growth-weight").value),
      talla: parseFloat(document.getElementById("growth-height").value),
      perimetro: parseFloat(document.getElementById("growth-head").value)
    };
    
    appState.growth.push(payload);
    fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addGrowth", data: payload })
    });
    alert("Medición registrada con éxito");
    form.reset();
  };
}

// GRÁFICOS CON CHART.JS
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
    const logDate = new Date(log.fechaInicio || log.fechainicio);
    if(isNaN(logDate)) return;
    
    const diffDays = Math.floor((now - logDate) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
      const dayIdx = 6 - diffDays;
      if (log.categoria === 'sleep') {
        sleepHours[dayIdx] += (parseFloat(log.valor) || 0) / 60;
      }
      if (log.categoria === 'feed' && log.unidad === 'ml') {
        feedVol[dayIdx] += parseFloat(log.valor) || 0;
      }
      if (log.categoria === 'hygiene' && log.subtipo && log.subtipo.includes('Panal')) {
        if (log.subtipo.includes('Pis')) diaperCounts.Pis++;
        else if (log.subtipo.includes('Caca')) diaperCounts.Caca++;
        else if (log.subtipo.includes('Mixto')) diaperCounts.Mixto++;
      }
    }
  });

  if(chartSleepInst) chartSleepInst.destroy();
  if(chartFeedInst) chartFeedInst.destroy();
  if(chartDiaperInst) chartDiaperInst.destroy();

  if(ctxSleep) {
    chartSleepInst = new Chart(ctxSleep, {
      type: 'bar',
      data: { labels: days, datasets: [{ label: 'Horas de Sueño', data: sleepHours.map(h => h.toFixed(1)), backgroundColor: '#3b82f6' }] },
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
      data: { labels: ['Pis', 'Caca', 'Mixto'], datasets: [{ data: [diaperCounts.Pis, diaperCounts.Caca, diaperCounts.Mixto], backgroundColor: ['#3b82f6', '#f97316', '#eab308'] }] },
      options: { responsive: true }
    });
  }
}
