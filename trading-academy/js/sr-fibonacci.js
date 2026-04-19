/* ======================================
   SUPPORT/RESISTANCE + FIBONACCI
   Sumber: BAB 7, 23 "Technical Analysis for Mega Profit"
   ====================================== */

/* ──── SVG FIBONACCI RENDERER ──── */
const FibRenderer = {
  /* Draw Fibonacci retracement levels on a price chart */
  drawFibRetracement(swingHigh, swingLow, currentPrice) {
    const w = 360, h = 220, pad = {top: 14, bottom: 14, left: 44, right: 50};
    const iw = w - pad.left - pad.right;
    const ih = h - pad.top - pad.bottom;
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];
    const colors = {
      0: '#8899b4', 0.236: '#a78bfa', 0.382: '#5b9cf6',
      0.5: '#f0b429', 0.618: '#26a69a', 0.786: '#5b9cf6', 1: '#8899b4'
    };
    const range = swingHigh - swingLow;
    const priceRange = {min: swingLow - range * 0.05, max: swingHigh + range * 0.05};
    const toY = p => pad.top + ih - ((p - priceRange.min) / (priceRange.max - priceRange.min)) * ih;

    const elems = [];
    // Background
    elems.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="#0c1220"/>`);

    // Draw price path (mockup downtrend from SH to SL then bounce)
    const pricePts = [
      {x: pad.left, y: toY(swingHigh)},
      {x: pad.left + iw * 0.4, y: toY(swingLow)},
      {x: pad.left + iw * 0.7, y: toY(swingLow + range * (currentPrice/100))},
    ];
    const pricePath = pricePts.map((p,i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
    elems.push(`<path d="${pricePath}" fill="none" stroke="#f0b429" stroke-width="2" stroke-linejoin="round"/>`);

    // Fib levels
    levels.forEach(lvl => {
      const price = swingHigh - range * lvl;
      const sy = toY(price);
      const col = colors[lvl] || '#8899b4';
      const isMajor = [0.382, 0.5, 0.618].includes(lvl);
      elems.push(`<line x1="${pad.left}" y1="${sy}" x2="${w - pad.right}" y2="${sy}" stroke="${col}" stroke-width="${isMajor ? 1.5 : 1}" stroke-dasharray="${isMajor ? 'none' : '4,3'}" opacity="${isMajor ? 1 : 0.6}"/>`);
      // Level label left
      elems.push(`<text x="${pad.left - 3}" y="${sy + 4}" text-anchor="end" font-size="9" fill="${col}" font-family="monospace">${(lvl * 100).toFixed(1)}%</text>`);
      // Price label right
      elems.push(`<text x="${w - pad.right + 4}" y="${sy + 4}" font-size="9" fill="${col}" font-family="monospace">${price.toFixed(0)}</text>`);
    });

    // Swing labels
    elems.push(`<text x="${pad.left + 4}" y="${toY(swingHigh) - 6}" font-size="9" fill="#f0b429" font-family="monospace">Swing High</text>`);
    elems.push(`<text x="${pad.left + iw * 0.4 - 40}" y="${toY(swingLow) + 14}" font-size="9" fill="#ef5350" font-family="monospace">Swing Low</text>`);

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${elems.join('')}</svg>`;
  },

  /* Draw support/resistance zones diagram */
  drawSRZones() {
    const w = 360, h = 200, pad = {top: 12, bottom: 12, left: 8, right: 60};
    const iw = w - pad.left - pad.right;
    const ih = h - pad.top - pad.bottom;

    // Price data: shows price bouncing off support and resistance
    const priceData = [
      52,56,60,64,68,72,76,78,75,70,65,60,56,54,56,60,64,68,72,75,72,68,63,58,55,53,55,59,63,68
    ];
    const n = priceData.length;
    const minP = 48, maxP = 84;
    const toX = i => pad.left + (i/(n-1))*iw;
    const toY = p => pad.top + ih - ((p-minP)/(maxP-minP))*ih;

    const zones = [
      {y: 77, label: 'Resistance 2', color: '#ef5350'},
      {y: 72, label: 'Resistance 1', color: '#f0b429'},
      {y: 60, label: 'Support 1', color: '#26a69a'},
      {y: 54, label: 'Support 2', color: '#5b9cf6'},
    ];

    const elems = [];
    elems.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="#0c1220"/>`);

    // Zone bands
    zones.forEach(z => {
      const sy = toY(z.y);
      elems.push(`<rect x="${pad.left}" y="${sy-4}" width="${iw}" height="8" fill="${z.color}" opacity="0.1"/>`);
      elems.push(`<line x1="${pad.left}" y1="${sy}" x2="${iw+pad.left}" y2="${sy}" stroke="${z.color}" stroke-width="1.5" stroke-dasharray="5,3"/>`);
      elems.push(`<text x="${iw+pad.left+4}" y="${sy+4}" font-size="9" fill="${z.color}" font-family="monospace">${z.label}</text>`);
    });

    // Price path
    const pPath = priceData.map((p,i)=>`${i===0?'M':'L'} ${toX(i).toFixed(1)} ${toY(p).toFixed(1)}`).join(' ');
    elems.push(`<path d="${pPath}" fill="none" stroke="#f0b429" stroke-width="2" stroke-linejoin="round"/>`);

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${elems.join('')}</svg>`;
  },
};

/* ──── SR & FIBONACCI KNOWLEDGE BASE ──── */
const SR_FIB_CONTENT = {

  support_resistance: {
    id: 'support_resistance',
    title: 'Support & Resistance',
    icon: '🧱',
    sections: [
      {
        heading: 'Apa itu Support & Resistance?',
        body: `<b>Support</b> adalah level harga di mana ada cukup banyak buyer sehingga harga berhenti turun dan bounce ke atas.
Buyer melihat level tersebut sebagai "murah" dan secara kolektif masuk beli.

<b>Resistance</b> adalah level harga di mana banyak seller masuk sehingga harga berhenti naik dan berbalik turun.
Seller melihat level tersebut sebagai "mahal" dan menjual.`,
        type: 'text',
      },
      {type: 'sr_visual'},
      {
        heading: 'Cara Identifikasi S/R',
        type: 'rules',
        rules: [
          {icon: '🔍', text: '<b>Previous Highs & Lows:</b> Level harga yang pernah menjadi top atau bottom sebelumnya — market punya "memory". Semakin sering ditest, semakin kuat.'},
          {icon: '🔢', text: '<b>Round Numbers:</b> Level psikologis seperti 2000, 2100, 2200 untuk XAUUSD — banyak order menumpuk di sini.'},
          {icon: '📊', text: '<b>Volume Clusters:</b> Di mana ada volume transaksi besar — banyak posisi terbuka di level itu.'},
          {icon: '📏', text: '<b>Trendline S/R:</b> Garis trend yang sudah ditest berkali-kali menjadi support/resistance dinamis.'},
          {icon: '🔄', text: '<b>Role Reversal:</b> Support yang ditembus ke bawah menjadi resistance (dan sebaliknya). Ini sangat penting dan sering terjadi!'},
        ],
      },
      {
        type: 'highlight',
        variant: 'info',
        icon: '💡',
        body: `<b>Rule of thumb S/R:</b> Semakin sering harga tes level dan bounce, semakin kuat level tersebut. Tapi jika tes terlalu sering — akhirnya akan tembus.`,
      },
      {
        heading: 'Trading dengan S/R',
        type: 'rules',
        rules: [
          {icon: '🟢', text: '<b>Buy at Support:</b> Tunggu harga mencapai support → muncul bullish candlestick pattern → BUY. Stop loss di bawah support.'},
          {icon: '🔴', text: '<b>Sell at Resistance:</b> Tunggu harga mencapai resistance → muncul bearish candlestick pattern → SELL. Stop loss di atas resistance.'},
          {icon: '💥', text: '<b>Breakout:</b> Ketika support/resistance ditembus dengan volume kuat → entry ke arah breakout.'},
          {icon: '🔄', text: '<b>Retest:</b> Setelah breakout, harga sering kembali test level yang ditembus (sekarang sebagai support/resistance baru) → entry terbaik.'},
        ],
      },
      {
        type: 'highlight',
        variant: 'warning',
        icon: '⚠️',
        body: `<b>False Breakout:</b> Breakout yang langsung balik arah. Hindari dengan: tunggu CLOSE candle di luar level, bukan hanya spike. Dan cek volume — breakout valid butuh volume besar.`,
      },
    ],
  },

  fibonacci: {
    id: 'fibonacci',
    title: 'Fibonacci Retracement & Extension',
    icon: '🌀',
    sections: [
      {
        heading: 'Apa itu Fibonacci?',
        body: `Leonardo Fibonacci menemukan bahwa angka-angka dalam deret Fibonacci (0,1,1,2,3,5,8,13,21...) memiliki rasio yang konsisten.
Ketika dibagi: 1/1.618 = 0.618, dan seterusnya. Trader menggunakan rasio ini untuk memprediksi di mana harga akan <i>pull back</i> sebelum melanjutkan trend.`,
        type: 'text',
      },
      {type: 'fib_visual'},
      {
        heading: 'Level Fibonacci Utama',
        type: 'rules',
        rules: [
          {icon: '🟣', text: '<b>23.6%</b> — Retracement kecil. Trend sangat kuat jika harga hanya pullback sampai sini.'},
          {icon: '🔵', text: '<b>38.2%</b> — Retracement normal. Entry opportunity di trend yang kuat.'},
          {icon: '🟡', text: '<b>50.0%</b> — Psikologis kuat (bukan angka Fibonacci asli tapi sering respek). Retracement 50% dari swing.'},
          {icon: '🟢', text: '<b>61.8% — Golden Ratio</b> ⭐⭐⭐⭐⭐ — Level terpenting! "Golden Pocket". Pullback sering berakhir di sini.'},
          {icon: '🔵', text: '<b>78.6%</b> — Retracement dalam. Trend masih valid jika bounce di sini.'},
          {icon: '🔴', text: '<b>100%</b> — Full retracement ke swing low. Jika tembus → trend reversal.'},
        ],
      },
      {
        type: 'highlight',
        variant: 'tip',
        icon: '🎯',
        body: `<b>Golden Pocket (61.8%):</b> Ini adalah level Fibonacci paling ditunggu-tunggu oleh trader profesional dan institusional. Ketika harga pull back ke 61.8% dan muncul bullish candle (di uptrend) = setup premium.`,
      },
      {
        heading: 'Cara Menggunakan Fibonacci',
        type: 'rules',
        rules: [
          {icon: '1️⃣', text: 'Identifikasi swing high dan swing low yang jelas'},
          {icon: '2️⃣', text: 'Di uptrend: tarik Fib dari swing LOW ke swing HIGH'},
          {icon: '3️⃣', text: 'Di downtrend: tarik Fib dari swing HIGH ke swing LOW'},
          {icon: '4️⃣', text: 'Tunggu harga pull back ke level Fib (terutama 38.2%, 50%, 61.8%)'},
          {icon: '5️⃣', text: 'Cari konfirmasi: candlestick pattern + RSI oversold + S/R confluence'},
          {icon: '6️⃣', text: 'Entry, stop loss di bawah level Fib berikutnya'},
        ],
      },
      {
        heading: 'Fibonacci Extension (Take Profit)',
        body: `Fibonacci Extension digunakan untuk menentukan target profit setelah breakout:
<b>127.2%, 161.8%</b> — Target umum. Di uptrend setelah breakout high, harga sering menuju 127.2% atau 161.8% dari swing.
<b>261.8%</b> — Target besar untuk strong trend.

Cara pakai: Dari swing low → swing high → koreksi. Extension menunjukkan target next leg.`,
        type: 'text',
      },
      {
        type: 'highlight',
        variant: 'info',
        icon: '💡',
        body: `<b>Confluence = Probabilitas Tinggi:</b> Ketika level Fibonacci bertemu dengan support/resistance horizontal + round number + MA = "ZONA AJAIB" — level ini sangat kuat dan sering menjadi turning point.`,
      },
    ],
  },

  angka_psikologi: {
    id: 'angka_psikologi',
    title: 'Angka Psikologi (Round Numbers)',
    icon: '🔢',
    sections: [
      {
        heading: 'Apa itu Angka Psikologi?',
        body: `Angka-angka "bulat" seperti 2000, 2050, 2100 untuk XAUUSD, atau 100, 150, 200 untuk saham, memiliki daya tarik psikologis kuat.
Trader dan investor sering menempatkan order beli/jual di angka-angka ini — sehingga level tersebut menjadi support/resistance yang kuat.`,
        type: 'text',
      },
      {
        type: 'rules',
        heading: 'Kenapa Angka Psikologi Penting?',
        rules: [
          {icon: '🧠', text: 'Otak manusia secara natural lebih fokus pada angka bulat — efek psikologis kolektif menciptakan S/R yang kuat'},
          {icon: '💼', text: 'Fund manager sering menempatkan target/stop di angka bulat dalam laporan dan presentasi'},
          {icon: '🤖', text: 'Algoritma trading banyak menggunakan round numbers sebagai trigger level'},
          {icon: '📊', text: 'Opsi (options) sering diterbitkan di strike price round number — ini menciptakan "gravity" pada level tersebut'},
        ],
      },
      {
        heading: 'Contoh Angka Psikologi',
        type: 'rules',
        rules: [
          {icon: '🥇', text: '<b>XAUUSD (Gold):</b> 1900, 2000, 2050, 2100, 2200, 2300 — setiap 50 dan 100 level kuat'},
          {icon: '🛢️', text: '<b>Oil (WTI):</b> 70, 80, 90, 100 per barel'},
          {icon: '📱', text: '<b>AAPL:</b> 100, 150, 175, 200 — setiap $25-50 increment'},
          {icon: '💱', text: '<b>EURUSD:</b> 1.0000, 1.0500, 1.1000 — setiap 500 pips'},
        ],
      },
      {
        type: 'highlight',
        variant: 'tip',
        icon: '🎯',
        body: `<b>Pro Tip:</b> Gunakan round number sebagai TARGET (take profit slightly below resistance round number, like 1998 instead of 2000) — karena banyak seller di round number exact. Dan pasang BUY LIMIT slightly above support round number (2002 instead of 2000) untuk menghindari fake bounce.`,
      },
    ],
  },
};

/* ──── S/R & Fibonacci Module ──── */
const SR_FIB_MODULE = {
  id: 'm12_sr_fibonacci',
  order: 12,
  title: 'Support, Resistance & Fibonacci',
  subtitle: 'Level kunci, zona S/R, Fibonacci retracement & extension',
  icon: '🌀',
  color: '#f0b429',
  tags: [{type: 'neutral', label: 'Foundation'}, {type: 'neutral', label: 'Level'}],
  xp: 120,
  lessons: [
    {id: 'support_resistance', title: 'Support & Resistance 101', duration: '12 menit', xp: 30, type: 'sr_lesson', contentId: 'support_resistance'},
    {id: 'fibonacci', title: 'Fibonacci Retracement & Extension', duration: '15 menit', xp: 40, type: 'sr_lesson', contentId: 'fibonacci'},
    {id: 'angka_psikologi', title: 'Angka Psikologi (Round Numbers)', duration: '8 menit', xp: 20, type: 'sr_lesson', contentId: 'angka_psikologi'},
    {id: 'q_sr_fib', title: 'Quiz: S/R & Fibonacci', duration: '8 menit', xp: 30, type: 'quiz', quizId: 'sr_fibonacci'},
  ],
};
