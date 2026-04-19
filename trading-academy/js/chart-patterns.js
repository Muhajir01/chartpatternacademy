/* ======================================
   CHART PATTERNS (KLASIK)
   Head & Shoulders, Double Top/Bottom,
   Triangles, Flags, Wedges
   Sumber: BAB 21 "Technical Analysis for Mega Profit"
   ====================================== */

/* ──── SVG CHART PATTERN RENDERER ──── */
const ChartPatternRenderer = {
  /* Draw a price-line chart from array of {x,y} points (0-100 scale)
   * options: {width, height, padding, lineColor, fillColor, markers, hlines, labels} */
  drawLine(points, options = {}) {
    const {
      width = 360, height = 200,
      padding = {top: 24, bottom: 24, left: 20, right: 20},
      lineColor = '#5b9cf6',
      fillOpacity = 0.08,
      markers = [],    // [{x,y,label,color}]
      hlines = [],     // [{y,label,color,dash}]
      vlines = [],     // [{x,label,color,dash}]
      labelSize = 10,
    } = options;

    const iw = width - padding.left - padding.right;
    const ih = height - padding.top - padding.bottom;

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys) - 5, maxY = Math.max(...ys) + 5;

    const toSvgX = x => padding.left + ((x - minX) / (maxX - minX)) * iw;
    const toSvgY = y => padding.top + ih - ((y - minY) / (maxY - minY)) * ih;

    const pathD = points.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${toSvgX(p.x).toFixed(1)} ${toSvgY(p.y).toFixed(1)}`
    ).join(' ');

    // Fill area under line
    const firstX = toSvgX(points[0].x), lastX = toSvgX(points[points.length - 1].x);
    const fillD = `${pathD} L ${lastX} ${padding.top + ih} L ${firstX} ${padding.top + ih} Z`;

    const elements = [];

    // Grid lines (faint)
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (ih / 4) * i;
      elements.push(`<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`);
    }

    // Horizontal reference lines (neckline, support, etc.)
    hlines.forEach(hl => {
      const sy = toSvgY(hl.y);
      const dash = hl.dash ? `stroke-dasharray="${hl.dash}"` : '';
      elements.push(`<line x1="${padding.left}" y1="${sy}" x2="${width - padding.right}" y2="${sy}" stroke="${hl.color || '#8899b4'}" stroke-width="1.5" ${dash}/>`);
      if (hl.label) {
        elements.push(`<text x="${width - padding.right + 3}" y="${sy + 4}" font-size="${labelSize - 1}" fill="${hl.color || '#8899b4'}" font-family="monospace">${hl.label}</text>`);
      }
    });

    // Vertical reference lines
    vlines.forEach(vl => {
      const sx = toSvgX(vl.x);
      const dash = vl.dash ? `stroke-dasharray="${vl.dash}"` : '';
      elements.push(`<line x1="${sx}" y1="${padding.top}" x2="${sx}" y2="${padding.top + ih}" stroke="${vl.color || '#8899b4'}" stroke-width="1" ${dash}/>`);
    });

    // Fill + line
    elements.push(`<path d="${fillD}" fill="${lineColor}" opacity="${fillOpacity}"/>`);
    elements.push(`<path d="${pathD}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);

    // Markers (key points with labels)
    markers.forEach(m => {
      const sx = toSvgX(m.x), sy = toSvgY(m.y);
      const mc = m.color || '#f0b429';
      elements.push(`<circle cx="${sx}" cy="${sy}" r="4" fill="${mc}" stroke="#0c1220" stroke-width="1.5"/>`);
      if (m.label) {
        const tx = sx;
        const ty = m.y > (minY + maxY) / 2 ? sy - 10 : sy + 16;
        elements.push(`<text x="${tx}" y="${ty}" text-anchor="middle" font-size="${labelSize}" fill="${mc}" font-family="monospace" font-weight="bold">${m.label}</text>`);
      }
    });

    return `<svg width="100%" height="auto" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="max-width:${width}px;display:block">${elements.join('')}</svg>`;
  },

  forChartPattern(id) {
    const def = CHART_PATTERN_VISUALS[id];
    if (!def) return '<div style="color:#526070;text-align:center;padding:20px">Visual N/A</div>';
    return this.drawLine(def.points, def.options);
  },
};

/* ──── CHART PATTERN VISUAL DATA ──── */
const CHART_PATTERN_VISUALS = {
  head_and_shoulders: {
    points: [
      {x:0,y:40},{x:5,y:50},{x:10,y:60},{x:15,y:52},{x:20,y:44},  // left base
      {x:25,y:55},{x:30,y:65},{x:35,y:55},{x:40,y:45},              // left shoulder
      {x:45,y:57},{x:50,y:75},{x:55,y:57},{x:60,y:45},              // head
      {x:65,y:56},{x:70,y:64},{x:75,y:54},{x:80,y:44},              // right shoulder
      {x:85,y:40},{x:90,y:35},{x:95,y:28},{x:100,y:22},             // breakdown
    ],
    options: {
      lineColor: '#5b9cf6',
      markers: [
        {x:30, y:65, label:'LS', color:'#8899b4'},
        {x:50, y:75, label:'HEAD', color:'#f0b429'},
        {x:70, y:64, label:'RS', color:'#8899b4'},
      ],
      hlines: [{y:44, label:'Neckline', color:'#ef5350', dash:'5,3'}],
    },
  },

  inverse_head_and_shoulders: {
    points: [
      {x:0,y:60},{x:5,y:50},{x:10,y:40},{x:15,y:48},{x:20,y:56},
      {x:25,y:45},{x:30,y:35},{x:35,y:45},{x:40,y:55},
      {x:45,y:43},{x:50,y:25},{x:55,y:43},{x:60,y:55},
      {x:65,y:44},{x:70,y:36},{x:75,y:46},{x:80,y:56},
      {x:85,y:60},{x:90,y:65},{x:95,y:72},{x:100,y:78},
    ],
    options: {
      lineColor: '#26a69a',
      markers: [
        {x:30, y:35, label:'LS', color:'#8899b4'},
        {x:50, y:25, label:'HEAD', color:'#f0b429'},
        {x:70, y:36, label:'RS', color:'#8899b4'},
      ],
      hlines: [{y:56, label:'Neckline', color:'#26a69a', dash:'5,3'}],
    },
  },

  double_top: {
    points: [
      {x:0,y:30},{x:10,y:45},{x:20,y:60},{x:30,y:72},{x:40,y:58},
      {x:50,y:48},{x:60,y:58},{x:70,y:72},{x:80,y:57},
      {x:88,y:46},{x:93,y:38},{x:97,y:30},{x:100,y:22},
    ],
    options: {
      lineColor: '#ef5350',
      markers: [
        {x:30, y:72, label:'Top 1', color:'#ef5350'},
        {x:70, y:72, label:'Top 2', color:'#ef5350'},
      ],
      hlines: [{y:48, label:'Support', color:'#8899b4', dash:'5,3'}],
    },
  },

  double_bottom: {
    points: [
      {x:0,y:70},{x:10,y:55},{x:20,y:40},{x:30,y:28},{x:40,y:42},
      {x:50,y:52},{x:60,y:42},{x:70,y:28},{x:80,y:43},
      {x:88,y:54},{x:93,y:62},{x:97,y:70},{x:100,y:78},
    ],
    options: {
      lineColor: '#26a69a',
      markers: [
        {x:30, y:28, label:'Bot 1', color:'#26a69a'},
        {x:70, y:28, label:'Bot 2', color:'#26a69a'},
      ],
      hlines: [{y:52, label:'Resistance', color:'#8899b4', dash:'5,3'}],
    },
  },

  triple_top: {
    points: [
      {x:0,y:30},{x:8,y:50},{x:15,y:68},{x:22,y:52},{x:30,y:43},
      {x:37,y:55},{x:44,y:68},{x:51,y:52},{x:58,y:43},
      {x:65,y:55},{x:72,y:68},{x:79,y:52},{x:86,y:41},
      {x:90,y:34},{x:95,y:26},{x:100,y:18},
    ],
    options: {
      lineColor: '#ef5350',
      markers: [
        {x:15, y:68, label:'T1', color:'#ef5350'},
        {x:44, y:68, label:'T2', color:'#ef5350'},
        {x:72, y:68, label:'T3', color:'#ef5350'},
      ],
      hlines: [{y:43, label:'Neckline', color:'#8899b4', dash:'5,3'}],
    },
  },

  triple_bottom: {
    points: [
      {x:0,y:70},{x:8,y:50},{x:15,y:32},{x:22,y:48},{x:30,y:57},
      {x:37,y:45},{x:44,y:32},{x:51,y:48},{x:58,y:57},
      {x:65,y:45},{x:72,y:32},{x:79,y:48},{x:86,y:59},
      {x:90,y:66},{x:95,y:74},{x:100,y:82},
    ],
    options: {
      lineColor: '#26a69a',
      markers: [
        {x:15, y:32, label:'B1', color:'#26a69a'},
        {x:44, y:32, label:'B2', color:'#26a69a'},
        {x:72, y:32, label:'B3', color:'#26a69a'},
      ],
      hlines: [{y:57, label:'Resistance', color:'#8899b4', dash:'5,3'}],
    },
  },

  symmetrical_triangle: {
    points: [
      {x:0,y:75},{x:10,y:60},{x:20,y:68},{x:30,y:55},{x:40,y:62},
      {x:50,y:52},{x:60,y:58},{x:70,y:52},{x:80,y:55},
      {x:88,y:53},{x:93,y:60},{x:97,y:68},{x:100,y:76},
    ],
    options: {
      lineColor: '#f0b429',
      hlines: [],
      markers: [{x:88, y:53, label:'Breakout', color:'#26a69a'}],
    },
  },

  ascending_triangle: {
    points: [
      {x:0,y:40},{x:10,y:55},{x:18,y:65},{x:25,y:52},{x:33,y:58},
      {x:40,y:65},{x:47,y:55},{x:54,y:61},{x:61,y:65},
      {x:68,y:58},{x:74,y:63},{x:80,y:65},{x:88,y:65},
      {x:93,y:72},{x:97,y:78},{x:100,y:85},
    ],
    options: {
      lineColor: '#26a69a',
      hlines: [{y:65, label:'Resistance', color:'#8899b4', dash:'4,3'}],
      markers: [{x:88, y:65, label:'Breakout!', color:'#26a69a'}],
    },
  },

  descending_triangle: {
    points: [
      {x:0,y:60},{x:10,y:45},{x:18,y:35},{x:25,y:48},{x:33,y:42},
      {x:40,y:35},{x:47,y:45},{x:54,y:39},{x:61,y:35},
      {x:68,y:42},{x:74,y:37},{x:80,y:35},{x:88,y:35},
      {x:93,y:28},{x:97,y:22},{x:100,y:16},
    ],
    options: {
      lineColor: '#ef5350',
      hlines: [{y:35, label:'Support', color:'#8899b4', dash:'4,3'}],
      markers: [{x:88, y:35, label:'Breakdown', color:'#ef5350'}],
    },
  },

  bull_flag: {
    points: [
      {x:0,y:20},{x:8,y:35},{x:16,y:52},{x:24,y:65},{x:32,y:75}, // flagpole up
      {x:40,y:70},{x:48,y:64},{x:56,y:68},{x:64,y:62},             // flag consolidation
      {x:72,y:66},{x:78,y:60},{x:85,y:64},
      {x:90,y:72},{x:95,y:82},{x:100,y:90},                         // breakout
    ],
    options: {
      lineColor: '#26a69a',
      markers: [
        {x:32, y:75, label:'Flagpole', color:'#5b9cf6'},
        {x:60, y:64, label:'Flag', color:'#f0b429'},
        {x:90, y:72, label:'Breakout!', color:'#26a69a'},
      ],
    },
  },

  bear_flag: {
    points: [
      {x:0,y:80},{x:8,y:65},{x:16,y:48},{x:24,y:35},{x:32,y:25}, // flagpole down
      {x:40,y:30},{x:48,y:36},{x:56,y:32},{x:64,y:38},             // flag consolidation
      {x:72,y:34},{x:78,y:40},{x:85,y:36},
      {x:90,y:28},{x:95,y:18},{x:100,y:10},                         // breakdown
    ],
    options: {
      lineColor: '#ef5350',
      markers: [
        {x:32, y:25, label:'Flagpole', color:'#5b9cf6'},
        {x:60, y:34, label:'Flag', color:'#f0b429'},
        {x:90, y:28, label:'Breakdown', color:'#ef5350'},
      ],
    },
  },

  rising_wedge: {
    points: [
      {x:0,y:30},{x:10,y:40},{x:20,y:50},{x:30,y:55},{x:40,y:63},
      {x:50,y:58},{x:60,y:65},{x:70,y:61},{x:80,y:66},
      {x:87,y:63},{x:92,y:55},{x:96,y:46},{x:100,y:35},
    ],
    options: {
      lineColor: '#ef5350',
      markers: [{x:87, y:63, label:'Breakdown', color:'#ef5350'}],
    },
  },

  falling_wedge: {
    points: [
      {x:0,y:70},{x:10,y:60},{x:20,y:50},{x:30,y:45},{x:40,y:37},
      {x:50,y:42},{x:60,y:35},{x:70,y:39},{x:80,y:34},
      {x:87,y:37},{x:92,y:45},{x:96,y:54},{x:100,y:65},
    ],
    options: {
      lineColor: '#26a69a',
      markers: [{x:87, y:37, label:'Breakout!', color:'#26a69a'}],
    },
  },
};

/* ──── CHART PATTERN KNOWLEDGE BASE ──── */
const CHART_PATTERNS = {

  // ═══════════════════════════════════════
  //   REVERSAL PATTERNS
  // ═══════════════════════════════════════

  head_and_shoulders: {
    id: 'head_and_shoulders',
    name: 'Head and Shoulders',
    nameId: 'Kepala dan Bahu',
    category: 'reversal-bearish',
    signal: 'bearish-reversal',
    reliability: 5,
    context: 'Pola reversal bearish PALING KLASIK — terbentuk setelah uptrend panjang',

    description: `Head and Shoulders (H&S) adalah pola 3 puncak: Left Shoulder (LS) — Head (puncak tertinggi) — Right Shoulder (RS) yang lebih rendah dari Head.
    Ketiganya dihubungkan oleh garis "Neckline". Ketika harga breakdown di bawah Neckline = konfirmasi bearish reversal.`,

    psychology: `Uptrend masih kuat di LS. Head menunjukkan usaha terakhir buyer namun momentum melemah. RS terbentuk lebih rendah dari Head (lower high) = buyer sudah tidak cukup kuat.
    Breakdown neckline = kepanikan buyer keluar, seller take over penuh.`,

    rules: [
      {icon: '📍', text: 'Left Shoulder: rally → pullback ke neckline'},
      {icon: '👑', text: 'Head: rally lebih tinggi dari LS → pullback ke neckline'},
      {icon: '📍', text: 'Right Shoulder: rally LEBIH RENDAH dari head → pullback'},
      {icon: '📏', text: 'Neckline: garis yang menghubungkan lembah LS dan RS'},
      {icon: '💥', text: 'Entry: breakdown close di bawah Neckline'},
      {icon: '🔄', text: 'Sering ada retest neckline sebelum lanjut turun (peluang entry)'},
    ],

    measurement: 'Target = Neckline − Jarak (Head ke Neckline). Contoh: Head di 2100, Neckline di 2050 → target 2050 − 50 = 2000.',

    entry: {
      signal: 'SELL',
      trigger: 'Close di bawah neckline. Entry terbaik: saat retest neckline dari bawah.',
      stopLoss: 'Di atas high Right Shoulder + buffer',
      takeProfit: 'Neckline − (Head − Neckline) = measured move target',
      timing: 'Daily / Weekly paling reliable',
    },

    confirmation: [
      'Volume meningkat saat breakdown neckline',
      'RSI bearish divergence di Right Shoulder',
      'Retest neckline gagal dari bawah',
      'MA cross down',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'W',
      description: 'H&S XAUUSD di Weekly/Daily chart sering mark top makro yang panjang. Cari di ATH / resistance major.',
    },

    mistakes: [
      'Entry sebelum breakdown neckline — pola belum valid',
      'Abaikan volume — breakdown tanpa volume = sering false breakout',
      'Target measurement tidak dipakai',
    ],
  },

  inverse_head_and_shoulders: {
    id: 'inverse_head_and_shoulders',
    name: 'Inverse Head and Shoulders',
    nameId: 'H&S Terbalik',
    category: 'reversal-bullish',
    signal: 'bullish-reversal',
    reliability: 5,
    context: 'Mirror dari H&S — 3 lembah (LS, Head lebih rendah, RS) di bawah downtrend. Sinyal bullish reversal.',

    description: `Inverse H&S = pola 3 lembah setelah downtrend. Left Shoulder, Head (terendah), Right Shoulder yang lebih tinggi dari Head.
    Breakout di atas Neckline = konfirmasi bullish reversal kuat.`,

    psychology: `Di downtrend, seller mencoba buat lower low baru (Head). Tapi RS tidak berhasil turun sejauh Head (higher low) = seller melemah.
    Breakout neckline = buyer overtake total, seller cover posisi.`,

    rules: [
      {icon: '📍', text: 'Left Shoulder: turun → pullback ke neckline'},
      {icon: '👑', text: 'Head: turun lebih dalam dari LS → pullback ke neckline'},
      {icon: '📍', text: 'Right Shoulder: turun LEBIH TINGGI dari head → pullback'},
      {icon: '📏', text: 'Neckline: garis menghubungkan puncak LS dan RS'},
      {icon: '💥', text: 'Entry: close di atas neckline'},
    ],

    measurement: 'Target = Neckline + (Neckline − Head). Measured move up.',

    entry: {
      signal: 'BUY',
      trigger: 'Close di atas neckline. Entry terbaik: retest neckline dari atas.',
      stopLoss: 'Di bawah low Right Shoulder',
      takeProfit: 'Neckline + (Neckline − Head)',
      timing: 'Daily / Weekly',
    },

    confirmation: [
      'Volume meningkat saat breakout neckline',
      'RSI bullish divergence di RS',
      'Retest neckline sebagai support',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Inverse H&S di XAUUSD setelah koreksi besar = setup swing-buy yang powerful.',
    },

    mistakes: [
      'Entry sebelum breakout neckline',
      'Ignore volume konfirmasi',
    ],
  },

  double_top: {
    id: 'double_top',
    name: 'Double Top',
    nameId: 'Puncak Ganda',
    category: 'reversal-bearish',
    signal: 'bearish-reversal',
    reliability: 5,
    context: '2 puncak pada level harga yang sama setelah uptrend — sinyal bearish reversal kuat',

    description: `Double Top: Harga rally ke level resistance → pullback → rally lagi ke LEVEL YANG SAMA → gagal break → breakdown.
    Pola ini mirip huruf "M". Dikonfirmasi saat harga break di bawah lembah antara 2 puncak (neckline support).`,

    psychology: `Puncak pertama: buyer mencoba tembus resistance — gagal. Puncak kedua: buyer coba lagi dengan FOMO — gagal lagi.
    Dua kali rejection di level sama = resistance sangat kuat. Buyer menyerah → seller ambil alih.`,

    rules: [
      {icon: '🏔️', text: 'Dua puncak pada level yang sama (toleransi ±1-2%)'},
      {icon: '📏', text: 'Ada pullback signifikan di antara 2 puncak (min 5-10%)'},
      {icon: '💥', text: 'Konfirmasi: close di bawah support lembah (neckline)'},
      {icon: '📈', text: 'Terbentuk setelah uptrend yang panjang'},
    ],

    measurement: 'Target = Neckline − (Puncak − Neckline)',

    entry: {
      signal: 'SELL',
      trigger: 'Close di bawah neckline support',
      stopLoss: 'Di atas puncak kedua + buffer',
      takeProfit: 'Measured move: Neckline − tinggi pola',
      timing: 'Daily / Weekly',
    },

    confirmation: [
      'Volume lebih rendah di puncak kedua (menunjukkan melemahnya momentum)',
      'RSI bearish divergence antara puncak 1 & 2',
      'Retest neckline gagal (jadi resistance)',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Double Top XAUUSD di ATH area — salah satu setup paling sering terjadi.',
    },

    mistakes: [
      'Sell sebelum konfirmasi breakdown — pola belum valid',
      'Puncak 2 tidak setara puncak 1 (tolerance > 2%)',
    ],
  },

  double_bottom: {
    id: 'double_bottom',
    name: 'Double Bottom',
    nameId: 'Lembah Ganda',
    category: 'reversal-bullish',
    signal: 'bullish-reversal',
    reliability: 5,
    context: '2 lembah pada level yang sama setelah downtrend — sinyal bullish reversal kuat (pola "W")',

    description: `Double Bottom: Harga turun ke support → bounce → turun lagi ke LEVEL YANG SAMA → gagal turun lebih dalam → breakout ke atas.
    Pola berbentuk "W". Dikonfirmasi saat harga break di atas resistance (neckline) antara 2 lembah.`,

    psychology: `Lembah pertama: buyer masuk di support. Lembah kedua: harga tes level sama — buyer kembali masuk kuat (double defense).
    Support teruji 2x dan bertahan = support sangat kuat. Buyer confident, seller cover short.`,

    rules: [
      {icon: '⛏️', text: 'Dua lembah pada level yang sama (toleransi ±1-2%)'},
      {icon: '📏', text: 'Ada bounce signifikan di antara 2 lembah'},
      {icon: '💥', text: 'Konfirmasi: close di atas resistance neckline'},
      {icon: '📉', text: 'Terbentuk setelah downtrend'},
    ],

    measurement: 'Target = Neckline + (Neckline − Bottom)',

    entry: {
      signal: 'BUY',
      trigger: 'Close di atas neckline resistance. Entry terbaik: retest neckline sebagai support.',
      stopLoss: 'Di bawah lembah kedua',
      takeProfit: 'Measured move: Neckline + tinggi pola',
      timing: 'Daily / Weekly',
    },

    confirmation: [
      'Volume meningkat saat breakout neckline',
      'RSI bullish divergence antara lembah 1 & 2',
      'Retest neckline sebagai support',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Double Bottom XAUUSD di support major (MA200, Fib 61.8%) = setup swing buy klasik.',
    },

    mistakes: [
      'Buy sebelum breakout neckline',
      'Lembah 2 jauh lebih rendah dari lembah 1 = bukan Double Bottom valid',
    ],
  },

  triple_top: {
    id: 'triple_top',
    name: 'Triple Top',
    nameId: 'Puncak Tiga',
    category: 'reversal-bearish',
    signal: 'bearish-reversal',
    reliability: 4,
    context: '3 kali rejection di resistance yang sama — sinyal bearish sangat kuat',

    description: `Triple Top: 3 kali harga mencoba tembus resistance dan GAGAL. Lebih kuat dari Double Top karena 3x konfirmasi penolakan.
    Breakdown neckline = sinyal bearish reversal kuat.`,

    psychology: `3 kali buyer coba — 3 kali gagal. Setelah tiga kali rejection, buyer kehilangan kepercayaan sepenuhnya.
    Seller semakin agresif di setiap puncak baru.`,

    rules: [
      {icon: '🏔️', text: '3 puncak pada level yang sama'},
      {icon: '📉', text: 'Volume biasanya menurun di setiap puncak berturut-turut'},
      {icon: '💥', text: 'Konfirmasi: breakdown neckline'},
    ],

    measurement: 'Target = Neckline − tinggi pola',

    entry: {
      signal: 'SELL',
      trigger: 'Breakdown neckline',
      stopLoss: 'Di atas puncak ketiga',
      takeProfit: 'Measured move',
      timing: 'Daily',
    },

    confirmation: ['Volume menurun di setiap puncak', 'RSI bearish divergence', 'Momentum melemah (MACD)'],

    examples: { symbol: 'NASDAQ:AAPL', tf: 'D', description: 'Triple Top AAPL di resistance all-time high.' },

    mistakes: ['Entry sebelum breakdown', 'Ignore volume pattern'],
  },

  triple_bottom: {
    id: 'triple_bottom',
    name: 'Triple Bottom',
    nameId: 'Lembah Tiga',
    category: 'reversal-bullish',
    signal: 'bullish-reversal',
    reliability: 4,
    context: '3 kali bounce dari support yang sama — sinyal bullish reversal kuat',

    description: `Triple Bottom: 3 kali harga tes support dan BOUNCE. Lebih kuat dari Double Bottom.
    Breakout neckline = konfirmasi bullish reversal.`,

    psychology: `3x seller coba push ke bawah support — 3x gagal. Seller exhausted. Buyer ambil alih.`,

    rules: [
      {icon: '⛏️', text: '3 lembah pada level yang sama'},
      {icon: '📈', text: 'Volume meningkat di setiap bounce'},
      {icon: '💥', text: 'Konfirmasi: breakout neckline'},
    ],

    measurement: 'Target = Neckline + tinggi pola',

    entry: {
      signal: 'BUY',
      trigger: 'Breakout neckline',
      stopLoss: 'Di bawah lembah ketiga',
      takeProfit: 'Measured move',
      timing: 'Daily',
    },

    confirmation: ['Volume meningkat di setiap bounce', 'Bullish divergence RSI', 'MACD cross up'],

    examples: { symbol: 'OANDA:XAUUSD', tf: 'D', description: 'Triple Bottom di support major.' },

    mistakes: ['Buy sebelum breakout', 'Lembah tidak sejajar'],
  },

  // ═══════════════════════════════════════
  //   CONTINUATION PATTERNS
  // ═══════════════════════════════════════

  symmetrical_triangle: {
    id: 'symmetrical_triangle',
    name: 'Symmetrical Triangle',
    nameId: 'Segitiga Simetris',
    category: 'continuation-neutral',
    signal: 'neutral',
    reliability: 4,
    context: 'Konsolidasi dengan higher lows + lower highs — bisa breakout ke kedua arah (arah trend lebih sering)',

    description: `Segitiga Simetris terbentuk dari garis trend yang konvergen: upper trendline (lower highs) + lower trendline (higher lows).
    Harga bergerak makin sempit hingga akhirnya breakout. Arah breakout biasanya mengikuti trend sebelumnya.`,

    psychology: `Market dalam ketidakpastian — volatility menurun. Buyer dan seller seimbang sementara.
    Saat salah satu break, momentum sering kuat karena energy terkompresi.`,

    rules: [
      {icon: '📐', text: 'Upper trendline: lower highs (turun)'},
      {icon: '📐', text: 'Lower trendline: higher lows (naik)'},
      {icon: '📏', text: 'Breakout idealnya terjadi di 2/3 dari panjang segitiga'},
      {icon: '📊', text: 'Volume menyusut selama pembentukan, spike saat breakout'},
    ],

    measurement: 'Target = tinggi dasar segitiga ditambahkan ke titik breakout',

    entry: {
      signal: 'BUY atau SELL sesuai arah breakout',
      trigger: 'Close di luar garis triangle (atas atau bawah)',
      stopLoss: 'Di sisi lain garis triangle',
      takeProfit: 'Measured move dari lebar dasar triangle',
      timing: 'Daily / H4',
    },

    confirmation: ['Volume spike saat breakout', 'Retest garis triangle', 'Momentum indicator confirm'],

    examples: { symbol: 'OANDA:XAUUSD', tf: 'D', description: 'XAUUSD sering konsolidasi dalam symmetrical triangle sebelum next major move.' },

    mistakes: ['Entry dalam triangle (before breakout)', 'Ignore volume — false break tanpa volume sering terjadi'],
  },

  ascending_triangle: {
    id: 'ascending_triangle',
    name: 'Ascending Triangle',
    nameId: 'Segitiga Naik',
    category: 'continuation-bullish',
    signal: 'bullish-continuation',
    reliability: 4,
    context: 'Flat resistance + higher lows — buyer agresif, biasanya breakout ke atas',

    description: `Ascending Triangle: Resistance horizontal (flat) + lower trendline yang naik (higher lows).
    Buyer semakin agresif (higher lows) tapi belum bisa break resistance. Ketika akhirnya break = explosive move.`,

    psychology: `Buyer progressif membangun pressure — setiap pullback tidak turun sejauh sebelumnya. Resistance akhirnya tidak kuat menahan.
    Breakout sering explosive karena short sellers di resistance terpaksa cover.`,

    rules: [
      {icon: '📏', text: 'Resistance horizontal (flat atas)'},
      {icon: '📐', text: 'Higher lows (lower trendline naik)'},
      {icon: '💥', text: 'Breakout di atas resistance = sinyal BUY'},
    ],

    measurement: 'Target = tinggi triangle ditambahkan ke resistance breakout',

    entry: {
      signal: 'BUY saat breakout',
      trigger: 'Close di atas resistance flat',
      stopLoss: 'Di bawah last higher low',
      takeProfit: 'Resistance + tinggi pola',
      timing: 'Daily / H4',
    },

    confirmation: ['Volume spike', 'Retest resistance sebagai support', 'RSI bullish'],

    examples: { symbol: 'NASDAQ:AAPL', tf: 'D', description: 'AAPL ascending triangle sebelum earnings rally.' },

    mistakes: ['Entry dalam triangle sebelum breakout', 'Abaikan volume saat breakout'],
  },

  descending_triangle: {
    id: 'descending_triangle',
    name: 'Descending Triangle',
    nameId: 'Segitiga Turun',
    category: 'continuation-bearish',
    signal: 'bearish-continuation',
    reliability: 4,
    context: 'Support horizontal + lower highs — seller agresif, biasanya breakdown ke bawah',

    description: `Descending Triangle: Support horizontal (flat) + upper trendline turun (lower highs).
    Seller semakin agresif. Breakdown support = sinyal SELL.`,

    psychology: `Seller terus menekan harga lebih rendah (lower highs). Support akhirnya tidak bertahan.`,

    rules: [
      {icon: '📏', text: 'Support horizontal (flat bawah)'},
      {icon: '📐', text: 'Lower highs (upper trendline turun)'},
      {icon: '💥', text: 'Breakdown support = sinyal SELL'},
    ],

    measurement: 'Target = Support − tinggi pola',

    entry: {
      signal: 'SELL saat breakdown',
      trigger: 'Close di bawah support flat',
      stopLoss: 'Di atas last lower high',
      takeProfit: 'Support − tinggi pola',
      timing: 'Daily / H4',
    },

    confirmation: ['Volume spike saat breakdown', 'Retest support sebagai resistance'],

    examples: { symbol: 'NYSE:SPY', tf: 'D', description: 'Descending triangle di market selloff.' },

    mistakes: ['Entry sebelum breakdown', 'Ignore volume'],
  },

  bull_flag: {
    id: 'bull_flag',
    name: 'Bull Flag',
    nameId: 'Bendera Bullish',
    category: 'continuation-bullish',
    signal: 'bullish-continuation',
    reliability: 4,
    context: 'Setelah rally tajam (flagpole), konsolidasi menurun miring (flag) sebelum lanjut naik',

    description: `Bull Flag = rally tajam (flagpole) diikuti konsolidasi yang turun secara paralel/miring (bendera).
    Breakout dari flag ke atas = lanjutan uptrend. Ini pola CONTINUATION, bukan reversal.`,

    psychology: `Rally kuat menciptakan flagpole. Konsolidasi = profit taking dan buyer baru masuk.
    Setelah sideways/turun mild, breakout terjadi karena demand masih kuat.`,

    rules: [
      {icon: '🚩', text: 'Flagpole: rally tajam minimal 15-20% atau sharp move'},
      {icon: '📐', text: 'Flag: konsolidasi dengan channel turun miring (turun paralel)'},
      {icon: '📊', text: 'Volume menurun selama flag formation'},
      {icon: '💥', text: 'Breakout ke atas dengan volume spike'},
    ],

    measurement: 'Target = dasar flagpole + tinggi flagpole (diukur dari breakout)',

    entry: {
      signal: 'BUY saat breakout',
      trigger: 'Close di atas upper channel flag',
      stopLoss: 'Di bawah lower channel flag',
      takeProfit: 'Flagpole height dari breakout point',
      timing: 'Daily / H4',
    },

    confirmation: ['Volume menurun di flag, spike di breakout', 'RSI masih di bullish zone'],

    examples: { symbol: 'NASDAQ:NVDA', tf: 'D', description: 'NVDA setelah earnings pop sering form Bull Flag sebelum lanjut naik.' },

    mistakes: ['Entry di tengah flag (terlalu awal)', 'Flagpole terlalu pendek — bukan Bull Flag valid'],
  },

  bear_flag: {
    id: 'bear_flag',
    name: 'Bear Flag',
    nameId: 'Bendera Bearish',
    category: 'continuation-bearish',
    signal: 'bearish-continuation',
    reliability: 4,
    context: 'Setelah drop tajam, bounce konsolidasi miring ke atas (flag) sebelum lanjut turun',

    description: `Bear Flag = drop tajam (flagpole) diikuti konsolidasi yang naik miring (bendera bearish).
    Breakdown flag = lanjutan downtrend.`,

    psychology: `Drop kuat → short covering dan FOMO buy = flag. Setelah konsolidasi, seller lanjut menekan.`,

    rules: [
      {icon: '🚩', text: 'Flagpole: drop tajam'},
      {icon: '📐', text: 'Flag: bounce konsolidasi miring ke atas'},
      {icon: '💥', text: 'Breakdown ke bawah flag = SELL signal'},
    ],

    measurement: 'Target = dasar flagpole − tinggi flagpole',

    entry: {
      signal: 'SELL saat breakdown',
      trigger: 'Close di bawah lower flag channel',
      stopLoss: 'Di atas upper flag channel',
      takeProfit: 'Flagpole height ke bawah dari breakdown',
      timing: 'Daily / H4',
    },

    confirmation: ['Volume menurun di flag, spike di breakdown'],

    examples: { symbol: 'NASDAQ:TSLA', tf: 'D', description: 'TSLA Bear Flag setelah bad earnings / macro selloff.' },

    mistakes: ['Entry terlalu cepat sebelum breakdown', 'Flag terlalu besar / panjang = lemah'],
  },

  rising_wedge: {
    id: 'rising_wedge',
    name: 'Rising Wedge',
    nameId: 'Baji Naik',
    category: 'reversal-bearish',
    signal: 'bearish-reversal',
    reliability: 4,
    context: 'Price bergerak naik dalam channel yang menyempit — bearish reversal atau continuation bearish',

    description: `Rising Wedge: 2 garis trend konvergen yang keduanya mengarah naik (upper line naik lebih lambat dari lower line).
    Harga bergerak naik dalam wedge tapi dengan momentum menurun. Breakdown = bearish.`,

    psychology: `Harga naik tapi makin "terjepit". Setiap new high dicapai dengan susah payah.
    Momentum buyer habis sementara formasi nampak bullish — ini "jebakan" bagi buyer.`,

    rules: [
      {icon: '📐', text: '2 garis trend konvergen keduanya slope ke atas'},
      {icon: '📉', text: 'Lower trendline lebih curam dari upper trendline'},
      {icon: '💥', text: 'Breakdown ke bawah = sinyal SELL'},
      {icon: '📊', text: 'Volume menurun saat naik dalam wedge'},
    ],

    measurement: 'Target = tinggi wedge',

    entry: {
      signal: 'SELL saat breakdown lower trendline',
      stopLoss: 'Di atas recent high dalam wedge',
      takeProfit: 'Tinggi wedge ke bawah dari breakdown',
      timing: 'Daily',
    },

    confirmation: ['Volume spike saat breakdown', 'RSI bearish divergence', 'MACD bearish cross'],

    examples: { symbol: 'OANDA:XAUUSD', tf: 'D', description: 'XAUUSD Rising Wedge setelah bull run = reversal setup.' },

    mistakes: ['Shorting dalam wedge sebelum breakdown', 'Confuse dengan ascending triangle'],
  },

  falling_wedge: {
    id: 'falling_wedge',
    name: 'Falling Wedge',
    nameId: 'Baji Turun',
    category: 'reversal-bullish',
    signal: 'bullish-reversal',
    reliability: 4,
    context: 'Price bergerak turun dalam channel menyempit — bullish reversal atau continuation bullish',

    description: `Falling Wedge: 2 garis trend konvergen keduanya mengarah turun. Harga turun tapi makin menyempit.
    Breakout ke atas = sinyal bullish.`,

    psychology: `Harga turun tapi seller makin lemah (lower highs & lower lows yang makin kecil).
    Breakout = buyer mengambil alih secara tiba-tiba.`,

    rules: [
      {icon: '📐', text: '2 garis trend konvergen keduanya slope ke bawah'},
      {icon: '📈', text: 'Upper trendline lebih curam dari lower trendline'},
      {icon: '💥', text: 'Breakout ke atas upper trendline = sinyal BUY'},
    ],

    measurement: 'Target = tinggi wedge ditambah dari breakout',

    entry: {
      signal: 'BUY saat breakout upper trendline',
      stopLoss: 'Di bawah recent low dalam wedge',
      takeProfit: 'Tinggi wedge',
      timing: 'Daily',
    },

    confirmation: ['Volume spike saat breakout', 'RSI bullish divergence', 'MACD bullish cross'],

    examples: { symbol: 'OANDA:XAUUSD', tf: 'D', description: 'XAUUSD Falling Wedge di koreksi = setup buy.' },

    mistakes: ['Entry dalam wedge sebelum breakout', 'Confuse dengan descending triangle'],
  },
};

/* Curriculum modules untuk chart patterns */
const CHART_PATTERN_MODULE = {
  id: 'm10_chart_patterns',
  order: 10,
  title: 'Chart Patterns Klasik',
  subtitle: 'H&S, Double Top/Bottom, Triangles, Flags, Wedges',
  icon: '🏔️',
  color: '#a78bfa',
  tags: [{type: 'bearish', label: 'Reversal'}, {type: 'bullish', label: 'Continuation'}, {type: 'neutral', label: 'Advanced'}],
  xp: 180,
  lessons: [
    {id: 'head_and_shoulders', title: 'Head & Shoulders ⭐', duration: '12 menit', xp: 25, type: 'chart_pattern', patternId: 'head_and_shoulders'},
    {id: 'inverse_head_and_shoulders', title: 'Inverse Head & Shoulders ⭐', duration: '10 menit', xp: 25, type: 'chart_pattern', patternId: 'inverse_head_and_shoulders'},
    {id: 'double_top', title: 'Double Top ⭐', duration: '10 menit', xp: 20, type: 'chart_pattern', patternId: 'double_top'},
    {id: 'double_bottom', title: 'Double Bottom ⭐', duration: '10 menit', xp: 20, type: 'chart_pattern', patternId: 'double_bottom'},
    {id: 'triple_top', title: 'Triple Top & Bottom', duration: '8 menit', xp: 15, type: 'chart_pattern', patternId: 'triple_top'},
    {id: 'triangle_patterns', title: 'Segitiga (Symmetrical, Ascending, Descending)', duration: '14 menit', xp: 25, type: 'chart_pattern', patternId: 'symmetrical_triangle'},
    {id: 'flag_patterns', title: 'Bull Flag & Bear Flag', duration: '10 menit', xp: 20, type: 'chart_pattern', patternId: 'bull_flag'},
    {id: 'wedge_patterns', title: 'Rising & Falling Wedge', duration: '10 menit', xp: 20, type: 'chart_pattern', patternId: 'rising_wedge'},
    {id: 'q_chart_patterns', title: 'Quiz: Chart Patterns', duration: '10 menit', xp: 30, type: 'quiz', quizId: 'chart_patterns'},
  ],
};
