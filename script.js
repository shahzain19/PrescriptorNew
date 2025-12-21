/* ==========================================================================
   SOLO CLINIC HIMS — MASTER LOGIC CONTROLLER
   v5.0.0 | ENTERPRISE "GOD MODE" EDITION
   ==========================================================================
   
   PROJECT:        Solo Clinic HIMS
   DESCRIPTION:    Single-file orchestration engine for clinical management.
   AUTHOR:         System Architect
   LAST UPDATED:   December 17, 2025
   LICENSE:        Proprietary
   
   --------------------------------------------------------------------------
   TABLE OF CONTENTS
   --------------------------------------------------------------------------
   1.0  MEDICAL KNOWLEDGE BASE (STATIC ONTOLOGY)
   2.0  CORE APP CONTROLLER
   3.0  INITIALIZATION & BOOTSTRAPPING
   4.0  DOM CACHING & REGISTRY
   5.0  EVENT BINDING & LISTENERS
   6.0  PATIENT MANAGEMENT SUBSYSTEM
   7.0  CLINICAL ENCOUNTER LOGIC
   8.0  PRESCRIPTION (RX) ENGINE
   9.0  ARTIFICIAL INTELLIGENCE MODULE
   10.0 UTILITIES & CALCULATORS
   11.0 PRINT & RENDERING ENGINE
   ========================================================================== */

(function () {
    "use strict";

    // System Boot Listener with Error Trapping
    document.addEventListener("DOMContentLoaded", () => {
        try {
            App.init();
        } catch (e) {
            console.error("CRITICAL KERNEL PANIC:", e);
            alert("System failed to boot. See console for stack trace.\n\nError: " + e.message);
        }
    });

})();


/* ==========================================================================
   1.0 MEDICAL KNOWLEDGE BASE (MOCK AI ONTOLOGY)
   ==========================================================================
   This section acts as the brain for the "AI Suggest" feature. 
   It maps clinical keywords to standard treatment protocols.
   ========================================================================== */

const MEDICAL_KNOWLEDGE_BASE = {
    
    // --- GENERAL PRACTICE PROTOCOLS ---
    protocols: [
        {
            id: "PROTO-001",
            condition: "Viral Fever / Pyrexia",
            keywords: ["fever", "viral", "pyrexia", "flu", "temperature", "chills"],
            rx: [
                { drug: "Tab. Paracetamol 650mg", dose: "1 Tab", freq: "TDS (8hrly)", dur: "3 Days", remarks: "For Fever/Pain" },
                { drug: "Cap. Vitamin C 500mg", dose: "1 Cap", freq: "OD", dur: "5 Days", remarks: "Immunity" },
                { drug: "ORS Sachet", dose: "1 Sachet", freq: "As needed", dur: "3 Days", remarks: "Dilute in 1L Water" }
            ],
            advice: "Complete bed rest. Drink plenty of fluids. Sponge with lukewarm water if temperature > 101°F."
        },
        {
            id: "PROTO-002",
            condition: "Upper Respiratory Infection (URI)",
            keywords: ["uri", "cold", "cough", "runny nose", "sneeze", "coryza"],
            rx: [
                { drug: "Tab. Cetirizine 10mg", dose: "1 Tab", freq: "HS (Night)", dur: "5 Days", remarks: "Anti-allergic" },
                { drug: "Tab. Paracetamol 500mg", dose: "1 Tab", freq: "SOS", dur: "3 Days", remarks: "For Body ache" },
                { drug: "Syr. Dextromethorphan", dose: "10ml", freq: "TDS", dur: "5 Days", remarks: "For Dry Cough" }
            ],
            advice: "Steam inhalation twice daily. Salt water gargles. Avoid cold water and oily food."
        },
        {
            id: "PROTO-003",
            condition: "Acute Gastritis / GERD",
            keywords: ["gastritis", "gerd", "acid", "heartburn", "stomach pain", "reflux", "gas"],
            rx: [
                { drug: "Cap. Pantoprazole 40mg + Domperidone 30mg", dose: "1 Cap", freq: "OD (BBF)", dur: "7 Days", remarks: "Empty Stomach" },
                { drug: "Syr. Sucralfate", dose: "10ml", freq: "TDS", dur: "5 Days", remarks: "Before meals" },
                { drug: "Tab. Dicyclomine", dose: "1 Tab", freq: "SOS", dur: "3 Days", remarks: "For Pain" }
            ],
            advice: "Avoid spicy, oily, and fried foods. Small frequent meals. Do not lie down immediately after eating."
        },
        {
            id: "PROTO-004",
            condition: "Acute Pharyngitis / Tonsillitis",
            keywords: ["throat", "tonsil", "pharyngitis", "pain in throat", "swallowing"],
            rx: [
                { drug: "Tab. Amoxicillin 500mg + Clavulanic Acid 125mg", dose: "1 Tab", freq: "BD", dur: "5 Days", remarks: "Antibiotic" },
                { drug: "Tab. Aceclofenac 100mg + Paracetamol 325mg", dose: "1 Tab", freq: "BD", dur: "3 Days", remarks: "For Pain/Inflammation" },
                { drug: "Chlorhexidine Mouthwash", dose: "10ml", freq: "BD", dur: "5 Days", remarks: "Gargle (Do not swallow)" }
            ],
            advice: "Warm saline gargles 3 times a day. Vocal rest. Hydration."
        },
        {
            id: "PROTO-005",
            condition: "Essential Hypertension",
            keywords: ["htn", "bp", "hypertension", "pressure", "high bp"],
            rx: [
                { drug: "Tab. Telmisartan 40mg", dose: "1 Tab", freq: "OD (M)", dur: "30 Days", remarks: "Morning" },
                { drug: "Tab. Amlodipine 5mg", dose: "1 Tab", freq: "OD (N)", dur: "30 Days", remarks: "Night" }
            ],
            advice: "Low salt diet (<5g/day). Regular aerobic exercise (30 mins). Monthly BP monitoring."
        },
        {
            id: "PROTO-006",
            condition: "Type 2 Diabetes Mellitus",
            keywords: ["diabetes", "sugar", "dm", "t2dm", "glucose"],
            rx: [
                { drug: "Tab. Metformin 500mg (SR)", dose: "1 Tab", freq: "BD", dur: "30 Days", remarks: "After food" },
                { drug: "Tab. Glimepiride 1mg", dose: "1 Tab", freq: "OD", dur: "30 Days", remarks: "Before breakfast" }
            ],
            advice: "Diabetic diet (Low carb, High fiber). Avoid direct sugars. Foot care. HbA1c check every 3 months."
        },
        {
            id: "PROTO-007",
            condition: "Acute Diarrhea / Gastroenteritis",
            keywords: ["diarrhea", "loose motion", "stomach upset", "dysentery"],
            rx: [
                { drug: "Cap. Racecadotril 100mg", dose: "1 Cap", freq: "TDS", dur: "3 Days", remarks: "Anti-secretory" },
                { drug: "Tab. Ofloxacin + Ornidazole", dose: "1 Tab", freq: "BD", dur: "5 Days", remarks: "Antibiotic" },
                { drug: "Sachet Probiotic", dose: "1 Sachet", freq: "BD", dur: "5 Days", remarks: "Gut flora" }
            ],
            advice: "ORS rehydration is mandatory. Soft diet (Curd rice, Banana, Toast). Avoid milk."
        },
        {
            id: "PROTO-008",
            condition: "General Weakness / Fatigue",
            keywords: ["weakness", "fatigue", "tired", "lethargy", "general"],
            rx: [
                { drug: "Cap. Multivitamin & Minerals", dose: "1 Cap", freq: "OD", dur: "15 Days", remarks: "Supplement" },
                { drug: "Syr. Iron Tonic", dose: "10ml", freq: "BD", dur: "15 Days", remarks: "Haematinic" }
            ],
            advice: "High protein diet. Adequate sleep (8 hours). Hydration."
        },
        {
            id: "PROTO-009",
            condition: "Migraine / Headache",
            keywords: ["headache", "migraine", "throbbing", "head"],
            rx: [
                { drug: "Tab. Naproxen 250mg", dose: "1 Tab", freq: "SOS", dur: "3 Days", remarks: "Pain" },
                { drug: "Tab. Domperidone 10mg", dose: "1 Tab", freq: "SOS", dur: "3 Days", remarks: "For Nausea" },
                { drug: "Tab. Flunarizine 10mg", dose: "1 Tab", freq: "HS", dur: "10 Days", remarks: "Prophylaxis" }
            ],
            advice: "Avoid triggers (bright light, loud noise). Sleep in a dark room. Stress management."
        },
        {
            id: "PROTO-010",
            condition: "Lower Back Pain (Lumbago)",
            keywords: ["back pain", "lumbago", "spine", "backache"],
            rx: [
                { drug: "Tab. Etoricoxib 90mg", dose: "1 Tab", freq: "OD", dur: "5 Days", remarks: "Anti-inflammatory" },
                { drug: "Tab. Thiocolchicoside 4mg", dose: "1 Tab", freq: "BD", dur: "5 Days", remarks: "Muscle Relaxant" },
                { drug: "Gel Diclofenac", dose: "Apply", freq: "TDS", dur: "7 Days", remarks: "Local Application" }
            ],
            advice: "Hard bed mattress. Avoid forward bending. Hot water fomentation. Physiotherapy."
        }
    ],

    // Fallback if no specific keyword matches
    defaultProtocol: {
        condition: "General Symptomatic Care",
        rx: [
            { drug: "Tab. Multivitamin", dose: "1 Tab", freq: "OD", dur: "5 Days", remarks: "Supportive" },
            { drug: "Tab. Paracetamol 500mg", dose: "1 Tab", freq: "SOS", dur: "3 Days", remarks: "If Pain/Fever" }
        ],
        advice: "Maintain hygiene. Balanced diet. Review if symptoms persist."
    }
};


/* ==========================================================================
   2.0 CORE APP CONTROLLER
   ==========================================================================
   The Singleton object 'App' manages the entire lifecycle of the application.
   It holds the state, references the DOM, and exposes public methods for
   HTML event handlers (onclick, oninput, etc.).
   ========================================================================== */

const App = {

    // --- 2.1 APPLICATION STATE ---
    state: {
        // Clinic Branding (Editable via Settings)
        clinic: { 
            name: "Solo Clinic", 
            doctor: "Dr. Physician", 
            address: "123 Health St, Medical District", 
            footerNote: "Get well soon!" 
        },
        
        // Data Stores (Loaded from LocalStorage)
        patients: [],
        visits: [],
        
        // Session Context
        currentPatient: null,
        currentVisit: null,
        
        // Reactive Logic State
        rxList: [],
        editingRxId: null,
        
        // Voice Module State
        isRecording: false,
        activeDictationInput: null,
        recognition: null
    },

    // --- 2.2 DOM REFERENCE CACHE ---
    // Populated by cacheDom() during init.
    dom: {},


    /* ==========================================================================
       3.0 INITIALIZATION & BOOTSTRAPPING
       ========================================================================== */

    /**
     * The Big Bang. This function starts everything.
     */
    init() {
        console.group("🚀 Solo Clinic HIMS: Kernel Boot Sequence");
        console.time("Boot Time");

        // 1. DOM Hydration
        this.cacheDom();
        console.log("✔ DOM Cached");

        // 2. Data Layer
        this.loadStorage();
        console.log("✔ Storage Loaded");

        // 3. Event Orchestration
        this.bindEvents();
        this.initTabs();
        this.initHotkeys();
        console.log("✔ Events Bound");

        // 4. Feature Initialization
        this.initDictation();
        this.startClock();
        console.log("✔ Features Initialized");

        // 5. Rendering
        this.renderClinicBranding();
        this.loadPatientContext(null); // Reset UI to clean state
        
        // Set Default Date
        if (this.dom.visitDate) {
            this.dom.visitDate.valueAsDate = new Date();
        }

        console.timeEnd("Boot Time");
        console.groupEnd();
        
        this.showToast("System Online. Ready for duty.", "success");
    },


    /* ==========================================================================
       4.0 DOM CACHING & REGISTRY
       ========================================================================== */

    /**
     * Maps HTML IDs to Javascript properties on `this.dom`.
     * This centralized mapping prevents "magic string" errors later in the code.
     */
    cacheDom() {
        const $ = (id) => {
            const el = document.getElementById(id);
            if (!el) {
                // Non-critical warning (allows system to boot even if element missing)
                // console.warn(`[DOM Warning] Missing element with ID: ${id}`);
            }
            return el;
        };

        this.dom = {
            // --- Top Bar ---
            clinicNameDisplay: $("clinicNameDisplay"),
            doctorNameDisplay: $("doctorNameDisplay"),
            globalPatientSearch: $("globalPatientSearch"),
            patientSearchResults: $("patientSearchResults"),
            liveTime: $("liveTime"), 
            liveDate: $("liveDate"), 
            
            // --- Actions ---
            newPatientBtn: $("newPatientBtn"),
            saveVisitBtn: $("saveVisitBtn"),
            printBtn: $("printBtn"),
            clinicSettingsBtn: $("clinicSettingsBtn"),

            // --- Context Header ---
            currentPatientHeader: $("currentPatientHeader"),
            headerAvatar: $("headerAvatar"),
            headerName: $("headerName"),
            headerUhid: $("headerUhid"),
            headerAgeSex: $("headerAgeSex"),
            headerPhone: $("headerPhone"),
            visitStatus: $("visitStatus"),
            openHistoryBtnHeader: $("openHistoryBtn"), 
            calcBtn: $("calcBtn"),

            // --- Left Panel (Vitals) ---
            snapshotAllergies: $("snapshotAllergies"),
            snapshotChronic: $("snapshotChronic"),
            vitalBP: $("vitalBP"),
            vitalPulse: $("vitalPulse"),
            vitalTemp: $("vitalTemp"),
            vitalSpO2: $("vitalSpO2"),
            vitalWeight: $("vitalWeight"),
            vitalHeight: $("vitalHeight"),

            // --- Center Panel (Clinical) ---
            visitDate: $("visitDate"),
            // Classes needed for tabs
            tabButtons: document.querySelectorAll(".tab-btn"),
            tabContents: document.querySelectorAll(".tab-content"),
            
            // Inputs
            coText: $("coText"),
            examText: $("examText"),
            dxText: $("dxText"),
            adviceText: $("adviceText"),
            investText: $("investText"),

            // --- Rx Module ---
            rxDrugName: $("rxDrugName"),
            drugSuggestions: $("drugSuggestions"),
            rxDose: $("rxDose"),
            rxFrequency: $("rxFrequency"),
            rxDuration: $("rxDuration"),
            rxRemarks: $("rxRemarks"),
            addRxBtn: $("addRxBtn"),
            addRxBtnText: $("addRxBtnText"), 
            editingIndicator: $("editingIndicator"), 
            rxTableBody: $("rxTableBody"),
            rxEmptyState: $("rxEmptyState"),
            aiSuggestBtn: $("aiSuggestBtn"),
            aiLoading: $("aiLoading"), 
            rxSafetyBanner: $("rxSafetyBanner"),
            rxAllergyText: $("rxAllergyText"),

            // --- Print Preview ---
            previewClinicName: $("previewClinicName"),
            previewDoctorName: $("previewDoctorName"),
            previewClinicAddress: $("previewClinicAddress"),
            previewFooterNote: $("previewFooterNote"),
            previewPatientName: $("previewPatientName"),
            previewPatientAgeSex: $("previewPatientAgeSex"),
            previewPatientId: $("previewPatientId"),
            previewDatePrint: $("previewDatePrint"),
            previewTimePrint: $("previewTimePrint"),
            
            previewVitalsRow: $("previewVitalsRow"),
            previewVitals: $("previewVitals"),
            previewCO: $("previewCO"),
            previewExam: $("previewExam"),
            previewDx: $("previewDx"),
            previewAdvice: $("previewAdvice"), 
            previewInvest: $("previewInvest"), 
            previewRxTable: $("previewRxTable"),
            
            // Sections (for hiding/showing)
            previewSectionCO: $("previewSectionCO"),
            previewSectionExam: $("previewSectionExam"),
            previewSectionDx: $("previewSectionDx"),
            previewSectionAdvice: $("previewSectionAdvice"),
            previewSectionInvest: $("previewSectionInvest"),

            // --- Modals ---
            historyDrawer: $("historyDrawer"),
            closeHistoryBtn: $("closeHistoryBtn"),
            historyList: $("historyList"),

            newPatientModal: $("newPatientModal"),
            closeNewPatientBtn: $("closeNewPatientBtn"),
            saveNewPatientBtn: $("saveNewPatientBtn"),
            regName: $("regName"),
            regPhone: $("regPhone"),
            regAge: $("regAge"),
            regSex: $("regSex"),
            regAllergies: $("regAllergies"),
            regChronic: $("regChronic"),

            settingsModal: $("settingsModal"),
            closeSettingsBtn: $("closeSettingsBtn"),
            saveSettingsBtn: $("saveSettingsBtn"),
            settingClinicName: $("settingClinicName"),
            settingDoctorName: $("settingDoctorName"),
            settingClinicAddress: $("settingClinicAddress"),
            settingFooterNote: $("settingFooterNote"),
            
            toastContainer: $("toast-container")
        };
    },


    /* ==========================================================================
       5.0 EVENT BINDING & LISTENERS
       ========================================================================== */

    bindEvents() {
        const d = this.dom;

        // --- Search ---
        if(d.globalPatientSearch) {
            d.globalPatientSearch.oninput = (e) => this.searchPatients(e.target.value);
            d.globalPatientSearch.onfocus = (e) => this.searchPatients(e.target.value);
        }
        
        // Close search on outside click
        document.addEventListener('click', (e) => {
            if (d.globalPatientSearch && d.patientSearchResults && 
                !d.globalPatientSearch.contains(e.target) && 
                !d.patientSearchResults.contains(e.target)) {
                d.patientSearchResults.setAttribute("aria-hidden", "true");
            }
        });

        // --- Modals ---
        if(d.newPatientBtn) d.newPatientBtn.onclick = () => this.toggleModal("newPatient", true);
        if(d.closeNewPatientBtn) d.closeNewPatientBtn.onclick = () => this.toggleModal("newPatient", false);
        if(d.saveNewPatientBtn) d.saveNewPatientBtn.onclick = () => this.registerNewPatient();
        
        if(d.clinicSettingsBtn) d.clinicSettingsBtn.onclick = () => {
            if(d.settingClinicName) d.settingClinicName.value = this.state.clinic.name;
            if(d.settingDoctorName) d.settingDoctorName.value = this.state.clinic.doctor;
            if(d.settingClinicAddress) d.settingClinicAddress.value = this.state.clinic.address;
            if(d.settingFooterNote) d.settingFooterNote.value = this.state.clinic.footerNote;
            this.toggleModal("settings", true);
        };
        if(d.closeSettingsBtn) d.closeSettingsBtn.onclick = () => this.toggleModal("settings", false);
        if(d.saveSettingsBtn) d.saveSettingsBtn.onclick = () => this.saveSettings();

        // --- Rx Engine ---
        if(d.addRxBtn) d.addRxBtn.onclick = () => this.addRx();
        if(d.rxDrugName) d.rxDrugName.oninput = (e) => this.searchDrugs(e.target.value);
        if(d.aiSuggestBtn) d.aiSuggestBtn.onclick = () => this.triggerAI();

        // Rx Navigation Logic (Enter Key)
        if(d.rxDrugName) {
            d.rxDrugName.onkeydown = (e) => { 
                if(e.key === "Escape") d.drugSuggestions.setAttribute("aria-hidden", "true");
                if(e.key === "Enter") d.rxDose.focus(); 
            };
            d.rxDose.onkeydown = (e) => { if(e.key === "Enter") d.rxFrequency.focus(); };
            d.rxFrequency.onkeydown = (e) => { if(e.key === "Enter") d.rxDuration.focus(); };
            d.rxDuration.onkeydown = (e) => { if(e.key === "Enter") d.rxRemarks.focus(); };
            d.rxRemarks.onkeydown = (e) => { if(e.key === "Enter") this.addRx(); };
        }

        // --- Main Actions ---
        if(d.saveVisitBtn) d.saveVisitBtn.onclick = () => this.saveCurrentVisit();
        if(d.printBtn) d.printBtn.onclick = () => this.handlePrint();
        if(d.calcBtn) d.calcBtn.onclick = () => this.calculateBMI();
        
        // --- History ---
        if(d.openHistoryBtnHeader) d.openHistoryBtnHeader.onclick = () => this.toggleHistoryDrawer(true);
        if(d.closeHistoryBtn) d.closeHistoryBtn.onclick = () => this.toggleHistoryDrawer(false);

        // --- Live Preview Updates ---
        // Bind input event to all clinical fields for realtime preview
        const inputs = [d.coText, d.examText, d.dxText, d.adviceText, d.investText, d.visitDate, 
                        d.vitalBP, d.vitalPulse, d.vitalTemp, d.vitalSpO2, d.vitalWeight];
        
        inputs.forEach(el => {
            if(el) el.addEventListener("input", () => this.renderPreview());
        });
    },

    initHotkeys() {
        document.addEventListener("keydown", (e) => {
            // Ctrl + S : Save
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                this.saveCurrentVisit();
            }
            // Ctrl + P : Print
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
                e.preventDefault();
                this.handlePrint();
            }
            // Alt + N : New Patient
            if (e.altKey && e.key.toLowerCase() === "n") {
                e.preventDefault();
                this.toggleModal("newPatient", true);
                if(this.dom.regName) setTimeout(() => this.dom.regName.focus(), 100);
            }
            // Escape : Close Everything
            if (e.key === "Escape") {
                this.toggleModal("newPatient", false);
                this.toggleModal("settings", false);
                this.toggleHistoryDrawer(false);
                if(this.dom.patientSearchResults) this.dom.patientSearchResults.setAttribute("aria-hidden", "true");
                this.cancelEditRx();
            }
        });
    },

    startClock() {
        const update = () => {
            const now = new Date();
            if(this.dom.liveTime) this.dom.liveTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if(this.dom.liveDate) this.dom.liveDate.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        };
        update();
        setInterval(update, 1000);
    },


    /* ==========================================================================
       6.0 PATIENT MANAGEMENT SUBSYSTEM
       ========================================================================== */

    loadStorage() {
        try {
            this.state.patients = JSON.parse(localStorage.getItem("hims_patients") || "[]");
            this.state.visits = JSON.parse(localStorage.getItem("hims_visits") || "[]");
            const savedClinic = JSON.parse(localStorage.getItem("hims_clinic"));
            if (savedClinic) this.state.clinic = savedClinic;
        } catch (e) {
            console.error("Storage Error", e);
            this.showToast("Error loading data", "error");
        }
    },

    saveData() {
        localStorage.setItem("hims_clinic", JSON.stringify(this.state.clinic));
        localStorage.setItem("hims_patients", JSON.stringify(this.state.patients));
        localStorage.setItem("hims_visits", JSON.stringify(this.state.visits));
    },

    registerNewPatient() {
        const d = this.dom;
        const name = d.regName.value.trim();
        
        if (!name) {
            this.showToast("Patient Name is required", "warning");
            d.regName.focus();
            return;
        }

        const newPatient = {
            id: "P-" + Date.now().toString().slice(-6),
            name: name,
            phone: d.regPhone.value.trim(),
            age: d.regAge.value,
            sex: d.regSex.value,
            allergies: d.regAllergies.value,
            chronic: d.regChronic.value,
            regDate: new Date().toISOString()
        };

        this.state.patients.push(newPatient);
        this.saveData();

        // Reset & Close
        d.regName.value = ""; d.regPhone.value = ""; d.regAge.value = ""; 
        d.regAllergies.value = ""; d.regChronic.value = "";
        
        this.toggleModal("newPatient", false);
        this.loadPatientContext(newPatient);
        this.showToast("Patient Registered Successfully", "success");
    },

    searchPatients(q) {
        const box = this.dom.patientSearchResults;
        if (!q) { box.setAttribute("aria-hidden", "true"); return; }

        const matches = this.state.patients
            .filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q) || p.id.toLowerCase().includes(q))
            .slice(0, 10);

        box.innerHTML = "";
        if (matches.length === 0) {
            box.innerHTML = `<div class="search-result-item" style="color:#999; cursor:default;">No match found. <br><small>Alt+N to add new.</small></div>`;
        }

        matches.forEach(p => {
            const div = document.createElement("div");
            div.className = "search-result-item";
            div.innerHTML = `<div><b>${p.name}</b> <small>(${p.age}/${p.sex})</small></div><small style='color:#666'>${p.phone}</small>`;
            div.onclick = () => {
                this.loadPatientContext(p);
                this.dom.globalPatientSearch.value = "";
                box.setAttribute("aria-hidden", "true");
            };
            box.appendChild(div);
        });
        box.setAttribute("aria-hidden", "false");
    },

    loadPatientContext(patient) {
        this.state.currentPatient = patient;
        const header = this.dom.currentPatientHeader;
        const d = this.dom;

        if (!patient) {
            if(header) header.classList.add("is-hidden");
            this.clearClinicalForms();
            this.renderPreview();
            return;
        }

        if(header) header.classList.remove("is-hidden");
        
        if(d.headerName) d.headerName.textContent = patient.name;
        if(d.headerUhid) d.headerUhid.textContent = patient.id;
        if(d.headerAgeSex) d.headerAgeSex.textContent = `${patient.age} / ${patient.sex}`;
        if(d.headerPhone) d.headerPhone.textContent = patient.phone;
        if(d.headerAvatar) d.headerAvatar.textContent = patient.name.charAt(0).toUpperCase();
        
        // Load Snapshot
        if(d.snapshotAllergies) d.snapshotAllergies.value = patient.allergies || "";
        if(d.snapshotChronic) d.snapshotChronic.value = patient.chronic || "";

        // Warning Logic
        if(patient.allergies && d.rxSafetyBanner) {
            d.rxSafetyBanner.classList.add("is-visible");
            if(d.rxAllergyText) d.rxAllergyText.textContent = patient.allergies;
        } else if(d.rxSafetyBanner) {
            d.rxSafetyBanner.classList.remove("is-visible");
        }

        this.startNewVisit();
        this.showToast("Patient Loaded", "info");
    },


    /* ==========================================================================
       7.0 CLINICAL ENCOUNTER LOGIC
       ========================================================================== */

    startNewVisit() {
        this.clearClinicalForms();
        
        const visit = {
            id: "V-" + Date.now(),
            patientId: this.state.currentPatient.id,
            date: new Date().toISOString().slice(0, 10),
            timestamp: Date.now(),
            status: "draft",
            notes: {},
            rx: []
        };

        this.state.currentVisit = visit;
        this.state.rxList = [];
        
        if(this.dom.visitDate) this.dom.visitDate.value = visit.date;
        if(this.dom.visitStatus) {
            this.dom.visitStatus.textContent = "Draft";
            this.dom.visitStatus.className = "status-badge draft";
        }

        this.renderRxTable();
        this.renderPreview();
    },

    saveCurrentVisit() {
        if (!this.state.currentPatient) {
            this.showToast("No active visit to save", "warning");
            return;
        }

        const d = this.dom;
        const v = this.state.currentVisit;

        // Capture Data
        v.notes = {
            co: d.coText.value, exam: d.examText.value, dx: d.dxText.value,
            advice: d.adviceText.value, invest: d.investText.value
        };
        v.vitals = {
            bp: d.vitalBP.value, pulse: d.vitalPulse.value, temp: d.vitalTemp.value,
            spo2: d.vitalSpO2.value, weight: d.vitalWeight.value, height: d.vitalHeight.value
        };
        v.rx = [...this.state.rxList];
        v.status = "Saved";

        // Update Patient Permanent Records
        this.state.currentPatient.allergies = d.snapshotAllergies.value;
        this.state.currentPatient.chronic = d.snapshotChronic.value;

        this.state.visits.push(v);
        this.saveData();
        
        if(d.visitStatus) {
            d.visitStatus.textContent = "Saved";
            d.visitStatus.className = "status-badge success";
        }
        this.showToast("Visit Saved Successfully", "success");
    },


    /* ==========================================================================
       8.0 PRESCRIPTION (RX) ENGINE
       ========================================================================== */

    searchDrugs(q) {
        const box = this.dom.drugSuggestions;
        if (!q || !window.meds_10000_cleaned) { 
            box.setAttribute("aria-hidden", "true"); 
            return; 
        }

        const matches = window.meds_10000_cleaned
            .filter(m => m.name.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 8); 

        box.innerHTML = "";
        matches.forEach(m => {
            const div = document.createElement("div");
            div.className = "search-result-item";
            div.textContent = m.name;
            div.onclick = () => {
                this.dom.rxDrugName.value = m.name;
                this.dom.rxDose.focus();
                box.setAttribute("aria-hidden", "true");
            };
            box.appendChild(div);
        });
        box.setAttribute("aria-hidden", matches.length ? "false" : "true");
    },

    addRx() {
        const d = this.dom;
        if (!d.rxDrugName.value.trim()) {
            this.showToast("Enter a medicine name", "warning");
            return d.rxDrugName.focus();
        }

        const rx = {
            id: this.state.editingRxId || Date.now(), 
            drug: d.rxDrugName.value,
            dose: d.rxDose.value,
            freq: d.rxFrequency.value,
            duration: d.rxDuration.value,
            remarks: d.rxRemarks.value
        };

        if (this.state.editingRxId) {
            const idx = this.state.rxList.findIndex(r => r.id === this.state.editingRxId);
            if(idx !== -1) this.state.rxList[idx] = rx;
            this.cancelEditRx();
            this.showToast("Medicine Updated", "success");
        } else {
            this.state.rxList.push(rx);
        }

        this.clearRxForm();
        this.renderRxTable();
        this.renderPreview();
        d.rxDrugName.focus();
    },

    editRx(id) {
        const rx = this.state.rxList.find(r => r.id === id);
        if (!rx) return;

        const d = this.dom;
        d.rxDrugName.value = rx.drug;
        d.rxDose.value = rx.dose;
        d.rxFrequency.value = rx.freq;
        d.rxDuration.value = rx.duration;
        d.rxRemarks.value = rx.remarks;

        this.state.editingRxId = id;
        d.addRxBtnText.textContent = "Update";
        d.addRxBtn.classList.remove("btn-primary");
        d.addRxBtn.classList.add("btn-accent"); 
        if(d.editingIndicator) d.editingIndicator.classList.remove("is-hidden");
        
        d.rxDrugName.focus();
    },

    cancelEditRx() {
        const d = this.dom;
        this.state.editingRxId = null;
        this.clearRxForm();
        d.addRxBtnText.textContent = "Add";
        d.addRxBtn.classList.remove("btn-accent");
        d.addRxBtn.classList.add("btn-primary");
        if(d.editingIndicator) d.editingIndicator.classList.add("is-hidden");
    },

    deleteRx(id) {
        this.state.rxList = this.state.rxList.filter(r => r.id !== id);
        if(this.state.editingRxId === id) this.cancelEditRx();
        this.renderRxTable();
        this.renderPreview();
    },

    clearRxForm() {
        const d = this.dom;
        d.rxDrugName.value = ""; d.rxDose.value = ""; d.rxFrequency.value = "";
        d.rxDuration.value = ""; d.rxRemarks.value = "";
    },

    renderRxTable() {
        const tbody = this.dom.rxTableBody;
        if(!tbody) return;
        tbody.innerHTML = "";
        
        const emptyState = document.getElementById("rxEmptyState");
        if(this.state.rxList.length === 0) {
            if(emptyState) emptyState.style.display = "block";
            return;
        }
        if(emptyState) emptyState.style.display = "none";

        this.state.rxList.forEach((rx, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="color:#64748b">${i + 1}</td>
                <td>
                    <b>${rx.drug}</b>
                    ${rx.remarks ? `<div style='font-size:11px; color:#64748b; font-style:italic;'>${rx.remarks}</div>` : ''}
                </td>
                <td>${rx.dose}</td>
                <td>${rx.freq}</td>
                <td>${rx.duration}</td>
                <td>
                    <button class="btn-icon" onclick="App.editRx(${rx.id})" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="App.deleteRx(${rx.id})" title="Delete" style="color:#ef4444">✕</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },


    /* ==========================================================================
       9.0 ARTIFICIAL INTELLIGENCE MODULE
       ========================================================================== */

    /**
     * "God Mode" AI Suggestion Engine.
     * Uses the MEDICAL_KNOWLEDGE_BASE constant.
     */
    triggerAI() {
        const dx = this.dom.dxText.value.toLowerCase();
        
        if(!dx) {
            this.showToast("Please enter a Diagnosis first!", "warning");
            this.dom.dxText.focus();
            return;
        }

        const btn = this.dom.aiSuggestBtn;
        const loader = this.dom.aiLoading;
        
        // UI State
        btn.disabled = true;
        if(loader) loader.classList.remove("is-hidden");
        this.showToast("Analyzing clinical data...", "info");

        // Simulate thinking time
        setTimeout(() => {
            let matches = [];
            
            // Search the Knowledge Base
            const kb = MEDICAL_KNOWLEDGE_BASE.protocols;
            const foundProtocol = kb.find(p => p.keywords.some(k => dx.includes(k)));

            if (foundProtocol) {
                // Add drugs from protocol
                foundProtocol.rx.forEach(item => {
                    this.state.rxList.push({
                        id: Date.now() + Math.random(),
                        drug: item.drug, 
                        dose: item.dose, 
                        freq: item.freq, 
                        duration: item.dur, 
                        remarks: item.remarks
                    });
                });
                // Add Advice
                this.insertMacro('adviceText', `Protocol: ${foundProtocol.advice}`);
                this.showToast(`Applied Protocol: ${foundProtocol.condition}`, "success");
            } else {
                // Fallback
                const def = MEDICAL_KNOWLEDGE_BASE.defaultProtocol;
                def.rx.forEach(item => {
                    this.state.rxList.push({
                        id: Date.now() + Math.random(),
                        drug: item.drug, 
                        dose: item.dose, 
                        freq: item.freq, 
                        duration: item.dur, 
                        remarks: item.remarks
                    });
                });
                this.insertMacro('adviceText', `General: ${def.advice}`);
                this.showToast("No specific protocol. Applied general care.", "info");
            }

            this.renderRxTable();
            this.renderPreview();

            btn.disabled = false;
            if(loader) loader.classList.add("is-hidden");

        }, 1200);
    },

    // --- Voice Dictation ---
    initDictation() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.state.recognition = new SpeechRecognition();
            this.state.recognition.continuous = false;
            this.state.recognition.interimResults = false;
            this.state.recognition.lang = 'en-US';
            
            this.state.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (this.state.activeDictationInput) {
                    const el = document.getElementById(this.state.activeDictationInput);
                    if (el) {
                        const current = el.value;
                        el.value = current ? current + " " + transcript : transcript;
                        this.renderPreview();
                    }
                }
            };

            this.state.recognition.onend = () => {
                this.state.isRecording = false;
                document.querySelectorAll('.mic-btn').forEach(btn => btn.classList.remove('recording'));
            };
        } else {
            console.warn("Speech Recognition not supported.");
        }
    },

    toggleDictation(inputId, btnElement) {
        if (!this.state.recognition) {
            this.showToast("Voice not supported on this browser", "error");
            return;
        }

        if (this.state.isRecording) {
            this.state.recognition.stop();
            this.state.isRecording = false;
            btnElement.classList.remove('recording');
        } else {
            this.state.activeDictationInput = inputId;
            this.state.recognition.start();
            this.state.isRecording = true;
            btnElement.classList.add('recording');
            this.showToast("Listening...", "info");
        }
    },

    // --- Macros ---
    insertMacro(inputId, text) {
        try {
            const el = document.getElementById(inputId);
            if(!el) return;
            
            const current = el.value;
            // Append if text exists, otherwise set
            el.value = current ? current + "\n" + text : text;
            this.renderPreview();
            this.showToast("Macro added", "success");
        } catch(e) {
            console.error("Macro Error", e);
        }
    },


    /* ==========================================================================
       10.0 UTILITIES & CALCULATORS
       ========================================================================== */

    calculateBMI() {
        const w = parseFloat(this.dom.vitalWeight.value);
        const h = parseFloat(this.dom.vitalHeight.value) / 100; // cm to m

        if (w > 0 && h > 0) {
            const bmi = (w / (h * h)).toFixed(1);
            let status = "";
            if (bmi < 18.5) status = "Underweight";
            else if (bmi < 25) status = "Normal";
            else if (bmi < 30) status = "Overweight";
            else status = "Obese";

            const msg = `BMI: ${bmi} (${status})`;
            
            // Append to Advice if not already there
            if(!this.dom.adviceText.value.includes("BMI:")) {
                this.dom.adviceText.value += (this.dom.adviceText.value ? "\n\n" : "") + msg;
                this.renderPreview();
            }
            this.showToast(msg, "info");
        } else {
            this.showToast("Enter Weight (kg) & Height (cm)", "error");
        }
    },

    toggleModal(id, show) {
        const el = this.dom[id + "Modal"];
        if (el) el.setAttribute("aria-hidden", !show);
    },

    toggleHistoryDrawer(show) {
        this.dom.historyDrawer.setAttribute("aria-hidden", show ? "false" : "true");
        if (show) this.renderHistoryList();
    },

    renderHistoryList() {
        const list = this.dom.historyList;
        list.innerHTML = "";
        
        if (!this.state.currentPatient) return list.innerHTML = `<div class="empty-state">Select a patient</div>`;

        const visits = this.state.visits
            .filter(v => v.patientId === this.state.currentPatient.id)
            .sort((a, b) => b.timestamp - a.timestamp);

        if (visits.length === 0) return list.innerHTML = `<div class="empty-state">No history found</div>`;

        visits.forEach(visit => {
            const card = document.createElement("div");
            card.className = "history-card";
            const dateStr = new Date(visit.date).toLocaleDateString();
            card.innerHTML = `
                <div class="card-date">
                    <span>📅 ${dateStr}</span>
                    <span class="status-badge success">Saved</span>
                </div>
                <div class="card-co"><b>Dx:</b> ${visit.notes.dx || "--"}</div>
                <div class="card-co">${visit.notes.co || ""}</div>
            `;
            card.onclick = () => this.loadHistoricalVisit(visit);
            list.appendChild(card);
        });
    },

    loadHistoricalVisit(visit) {
        if(!confirm("Load this historical visit? Unsaved changes will be lost.")) return;

        this.state.currentVisit = JSON.parse(JSON.stringify(visit));
        this.state.rxList = this.state.currentVisit.rx || [];
        
        const d = this.dom;
        d.visitDate.value = visit.date;
        d.coText.value = visit.notes.co || "";
        d.examText.value = visit.notes.exam || "";
        d.dxText.value = visit.notes.dx || "";
        d.adviceText.value = visit.notes.advice || "";
        d.investText.value = visit.notes.invest || "";
        
        if(visit.vitals) {
            d.vitalBP.value = visit.vitals.bp || "";
            d.vitalPulse.value = visit.vitals.pulse || "";
            d.vitalTemp.value = visit.vitals.temp || "";
            d.vitalSpO2.value = visit.vitals.spo2 || "";
            d.vitalWeight.value = visit.vitals.weight || "";
        }

        d.visitStatus.textContent = "Viewing History";
        this.renderRxTable();
        this.renderPreview();
        this.toggleHistoryDrawer(false);
    },

    saveSettings() {
        if(this.dom.settingClinicName) this.state.clinic.name = this.dom.settingClinicName.value;
        if(this.dom.settingDoctorName) this.state.clinic.doctor = this.dom.settingDoctorName.value;
        if(this.dom.settingClinicAddress) this.state.clinic.address = this.dom.settingClinicAddress.value;
        if(this.dom.settingFooterNote) this.state.clinic.footerNote = this.dom.settingFooterNote.value;
        
        this.saveData();
        this.renderClinicBranding();
        this.toggleModal('settings', false);
        this.showToast("Settings Updated", "success");
    },

    renderClinicBranding() {
        if(this.dom.clinicNameDisplay) this.dom.clinicNameDisplay.textContent = this.state.clinic.name;
        if(this.dom.doctorNameDisplay) this.dom.doctorNameDisplay.textContent = this.state.clinic.doctor;
        this.renderPreview();
    },

    clearClinicalForms() {
        const d = this.dom;
        d.coText.value = ""; d.examText.value = ""; d.dxText.value = ""; 
        d.adviceText.value = ""; d.investText.value = "";
        d.vitalBP.value = ""; d.vitalPulse.value = ""; d.vitalTemp.value = ""; 
        d.vitalSpO2.value = ""; d.vitalWeight.value = ""; d.vitalHeight.value = "";
        d.rxDrugName.value = "";
    },

    initTabs() {
        this.dom.tabButtons.forEach(btn => {
            btn.onclick = () => {
                this.dom.tabButtons.forEach(b => b.classList.remove("active"));
                this.dom.tabContents.forEach(c => c.classList.remove("active"));
                btn.classList.add("active");
                document.getElementById(btn.dataset.tab).classList.add("active");
            };
        });
    },

    showToast(msg, type = "info") {
        let box = document.getElementById("toast-container");
        if (!box) {
            box = document.createElement("div");
            box.id = "toast-container";
            box.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:10000; display:flex; flex-direction:column; gap:10px;";
            document.body.appendChild(box);
        }
        const el = document.createElement("div");
        el.style.cssText = `background:${type==='error'?'#ef4444':type==='success'?'#10b981':'#333'}; color:white; padding:12px 24px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15); animation:fadeIn 0.3s forwards; font-family:var(--font-sans); font-size:13px; font-weight:500; display:flex; align-items:center; gap:8px;`;
        el.innerHTML = `<span>${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span> ${msg}`;
        box.appendChild(el);
        setTimeout(() => {
            el.style.opacity = "0";
            setTimeout(() => el.remove(), 300);
        }, 3000);
    },


    /* ==========================================================================
       11.0 PRINT & RENDERING ENGINE
       ========================================================================== */

    renderPreview() {
        const d = this.dom;
        const c = this.state.clinic;
        
        // Safety checks for elements that might be missing in HTML
        if(d.previewClinicName) d.previewClinicName.textContent = c.name;
        if(d.previewDoctorName) d.previewDoctorName.textContent = c.doctor;
        if(d.previewClinicAddress) d.previewClinicAddress.textContent = c.address;
        if(d.previewFooterNote) d.previewFooterNote.textContent = c.footerNote;

        if (this.state.currentPatient) {
            const p = this.state.currentPatient;
            if(d.previewPatientName) d.previewPatientName.textContent = p.name;
            if(d.previewPatientAgeSex) d.previewPatientAgeSex.textContent = `${p.age} / ${p.sex}`;
            if(d.previewPatientId) d.previewPatientId.textContent = p.id;
        }
        
        // Dates
        const printDateEl = document.getElementById("previewDatePrint");
        const printTimeEl = document.getElementById("previewTimePrint");
        if(printDateEl && d.visitDate) printDateEl.textContent = new Date(d.visitDate.value).toLocaleDateString();
        if(printTimeEl) printTimeEl.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Clinical Sections
        if(d.previewCO) d.previewCO.textContent = d.coText.value;
        if(d.previewExam) d.previewExam.textContent = d.examText.value;
        if(d.previewDx) d.previewDx.textContent = d.dxText.value;
        if(d.previewAdvice) d.previewAdvice.textContent = d.adviceText.value;
        if(d.previewInvest) d.previewInvest.textContent = d.investText.value;

        ['previewSectionCO', 'previewSectionExam', 'previewSectionDx', 'previewSectionAdvice', 'previewSectionInvest'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                const contentSpan = el.querySelector('span:not(.paper-label)');
                const hasContent = contentSpan && contentSpan.textContent.trim().length > 0;
                el.style.display = hasContent ? 'block' : 'none';
            }
        });

        // Rx Table
        if(d.previewRxTable) {
            d.previewRxTable.innerHTML = "";
            const rxSection = document.querySelector('.rx-section-print');
            
            if (this.state.rxList.length > 0) {
                if(rxSection) rxSection.style.display = 'block';
                
                this.state.rxList.forEach((rx, i) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td class="col-type" style="font-size:11px; color:#666;">${i + 1}</td> 
                        <td class="col-med" style="font-weight:bold;">${rx.drug}</td>
                        <td class="col-dose">${rx.dose}</td>
                        <td class="col-freq">${rx.freq}</td>
                        <td class="col-dur">${rx.duration}</td>
                        <td class="col-remark">${rx.remarks || ''}</td>
                    `;
                    d.previewRxTable.appendChild(tr);
                });
            } else {
                if(rxSection) rxSection.style.display = 'none';
            }
        }
        
        // Vitals
        const vitalsStr = [
            d.vitalBP.value ? `BP: <b>${d.vitalBP.value}</b>` : '',
            d.vitalPulse.value ? `PR: <b>${d.vitalPulse.value}</b>` : '',
            d.vitalTemp.value ? `Temp: <b>${d.vitalTemp.value}°F</b>` : '',
            d.vitalWeight.value ? `Wt: <b>${d.vitalWeight.value} kg</b>` : ''
        ].filter(Boolean).join(" | ");
        
        const vitalsRow = document.getElementById("previewVitalsRow");
        const vitalsSpan = document.getElementById("previewVitals");
        if(vitalsSpan) vitalsSpan.innerHTML = vitalsStr;
        if(vitalsRow) vitalsRow.style.display = vitalsStr ? "block" : "none";
    },

    handlePrint() {
        this.saveCurrentVisit();

        // Helper: Escape HTML
        const esc = (str) => {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>');
        };

        // Create Clone Div
        let printDiv = document.querySelector('.printable-clone');
        if (!printDiv) {
            printDiv = document.createElement('div');
            printDiv.className = 'printable-clone';
            document.body.appendChild(printDiv);
        }

        const c = this.state.clinic;
        const p = this.state.currentPatient || { name: '--', age: '--', sex: '--', id: '--', phone: '--' };
        const d = this.dom;
        const rxList = this.state.rxList;
        const visitDate = new Date(d.visitDate.value).toLocaleDateString();

        const rxRows = rxList.map((rx, i) => `
            <tr>
            <td style="padding:6px;border:1px solid #ddd;color:#666;font-size:11px">${i + 1}</td>
            <td style="padding:6px;border:1px solid #ddd"><strong>${esc(rx.drug)}</strong></td>
            <td style="padding:6px;border:1px solid #ddd">${esc(rx.dose)}</td>
            <td style="padding:6px;border:1px solid #ddd">${esc(rx.freq)}</td>
            <td style="padding:6px;border:1px solid #ddd">${esc(rx.duration)}</td>
            <td style="padding:6px;border:1px solid #ddd;font-style:italic">${esc(rx.remarks)}</td>
            </tr>
        `).join('') || `<tr><td colspan="6" style="padding:12px;text-align:center;color:#666">No medicines prescribed.</td></tr>`;

        const logoHtml = `<div style="height:60px;width:60px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:#eff6ff;color:#2563eb;font-size:30px;margin-right:12px">🩺</div>`;

        const htmlContent = `
        <div style="padding:20px; font-family:'Inter', sans-serif; color:#111; max-width: 100%;">
            
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;border-bottom:2px solid #111;padding-bottom:12px;">
            <div style="display:flex;align-items:center;gap:12px">
                ${logoHtml}
                <div>
                <h2 style="margin:0;font-size:24px;color:#1e3a8a;text-transform:uppercase;">${esc(c.name)}</h2>
                <div style="font-size:14px;color:#444;margin-top:4px;">${esc(c.doctor)}</div>
                <div style="font-size:12px;color:#666;">${esc(c.address)}</div>
                </div>
            </div>
            <div style="text-align:right;font-size:13px;color:#333;line-height:1.6">
                <div><strong>Date:</strong> ${visitDate}</div>
                <div><strong>UHID:</strong> ${esc(p.id)}</div>
                <div><strong>Patient:</strong> ${esc(p.name)}</div>
                <div><strong>Age/Sex:</strong> ${esc(p.age)} / ${esc(p.sex)}</div>
                <div><strong>Phone:</strong> ${esc(p.phone)}</div>
            </div>
            </div>

            <div style="margin-bottom:20px; padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:13px; display:flex; justify-content:space-between;">
                <span><strong>BP:</strong> ${esc(d.vitalBP.value || '--')}</span>
                <span><strong>Pulse:</strong> ${esc(d.vitalPulse.value || '--')}</span>
                <span><strong>Temp:</strong> ${esc(d.vitalTemp.value || '--')}</span>
                <span><strong>SpO2:</strong> ${esc(d.vitalSpO2.value || '--')}</span>
                <span><strong>Wt:</strong> ${esc(d.vitalWeight.value || '--')}</span>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                <div>
                    <div style="font-size:12px; font-weight:700; color:#666; text-transform:uppercase; margin-bottom:4px;">Chief Complaints</div>
                    <div style="font-size:14px;">${esc(d.coText.value) || '<span style="color:#ccc">--</span>'}</div>
                </div>
                <div>
                    <div style="font-size:12px; font-weight:700; color:#666; text-transform:uppercase; margin-bottom:4px;">Diagnosis</div>
                    <div style="font-size:14px; font-weight:600;">${esc(d.dxText.value) || '<span style="color:#ccc">--</span>'}</div>
                </div>
            </div>

            <div style="margin-bottom:20px;">
                <div style="font-size:12px; font-weight:700; color:#666; text-transform:uppercase; margin-bottom:4px;">Clinical Observations</div>
                <div style="font-size:14px;">${esc(d.examText.value) || '<span style="color:#ccc">--</span>'}</div>
            </div>

            <div style="margin-top:20px">
            <h3 style="margin:0 0 10px 0; font-family:'Merriweather', serif; font-style:italic;">Rx <span style="font-size:14px; font-family:'Inter', sans-serif; font-style:normal; color:#666;">(Prescription)</span></h3>
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead style="background:#f1f5f9; color:#334155;">
                <tr>
                    <th style="padding:8px; border:1px solid #cbd5e1; width:30px;">#</th>
                    <th style="padding:8px; border:1px solid #cbd5e1; text-align:left;">Medicine</th>
                    <th style="padding:8px; border:1px solid #cbd5e1;">Dose</th>
                    <th style="padding:8px; border:1px solid #cbd5e1;">Freq</th>
                    <th style="padding:8px; border:1px solid #cbd5e1;">Dur</th>
                    <th style="padding:8px; border:1px solid #cbd5e1;">Remarks</th>
                </tr>
                </thead>
                <tbody>${rxRows}</tbody>
            </table>
            </div>

            <div style="margin-top:24px;">
                <div style="margin-bottom:12px;">
                    <div style="font-size:12px; font-weight:700; color:#666; text-transform:uppercase; margin-bottom:4px;">Advice</div>
                    <div style="font-size:14px;">${esc(d.adviceText.value) || 'General precautions.'}</div>
                </div>
                ${d.investText.value ? `
                <div style="margin-bottom:12px;">
                    <div style="font-size:12px; font-weight:700; color:#666; text-transform:uppercase; margin-bottom:4px;">Investigations (Lab/Radio)</div>
                    <div style="font-size:14px;">${esc(d.investText.value)}</div>
                </div>` : ''}
            </div>

            <div style="margin-top:40px; display:flex; justify-content:space-between; align-items:flex-end;">
                <div style="font-size:11px; color:#666; max-width:60%;">
                    ${esc(c.footerNote)}
                </div>
                <div style="text-align:center;">
                    <div style="height:40px;"></div>
                    <div style="border-top:1px solid #000; padding-top:4px; width:200px; font-weight:600;">
                        ${esc(c.doctor)}
                    </div>
                </div>
            </div>

        </div>
        `;

        printDiv.innerHTML = htmlContent;
        
        setTimeout(() => {
            window.print();
        }, 100);
    }

};

/* CSS Injection for Toast Animation */
const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);
