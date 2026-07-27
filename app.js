// Application State
let state = {
    bgImage: "",        // Base64 or image path
    fields: [],         // Field objects
    items: [],          // Inventory items
    selectedItemId: null, // Selected inventory item ID
    activeMode: "play", // "play" or "edit"
    currentZoom: 100,   // Percentage
    selectedFieldId: null,
    snapToGrid: true
};

// Configuration
const BASE_WIDTH = 900; // Baseline width of sheet at 100% zoom
const GRID_SNAP_SIZE = 0.25; // Snap interval in percentages

// Grid Zones Configuration for Snapping (w and h will be calculated dynamically on image load)
const gridZones = [
    { id: "destra", name: "Destra", x: 5.8, y: 53.34, w: 28.44, h: 29.3, cols: 3, rows: 4 },
    { id: "carga_l", name: "Carga (Esquerda)", x: 23.6, y: 53.34, w: 28.44, h: 29.3, cols: 3, rows: 4 },
    { id: "traje", name: "Traje", x: 35.2, y: 53.34, w: 28.44, h: 29.3, cols: 3, rows: 4 },
    { id: "carga_r", name: "Carga (Direita)", x: 58.8, y: 53.34, w: 28.44, h: 29.3, cols: 3, rows: 4 },
    { id: "sinistra", name: "Sinistra", x: 76.4, y: 53.34, w: 28.44, h: 29.3, cols: 3, rows: 4 },
    { id: "carga_1", name: "Carga 1", x: 5.8, y: 71.34, w: 47.39, h: 29.3, cols: 5, rows: 4 },
    { id: "carga_2", name: "Carga 2", x: 35.2, y: 71.34, w: 47.39, h: 29.3, cols: 5, rows: 4 },
    { id: "carga_3", name: "Carga 3", x: 64.8, y: 71.34, w: 47.39, h: 29.3, cols: 5, rows: 4 }
];

let SHEET_RATIO = 0.707; // Default aspect ratio of A4 sheet (2480 / 3508)
let cellW = 9.48; // Base width percentage for a 1x1 grid cell (300 / 3165 * 100)
let cellH = 7.32; // Base height percentage for a 1x1 grid cell (300 / 4096 * 100)

// Drag & Resize Tracking
let dragContext = {
    isDragging: false,
    isResizing: false,
    fieldId: null,
    startX: 0,
    startY: 0,
    startFieldX: 0,
    startFieldY: 0,
    startFieldW: 0,
    startFieldH: 0
};

// Item Drag Tracking
let itemDragContext = {
    isDragging: false,
    itemId: null,
    startX: 0,
    startY: 0,
    startItemX: 0,
    startItemY: 0
};

// DOM References
const elements = {
    appContainer: document.querySelector(".app-container"),
    sheetContainer: document.getElementById("sheet-container"),
    sheetImage: document.getElementById("sheet-image"),
    fieldsOverlay: document.getElementById("fields-overlay"),
    emptyState: document.getElementById("empty-state"),
    canvasViewport: document.getElementById("canvas-viewport"),
    sheetScroller: document.getElementById("sheet-scroller"),
    
    // Mode switcher buttons
    btnPlayMode: document.getElementById("btn-play-mode"),
    btnEditMode: document.getElementById("btn-edit-mode"),
    
    // File inputs & buttons
    btnLoadPoise: document.getElementById("btn-load-poise"),
    btnSavePoise: document.getElementById("btn-save-poise"),
    btnPrintPdf: document.getElementById("btn-print-pdf"),
    btnClearValues: document.getElementById("btn-clear-values"),
    btnUploadPng: document.getElementById("btn-upload-png"),
    filePngInput: document.getElementById("file-png-input"),
    filePoiseInput: document.getElementById("file-poise-input"),
    
    // Empty state CTA buttons
    btnEmptyUpload: document.getElementById("btn-empty-upload"),
    btnEmptyLoadFile: document.getElementById("btn-empty-load-file"),
    
    // Designer controls
    editorControls: document.getElementById("editor-controls"),
    btnAddText: document.getElementById("btn-add-text"),
    btnAddTextarea: document.getElementById("btn-add-textarea"),
    btnAddCheckbox: document.getElementById("btn-add-checkbox"),
    btnAddBubbleGroup: document.getElementById("btn-add-bubblegroup"),
    snapToggle: document.getElementById("snap-toggle"),
    
    // Properties inspector
    propertiesPanel: document.getElementById("properties-panel"),
    propName: document.getElementById("prop-name"),
    propType: document.getElementById("prop-type"),
    bubbleCountRow: document.getElementById("bubble-count-row"),
    propBubbleCount: document.getElementById("prop-bubble-count"),
    propFontSize: document.getElementById("prop-fontsize"),
    propAlign: document.getElementById("prop-align"),
    propX: document.getElementById("prop-x"),
    propY: document.getElementById("prop-y"),
    propW: document.getElementById("prop-w"),
    propH: document.getElementById("prop-h"),
    btnDeleteField: document.getElementById("btn-delete-field"),
    
    // Zoom controls
    btnZoomIn: document.getElementById("btn-zoom-in"),
    btnZoomOut: document.getElementById("btn-zoom-out"),
    btnZoomFit: document.getElementById("btn-zoom-fit"),
    btnZoomActual: document.getElementById("btn-zoom-actual"),
    zoomIndicator: document.getElementById("zoom-indicator"),
    
    // Overlays & Modal
    dragOverlay: document.getElementById("drag-overlay"),
    helpModal: document.getElementById("help-modal"),
    btnHelp: document.getElementById("btn-help"),
    btnCloseHelp: document.getElementById("btn-close-help"),
    autosaveStatus: document.getElementById("autosave-status"),
    
    // Inventory controls & snap preview
    itemNameInput: document.getElementById("item-name-input"),
    itemCardSelect: document.getElementById("item-card-select"),
    btnAddItem: document.getElementById("btn-add-item"),
    snapPreview: document.getElementById("snap-preview"),
    
    // Inventory inspector controls
    itemInspector: document.getElementById("item-inspector"),
    inspectItemName: document.getElementById("inspect-item-name"),
    inspectItemDesc: document.getElementById("inspect-item-desc"),
    inspectItemDetails: document.getElementById("inspect-item-details"),
    btnDetachItem: document.getElementById("btn-detach-item"),
    btnDeleteItem: document.getElementById("btn-delete-item"),
    
    // Mobile sidebar toggle controls
    sidebarToggle: document.getElementById("sidebar-toggle"),
    sidebarOverlay: document.getElementById("sidebar-overlay"),
    sidebar: document.querySelector(".sidebar")
};

// Initialize Application
window.addEventListener("DOMContentLoaded", () => {
    loadSession();
    setupEventListeners();
    updateZoom();
});

// Load saved session or check default state
function loadSession() {
    const saved = localStorage.getItem("poise_sheet_save");
    if (saved) {
        try {
            const data = JSON.parse(saved);
            state.bgImage = data.bgImage || "";
            state.fields = data.fields || [];
            state.items = data.items || [];
            state.snapToGrid = data.snapToGrid !== undefined ? data.snapToGrid : true;
            elements.snapToggle.checked = state.snapToGrid;
            
            if (state.bgImage) {
                elements.sheetImage.src = state.bgImage;
                elements.emptyState.classList.add("hidden");
                renderFields();
            } else {
                showEmptyState();
            }
        } catch (e) {
            console.error("Erro ao carregar sessão anterior:", e);
            showEmptyState();
        }
    } else {
        showEmptyState();
    }
}

// Save current session to LocalStorage
function saveSession() {
    elements.autosaveStatus.textContent = "Salvando...";
    elements.autosaveStatus.classList.add("saving");
    
    const data = {
        bgImage: state.bgImage,
        fields: state.fields,
        items: state.items,
        snapToGrid: state.snapToGrid
    };
    
    localStorage.setItem("poise_sheet_save", JSON.stringify(data));
    
    setTimeout(() => {
        elements.autosaveStatus.textContent = "Salvo localmente";
        elements.autosaveStatus.classList.remove("saving");
    }, 500);
}

// Show empty landing view
function showEmptyState() {
    elements.emptyState.classList.remove("hidden");
    elements.sheetImage.src = "";
    state.bgImage = "";
    state.fields = [];
    state.items = [];
    renderFields();
}

// Setup Event Handlers
function setupEventListeners() {
    // Mode Swapping
    elements.btnPlayMode.addEventListener("click", () => setMode("play"));
    elements.btnEditMode.addEventListener("click", () => setMode("edit"));
    
    // Empty state triggers
    elements.btnEmptyUpload.addEventListener("click", () => elements.filePngInput.click());
    elements.btnEmptyLoadFile.addEventListener("click", () => elements.filePoiseInput.click());
    
    // Sidebar sheet control actions
    elements.btnUploadPng.addEventListener("click", () => elements.filePngInput.click());
    elements.btnLoadPoise.addEventListener("click", () => elements.filePoiseInput.click());
    elements.btnSavePoise.addEventListener("click", exportPoiseFile);
    elements.btnPrintPdf.addEventListener("click", () => window.print());
    elements.btnClearValues.addEventListener("click", clearValues);
    
    // File inputs changes
    elements.filePngInput.addEventListener("change", handlePngUpload);
    elements.filePoiseInput.addEventListener("change", handlePoiseUpload);
    
    // Zoom triggers
    elements.btnZoomIn.addEventListener("click", () => adjustZoom(10));
    elements.btnZoomOut.addEventListener("click", () => adjustZoom(-10));
    elements.btnZoomFit.addEventListener("click", zoomToFit);
    elements.btnZoomActual.addEventListener("click", () => { state.currentZoom = 100; updateZoom(); });
    
    // Designer field creators
    elements.btnAddText.addEventListener("click", () => addField("text"));
    elements.btnAddTextarea.addEventListener("click", () => addField("textarea"));
    elements.btnAddCheckbox.addEventListener("click", () => addField("checkbox"));
    elements.btnAddBubbleGroup.addEventListener("click", () => addField("bubble-group"));
    
    elements.snapToggle.addEventListener("change", (e) => {
        state.snapToGrid = e.target.checked;
        saveSession();
    });
    
    // Properties inspector changes
    elements.propName.addEventListener("input", updateSelectedFieldProperty);
    elements.propType.addEventListener("change", (e) => {
        const type = e.target.value;
        if (type === "bubble-group") {
            elements.bubbleCountRow.classList.remove("hidden");
        } else {
            elements.bubbleCountRow.classList.add("hidden");
        }
        updateSelectedFieldProperty();
    });
    elements.propBubbleCount.addEventListener("input", updateSelectedFieldProperty);
    elements.propFontSize.addEventListener("input", updateSelectedFieldProperty);
    elements.propAlign.addEventListener("change", updateSelectedFieldProperty);
    
    // Coordinate input adjustments in designer panel
    const coordInputs = [elements.propX, elements.propY, elements.propW, elements.propH];
    coordInputs.forEach(input => {
        input.addEventListener("input", () => {
            if (!state.selectedFieldId) return;
            const field = state.fields.find(f => f.id === state.selectedFieldId);
            if (!field) return;
            
            field.x = parseFloat(elements.propX.value) || 0;
            field.y = parseFloat(elements.propY.value) || 0;
            field.w = parseFloat(elements.propW.value) || 1;
            field.h = parseFloat(elements.propH.value) || 1;
            
            // Re-render only position styles for performance
            const el = document.querySelector(`.sheet-field[data-id="${field.id}"]`);
            if (el) {
                el.style.left = `${field.x}%`;
                el.style.top = `${field.y}%`;
                el.style.width = `${field.w}%`;
                el.style.height = `${field.h}%`;
            }
            saveSession();
        });
    });
    
    elements.btnDeleteField.addEventListener("click", deleteSelectedField);
    
    // Help modal triggers
    elements.btnHelp.addEventListener("click", () => elements.helpModal.classList.remove("hidden"));
    elements.btnCloseHelp.addEventListener("click", () => elements.helpModal.classList.add("hidden"));
    
    // Drag & Drop onto viewport
    window.addEventListener("dragenter", handleDragEnter);
    elements.dragOverlay.addEventListener("dragover", handleDragOver);
    elements.dragOverlay.addEventListener("dragleave", handleDragLeave);
    elements.dragOverlay.addEventListener("drop", handleDrop);
    
    // De-select field or item when clicking on the sheet wrapper background
    elements.sheetScroller.addEventListener("mousedown", (e) => {
        if (e.target === elements.sheetScroller || e.target === elements.sheetContainer || e.target === elements.sheetImage || e.target === elements.fieldsOverlay) {
            if (state.activeMode === "edit") {
                selectField(null);
            }
            selectItem(null);
        }
    });
    
    // Global Keyboard Shortcuts
    document.addEventListener("keydown", handleKeyDown);
    
    // Update sheet ratio when image loads
    elements.sheetImage.addEventListener("load", () => {
        if (elements.sheetImage.naturalWidth && elements.sheetImage.naturalHeight) {
            SHEET_RATIO = elements.sheetImage.naturalWidth / elements.sheetImage.naturalHeight;
            
            // Calculate exact cell percentages based on 300x300px cells on the sheet
            cellW = (300 / elements.sheetImage.naturalWidth) * 100;
            cellH = (300 / elements.sheetImage.naturalHeight) * 100;
            
            // Update grid zones dimensions dynamically
            gridZones.forEach(zone => {
                zone.w = zone.cols * cellW;
                zone.h = zone.rows * cellH;
            });
            
            if (state.items && state.items.length > 0) {
                // Re-calculate heights of items to maintain aspect ratio
                state.items.forEach(item => {
                    if (!item.snapped) {
                        item.w = parseFloat((item.cols * cellW).toFixed(2));
                        item.h = parseFloat((item.rows * cellH).toFixed(2));
                    } else {
                        item.w = parseFloat((item.cols * cellW).toFixed(2));
                        item.h = parseFloat((item.rows * cellH).toFixed(2));
                    }
                });
                renderInventoryItems();
            }
        }
    });
    
    // Add Item click
    elements.btnAddItem.addEventListener("click", () => {
        const name = elements.itemNameInput.value.trim() || "Item";
        
        // Parse select value: "imageName|cols|rows"
        const selectVal = elements.itemCardSelect.value;
        const [imageName, colsStr, rowsStr] = selectVal.split('|');
        const cols = parseInt(colsStr) || 1;
        const rows = parseInt(rowsStr) || 1;
        
        spawnInventoryItem(name, cols, rows, imageName);
        elements.itemNameInput.value = "";
    });
    
    // Inspector events
    elements.inspectItemName.addEventListener("input", (e) => {
        if (!state.selectedItemId) return;
        const item = state.items.find(it => it.id === state.selectedItemId);
        if (item) {
            item.name = e.target.value;
            const cardEl = document.querySelector(`.inventory-card[data-id="${item.id}"]`);
            if (cardEl) {
                const label = cardEl.querySelector(".card-label");
                if (label) label.textContent = item.name;
            }
            saveSession();
        }
    });
    
    elements.inspectItemDesc.addEventListener("input", (e) => {
        if (!state.selectedItemId) return;
        const item = state.items.find(it => it.id === state.selectedItemId);
        if (item) {
            item.desc = e.target.value;
            const cardEl = document.querySelector(`.inventory-card[data-id="${item.id}"]`);
            if (cardEl) {
                const descEl = cardEl.querySelector(".card-desc");
                if (descEl) descEl.textContent = item.desc;
            }
            saveSession();
        }
    });
    
    elements.btnDetachItem.addEventListener("click", () => {
        if (!state.selectedItemId) return;
        const item = state.items.find(it => it.id === state.selectedItemId);
        if (item && item.snapped) {
            item.snapped = false;
            item.zoneId = null;
            // Shift position slightly so it's not directly on top of the grid
            item.y = Math.max(2, item.y - 10); 
            // Revert size keeping aspect ratio
            item.w = parseFloat((item.cols * cellW).toFixed(2));
            item.h = parseFloat((item.rows * cellH).toFixed(2));
            
            selectItem(item.id);
            renderInventoryItems();
            saveSession();
        }
    });
    
    elements.btnDeleteItem.addEventListener("click", () => {
        if (!state.selectedItemId) return;
        deleteInventoryItem(state.selectedItemId);
        selectItem(null);
    });
    
    // Collapsible Mobile Sidebar Toggle Listeners
    if (elements.sidebarToggle && elements.sidebarOverlay && elements.sidebar) {
        elements.sidebarToggle.addEventListener("click", () => {
            elements.sidebar.classList.toggle("active");
            elements.sidebarOverlay.classList.toggle("active");
        });
        
        elements.sidebarOverlay.addEventListener("click", () => {
            elements.sidebar.classList.remove("active");
            elements.sidebarOverlay.classList.remove("active");
        });
        
        // Auto-close sidebar on mobile when changing modes or actions to improve UX flow
        const closeButtons = [
            elements.btnPlayMode,
            elements.btnEditMode,
            elements.btnLoadPoise,
            elements.btnSavePoise,
            elements.btnPrintPdf,
            elements.btnClearValues
        ];
        closeButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener("click", () => {
                    elements.sidebar.classList.remove("active");
                    elements.sidebarOverlay.classList.remove("active");
                });
            }
        });
    }
}

// Switch Mode (Play vs Edit)
function setMode(mode) {
    state.activeMode = mode;
    document.body.className = `mode-${mode}`;
    
    if (mode === "play") {
        elements.btnPlayMode.classList.add("active");
        elements.btnEditMode.classList.remove("active");
        elements.editorControls.classList.add("hidden");
        elements.propertiesPanel.classList.add("hidden");
        selectField(null);
    } else {
        elements.btnPlayMode.classList.remove("active");
        elements.btnEditMode.classList.add("active");
        elements.editorControls.classList.remove("hidden");
        
        // Show properties if a field is selected
        if (state.selectedFieldId) {
            elements.propertiesPanel.classList.remove("hidden");
        }
    }
    
    renderFields();
}


// Handlers for Uploading Files
function handlePngUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        state.bgImage = event.target.result;
        elements.sheetImage.src = state.bgImage;
        elements.emptyState.classList.add("hidden");
        
        // Clear old fields since it's a new layout, or if the name matches the official sheet, prompt loading default
        if (file.name.includes("PoiseRPG") || file.name.includes("CS") || file.name.includes("planilha")) {
            if (confirm("Identificamos que este arquivo pode ser a planilha oficial do Poise RPG. Deseja carregar o layout de campos padrão?")) {
                state.fields = JSON.parse(JSON.stringify(defaultTemplate));
            } else {
                state.fields = [];
            }
        } else {
            state.fields = [];
        }
        
        selectField(null);
        renderFields();
        saveSession();
        
        setTimeout(zoomToFit, 100);
    };
    reader.readAsDataURL(file);
}

function handlePoiseUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    loadPoiseFileContent(file);
}

function loadPoiseFileContent(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.bgImage && data.bgImage !== "PoiseRPGv0.1.4_CS.png") {
                state.bgImage = data.bgImage;
                elements.sheetImage.src = state.bgImage;
                elements.emptyState.classList.add("hidden");
            } else {
                // If JSON doesn't contain a valid base64 image, ask the user to select the PNG
                alert("Esta ficha requer que você selecione o arquivo de imagem PNG da planilha para ser exibida.");
                elements.filePngInput.click();
            }
            
            state.fields = data.fields || [];
            state.items = data.items || [];
            selectField(null);
            renderFields();
            saveSession();
            setTimeout(zoomToFit, 100);
        } catch (err) {
            alert("Erro ao ler arquivo .poise: formato JSON inválido.");
            console.error(err);
        }
    };
    reader.readAsText(file);
}

// Drag & Drop File Handlers
function handleDragEnter(e) {
    e.preventDefault();
    elements.dragOverlay.classList.add("active");
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragLeave(e) {
    e.preventDefault();
    // Only deactivate if drag leaves overlay wrapper
    if (e.target === elements.dragOverlay) {
        elements.dragOverlay.classList.remove("active");
    }
}

function handleDrop(e) {
    e.preventDefault();
    elements.dragOverlay.classList.remove("active");
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    if (file.name.endsWith(".poise") || file.name.endsWith(".json")) {
        loadPoiseFileContent(file);
    } else if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
            state.bgImage = event.target.result;
            elements.sheetImage.src = state.bgImage;
            elements.emptyState.classList.add("hidden");
            
            if (confirm("Planilha carregada. Deseja aplicar o layout de campos padrão do Poise RPG?")) {
                state.fields = JSON.parse(JSON.stringify(defaultTemplate));
            } else {
                state.fields = [];
            }
            
            selectField(null);
            renderFields();
            saveSession();
            setTimeout(zoomToFit, 100);
        };
        reader.readAsDataURL(file);
    }
}

// Clear all player input values
function clearValues() {
    if (!confirm("Tem certeza que deseja apagar todos os preenchimentos e itens da mochila? Os campos de digitação e itens serão resetados.")) {
        return;
    }
    state.fields.forEach(field => {
        if (field.type === "checkbox") {
            field.value = false;
        } else if (field.type === "bubble-group") {
            field.value = Array(field.bubblesCount || 6).fill(false);
        } else {
            field.value = "";
        }
    });
    state.items = [];
    renderFields();
    saveSession();
}

// Zoom Management
function adjustZoom(amount) {
    state.currentZoom = Math.max(30, Math.min(250, state.currentZoom + amount));
    updateZoom();
}

function zoomToFit() {
    const scrollerW = elements.sheetScroller.clientWidth - 40;
    const ratio = scrollerW / BASE_WIDTH;
    state.currentZoom = Math.round(ratio * 100);
    updateZoom();
}

function updateZoom() {
    elements.zoomIndicator.textContent = `${state.currentZoom}%`;
    const newWidth = BASE_WIDTH * (state.currentZoom / 100);
    elements.sheetContainer.style.width = `${newWidth}px`;
    
    // Scale existing fields font sizes dynamically
    state.fields.forEach(field => {
        const el = document.querySelector(`.sheet-field[data-id="${field.id}"]`);
        if (el) {
            const input = el.querySelector("input, textarea");
            if (input) {
                input.style.fontSize = `${(field.fontSize || 14) * (state.currentZoom / 100)}px`;
            }
        }
    });
    
    // Scale existing inventory card font sizes dynamically
    if (state.items) {
        state.items.forEach(item => {
            const el = document.querySelector(`.inventory-card[data-id="${item.id}"]`);
            if (el) {
                const label = el.querySelector(".card-label");
                if (label) {
                    label.style.fontSize = `${13 * (state.currentZoom / 100)}px`;
                }
                const desc = el.querySelector(".card-desc");
                if (desc) {
                    desc.style.fontSize = `${10 * (state.currentZoom / 100)}px`;
                }
            }
        });
    }
}

// Render Fields Overlay
function renderFields() {
    elements.fieldsOverlay.innerHTML = "";
    
    state.fields.forEach(field => {
        const fieldEl = document.createElement("div");
        fieldEl.className = `sheet-field field-type-${field.type}`;
        fieldEl.setAttribute("data-id", field.id);
        
        // Coordinates and sizes
        fieldEl.style.left = `${field.x}%`;
        fieldEl.style.top = `${field.y}%`;
        fieldEl.style.width = `${field.w}%`;
        fieldEl.style.height = `${field.h}%`;
        
        // Font configuration
        const calculatedFontSize = (field.fontSize || 14) * (state.currentZoom / 100);
        
        if (state.activeMode === "play") {
            // Render actual inputs based on type
            if (field.type === "textarea") {
                const textarea = document.createElement("textarea");
                textarea.value = field.value || "";
                textarea.style.fontSize = `${calculatedFontSize}px`;
                textarea.style.textAlign = field.align || "left";
                
                textarea.addEventListener("input", (e) => {
                    field.value = e.target.value;
                    saveSession();
                });
                fieldEl.appendChild(textarea);
                
            } else if (field.type === "checkbox") {
                if (field.value) fieldEl.classList.add("checked");
                fieldEl.addEventListener("click", () => {
                    field.value = !field.value;
                    if (field.value) {
                        fieldEl.classList.add("checked");
                    } else {
                        fieldEl.classList.remove("checked");
                    }
                    saveSession();
                });
                
            } else if (field.type === "bubble-group") {
                const count = field.bubblesCount || 6;
                const vals = Array.isArray(field.value) ? field.value : Array(count).fill(false);
                
                for (let i = 0; i < count; i++) {
                    const bubble = document.createElement("div");
                    bubble.className = "bubble-item";
                    if (vals[i]) bubble.classList.add("checked");
                    
                    bubble.addEventListener("click", (e) => {
                        e.stopPropagation();
                        vals[i] = !vals[i];
                        field.value = vals;
                        
                        if (vals[i]) {
                            bubble.classList.add("checked");
                        } else {
                            bubble.classList.remove("checked");
                        }
                        saveSession();
                    });
                    fieldEl.appendChild(bubble);
                }
                
            } else { // text, number
                const input = document.createElement("input");
                input.type = field.type === "number" ? "number" : "text";
                input.value = field.value || "";
                input.style.fontSize = `${calculatedFontSize}px`;
                input.style.textAlign = field.align || "left";
                
                input.addEventListener("input", (e) => {
                    field.value = e.target.value;
                    saveSession();
                });
                fieldEl.appendChild(input);
            }
            
        } else {
            // Render designer layout (EDIT MODE)
            fieldEl.classList.toggle("selected", field.id === state.selectedFieldId);
            
            // Text visual indicators in edit mode
            if (field.type === "bubble-group") {
                const count = field.bubblesCount || 6;
                for (let i = 0; i < count; i++) {
                    const bubble = document.createElement("div");
                    bubble.className = "bubble-item";
                    fieldEl.appendChild(bubble);
                }
            } else if (field.type === "checkbox") {
                // Circular indicator
            } else {
                const placeholder = document.createElement("div");
                placeholder.textContent = field.value || field.name;
                placeholder.style.fontSize = `${calculatedFontSize}px`;
                placeholder.style.textAlign = field.align || "left";
                placeholder.style.overflow = "hidden";
                placeholder.style.whiteSpace = field.type === "textarea" ? "normal" : "nowrap";
                fieldEl.appendChild(placeholder);
            }
            
            // Header tag
            const labelTag = document.createElement("span");
            labelTag.className = "field-label-tag";
            labelTag.textContent = field.name || field.id;
            fieldEl.appendChild(labelTag);
            
            // Resize corner handle
            const resizeHandle = document.createElement("span");
            resizeHandle.className = "resize-handle";
            fieldEl.appendChild(resizeHandle);
            
            // Setup mouse drag-and-drop handles
            fieldEl.addEventListener("mousedown", (e) => handleFieldMouseDown(e, field.id));
        }
        
        elements.fieldsOverlay.appendChild(fieldEl);
    });
    
    // Render inventory cards
    renderInventoryItems();
}

// Select a Field in Designer Mode
function selectField(id) {
    state.selectedFieldId = id;
    
    // Update border highlight in UI
    document.querySelectorAll(".sheet-field").forEach(el => {
        el.classList.toggle("selected", el.getAttribute("data-id") === id);
    });
    
    if (id && state.activeMode === "edit") {
        const field = state.fields.find(f => f.id === id);
        if (field) {
            elements.propertiesPanel.classList.remove("hidden");
            elements.propName.value = field.name || "";
            elements.propType.value = field.type;
            elements.propFontSize.value = field.fontSize || 14;
            elements.propAlign.value = field.align || "left";
            
            elements.propX.value = field.x.toFixed(1);
            elements.propY.value = field.y.toFixed(1);
            elements.propW.value = field.w.toFixed(1);
            elements.propH.value = field.h.toFixed(1);
            
            if (field.type === "bubble-group") {
                elements.bubbleCountRow.classList.remove("hidden");
                elements.propBubbleCount.value = field.bubblesCount || 6;
            } else {
                elements.bubbleCountRow.classList.add("hidden");
            }
        }
    } else {
        elements.propertiesPanel.classList.add("hidden");
    }
}

// Add a New Field in Designer Mode
function addField(type) {
    if (state.activeMode !== "edit") return;
    
    const id = "field_" + Date.now();
    const scrollLeft = elements.sheetScroller.scrollLeft;
    const scrollTop = elements.sheetScroller.scrollTop;
    
    // Position field near the center of the current scroll viewport
    const containerRect = elements.sheetContainer.getBoundingClientRect();
    const viewportRect = elements.canvasViewport.getBoundingClientRect();
    
    // Calculate percentage coords based on viewport center relative to container
    const centerX_px = (viewportRect.width / 2) + scrollLeft - 100;
    const centerY_px = (viewportRect.height / 2) + scrollTop - 20;
    
    let x = (centerX_px / containerRect.width) * 100;
    let y = (centerY_px / containerRect.height) * 100;
    
    // Keep it in bounds
    x = Math.max(2, Math.min(80, x));
    y = Math.max(2, Math.min(90, y));
    
    let w = 15;
    let h = 2.5;
    let name = "Novo Campo";
    let defaultValue = "";
    
    if (type === "textarea") {
        w = 20;
        h = 10;
        name = "Bloco de Texto";
    } else if (type === "checkbox") {
        w = 3.2;
        h = 2.3;
        name = "Check";
        defaultValue = false;
    } else if (type === "bubble-group") {
        w = 10;
        h = 2.0;
        name = "Grupo de EXP";
        defaultValue = Array(6).fill(false);
    }
    
    const newField = {
        id,
        name,
        type,
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
        w,
        h,
        fontSize: 14,
        align: type === "checkbox" || type === "bubble-group" ? "center" : "left",
        value: defaultValue,
        bubblesCount: type === "bubble-group" ? 6 : undefined
    };
    
    state.fields.push(newField);
    renderFields();
    selectField(id);
    saveSession();
}

// Update selected field property from sidebar inputs
function updateSelectedFieldProperty() {
    if (!state.selectedFieldId) return;
    const field = state.fields.find(f => f.id === state.selectedFieldId);
    if (!field) return;
    
    field.name = elements.propName.value;
    
    const oldType = field.type;
    field.type = elements.propType.value;
    
    // Reset values appropriately if type is mutated
    if (oldType !== field.type) {
        if (field.type === "checkbox") {
            field.value = false;
            field.w = 3.2;
            field.h = 2.3;
        } else if (field.type === "bubble-group") {
            field.bubblesCount = parseInt(elements.propBubbleCount.value) || 6;
            field.value = Array(field.bubblesCount).fill(false);
            field.w = 10;
            field.h = 2.0;
        } else if (field.type === "textarea") {
            field.value = "";
            field.w = 20;
            field.h = 8;
        } else {
            field.value = "";
            field.w = 15;
            field.h = 2.5;
        }
    }
    
    if (field.type === "bubble-group") {
        const newCount = parseInt(elements.propBubbleCount.value) || 6;
        if (field.bubblesCount !== newCount) {
            field.bubblesCount = newCount;
            field.value = Array(newCount).fill(false);
        }
    }
    
    field.fontSize = parseInt(elements.propFontSize.value) || 14;
    field.align = elements.propAlign.value;
    
    renderFields();
    saveSession();
}

// Delete Selected Field
function deleteSelectedField() {
    if (!state.selectedFieldId) return;
    state.fields = state.fields.filter(f => f.id !== state.selectedFieldId);
    selectField(null);
    renderFields();
    saveSession();
}

// Mouse Drag & Resize Handlers
function handleFieldMouseDown(e, fieldId) {
    if (state.activeMode !== "edit") return;
    
    e.preventDefault();
    selectField(fieldId);
    
    const field = state.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    const isResize = e.target.classList.contains("resize-handle");
    
    dragContext.isDragging = !isResize;
    dragContext.isResizing = isResize;
    dragContext.fieldId = fieldId;
    dragContext.startX = e.clientX;
    dragContext.startY = e.clientY;
    dragContext.startFieldX = field.x;
    dragContext.startFieldY = field.y;
    dragContext.startFieldW = field.w;
    dragContext.startFieldH = field.h;
    
    const fieldEl = document.querySelector(`.sheet-field[data-id="${fieldId}"]`);
    if (fieldEl) fieldEl.classList.add("dragging");
    
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
}

function handleDocumentMouseMove(e) {
    if (!dragContext.fieldId) return;
    
    const field = state.fields.find(f => f.id === dragContext.fieldId);
    if (!field) return;
    
    const containerW = elements.sheetContainer.offsetWidth;
    const containerH = elements.sheetContainer.offsetHeight;
    
    // Pixel differences
    const dx_px = e.clientX - dragContext.startX;
    const dy_px = e.clientY - dragContext.startY;
    
    // Percentage differences
    const dx_pct = (dx_px / containerW) * 100;
    const dy_pct = (dy_px / containerH) * 100;
    
    const fieldEl = document.querySelector(`.sheet-field[data-id="${field.id}"]`);
    
    if (dragContext.isDragging) {
        let newX = dragContext.startFieldX + dx_pct;
        let newY = dragContext.startFieldY + dy_pct;
        
        if (state.snapToGrid) {
            newX = Math.round(newX / GRID_SNAP_SIZE) * GRID_SNAP_SIZE;
            newY = Math.round(newY / GRID_SNAP_SIZE) * GRID_SNAP_SIZE;
        }
        
        // Bounds clamping
        newX = Math.max(0, Math.min(100 - field.w, newX));
        newY = Math.max(0, Math.min(100 - field.h, newY));
        
        field.x = parseFloat(newX.toFixed(2));
        field.y = parseFloat(newY.toFixed(2));
        
        if (fieldEl) {
            fieldEl.style.left = `${field.x}%`;
            fieldEl.style.top = `${field.y}%`;
        }
        
        // Sync to sidebar inputs
        elements.propX.value = field.x.toFixed(1);
        elements.propY.value = field.y.toFixed(1);
    }
    
    if (dragContext.isResizing) {
        let newW = dragContext.startFieldW + dx_pct;
        let newH = dragContext.startFieldH + dy_pct;
        
        if (state.snapToGrid) {
            newW = Math.round(newW / GRID_SNAP_SIZE) * GRID_SNAP_SIZE;
            newH = Math.round(newH / GRID_SNAP_SIZE) * GRID_SNAP_SIZE;
        }
        
        // Minimum size rules
        newW = Math.max(0.5, Math.min(100 - field.x, newW));
        newH = Math.max(0.5, Math.min(100 - field.y, newH));
        
        field.w = parseFloat(newW.toFixed(2));
        field.h = parseFloat(newH.toFixed(2));
        
        if (fieldEl) {
            fieldEl.style.width = `${field.w}%`;
            fieldEl.style.height = `${field.h}%`;
        }
        
        // Sync to sidebar inputs
        elements.propW.value = field.w.toFixed(1);
        elements.propH.value = field.h.toFixed(1);
    }
}

function handleDocumentMouseUp() {
    if (dragContext.fieldId) {
        const fieldEl = document.querySelector(`.sheet-field[data-id="${dragContext.fieldId}"]`);
        if (fieldEl) fieldEl.classList.remove("dragging");
        
        saveSession();
        // Full re-render to ensure layout text wraps correctly after resize
        renderFields();
    }
    
    dragContext.isDragging = false;
    dragContext.isResizing = false;
    dragContext.fieldId = null;
    
    document.removeEventListener("mousemove", handleDocumentMouseMove);
    document.removeEventListener("mouseup", handleDocumentMouseUp);
}

// Keyboard shortcuts & fine adjustments (Nudging)
function handleKeyDown(e) {
    // If typing in any input field, ignore global shortcut hotkeys
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
        return;
    }
    
    // Help Modal escape
    if (e.key === "Escape" && !elements.helpModal.classList.contains("hidden")) {
        elements.helpModal.classList.add("hidden");
        return;
    }
    
    if (state.activeMode !== "edit") return;
    
    if (state.selectedFieldId) {
        const field = state.fields.find(f => f.id === state.selectedFieldId);
        if (!field) return;
        
        const step = e.shiftKey ? 1.0 : 0.1; // Hold shift for large move
        
        if (e.key === "ArrowUp") {
            e.preventDefault();
            field.y = parseFloat(Math.max(0, field.y - step).toFixed(2));
            saveAndNudge(field);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            field.y = parseFloat(Math.min(100 - field.h, field.y + step).toFixed(2));
            saveAndNudge(field);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            field.x = parseFloat(Math.max(0, field.x - step).toFixed(2));
            saveAndNudge(field);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            field.x = parseFloat(Math.min(100 - field.w, field.x + step).toFixed(2));
            saveAndNudge(field);
        } else if (e.key === "Delete") {
            e.preventDefault();
            deleteSelectedField();
        } else if (e.key === "Escape") {
            selectField(null);
        }
    }
}

function saveAndNudge(field) {
    const el = document.querySelector(`.sheet-field[data-id="${field.id}"]`);
    if (el) {
        el.style.left = `${field.x}%`;
        el.style.top = `${field.y}%`;
    }
    
    elements.propX.value = field.x.toFixed(1);
    elements.propY.value = field.y.toFixed(1);
    saveSession();
}

// Export Character Sheet to .poise (JSON)
function exportPoiseFile() {
    if (!state.bgImage) {
        alert("Carregue uma planilha antes de salvar.");
        return;
    }
    
    const data = {
        bgImage: state.bgImage,
        fields: state.fields,
        items: state.items
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Find character name to define filename
    const nameField = state.fields.find(f => f.id === "nome_desc");
    let charName = "ficha_poise";
    if (nameField && nameField.value) {
        // Grab first line of Name description, clean special chars
        const firstLine = nameField.value.split("\n")[0].trim();
        if (firstLine) {
            charName = firstLine.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        }
    }
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${charName}.poise`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================
// GRID INVENTORY SYSTEM (CARGA)
// ==========================================

function spawnInventoryItem(name, cols, rows, imageName) {
    if (!state.bgImage) {
        alert("Carregue uma planilha antes de adicionar itens.");
        return;
    }
    
    const id = "item_" + Date.now();
    
    // Default size when floating (not snapped)
    const w = cols * cellW;
    const h = rows * cellH;
    
    // Spawn in the middle of viewport scroll
    const scrollLeft = elements.sheetScroller.scrollLeft;
    const scrollTop = elements.sheetScroller.scrollTop;
    const containerRect = elements.sheetContainer.getBoundingClientRect();
    const viewportRect = elements.canvasViewport.getBoundingClientRect();
    
    const centerX_px = (viewportRect.width / 2) + scrollLeft - (containerRect.width * (w / 100) / 2);
    const centerY_px = (viewportRect.height / 2) + scrollTop - (containerRect.height * (h / 100) / 2);
    
    let x = (centerX_px / containerRect.width) * 100;
    let y = (centerY_px / containerRect.height) * 100;
    
    x = Math.max(2, Math.min(98 - w, x));
    y = Math.max(2, Math.min(98 - h, y));
    
    const newItem = {
        id,
        name,
        desc: "",
        cols,
        rows,
        imageName,
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
        w: parseFloat(w.toFixed(2)),
        h: parseFloat(h.toFixed(2)),
        snapped: false,
        zoneId: null,
        col: 0,
        row: 0
    };
    
    state.items.push(newItem);
    renderInventoryItems();
    selectItem(id);
    saveSession();
}

function renderInventoryItems() {
    // Remove existing inventory cards
    document.querySelectorAll(".inventory-card").forEach(el => el.remove());
    
    state.items.forEach(item => {
        const cardEl = document.createElement("div");
        cardEl.className = "inventory-card";
        cardEl.setAttribute("data-id", item.id);
        
        if (state.selectedItemId === item.id) {
            cardEl.classList.add("selected");
        }
        
        const imageName = item.imageName || `IC${item.cols}x${item.rows}`;
        cardEl.style.backgroundImage = `url('PoiseBlankIC/${imageName}.png')`;
        cardEl.style.left = `${item.x}%`;
        cardEl.style.top = `${item.y}%`;
        cardEl.style.width = `${item.w}%`;
        cardEl.style.height = `${item.h}%`;
        
        // Plain label instead of textarea to avoid click blocking
        const label = document.createElement("div");
        label.className = "card-label";
        label.textContent = item.name || "";
        label.style.fontSize = `${13 * (state.currentZoom / 100)}px`;
        
        // Description label, aligned to the left
        const descLabel = document.createElement("div");
        descLabel.className = "card-desc";
        descLabel.textContent = item.desc || "";
        descLabel.style.fontSize = `${10 * (state.currentZoom / 100)}px`;
        
        // Delete button
        const delBtn = document.createElement("button");
        delBtn.className = "delete-card-btn";
        delBtn.innerHTML = "&times;";
        delBtn.title = "Remover Item";
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteInventoryItem(item.id);
            if (state.selectedItemId === item.id) {
                selectItem(null);
            }
        });
        
        cardEl.appendChild(label);
        cardEl.appendChild(descLabel);
        cardEl.appendChild(delBtn);
        
        // Drag listener
        cardEl.addEventListener("mousedown", (e) => handleItemMouseDown(e, item.id));
        
        elements.fieldsOverlay.appendChild(cardEl);
    });
}

function deleteInventoryItem(id) {
    state.items = state.items.filter(item => item.id !== id);
    renderInventoryItems();
    saveSession();
}

function selectItem(itemId) {
    state.selectedItemId = itemId;
    
    document.querySelectorAll(".inventory-card").forEach(el => {
        el.classList.toggle("selected", el.getAttribute("data-id") === itemId);
    });
    
    if (itemId) {
        const item = state.items.find(it => it.id === itemId);
        if (item) {
            elements.itemInspector.classList.remove("hidden");
            elements.inspectItemName.value = item.name || "";
            elements.inspectItemDesc.value = item.desc || "";
            elements.inspectItemDetails.textContent = `Tamanho: ${item.cols}x${item.rows} | Status: ${item.snapped ? 'Acoplado (' + item.zoneId + ')' : 'Flutuante'}`;
            elements.inspectItemName.focus();
        }
    } else {
        elements.itemInspector.classList.add("hidden");
    }
}

// Drag & Snapping for Item Cards
function handleItemMouseDown(e, itemId) {
    // Do not drag if clicking delete button
    if (e.target.classList.contains("delete-card-btn")) {
        return;
    }
    
    e.preventDefault();
    selectItem(itemId);
    
    const item = state.items.find(it => it.id === itemId);
    if (!item) return;
    
    itemDragContext.isDragging = true;
    itemDragContext.itemId = itemId;
    itemDragContext.startX = e.clientX;
    itemDragContext.startY = e.clientY;
    itemDragContext.startItemX = item.x;
    itemDragContext.startItemY = item.y;
    
    const cardEl = document.querySelector(`.inventory-card[data-id="${itemId}"]`);
    if (cardEl) cardEl.classList.add("dragging");
    
    document.addEventListener("mousemove", handleItemMouseMove);
    document.addEventListener("mouseup", handleItemMouseUp);
}

// Track temporary snapping during drag
let currentSnap = null;

function handleItemMouseMove(e) {
    if (!itemDragContext.isDragging) return;
    
    const item = state.items.find(it => it.id === itemDragContext.itemId);
    if (!item) return;
    
    const containerW = elements.sheetContainer.offsetWidth;
    const containerH = elements.sheetContainer.offsetHeight;
    
    // Pixel differences
    const dx_px = e.clientX - itemDragContext.startX;
    const dy_px = e.clientY - itemDragContext.startY;
    
    // Percentage differences
    const dx_pct = (dx_px / containerW) * 100;
    const dy_pct = (dy_px / containerH) * 100;
    
    // Update raw position
    item.x = parseFloat((itemDragContext.startItemX + dx_pct).toFixed(2));
    item.y = parseFloat((itemDragContext.startItemY + dy_pct).toFixed(2));
    
    const cardEl = document.querySelector(`.inventory-card[data-id="${item.id}"]`);
    if (cardEl) {
        cardEl.style.left = `${item.x}%`;
        cardEl.style.top = `${item.y}%`;
    }
    
    // Check snapping bounds (using center of card)
    const centerX = item.x + (item.w / 2);
    const centerY = item.y + (item.h / 2);
    
    let foundZone = null;
    
    for (const zone of gridZones) {
        if (centerX >= zone.x && centerX <= (zone.x + zone.w) &&
            centerY >= zone.y && centerY <= (zone.y + zone.h)) {
            foundZone = zone;
            break;
        }
    }
    
    if (foundZone) {
        // Calculate cell sizes
        const cellW = foundZone.w / foundZone.cols;
        const cellH = foundZone.h / foundZone.rows;
        
        // Find row & col indices relative to zone
        const relX = centerX - foundZone.x;
        const relY = centerY - foundZone.y;
        
        let col = Math.floor(relX / cellW) - Math.floor(item.cols / 2);
        let row = Math.floor(relY / cellH) - Math.floor(item.rows / 2);
        
        // Clamp bounds inside zone
        col = Math.max(0, Math.min(foundZone.cols - item.cols, col));
        row = Math.max(0, Math.min(foundZone.rows - item.rows, row));
        
        // Calculate final snap percentages
        const snapX = foundZone.x + col * cellW;
        const snapY = foundZone.y + row * cellH;
        const snapW = item.cols * cellW;
        const snapH = snapW * SHEET_RATIO * (item.rows / item.cols); // Keep aspect ratio!
        
        currentSnap = {
            zoneId: foundZone.id,
            col,
            row,
            x: parseFloat(snapX.toFixed(2)),
            y: parseFloat(snapY.toFixed(2)),
            w: parseFloat(snapW.toFixed(2)),
            h: parseFloat(snapH.toFixed(2))
        };
        
        // Render snap preview
        elements.snapPreview.style.left = `${currentSnap.x}%`;
        elements.snapPreview.style.top = `${currentSnap.y}%`;
        elements.snapPreview.style.width = `${currentSnap.w}%`;
        elements.snapPreview.style.height = `${currentSnap.h}%`;
        elements.snapPreview.classList.remove("hidden");
    } else {
        currentSnap = null;
        elements.snapPreview.classList.add("hidden");
    }
}

function handleItemMouseUp() {
    if (!itemDragContext.isDragging) return;
    
    const item = state.items.find(it => it.id === itemDragContext.itemId);
    const cardEl = document.querySelector(`.inventory-card[data-id="${itemDragContext.itemId}"]`);
    
    if (cardEl) cardEl.classList.remove("dragging");
    
    if (item) {
        if (currentSnap) {
            item.snapped = true;
            item.zoneId = currentSnap.zoneId;
            item.col = currentSnap.col;
            item.row = currentSnap.row;
            item.x = currentSnap.x;
            item.y = currentSnap.y;
            item.w = currentSnap.w;
            item.h = currentSnap.h;
        } else {
            item.snapped = false;
            item.zoneId = null;
            // Revert size keeping aspect ratio
            item.w = parseFloat((item.cols * cellW).toFixed(2));
            item.h = parseFloat((item.rows * cellH).toFixed(2));
        }
        
        saveSession();
    }
    
    currentSnap = null;
    elements.snapPreview.classList.add("hidden");
    itemDragContext.isDragging = false;
    itemDragContext.itemId = null;
    
    document.removeEventListener("mousemove", handleItemMouseMove);
    document.removeEventListener("mouseup", handleItemMouseUp);
    
    renderInventoryItems();
}
