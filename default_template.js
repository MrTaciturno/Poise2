// Default Template definitions for PoiseRPGv0.1.4_CS.png
// Positions are in percentages relative to the sheet container width and height.

const defaultTemplate = [
  // Header Info
  { id: "nome_desc", name: "Nome e Descrição", type: "textarea", x: 5.8, y: 10.6, w: 29.5, h: 8.8, fontSize: 16, align: "left", value: "" },
  { id: "pontos_vida", name: "Pontos de Vida (Máx: 10+Fís*Tier)", type: "text", x: 5.8, y: 4.5, w: 9.5, h: 4.0, fontSize: 20, align: "center", value: "" },
  { id: "mov_carga", name: "MOV / CARGA (TAM-CARGA)", type: "text", x: 18.8, y: 4.5, w: 6.2, h: 4.0, fontSize: 18, align: "center", value: "" },
  { id: "ini", name: "INI (TierD+MOT)", type: "text", x: 74.3, y: 4.5, w: 6.2, h: 4.0, fontSize: 18, align: "center", value: "" },
  { id: "pontos_mana", name: "Pontos de Mana (Máx: 10+Men*Nível)", type: "text", x: 81.3, y: 4.5, w: 13.0, h: 4.0, fontSize: 20, align: "center", value: "" },
  
  // Action Points
  { id: "pa_bubble_1", name: "Pontos de Ação 1", type: "checkbox", x: 27.2, y: 4.8, w: 3.2, h: 2.3, value: false },
  { id: "pa_bubble_2", name: "Pontos de Ação 2", type: "checkbox", x: 34.6, y: 4.8, w: 3.2, h: 2.3, value: false },
  { id: "pa_bubble_3", name: "Pontos de Ação 3", type: "checkbox", x: 42.4, y: 4.8, w: 3.2, h: 2.3, value: false },
  { id: "pa_bubble_4", name: "Pontos de Ação 4", type: "checkbox", x: 50.4, y: 4.8, w: 3.2, h: 2.3, value: false },
  { id: "pa_bubble_5", name: "Pontos de Ação 5", type: "checkbox", x: 58.2, y: 4.8, w: 3.2, h: 2.3, value: false },
  { id: "pa_bubble_6", name: "Pontos de Ação 6", type: "checkbox", x: 66.0, y: 4.8, w: 3.2, h: 2.3, value: false },
  
  // Nível & Tier
  { id: "nivel", name: "Nível", type: "text", x: 36.8, y: 10.6, w: 6.8, h: 3.8, fontSize: 18, align: "center", value: "" },
  { id: "tier", name: "Tier", type: "text", x: 56.5, y: 10.6, w: 6.8, h: 3.8, fontSize: 18, align: "center", value: "" },
  
  // Attributes (Físico & Mente)
  { id: "fisico", name: "Atributo Físico", type: "text", x: 36.8, y: 27.6, w: 12.5, h: 4.0, fontSize: 22, align: "center", value: "" },
  { id: "mente", name: "Atributo Mente", type: "text", x: 50.8, y: 27.6, w: 12.5, h: 4.0, fontSize: 22, align: "center", value: "" },
  
  // Attribute modifiers / stats
  { id: "res_f_alc_f", name: "Res. Fís / Alc. Fís", type: "text", x: 36.8, y: 32.5, w: 9.0, h: 3.0, fontSize: 14, align: "center", value: "" },
  { id: "sorte_d", name: "SorteD", type: "text", x: 47.0, y: 32.5, w: 6.0, h: 3.0, fontSize: 14, align: "center", value: "" },
  { id: "res_m_alc_m", name: "Res. Mente / Alc. Mente", type: "text", x: 54.3, y: 32.5, w: 9.0, h: 3.0, fontSize: 14, align: "center", value: "" },

  // Diagram Defesa & Ataque
  { id: "def_a", name: "Defesa A", type: "text", x: 47.3, y: 35.8, w: 5.4, h: 2.2, fontSize: 14, align: "center", value: "" },
  { id: "atq_d", name: "Ataque D", type: "text", x: 47.3, y: 41.2, w: 5.4, h: 2.2, fontSize: 14, align: "center", value: "" },
  { id: "bloq", name: "Bloqueio", type: "text", x: 57.2, y: 41.2, w: 5.4, h: 2.2, fontSize: 14, align: "center", value: "" },
  { id: "arm", name: "Armadura", type: "text", x: 55.8, y: 45.4, w: 5.0, h: 2.2, fontSize: 14, align: "center", value: "" },
  { id: "pv_diagram", name: "PV Diagrama", type: "text", x: 52.8, y: 47.5, w: 5.0, h: 2.2, fontSize: 14, align: "center", value: "" },

  // Modificadores de Personagem
  { id: "modificadores", name: "Modificadores de Personagem", type: "textarea", x: 5.8, y: 20.7, w: 29.5, h: 12.8, fontSize: 13, align: "left", value: "" },

  // Ataques (Mods) Table
  { id: "atq_row1_desc", name: "Ataque 1: Descrição", type: "text", x: 5.8, y: 37.4, w: 15.4, h: 2.8, fontSize: 13, align: "left", value: "" },
  { id: "atq_row1_mods", name: "Ataque 1: ATQ x PA", type: "text", x: 21.2, y: 37.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },
  { id: "atq_row1_alc", name: "Ataque 1: Alc. E", type: "text", x: 28.2, y: 37.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },
  
  { id: "atq_row2_desc", name: "Ataque 2: Descrição", type: "text", x: 5.8, y: 40.4, w: 15.4, h: 2.8, fontSize: 13, align: "left", value: "" },
  { id: "atq_row2_mods", name: "Ataque 2: ATQ x PA", type: "text", x: 21.2, y: 40.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },
  { id: "atq_row2_alc", name: "Ataque 2: Alc. E", type: "text", x: 28.2, y: 40.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },

  { id: "atq_row3_desc", name: "Ataque 3: Descrição", type: "text", x: 5.8, y: 43.4, w: 15.4, h: 2.8, fontSize: 13, align: "left", value: "" },
  { id: "atq_row3_mods", name: "Ataque 3: ATQ x PA", type: "text", x: 21.2, y: 43.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },
  { id: "atq_row3_alc", name: "Ataque 3: Alc. E", type: "text", x: 28.2, y: 43.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },

  { id: "atq_row4_desc", name: "Ataque 4: Descrição", type: "text", x: 5.8, y: 46.4, w: 15.4, h: 2.8, fontSize: 13, align: "left", value: "" },
  { id: "atq_row4_mods", name: "Ataque 4: ATQ x PA", type: "text", x: 21.2, y: 46.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },
  { id: "atq_row4_alc", name: "Ataque 4: Alc. E", type: "text", x: 28.2, y: 46.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },

  { id: "atq_row5_desc", name: "Ataque 5: Descrição", type: "text", x: 5.8, y: 49.4, w: 15.4, h: 2.8, fontSize: 13, align: "left", value: "" },
  { id: "atq_row5_mods", name: "Ataque 5: ATQ x PA", type: "text", x: 21.2, y: 49.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },
  { id: "atq_row5_alc", name: "Ataque 5: Alc. E", type: "text", x: 28.2, y: 49.4, w: 7.0, h: 2.8, fontSize: 13, align: "center", value: "" },

  // Perícias (Skills) Table
  // Main Skills: Atletismo, Furtividade, Intelecto, Perspicácia, Social
  { id: "sk_atletismo_test", name: "Atletismo: TesteD", type: "text", x: 79.2, y: 12.2, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_atletismo_exp", name: "Atletismo: EXP", type: "bubble-group", x: 84.8, y: 12.2, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_furtividade_test", name: "Furtividade: TesteD", type: "text", x: 79.2, y: 14.0, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_furtividade_exp", name: "Furtividade: EXP", type: "bubble-group", x: 84.8, y: 14.0, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_intelecto_test", name: "Intelecto: TesteD", type: "text", x: 79.2, y: 15.8, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_intelecto_exp", name: "Intelecto: EXP", type: "bubble-group", x: 84.8, y: 15.8, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_perspicacia_test", name: "Perspicácia: TesteD", type: "text", x: 79.2, y: 17.6, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_perspicacia_exp", name: "Perspicácia: EXP", type: "bubble-group", x: 84.8, y: 17.6, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_social_test", name: "Social: TesteD", type: "text", x: 79.2, y: 19.4, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_social_exp", name: "Social: EXP", type: "bubble-group", x: 84.8, y: 19.4, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  // Blank Skills Rows (6 to 22)
  { id: "sk_r6_name", name: "Perícia 6: Nome", type: "text", x: 64.8, y: 21.2, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r6_test", name: "Perícia 6: TesteD", type: "text", x: 79.2, y: 21.2, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r6_exp", name: "Perícia 6: EXP", type: "bubble-group", x: 84.8, y: 21.2, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r7_name", name: "Perícia 7: Nome", type: "text", x: 64.8, y: 23.0, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r7_test", name: "Perícia 7: TesteD", type: "text", x: 79.2, y: 23.0, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r7_exp", name: "Perícia 7: EXP", type: "bubble-group", x: 84.8, y: 23.0, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r8_name", name: "Perícia 8: Nome", type: "text", x: 64.8, y: 24.8, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r8_test", name: "Perícia 8: TesteD", type: "text", x: 79.2, y: 24.8, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r8_exp", name: "Perícia 8: EXP", type: "bubble-group", x: 84.8, y: 24.8, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r9_name", name: "Perícia 9: Nome", type: "text", x: 64.8, y: 26.6, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r9_test", name: "Perícia 9: TesteD", type: "text", x: 79.2, y: 26.6, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r9_exp", name: "Perícia 9: EXP", type: "bubble-group", x: 84.8, y: 26.6, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r10_name", name: "Perícia 10: Nome", type: "text", x: 64.8, y: 28.4, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r10_test", name: "Perícia 10: TesteD", type: "text", x: 79.2, y: 28.4, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r10_exp", name: "Perícia 10: EXP", type: "bubble-group", x: 84.8, y: 28.4, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r11_name", name: "Perícia 11: Nome", type: "text", x: 64.8, y: 30.2, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r11_test", name: "Perícia 11: TesteD", type: "text", x: 79.2, y: 30.2, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r11_exp", name: "Perícia 11: EXP", type: "bubble-group", x: 84.8, y: 30.2, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r12_name", name: "Perícia 12: Nome", type: "text", x: 64.8, y: 32.0, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r12_test", name: "Perícia 12: TesteD", type: "text", x: 79.2, y: 32.0, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r12_exp", name: "Perícia 12: EXP", type: "bubble-group", x: 84.8, y: 32.0, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r13_name", name: "Perícia 13: Nome", type: "text", x: 64.8, y: 33.8, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r13_test", name: "Perícia 13: TesteD", type: "text", x: 79.2, y: 33.8, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r13_exp", name: "Perícia 13: EXP", type: "bubble-group", x: 84.8, y: 33.8, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r14_name", name: "Perícia 14: Nome", type: "text", x: 64.8, y: 35.6, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r14_test", name: "Perícia 14: TesteD", type: "text", x: 79.2, y: 35.6, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r14_exp", name: "Perícia 14: EXP", type: "bubble-group", x: 84.8, y: 35.6, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  { id: "sk_r15_name", name: "Perícia 15: Nome", type: "text", x: 64.8, y: 37.4, w: 14.4, h: 1.8, fontSize: 12, align: "left", value: "" },
  { id: "sk_r15_test", name: "Perícia 15: TesteD", type: "text", x: 79.2, y: 37.4, w: 5.0, h: 1.8, fontSize: 12, align: "center", value: "" },
  { id: "sk_r15_exp", name: "Perícia 15: EXP", type: "bubble-group", x: 84.8, y: 37.4, w: 9.4, h: 1.8, bubblesCount: 6, value: [false, false, false, false, false, false] },

  // Total EXP Box at bottom of skills
  { id: "total_exp_box", name: "Total EXP", type: "text", x: 64.8, y: 50.8, w: 29.4, h: 1.8, fontSize: 14, align: "center", value: "" },

  // Equipamentos (5 Columns)
  { id: "eq_destra", name: "Equipamento: Destra", type: "textarea", x: 5.8, y: 54.8, w: 17.8, h: 16.4, fontSize: 13, align: "left", value: "" },
  { id: "eq_carga1", name: "Equipamento: Carga 1", type: "textarea", x: 23.6, y: 54.8, w: 11.6, h: 16.4, fontSize: 13, align: "left", value: "" },
  { id: "eq_traje", name: "Equipamento: Traje", type: "textarea", x: 35.2, y: 54.8, w: 23.6, h: 16.4, fontSize: 13, align: "left", value: "" },
  { id: "eq_carga2", name: "Equipamento: Carga 2", type: "textarea", x: 58.8, y: 54.8, w: 17.6, h: 16.4, fontSize: 13, align: "left", value: "" },
  { id: "eq_sinistra", name: "Equipamento: Sinistra", type: "textarea", x: 76.4, y: 54.8, w: 17.8, h: 16.4, fontSize: 13, align: "left", value: "" },

  // Inventário (3 Columns)
  { id: "inv_carga1", name: "Inventário: Carga 1", type: "textarea", x: 5.8, y: 72.8, w: 29.4, h: 15.6, fontSize: 13, align: "left", value: "" },
  { id: "inv_carga2", name: "Inventário: Carga 2", type: "textarea", x: 35.2, y: 72.8, w: 29.6, h: 15.6, fontSize: 13, align: "left", value: "" },
  { id: "inv_carga3", name: "Inventário: Carga 3", type: "textarea", x: 64.8, y: 72.8, w: 29.4, h: 15.6, fontSize: 13, align: "left", value: "" }
];
