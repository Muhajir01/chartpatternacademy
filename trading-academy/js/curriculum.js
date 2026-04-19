/* ======================================
   CURRICULUM STRUCTURE
   Modul pembelajaran terurut: basic → advanced
   ====================================== */

const CURRICULUM = [

  {
    id: 'm1_basics',
    order: 1,
    title: 'Fondasi Candlestick',
    subtitle: 'Anatomi, psikologi, dan cara membaca candle',
    icon: '🏗️',
    color: '#5b9cf6',
    tags: [{type: 'neutral', label: 'Wajib'}],
    xp: 50,
    lessons: [
      {
        id: 'what_is_candle',
        title: 'Apa itu Candlestick?',
        duration: '5 menit',
        xp: 10,
        type: 'concept',
        content: 'basics_intro',
      },
      {
        id: 'anatomy',
        title: 'Anatomi Candle (OHLC)',
        duration: '7 menit',
        xp: 15,
        type: 'concept',
        content: 'basics_anatomy',
      },
      {
        id: 'bull_vs_bear',
        title: 'Bullish vs Bearish Candle',
        duration: '5 menit',
        xp: 10,
        type: 'concept',
        content: 'basics_bullbear',
      },
      {
        id: 'timeframes',
        title: 'Memahami Timeframe',
        duration: '6 menit',
        xp: 15,
        type: 'concept',
        content: 'basics_timeframes',
      },
    ],
  },

  {
    id: 'm2_single_bullish',
    order: 2,
    title: 'Single Candle — Bullish Reversal',
    subtitle: 'Hammer, Inverted Hammer, Dragonfly Doji, Bullish Belt Hold',
    icon: '🔨',
    color: '#26a69a',
    tags: [{type: 'bullish', label: 'Bullish'}, {type: 'neutral', label: '1 Candle'}],
    xp: 80,
    lessons: [
      {id: 'hammer', title: 'Hammer', duration: '10 menit', xp: 20, type: 'pattern', patternId: 'hammer'},
      {id: 'inverted_hammer', title: 'Inverted Hammer', duration: '8 menit', xp: 20, type: 'pattern', patternId: 'inverted_hammer'},
      {id: 'dragonfly_doji', title: 'Dragonfly Doji', duration: '8 menit', xp: 20, type: 'pattern', patternId: 'dragonfly_doji'},
      {id: 'bullish_belt_hold', title: 'Bullish Belt Hold', duration: '7 menit', xp: 20, type: 'pattern', patternId: 'bullish_belt_hold'},
    ],
  },

  {
    id: 'm3_single_bearish',
    order: 3,
    title: 'Single Candle — Bearish Reversal',
    subtitle: 'Hanging Man, Shooting Star, Gravestone Doji, Bearish Belt Hold',
    icon: '⭐',
    color: '#ef5350',
    tags: [{type: 'bearish', label: 'Bearish'}, {type: 'neutral', label: '1 Candle'}],
    xp: 80,
    lessons: [
      {id: 'hanging_man', title: 'Hanging Man', duration: '10 menit', xp: 20, type: 'pattern', patternId: 'hanging_man'},
      {id: 'shooting_star', title: 'Shooting Star', duration: '10 menit', xp: 20, type: 'pattern', patternId: 'shooting_star'},
      {id: 'gravestone_doji', title: 'Gravestone Doji', duration: '8 menit', xp: 20, type: 'pattern', patternId: 'gravestone_doji'},
      {id: 'bearish_belt_hold', title: 'Bearish Belt Hold', duration: '7 menit', xp: 20, type: 'pattern', patternId: 'bearish_belt_hold'},
    ],
  },

  {
    id: 'm4_double_bullish',
    order: 4,
    title: 'Two Candle — Bullish Reversal',
    subtitle: 'Engulfing, Harami, Piercing Line, Tweezer Bottom',
    icon: '🟢',
    color: '#26a69a',
    tags: [{type: 'bullish', label: 'Bullish'}, {type: 'neutral', label: '2 Candle'}],
    xp: 100,
    lessons: [
      {id: 'bullish_engulfing', title: 'Bullish Engulfing ⭐', duration: '12 menit', xp: 30, type: 'pattern', patternId: 'bullish_engulfing'},
      {id: 'bullish_harami', title: 'Bullish Harami', duration: '8 menit', xp: 20, type: 'pattern', patternId: 'bullish_harami'},
      {id: 'piercing_line', title: 'Piercing Line', duration: '10 menit', xp: 25, type: 'pattern', patternId: 'piercing_line'},
      {id: 'tweezer_bottom', title: 'Tweezer Bottom', duration: '8 menit', xp: 25, type: 'pattern', patternId: 'tweezer_bottom'},
    ],
  },

  {
    id: 'm5_double_bearish',
    order: 5,
    title: 'Two Candle — Bearish Reversal',
    subtitle: 'Bearish Engulfing, Bearish Harami, Dark Cloud Cover, Tweezer Top',
    icon: '🔴',
    color: '#ef5350',
    tags: [{type: 'bearish', label: 'Bearish'}, {type: 'neutral', label: '2 Candle'}],
    xp: 100,
    lessons: [
      {id: 'bearish_engulfing', title: 'Bearish Engulfing ⭐', duration: '12 menit', xp: 30, type: 'pattern', patternId: 'bearish_engulfing'},
      {id: 'bearish_harami', title: 'Bearish Harami', duration: '8 menit', xp: 20, type: 'pattern', patternId: 'bearish_harami'},
      {id: 'dark_cloud_cover', title: 'Dark Cloud Cover', duration: '10 menit', xp: 25, type: 'pattern', patternId: 'dark_cloud_cover'},
      {id: 'tweezer_top', title: 'Tweezer Top', duration: '8 menit', xp: 25, type: 'pattern', patternId: 'tweezer_top'},
    ],
  },

  {
    id: 'm6_triple_bullish',
    order: 6,
    title: 'Three Candle — Bullish Reversal',
    subtitle: 'Morning Star, Morning Doji Star, Three White Soldiers',
    icon: '🌅',
    color: '#26a69a',
    tags: [{type: 'bullish', label: 'Bullish'}, {type: 'neutral', label: '3 Candle'}, {type: 'neutral', label: 'Advanced'}],
    xp: 100,
    lessons: [
      {id: 'morning_star', title: 'Morning Star ⭐⭐', duration: '12 menit', xp: 35, type: 'pattern', patternId: 'morning_star'},
      {id: 'morning_doji_star', title: 'Morning Doji Star', duration: '10 menit', xp: 30, type: 'pattern', patternId: 'morning_doji_star'},
      {id: 'three_white_soldiers', title: 'Three White Soldiers', duration: '10 menit', xp: 35, type: 'pattern', patternId: 'three_white_soldiers'},
    ],
  },

  {
    id: 'm7_triple_bearish',
    order: 7,
    title: 'Three Candle — Bearish Reversal',
    subtitle: 'Evening Star, Evening Doji Star, Three Black Crows',
    icon: '🌃',
    color: '#ef5350',
    tags: [{type: 'bearish', label: 'Bearish'}, {type: 'neutral', label: '3 Candle'}, {type: 'neutral', label: 'Advanced'}],
    xp: 100,
    lessons: [
      {id: 'evening_star', title: 'Evening Star ⭐⭐', duration: '12 menit', xp: 35, type: 'pattern', patternId: 'evening_star'},
      {id: 'evening_doji_star', title: 'Evening Doji Star', duration: '10 menit', xp: 30, type: 'pattern', patternId: 'evening_doji_star'},
      {id: 'three_black_crows', title: 'Three Black Crows', duration: '10 menit', xp: 35, type: 'pattern', patternId: 'three_black_crows'},
    ],
  },

  {
    id: 'm8_practice',
    order: 8,
    title: 'Practice & Master Quiz',
    subtitle: 'Uji pemahaman komprehensif — mixed patterns',
    icon: '🎯',
    color: '#f0b429',
    tags: [{type: 'quiz', label: 'Quiz'}, {type: 'neutral', label: 'Capstone'}],
    xp: 150,
    lessons: [
      {id: 'q_identify', title: 'Quiz: Identifikasi Pola', duration: '10 menit', xp: 30, type: 'quiz', quizId: 'identify'},
      {id: 'q_signal', title: 'Quiz: Bullish or Bearish?', duration: '8 menit', xp: 30, type: 'quiz', quizId: 'signal'},
      {id: 'q_entry', title: 'Quiz: Where to Entry?', duration: '10 menit', xp: 40, type: 'quiz', quizId: 'entry'},
      {id: 'q_master', title: 'Master Quiz (Campuran) 🏆', duration: '15 menit', xp: 50, type: 'quiz', quizId: 'master'},
    ],
  },

  {
    id: 'm9_cheatsheet',
    order: 9,
    title: 'Cheatsheet & Referensi',
    subtitle: 'Kartu referensi semua pola untuk dipelajari cepat',
    icon: '📒',
    color: '#a78bfa',
    tags: [{type: 'neutral', label: 'Reference'}],
    xp: 0,
    lessons: [
      {id: 'cheatsheet', title: 'Cheatsheet Semua Pola', duration: 'Reference', xp: 0, type: 'cheatsheet'},
    ],
  },
];

/* Inject extra modules from feature files (called after all scripts load) */
function injectExtraModules() {
  if (typeof CHART_PATTERN_MODULE !== 'undefined') CURRICULUM.push(CHART_PATTERN_MODULE);
  if (typeof INDICATORS_MODULE !== 'undefined') CURRICULUM.push(INDICATORS_MODULE);
  if (typeof SR_FIB_MODULE !== 'undefined') CURRICULUM.push(SR_FIB_MODULE);
  if (typeof PATTERN_HUNTER_MODULE !== 'undefined') CURRICULUM.push(PATTERN_HUNTER_MODULE);
  if (typeof PAPER_TRADE_MODULE !== 'undefined') CURRICULUM.push(PAPER_TRADE_MODULE);
}

/* Konten pelajaran basics */
const BASICS_CONTENT = {
  basics_intro: {
    title: 'Apa itu Candlestick?',
    sections: [
      {
        type: 'text',
        heading: 'Sejarah Singkat',
        body: `Candlestick chart adalah teknik visualisasi harga yang ditemukan oleh pedagang beras Jepang, <b>Munehisa Homma</b>, di abad ke-18. Homma menggunakannya untuk memprediksi pergerakan harga beras di pasar Dojima.
Teknik ini diperkenalkan ke dunia Barat oleh <b>Steve Nison</b> di tahun 1990-an lewat bukunya "Japanese Candlestick Charting Techniques". Sejak itu, candlestick menjadi teknik membaca chart paling populer di dunia — dipakai oleh trader saham, forex, crypto, komoditas, dan semua asset class.`,
      },
      {
        type: 'highlight',
        variant: 'info',
        icon: '💡',
        body: `Candlestick adalah representasi visual dari <b>psikologi pasar</b> dalam satu periode waktu. Setiap candle = pertarungan mini antara buyer dan seller.`,
      },
      {
        type: 'text',
        heading: 'Mengapa Candlestick?',
        body: `Dibandingkan line chart (hanya close price) atau bar chart, candlestick memberikan lebih banyak informasi sekaligus:<br>
        ✅ Arah pergerakan (bullish/bearish) langsung terlihat dari warna<br>
        ✅ Volatility sesi terlihat dari panjang wick<br>
        ✅ Pola psikologi pasar terbentuk dari rangkaian candle<br>
        ✅ Sinyal trading spesifik bisa didapat dari formasi tertentu`,
      },
    ],
  },

  basics_anatomy: {
    title: 'Anatomi Candle (OHLC)',
    sections: [
      {
        type: 'text',
        body: `Setiap candlestick mewakili <b>4 harga kunci</b> dalam satu periode (misal: 1 candle Daily = 1 hari trading):`,
      },
      {
        type: 'anatomy',
      },
      {
        type: 'rules',
        heading: 'Komponen Utama',
        rules: [
          {icon: '🟩', text: '<b>Body</b> — area persegi panjang antara Open dan Close. Warna menunjukkan arah: hijau = close > open (bullish), merah = close < open (bearish).'},
          {icon: '📏', text: '<b>Upper Shadow/Wick</b> — garis tipis di atas body. Menunjukkan harga tertinggi (High) sesi.'},
          {icon: '📏', text: '<b>Lower Shadow/Wick</b> — garis tipis di bawah body. Menunjukkan harga terendah (Low) sesi.'},
          {icon: '⏰', text: '<b>Periode</b> — durasi 1 candle tergantung timeframe. 1D = 1 candle per hari, 1H = 1 candle per jam, dst.'},
        ],
      },
      {
        type: 'highlight',
        variant: 'tip',
        icon: '🎯',
        body: `<b>Trader mindset:</b> Panjang body = kekuatan momentum. Panjang wick = indecision / rejection. Paham ini = 50% skill baca chart.`,
      },
    ],
  },

  basics_bullbear: {
    title: 'Bullish vs Bearish Candle',
    sections: [
      {
        type: 'text',
        body: `Setiap candle dibagi menjadi 2 tipe utama berdasarkan arah:`,
      },
      {
        type: 'bullbear',
      },
      {
        type: 'rules',
        heading: 'Cara Baca',
        rules: [
          {icon: '🟢', text: '<b>Bullish Candle (Hijau):</b> Close > Open. Buyer menang di sesi ini. Harga naik dari pembukaan ke penutupan.'},
          {icon: '🔴', text: '<b>Bearish Candle (Merah):</b> Close < Open. Seller menang. Harga turun dari pembukaan ke penutupan.'},
          {icon: '⚫', text: '<b>Doji:</b> Open ≈ Close. Indecision / market ragu — tidak ada pemenang jelas di sesi itu.'},
        ],
      },
      {
        type: 'highlight',
        variant: 'warning',
        icon: '⚠️',
        body: `Jangan confuse: warna hanya menunjukkan arah close vs open. Candle <b>BUKAN</b> gambaran seluruh pergerakan sesi — kita kehilangan sequence harga. Tapi 4 titik OHLC cukup untuk baca psikologi pasar.`,
      },
    ],
  },

  basics_timeframes: {
    title: 'Memahami Timeframe',
    sections: [
      {
        type: 'text',
        body: `Timeframe menentukan <b>periode yang diwakili 1 candle</b>. Semakin besar timeframe, semakin "besar" story yang diceritakan candle tersebut.`,
      },
      {
        type: 'rules',
        heading: 'Timeframe Umum',
        rules: [
          {icon: '⚡', text: '<b>M1, M5, M15</b> (1, 5, 15 menit) — untuk scalping. Banyak noise, sinyal candlestick kurang reliable.'},
          {icon: '📊', text: '<b>H1, H4</b> (1 jam, 4 jam) — intraday / swing trading. Sinyal mulai reliable.'},
          {icon: '📅', text: '<b>D (Daily)</b> — swing trading. Sinyal candlestick paling reliable di sini.'},
          {icon: '📆', text: '<b>W, M</b> (Weekly, Monthly) — position trading & investing. Sinyal sangat kuat tapi jarang muncul.'},
        ],
      },
      {
        type: 'highlight',
        variant: 'tip',
        icon: '🧠',
        body: `<b>Rule of thumb:</b> Untuk pola candlestick reversal, Daily dan Weekly adalah "sweet spot" — cukup sering muncul, dan akurasinya tinggi. Intraday (< H1) = boleh dipakai tapi butuh konfirmasi tambahan.`,
      },
      {
        type: 'highlight',
        variant: 'info',
        icon: '🔗',
        body: `<b>Multi-timeframe analysis:</b> Gunakan timeframe lebih tinggi untuk identifikasi <i>context/trend</i>, timeframe lebih rendah untuk <i>entry timing</i>. Contoh: cek Daily untuk trend → entry di H4 saat pola muncul.`,
      },
    ],
  },
};
