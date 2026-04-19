/* ======================================
   CANDLESTICK PATTERN KNOWLEDGE BASE
   Sumber: "Technical Analysis for Mega Profit" (Edianto Ong)
            + Steve Nison (Japanese Candlestick Charting Techniques)
            + Pengalaman praktis trading XAUUSD/Saham
   ====================================== */

const PATTERNS = {

  // ═══════════════════════════════════════════════
  //   SINGLE CANDLE — BULLISH REVERSAL
  // ═══════════════════════════════════════════════

  hammer: {
    id: 'hammer',
    name: 'Hammer',
    nameId: 'Palu',
    category: 'single-bullish',
    signal: 'bullish-reversal',
    reliability: 4,
    context: 'Muncul di akhir downtrend — sinyal potensi reversal ke atas',

    description: `Hammer adalah pola satu candle yang muncul setelah downtrend. Bentuknya seperti palu:
      body kecil di bagian atas, dengan lower shadow (ekor bawah) yang panjangnya minimal
      2x body. Upper shadow hampir tidak ada. Warna body boleh merah (bearish) atau hijau
      (bullish) — tapi Hammer hijau biasanya lebih kuat.`,

    psychology: `Cerita di balik Hammer: di sesi ini seller masih mendominasi dan berhasil
      menekan harga jauh ke bawah (membuat lower shadow panjang). Tapi di tengah sesi, buyer
      masuk agresif dan mendorong harga kembali ke dekat open. Ini menandakan selling pressure
      mulai habis — buyer mulai "menangkap" harga murah. Sinyal bahwa downtrend mungkin selesai.`,

    rules: [
      {icon: '📐', text: 'Lower shadow minimal 2x panjang body (ideal 3x)'},
      {icon: '🚫', text: 'Upper shadow sangat kecil atau tidak ada (< 10% body)'},
      {icon: '📍', text: 'Body kecil, berada di bagian atas range candle'},
      {icon: '📉', text: 'WAJIB muncul setelah downtrend (bukan di uptrend!)'},
      {icon: '🎨', text: 'Warna body: bullish (hijau) lebih diutamakan daripada bearish'},
    ],

    entry: {
      signal: 'BUY di candle konfirmasi',
      trigger: 'Ketika candle berikutnya close di atas high Hammer',
      stopLoss: 'Di bawah low Hammer (lower shadow) - tambahkan buffer 5-10 pips',
      takeProfit: 'Minimal 1:2 Risk:Reward, atau resistance terdekat',
      timing: 'Lebih kuat di timeframe H4 / Daily. Hindari M5-M15 (banyak noise)',
    },

    confirmation: [
      'RSI oversold (< 30) + divergence bullish',
      'Support level (S1, pivot, Fibonacci 61.8%, round number)',
      'Volume candle Hammer besar (selling climax)',
      'Candle berikutnya bullish engulfing atau gap up',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: '240',
      description: 'XAUUSD sering membentuk Hammer di area support Fibonacci 61.8% setelah retracement. Cek Daily chart saat harga tes support kuat.',
    },

    mistakes: [
      'Entry tanpa candle konfirmasi — banyak false signal',
      'Trading Hammer di sideways (bukan downtrend) — ini bukan Hammer, cuma hammer-like',
      'Abaikan context: Hammer di tengah strong downtrend masih berisiko',
    ],
  },

  inverted_hammer: {
    id: 'inverted_hammer',
    name: 'Inverted Hammer',
    nameId: 'Palu Terbalik',
    category: 'single-bullish',
    signal: 'bullish-reversal',
    reliability: 3,
    context: 'Muncul di akhir downtrend — sinyal reversal, tapi butuh konfirmasi lebih kuat',

    description: `Inverted Hammer adalah kebalikan bentuk Hammer: body kecil di bagian bawah,
      dengan upper shadow panjang (minimal 2x body) dan lower shadow sangat kecil. Muncul
      setelah downtrend.`,

    psychology: `Buyer mencoba mendorong harga naik tajam (upper shadow panjang), tapi seller
      berhasil menekan balik mendekati open. Meski terlihat seller menang di sesi itu,
      upaya buyer yang kuat menandakan shift dalam sentimen — mereka mulai agresif.
      Ini bukan sinyal langsung reversal, tapi WARNING bagi seller.`,

    rules: [
      {icon: '📐', text: 'Upper shadow minimal 2x panjang body'},
      {icon: '🚫', text: 'Lower shadow sangat kecil atau tidak ada'},
      {icon: '📍', text: 'Body kecil di bagian bawah candle'},
      {icon: '📉', text: 'Harus muncul setelah downtrend'},
      {icon: '✅', text: 'Butuh konfirmasi candle berikutnya (gap up atau bullish close)'},
    ],

    entry: {
      signal: 'BUY setelah konfirmasi',
      trigger: 'Candle berikutnya close di atas high Inverted Hammer',
      stopLoss: 'Di bawah low Inverted Hammer + buffer',
      takeProfit: '1:2 atau lebih, target resistance',
      timing: 'Lebih akurat di Daily & Weekly',
    },

    confirmation: [
      'Gap up di candle berikutnya (paling kuat)',
      'RSI divergence bullish',
      'Berada di key support level',
      'Volume meningkat saat candle konfirmasi',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Inverted Hammer di Daily XAUUSD sering muncul setelah koreksi ke MA200 atau support weekly.',
    },

    mistakes: [
      'Jangan langsung entry — tanpa konfirmasi, ini bisa jadi pola continuation',
      'Sering tertukar dengan Shooting Star (konteks berbeda!)',
    ],
  },

  dragonfly_doji: {
    id: 'dragonfly_doji',
    name: 'Dragonfly Doji',
    nameId: 'Doji Capung',
    category: 'single-bullish',
    signal: 'bullish-reversal',
    reliability: 4,
    context: 'Doji dengan lower shadow panjang — sinyal reversal bullish kuat setelah downtrend',

    description: `Dragonfly Doji terbentuk ketika open = close = high, dengan lower shadow
      yang sangat panjang. Bentuknya seperti huruf T. Ini adalah pola yang menandakan seller
      kehilangan kontrol total di akhir downtrend.`,

    psychology: `Sepanjang sesi seller berhasil menekan harga turun jauh. Tapi di penutupan,
      buyer benar-benar mengambil alih dan mendorong harga kembali ke level open (= high).
      Ini sinyal kuat bahwa momentum sudah berbalik total.`,

    rules: [
      {icon: '📐', text: 'Open ≈ Close ≈ High (body hampir tidak ada)'},
      {icon: '⬇️', text: 'Lower shadow panjang (minimal 2x range body)'},
      {icon: '🚫', text: 'Upper shadow tidak ada atau sangat kecil'},
      {icon: '📉', text: 'Terbentuk di akhir downtrend atau di support'},
    ],

    entry: {
      signal: 'BUY saat konfirmasi',
      trigger: 'Close candle berikutnya di atas high Dragonfly Doji',
      stopLoss: 'Di bawah low Dragonfly (lower shadow) + buffer',
      takeProfit: 'Resistance terdekat, minimal 1:2',
      timing: 'Daily / H4 paling reliable',
    },

    confirmation: [
      'Di support major (Fibonacci 61.8%, MA200, structure low)',
      'RSI oversold + bullish divergence',
      'Volume tinggi di Dragonfly candle',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: '240',
      description: 'Dragonfly Doji di XAUUSD sering terjadi saat tes support psikologis (mis. 2000.00).',
    },

    mistakes: [
      'Entry di tengah downtrend kuat tanpa cek support',
      'Abaikan timeframe — di M15 Dragonfly kurang reliable',
    ],
  },

  bullish_belt_hold: {
    id: 'bullish_belt_hold',
    name: 'Bullish Belt Hold',
    nameId: 'Sabuk Bullish',
    category: 'single-bullish',
    signal: 'bullish-reversal',
    reliability: 3,
    context: 'Candle bullish besar yang open = low, tanpa lower shadow',

    description: `Bullish Belt Hold adalah candle bullish (hijau) panjang dengan:
      open = low (tidak ada lower shadow sama sekali), upper shadow minimal, body besar.
      Juga dikenal sebagai "Yorikiri" (sumo) — dorongan kuat dari buyer sejak pembukaan.`,

    psychology: `Sejak pembukaan, buyer langsung mengambil alih dan tidak memberi kesempatan
      sedikitpun pada seller. Harga naik terus sepanjang sesi dengan minim pullback.
      Momentum bullish sangat kuat.`,

    rules: [
      {icon: '📐', text: 'Body bullish (hijau) panjang'},
      {icon: '🚫', text: 'Tidak ada lower shadow (open = low)'},
      {icon: '🔽', text: 'Upper shadow minimal'},
      {icon: '📉', text: 'Muncul di akhir downtrend'},
    ],

    entry: {
      signal: 'BUY di breakout high Belt Hold',
      trigger: 'Harga close di atas high Belt Hold',
      stopLoss: 'Di bawah low (= open) Belt Hold',
      takeProfit: '1:2+, atau resistance major',
      timing: 'Semua timeframe, tapi Daily paling kuat',
    },

    confirmation: [
      'Volume besar di candle Belt Hold',
      'Berada di support kunci',
      'Tidak ada resistance ketat dalam 2-3 candle range',
    ],

    examples: {
      symbol: 'NASDAQ:AAPL',
      tf: 'D',
      description: 'AAPL setelah earnings positif sering open gap up dan form Belt Hold bullish.',
    },

    mistakes: [
      'Chasing terlalu jauh dari low — risk/reward jadi buruk',
      'Ignore kalau candle muncul di tengah range sideways',
    ],
  },

  // ═══════════════════════════════════════════════
  //   SINGLE CANDLE — BEARISH REVERSAL
  // ═══════════════════════════════════════════════

  hanging_man: {
    id: 'hanging_man',
    name: 'Hanging Man',
    nameId: 'Orang Gantung',
    category: 'single-bearish',
    signal: 'bearish-reversal',
    reliability: 3,
    context: 'Bentuk persis Hammer, tapi muncul di puncak uptrend — sinyal bearish reversal',

    description: `Hanging Man punya bentuk yang sama dengan Hammer (body kecil di atas, lower
      shadow panjang), tapi KONTEKSNYA berbeda: Hanging Man muncul di PUNCAK uptrend.
      Warna body merah lebih reliable daripada hijau.`,

    psychology: `Di uptrend yang sudah berjalan panjang, muncul candle di mana seller tiba-tiba
      menekan harga jauh ke bawah (lower shadow panjang). Meskipun buyer berhasil push balik,
      fakta bahwa seller mampu menekan sejauh itu di tengah uptrend = warning kuat.
      Momentum buyer mulai melemah.`,

    rules: [
      {icon: '📐', text: 'Lower shadow minimal 2x body'},
      {icon: '🚫', text: 'Upper shadow sangat kecil'},
      {icon: '📍', text: 'Body kecil di bagian atas candle'},
      {icon: '📈', text: 'WAJIB muncul setelah uptrend'},
      {icon: '🔴', text: 'Body merah (bearish) lebih reliable'},
    ],

    entry: {
      signal: 'SELL saat konfirmasi',
      trigger: 'Candle berikutnya close di bawah low Hanging Man',
      stopLoss: 'Di atas high Hanging Man + buffer',
      takeProfit: 'Support terdekat, 1:2+',
      timing: 'Daily / H4 paling kuat',
    },

    confirmation: [
      'RSI overbought + bearish divergence',
      'Di resistance kunci (round number, previous high, Fib)',
      'Volume tinggi di Hanging Man',
      'Candle konfirmasi bearish engulfing atau gap down',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Saat XAUUSD rally ke all-time high dan form Hanging Man di Daily — seringkali awal koreksi besar.',
    },

    mistakes: [
      'Entry tanpa konfirmasi — Hanging Man punya failure rate cukup tinggi solo',
      'Lupa cek context uptrend — kalau muncul di sideways, bukan valid signal',
    ],
  },

  shooting_star: {
    id: 'shooting_star',
    name: 'Shooting Star',
    nameId: 'Bintang Jatuh',
    category: 'single-bearish',
    signal: 'bearish-reversal',
    reliability: 4,
    context: 'Muncul di puncak uptrend — sinyal reversal bearish',

    description: `Shooting Star adalah "mirror" dari Inverted Hammer, tapi muncul di PUNCAK
      uptrend. Body kecil di bawah, upper shadow panjang (min 2x body), lower shadow minimal.
      Warna body biasanya merah (lebih reliable).`,

    psychology: `Di uptrend, buyer mencoba push harga lebih tinggi (upper shadow panjang) —
      tapi seller masuk dengan agresif dan mendorong harga kembali turun ke dekat open.
      Upaya buyer ditolak keras. Ini tanda kuat bahwa puncak sudah tercapai.`,

    rules: [
      {icon: '📐', text: 'Upper shadow minimal 2x body (ideal 3x)'},
      {icon: '🚫', text: 'Lower shadow sangat kecil atau tidak ada'},
      {icon: '📍', text: 'Body kecil di bagian bawah candle'},
      {icon: '📈', text: 'Muncul setelah uptrend kuat'},
      {icon: '🔴', text: 'Body merah lebih kuat sebagai sinyal'},
    ],

    entry: {
      signal: 'SELL saat konfirmasi',
      trigger: 'Close di bawah low Shooting Star',
      stopLoss: 'Di atas high Shooting Star + buffer',
      takeProfit: 'Support major, 1:2+',
      timing: 'Daily paling reliable, H4 juga baik',
    },

    confirmation: [
      'Di resistance kunci (round number, all-time high, trendline)',
      'RSI overbought + bearish divergence',
      'Volume tinggi',
      'Gap down di candle berikutnya',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Shooting Star di XAUUSD di level psikologis (2100, 2200) seringkali awal koreksi signifikan.',
    },

    mistakes: [
      'Salah identifikasi — Shooting Star butuh uptrend, bukan sideways',
      'Stop loss terlalu ketat (harga sering tes high lagi sebelum turun)',
    ],
  },

  gravestone_doji: {
    id: 'gravestone_doji',
    name: 'Gravestone Doji',
    nameId: 'Doji Batu Nisan',
    category: 'single-bearish',
    signal: 'bearish-reversal',
    reliability: 4,
    context: 'Doji dengan upper shadow panjang — sinyal bearish reversal kuat di puncak',

    description: `Gravestone Doji terbentuk ketika open = close = low, dengan upper shadow
      panjang. Bentuknya seperti batu nisan (huruf T terbalik). Ini "death signal" — buyer
      sudah habis tenaga.`,

    psychology: `Buyer mencoba push harga jauh ke atas sepanjang sesi (upper shadow panjang).
      Tapi di penutupan, seller berhasil drag harga kembali ke level open (= low). Ini
      menandakan buyer sudah tidak mampu mempertahankan gain sedikitpun.`,

    rules: [
      {icon: '📐', text: 'Open ≈ Close ≈ Low'},
      {icon: '⬆️', text: 'Upper shadow panjang (min 2x range)'},
      {icon: '🚫', text: 'Lower shadow tidak ada atau sangat kecil'},
      {icon: '📈', text: 'Muncul setelah uptrend / di resistance'},
    ],

    entry: {
      signal: 'SELL saat konfirmasi',
      trigger: 'Close di bawah low Gravestone',
      stopLoss: 'Di atas high Gravestone + buffer',
      takeProfit: 'Support terdekat, 1:2+',
      timing: 'Daily paling kuat',
    },

    confirmation: [
      'Resistance major (previous high, round number)',
      'RSI overbought',
      'Volume tinggi di Gravestone',
      'Bearish divergence',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Gravestone Doji di all-time high XAUUSD sering mark swing high major.',
    },

    mistakes: [
      'Ignoring resistance context',
      'Entry terlalu cepat tanpa close konfirmasi',
    ],
  },

  bearish_belt_hold: {
    id: 'bearish_belt_hold',
    name: 'Bearish Belt Hold',
    nameId: 'Sabuk Bearish',
    category: 'single-bearish',
    signal: 'bearish-reversal',
    reliability: 3,
    context: 'Candle bearish besar yang open = high, tanpa upper shadow',

    description: `Bearish Belt Hold adalah candle bearish (merah) panjang dengan:
      open = high (tidak ada upper shadow), lower shadow minimal, body besar. Menandakan
      seller menguasai sesi sejak open.`,

    psychology: `Sejak open, seller langsung agresif dan terus menekan harga tanpa memberi
      ruang buyer. Full bearish control.`,

    rules: [
      {icon: '📐', text: 'Body bearish panjang'},
      {icon: '🚫', text: 'Tidak ada upper shadow (open = high)'},
      {icon: '🔽', text: 'Lower shadow minimal'},
      {icon: '📈', text: 'Muncul di akhir uptrend atau di resistance'},
    ],

    entry: {
      signal: 'SELL di breakdown low',
      trigger: 'Close di bawah low Belt Hold',
      stopLoss: 'Di atas high (= open)',
      takeProfit: '1:2+, support major',
      timing: 'Daily / H4',
    },

    confirmation: [
      'Volume besar',
      'Di resistance major',
      'Gap down di candle berikutnya = konfirmasi ekstra kuat',
    ],

    examples: {
      symbol: 'NASDAQ:TSLA',
      tf: 'D',
      description: 'TSLA sering membentuk Bearish Belt Hold setelah earnings miss.',
    },

    mistakes: [
      'Mengejar setelah drop besar (chasing)',
      'Abaikan context resistance',
    ],
  },

  // ═══════════════════════════════════════════════
  //   2-CANDLE BULLISH REVERSAL
  // ═══════════════════════════════════════════════

  bullish_engulfing: {
    id: 'bullish_engulfing',
    name: 'Bullish Engulfing',
    nameId: 'Engulfing Bullish',
    category: 'double-bullish',
    signal: 'bullish-reversal',
    reliability: 5,
    context: 'Salah satu pola reversal bullish PALING KUAT. Muncul di bottom downtrend.',

    description: `Bullish Engulfing terdiri dari 2 candle: Candle 1 bearish (merah) kecil/sedang,
      Candle 2 bullish (hijau) yang body-nya MENELAN (engulf) seluruh body Candle 1.
      Open Candle 2 lebih rendah dari close Candle 1, dan close Candle 2 lebih tinggi dari
      open Candle 1.`,

    psychology: `Setelah downtrend, muncul candle bearish kecil (seller mulai kehilangan tenaga).
      Di sesi berikutnya, pasar buka lebih rendah — tapi buyer segera mengambil alih dan
      mendorong harga naik kuat hingga menutup di atas open candle sebelumnya.
      Ini = pergeseran momentum total dari seller ke buyer.`,

    rules: [
      {icon: '🕯️', text: 'Candle 1: bearish (merah), biasanya kecil-sedang'},
      {icon: '🕯️', text: 'Candle 2: bullish (hijau), body LEBIH BESAR dari candle 1'},
      {icon: '📏', text: 'Body Candle 2 menelan FULL body Candle 1 (open lebih rendah, close lebih tinggi)'},
      {icon: '📉', text: 'Muncul setelah downtrend'},
      {icon: '🔥', text: 'Makin besar Candle 2 dibanding Candle 1, makin kuat sinyalnya'},
    ],

    entry: {
      signal: 'BUY agresif atau konservatif',
      trigger: 'Agresif: entry saat close Candle 2. Konservatif: BUY di pullback / di atas high Candle 2.',
      stopLoss: 'Di bawah low Candle 2 (atau low Candle 1 jika lebih rendah) + buffer',
      takeProfit: 'Minimal 1:2 RR. Target: resistance terdekat atau extension 1.618.',
      timing: 'Semua timeframe, tapi Daily / H4 paling reliable',
    },

    confirmation: [
      'Volume Candle 2 jauh lebih tinggi dari Candle 1',
      'Terjadi di support major (Fib 61.8%, MA200, structure low)',
      'RSI oversold + bullish divergence',
      'Candle 3 konfirmasi bullish melanjutkan',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: '240',
      description: 'Bullish Engulfing di Daily XAUUSD di Fib 61.8% pullback seringkali awal leg-up baru yang besar.',
    },

    mistakes: [
      'Hanya melihat wick (bukan body) — engulfing adalah tentang BODY, bukan wick',
      'Entry di Bullish Engulfing kecil — size matter',
      'Ignore context downtrend',
    ],
  },

  bullish_harami: {
    id: 'bullish_harami',
    name: 'Bullish Harami',
    nameId: 'Harami Bullish (Pregnant)',
    category: 'double-bullish',
    signal: 'bullish-reversal',
    reliability: 3,
    context: 'Kebalikan Engulfing — Candle 2 kecil "di dalam" body Candle 1. Sinyal early warning.',

    description: `Harami (bahasa Jepang = "pregnant/hamil") adalah pola 2 candle di mana:
      Candle 1 bearish besar, Candle 2 bullish kecil yang body-nya berada SELURUHNYA di
      dalam body Candle 1. Sinyal bahwa momentum bearish mulai habis.`,

    psychology: `Downtrend ditandai dengan candle bearish besar (seller dominan). Di candle
      berikutnya, volatility menurun drastis — harga tidak lagi mampu lanjut turun.
      Ini = seller kehilangan tenaga, indecision mulai masuk. Belum reversal konfirm,
      tapi warning bahwa downtrend mungkin berakhir.`,

    rules: [
      {icon: '🕯️', text: 'Candle 1: bearish besar (long body)'},
      {icon: '🕯️', text: 'Candle 2: bullish kecil (small body)'},
      {icon: '📦', text: 'Body Candle 2 FULL di dalam body Candle 1 (high < open C1, low > close C1)'},
      {icon: '📉', text: 'Muncul setelah downtrend'},
      {icon: '⚠️', text: 'Sinyal lebih lemah dari Engulfing — butuh konfirmasi'},
    ],

    entry: {
      signal: 'BUY saat konfirmasi (jangan agresif)',
      trigger: 'Close Candle 3 di atas high Candle 1',
      stopLoss: 'Di bawah low Candle 1 + buffer',
      takeProfit: '1:2 RR, resistance terdekat',
      timing: 'Daily/Weekly — di intraday kurang reliable',
    },

    confirmation: [
      'Candle 3 bullish yang menembus high Harami',
      'Volume Candle 2 rendah (konfirmasi indecision)',
      'Support level & bullish divergence',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Harami bullish di Daily XAUUSD di area MA200 sering awal konsolidasi → reversal.',
    },

    mistakes: [
      'Entry langsung tanpa konfirmasi — failure rate tinggi',
      'Abaikan ukuran Candle 1 (harus LONG)',
    ],
  },

  piercing_line: {
    id: 'piercing_line',
    name: 'Piercing Line',
    nameId: 'Garis Penembus',
    category: 'double-bullish',
    signal: 'bullish-reversal',
    reliability: 4,
    context: 'Mirip Engulfing, tapi Candle 2 hanya menembus > 50% body Candle 1 (tidak full engulf)',

    description: `Piercing Line = 2 candle: Candle 1 bearish panjang, Candle 2 bullish yang:
      open GAP DOWN di bawah low Candle 1, tapi close menembus LEBIH DARI 50% body Candle 1
      (bisa sampai dekat open Candle 1). Lebih lemah dari Engulfing tapi masih reliable.`,

    psychology: `Seller berhasil push turun di Candle 1. Sesi berikutnya open gap down — seller
      bertambah agresif. Tapi buyer masuk kuat dan membalikkan arah hingga close di atas
      midpoint Candle 1. Ini menunjukkan shift momentum meski belum full engulf.`,

    rules: [
      {icon: '🕯️', text: 'Candle 1: bearish panjang (long body)'},
      {icon: '📉', text: 'Candle 2 open GAP DOWN di bawah low Candle 1 (dalam stock)'},
      {icon: '🕯️', text: 'Candle 2: bullish'},
      {icon: '📏', text: 'Close Candle 2 MENEMBUS > 50% body Candle 1'},
      {icon: '🚫', text: 'Close Candle 2 TIDAK boleh di atas open Candle 1 (kalau iya = Engulfing)'},
    ],

    entry: {
      signal: 'BUY saat konfirmasi',
      trigger: 'Close di atas high Piercing Line',
      stopLoss: 'Di bawah low Candle 2 + buffer',
      takeProfit: '1:2+',
      timing: 'Daily',
    },

    confirmation: [
      'Volume Candle 2 besar',
      'Di support kunci',
      'Bullish divergence',
    ],

    examples: {
      symbol: 'NYSE:GC1!',
      tf: 'D',
      description: 'Gold futures di support 1900 sering form Piercing Line sebelum bounce.',
    },

    mistakes: [
      'Forex tidak ada "real gap" — gunakan versi modifikasi (open < close C1 cukup)',
      'Close Candle 2 hanya 30-40% body = bukan Piercing, failed signal',
    ],
  },

  tweezer_bottom: {
    id: 'tweezer_bottom',
    name: 'Tweezer Bottom',
    nameId: 'Pinset Bawah',
    category: 'double-bullish',
    signal: 'bullish-reversal',
    reliability: 3,
    context: '2 candle dengan LOW yang sama persis — sinyal double-bottom mini',

    description: `Tweezer Bottom: 2 candle berturut-turut dengan LOW yang identik (atau hampir
      sama). Biasanya Candle 1 bearish, Candle 2 bullish. Harga tes level support 2x dan
      gagal break — seller kehabisan tenaga.`,

    psychology: `Di titik support, harga tes level yang sama dua kali. Yang pertama bisa
      coincidence, tapi yang kedua = konfirmasi bahwa level tersebut solid. Buyer melihat ini
      sebagai sinyal strong support.`,

    rules: [
      {icon: '📏', text: 'Low Candle 1 = Low Candle 2 (toleransi ≤ 5 pips)'},
      {icon: '🕯️', text: 'Ideal: Candle 1 bearish, Candle 2 bullish'},
      {icon: '📉', text: 'Muncul di bottom downtrend atau di support'},
    ],

    entry: {
      signal: 'BUY saat close Candle 2',
      trigger: 'Close Candle 2 bullish',
      stopLoss: 'Di bawah low Tweezer + buffer',
      takeProfit: '1:2+',
      timing: 'H4 / Daily',
    },

    confirmation: [
      'Candle 3 bullish melanjutkan',
      'Support structure level',
      'Long lower shadows di kedua candle',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: '240',
      description: 'Tweezer di support H4 XAUUSD = setup scalping/swing yang bagus.',
    },

    mistakes: [
      'Level low berbeda > 10 pips — bukan Tweezer valid',
      'Abaikan candle ke-3 untuk konfirmasi',
    ],
  },

  // ═══════════════════════════════════════════════
  //   2-CANDLE BEARISH REVERSAL
  // ═══════════════════════════════════════════════

  bearish_engulfing: {
    id: 'bearish_engulfing',
    name: 'Bearish Engulfing',
    nameId: 'Engulfing Bearish',
    category: 'double-bearish',
    signal: 'bearish-reversal',
    reliability: 5,
    context: 'Pola reversal bearish PALING KUAT. Muncul di top uptrend.',

    description: `Bearish Engulfing: Candle 1 bullish (hijau) kecil/sedang, Candle 2 bearish
      (merah) yang body-nya MENELAN seluruh body Candle 1. Open Candle 2 lebih tinggi dari
      close Candle 1, close Candle 2 lebih rendah dari open Candle 1.`,

    psychology: `Di uptrend, buyer mulai melemah (Candle 1 bullish kecil). Sesi berikutnya
      pasar open lebih tinggi (FOMO buying) — tapi seller langsung dump agresif dan membalikkan
      arah total. Momentum bergeser dari buyer ke seller secara brutal.`,

    rules: [
      {icon: '🕯️', text: 'Candle 1: bullish kecil-sedang'},
      {icon: '🕯️', text: 'Candle 2: bearish BESAR, body menelan Candle 1 full'},
      {icon: '📏', text: 'Open C2 > Close C1, Close C2 < Open C1'},
      {icon: '📈', text: 'Muncul setelah uptrend'},
      {icon: '🔥', text: 'Body C2 makin besar = sinyal makin kuat'},
    ],

    entry: {
      signal: 'SELL agresif atau konservatif',
      trigger: 'Agresif: saat close C2. Konservatif: SELL di retest high C2.',
      stopLoss: 'Di atas high Candle 2 + buffer',
      takeProfit: '1:2+ RR, support terdekat',
      timing: 'Daily / H4 terkuat',
    },

    confirmation: [
      'Volume C2 besar',
      'Di resistance major / ATH',
      'RSI overbought + bearish divergence',
      'Candle 3 bearish melanjutkan',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Bearish Engulfing di Daily XAUUSD di resistance ATH = high-probability short setup.',
    },

    mistakes: [
      'Engulfing = BODY, bukan wick. Jangan rancu.',
      'Entry tanpa perhatikan support ke bawah — stop-out karena noise',
    ],
  },

  bearish_harami: {
    id: 'bearish_harami',
    name: 'Bearish Harami',
    nameId: 'Harami Bearish',
    category: 'double-bearish',
    signal: 'bearish-reversal',
    reliability: 3,
    context: 'Candle 2 bearish kecil di dalam body Candle 1 bullish. Early warning reversal.',

    description: `Mirror dari Bullish Harami. Candle 1 bullish besar, Candle 2 bearish kecil
      yang body-nya full di dalam body Candle 1. Menandakan buyer kehabisan tenaga di puncak.`,

    psychology: `Uptrend kuat ditunjukkan oleh Candle 1. Tapi Candle 2 hanya bergerak kecil
      (volatility menurun) = momentum buyer mulai hilang. Indecision di puncak = warning.`,

    rules: [
      {icon: '🕯️', text: 'Candle 1: bullish besar'},
      {icon: '🕯️', text: 'Candle 2: bearish kecil'},
      {icon: '📦', text: 'Body C2 full di dalam body C1'},
      {icon: '📈', text: 'Setelah uptrend'},
      {icon: '⚠️', text: 'Butuh konfirmasi Candle 3'},
    ],

    entry: {
      signal: 'SELL saat konfirmasi',
      trigger: 'Candle 3 close di bawah low Candle 1',
      stopLoss: 'Di atas high C1 + buffer',
      takeProfit: '1:2+',
      timing: 'Daily/Weekly',
    },

    confirmation: [
      'Candle 3 bearish menembus low Harami',
      'Bearish divergence RSI',
      'Resistance kuat',
    ],

    examples: {
      symbol: 'NASDAQ:NVDA',
      tf: 'D',
      description: 'NVDA setelah rally parabolic sering form Bearish Harami di resistance round number.',
    },

    mistakes: [
      'Entry tanpa konfirmasi',
      'Abaikan ukuran Candle 1 (harus besar)',
    ],
  },

  dark_cloud_cover: {
    id: 'dark_cloud_cover',
    name: 'Dark Cloud Cover',
    nameId: 'Awan Gelap',
    category: 'double-bearish',
    signal: 'bearish-reversal',
    reliability: 4,
    context: 'Mirror Piercing Line. Candle 2 bearish yang menembus > 50% body Candle 1.',

    description: `Dark Cloud Cover = 2 candle: Candle 1 bullish panjang, Candle 2 bearish yang:
      open GAP UP di atas high Candle 1, tapi close menembus KE BAWAH > 50% body Candle 1.
      Lebih lemah dari Bearish Engulfing tapi masih kuat.`,

    psychology: `Buyer masih kontrol di Candle 1. Sesi berikutnya open gap up (buying continuation),
      tapi seller langsung reverse kuat hingga close di bawah midpoint C1. Sinyal jelas bahwa
      buying exhaustion terjadi.`,

    rules: [
      {icon: '🕯️', text: 'Candle 1: bullish panjang'},
      {icon: '📈', text: 'Candle 2 open GAP UP di atas high C1 (stock) atau di atas close C1 (forex)'},
      {icon: '🕯️', text: 'Candle 2: bearish'},
      {icon: '📏', text: 'Close C2 menembus > 50% body C1 KE BAWAH'},
      {icon: '🚫', text: 'Close C2 tidak boleh di bawah open C1 (itu = Bearish Engulfing)'},
    ],

    entry: {
      signal: 'SELL saat konfirmasi',
      trigger: 'Close di bawah low Dark Cloud Cover',
      stopLoss: 'Di atas high C2 + buffer',
      takeProfit: '1:2+',
      timing: 'Daily',
    },

    confirmation: [
      'Volume C2 besar',
      'Resistance major',
      'Bearish divergence',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Dark Cloud Cover di resistance ATH XAUUSD = kandidat short swing.',
    },

    mistakes: [
      'Salah identifikasi vs Bearish Engulfing (cek close C2)',
      'Abaikan gap (dalam forex gunakan proxy: open C2 > close C1)',
    ],
  },

  tweezer_top: {
    id: 'tweezer_top',
    name: 'Tweezer Top',
    nameId: 'Pinset Atas',
    category: 'double-bearish',
    signal: 'bearish-reversal',
    reliability: 3,
    context: '2 candle dengan HIGH yang sama persis — mini double-top',

    description: `Tweezer Top: 2 candle berturut dengan HIGH identik. Biasanya Candle 1 bullish,
      Candle 2 bearish. Harga tes resistance 2x dan gagal break.`,

    psychology: `Level resistance tested 2x — buyer tidak mampu menembus. Ini konfirmasi
      bahwa resistance tersebut kuat. Seller mulai masuk.`,

    rules: [
      {icon: '📏', text: 'High C1 = High C2 (toleransi ≤ 5 pips)'},
      {icon: '🕯️', text: 'Ideal: C1 bullish, C2 bearish'},
      {icon: '📈', text: 'Setelah uptrend atau di resistance'},
    ],

    entry: {
      signal: 'SELL saat close C2',
      stopLoss: 'Di atas high Tweezer + buffer',
      takeProfit: '1:2+',
      timing: 'H4 / Daily',
    },

    confirmation: [
      'Candle 3 bearish',
      'Long upper shadows di kedua candle',
      'Resistance level',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: '240',
      description: 'Tweezer Top di resistance H4 setelah double-reject = high probability short.',
    },

    mistakes: [
      'High berbeda > 10 pips',
      'Abaikan konfirmasi',
    ],
  },

  // ═══════════════════════════════════════════════
  //   3-CANDLE BULLISH REVERSAL
  // ═══════════════════════════════════════════════

  morning_star: {
    id: 'morning_star',
    name: 'Morning Star',
    nameId: 'Bintang Pagi',
    category: 'triple-bullish',
    signal: 'bullish-reversal',
    reliability: 5,
    context: 'Pola reversal bullish PALING RELIABLE di akhir downtrend. 3 candle.',

    description: `Morning Star = 3 candle:
      Candle 1: bearish panjang (downtrend continuation)
      Candle 2: "star" — body kecil (bisa bull atau bear), gap DOWN dari close C1
      Candle 3: bullish panjang, close di atas midpoint body C1`,

    psychology: `Candle 1 menunjukkan seller masih kuat. Candle 2 (star) = indecision total —
      seller tidak mampu lanjut turun, harga hanya mojok di bottom. Candle 3 menunjukkan
      buyer full take-over dan push naik kuat. Ini = transisi momentum klasik: seller →
      indecision → buyer.`,

    rules: [
      {icon: '🕯️', text: 'C1: bearish panjang'},
      {icon: '🕯️', text: 'C2: body kecil (star), ideal-nya gap down dari C1'},
      {icon: '🕯️', text: 'C3: bullish panjang'},
      {icon: '📏', text: 'Close C3 MENEMBUS > 50% body C1 ke atas'},
      {icon: '📉', text: 'Muncul setelah downtrend'},
    ],

    entry: {
      signal: 'BUY',
      trigger: 'Close C3 bullish (atau pullback ke mid C3)',
      stopLoss: 'Di bawah low C2 (low keseluruhan pattern) + buffer',
      takeProfit: '1:2+, resistance major',
      timing: 'Daily paling optimal. Weekly = sinyal swing-trade besar.',
    },

    confirmation: [
      'Volume tertinggi di C3',
      'Support major',
      'Bullish divergence RSI',
      'Morning Doji Star (C2 adalah doji) = varian lebih kuat',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Morning Star di Daily XAUUSD di support Fib 61.8% / MA200 = setup swing berkualitas tinggi.',
    },

    mistakes: [
      'C3 terlalu kecil — close tidak menembus 50% C1 = failed signal',
      'Entry di C3 terlambat — risk/reward jelek',
    ],
  },

  morning_doji_star: {
    id: 'morning_doji_star',
    name: 'Morning Doji Star',
    nameId: 'Bintang Pagi Doji',
    category: 'triple-bullish',
    signal: 'bullish-reversal',
    reliability: 5,
    context: 'Varian Morning Star dengan C2 = Doji. Lebih kuat dari Morning Star biasa.',

    description: `Sama seperti Morning Star tapi C2 adalah Doji (open ≈ close). Doji menandakan
      indecision total dan transisi momentum yang lebih tajam.`,

    psychology: `Doji di posisi star = ketidakpastian TOTAL di pasar. Setelah downtrend, ini
      sinyal exhaustion seller yang sangat jelas. Follow-through dengan C3 bullish panjang =
      transisi momentum yang paling "bersih".`,

    rules: [
      {icon: '🕯️', text: 'C1: bearish panjang'},
      {icon: '🕯️', text: 'C2: DOJI (open = close)'},
      {icon: '🕯️', text: 'C3: bullish panjang, close > 50% body C1'},
      {icon: '📉', text: 'Setelah downtrend'},
    ],

    entry: {
      signal: 'BUY',
      trigger: 'Close C3',
      stopLoss: 'Di bawah low doji',
      takeProfit: '1:2+',
      timing: 'Daily',
    },

    confirmation: [
      'Volume besar di C3',
      'Support major',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Morning Doji Star di support Weekly XAUUSD = sinyal reversal yang sangat reliable.',
    },

    mistakes: [
      'Confuse dengan Morning Star biasa (tidak ada perbedaan signifikan di trading)',
    ],
  },

  three_white_soldiers: {
    id: 'three_white_soldiers',
    name: 'Three White Soldiers',
    nameId: 'Tiga Prajurit Putih',
    category: 'triple-bullish',
    signal: 'bullish-reversal',
    reliability: 4,
    context: '3 candle bullish panjang berturut-turut setelah downtrend — konfirmasi reversal.',

    description: `3 candle bullish panjang berurutan, masing-masing:
      - Close lebih tinggi dari sebelumnya
      - Open di dalam atau dekat body candle sebelumnya
      - Upper shadow minimal (menandakan kekuatan beli sepanjang sesi)`,

    psychology: `Setelah downtrend, 3 sesi berturut-turut buyer mendominasi penuh — progression
      bullish yang konsisten. Ini = konfirmasi kuat pergeseran dari bear ke bull market.`,

    rules: [
      {icon: '🕯️', text: '3 candle bullish berturut-turut'},
      {icon: '📏', text: 'Body masing-masing panjang (bukan doji kecil)'},
      {icon: '📍', text: 'Setiap open di dalam body candle sebelumnya'},
      {icon: '📈', text: 'Setiap close lebih tinggi dari sebelumnya'},
      {icon: '🔽', text: 'Upper shadow tiap candle minimal'},
      {icon: '📉', text: 'Setelah downtrend'},
    ],

    entry: {
      signal: 'BUY di pullback',
      trigger: 'Setelah close candle ke-3. Entry terbaik: pullback ke mid candle-3.',
      stopLoss: 'Di bawah low candle-1',
      takeProfit: '1:2+',
      timing: 'Daily/Weekly',
    },

    confirmation: [
      'Volume meningkat progresif',
      'Break resistance level',
      'MA cross up',
    ],

    examples: {
      symbol: 'NASDAQ:AAPL',
      tf: 'D',
      description: 'AAPL setelah koreksi besar sering memulai leg-up baru dengan 3 White Soldiers.',
    },

    mistakes: [
      'Chasing di candle ke-3 (overextended, risk tinggi)',
      'Upper shadow besar = momentum melemah = signal lemah',
    ],
  },

  // ═══════════════════════════════════════════════
  //   3-CANDLE BEARISH REVERSAL
  // ═══════════════════════════════════════════════

  evening_star: {
    id: 'evening_star',
    name: 'Evening Star',
    nameId: 'Bintang Malam',
    category: 'triple-bearish',
    signal: 'bearish-reversal',
    reliability: 5,
    context: 'Pola reversal bearish PALING RELIABLE di puncak uptrend. 3 candle.',

    description: `Evening Star = 3 candle:
      C1: bullish panjang (uptrend continuation)
      C2: star — body kecil, gap UP dari close C1
      C3: bearish panjang, close di bawah midpoint body C1`,

    psychology: `C1 = buyer masih kuat. C2 (star) gap up = FOMO buying, tapi momentum mati —
      harga stuck di top. C3 = seller agresif take-over dan push turun. Transisi:
      buyer → indecision → seller.`,

    rules: [
      {icon: '🕯️', text: 'C1: bullish panjang'},
      {icon: '🕯️', text: 'C2: body kecil (star), gap up dari C1'},
      {icon: '🕯️', text: 'C3: bearish panjang'},
      {icon: '📏', text: 'Close C3 menembus > 50% body C1 KE BAWAH'},
      {icon: '📈', text: 'Setelah uptrend'},
    ],

    entry: {
      signal: 'SELL',
      trigger: 'Close C3',
      stopLoss: 'Di atas high C2 + buffer',
      takeProfit: '1:2+',
      timing: 'Daily / Weekly terbaik',
    },

    confirmation: [
      'Volume tertinggi di C3',
      'Resistance major',
      'Bearish divergence',
      'Evening Doji Star (C2 = doji) = lebih kuat',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Evening Star di ATH XAUUSD = sering mark top yang signifikan.',
    },

    mistakes: [
      'C3 terlalu kecil tidak menembus 50% C1 = bukan Evening Star valid',
      'Entry terlambat = R:R jelek',
    ],
  },

  evening_doji_star: {
    id: 'evening_doji_star',
    name: 'Evening Doji Star',
    nameId: 'Bintang Malam Doji',
    category: 'triple-bearish',
    signal: 'bearish-reversal',
    reliability: 5,
    context: 'Varian Evening Star dengan C2 = Doji. Lebih kuat.',

    description: `Sama seperti Evening Star, tapi C2 adalah Doji. Indecision total di puncak
      + follow-through bearish panjang = reversal signal yang sangat bersih.`,

    psychology: `Doji di puncak uptrend = buyer total kehabisan tenaga, market ragu. C3 bearish
      = seller konfirmasi reversal.`,

    rules: [
      {icon: '🕯️', text: 'C1: bullish panjang'},
      {icon: '🕯️', text: 'C2: DOJI, gap up dari C1'},
      {icon: '🕯️', text: 'C3: bearish panjang, close > 50% body C1 turun'},
      {icon: '📈', text: 'Setelah uptrend'},
    ],

    entry: {
      signal: 'SELL',
      trigger: 'Close C3',
      stopLoss: 'Di atas high doji + buffer',
      takeProfit: '1:2+',
      timing: 'Daily',
    },

    confirmation: [
      'Volume besar C3',
      'Resistance major',
    ],

    examples: {
      symbol: 'OANDA:XAUUSD',
      tf: 'D',
      description: 'Evening Doji Star di ATH XAUUSD seringkali mark top makro.',
    },

    mistakes: [
      'Confuse dengan Evening Star biasa (praktis sama)',
    ],
  },

  three_black_crows: {
    id: 'three_black_crows',
    name: 'Three Black Crows',
    nameId: 'Tiga Gagak Hitam',
    category: 'triple-bearish',
    signal: 'bearish-reversal',
    reliability: 4,
    context: '3 candle bearish panjang berturut-turut setelah uptrend.',

    description: `Mirror dari Three White Soldiers: 3 candle bearish panjang berturut-turut,
      masing-masing close lebih rendah, open di dalam body sebelumnya, lower shadow minimal.`,

    psychology: `Setelah uptrend, 3 sesi berturut seller dominan total. Progression bearish
      konsisten = konfirmasi shift ke bear market.`,

    rules: [
      {icon: '🕯️', text: '3 candle bearish berturut'},
      {icon: '📏', text: 'Body panjang'},
      {icon: '📍', text: 'Open di dalam body candle sebelumnya'},
      {icon: '📉', text: 'Close tiap candle lebih rendah'},
      {icon: '🔽', text: 'Lower shadow minimal'},
      {icon: '📈', text: 'Setelah uptrend'},
    ],

    entry: {
      signal: 'SELL di pullback',
      trigger: 'Setelah close candle ke-3, entry di pullback ke mid candle-3',
      stopLoss: 'Di atas high candle-1',
      takeProfit: '1:2+',
      timing: 'Daily/Weekly',
    },

    confirmation: [
      'Volume meningkat progresif',
      'Break support kunci',
      'MA cross down',
    ],

    examples: {
      symbol: 'NASDAQ:TSLA',
      tf: 'D',
      description: 'TSLA setelah rally parabolic + bad news → Three Black Crows di Daily.',
    },

    mistakes: [
      'Chasing di candle-3 (overextended)',
      'Lower shadow panjang = buyer mulai fight back = signal lemah',
    ],
  },

  // ═══════════════════════════════════════════════
  //   INFO PATTERN (BASICS)
  // ═══════════════════════════════════════════════

  anatomy: {
    id: 'anatomy',
    name: 'Anatomi Candlestick',
    category: 'basics',
    signal: null,
    description: `Setiap candlestick merepresentasikan 4 harga kunci di periode tertentu:
      Open (harga pembukaan), High (harga tertinggi), Low (harga terendah), Close (harga penutupan).`,
  },
};

/* Mapping signal → tag class */
const SIGNAL_TAGS = {
  'bullish-reversal': {class: 'bullish', label: 'BULLISH'},
  'bearish-reversal': {class: 'bearish', label: 'BEARISH'},
  'bullish-continuation': {class: 'bullish', label: 'BULL CONT.'},
  'bearish-continuation': {class: 'bearish', label: 'BEAR CONT.'},
  neutral: {class: 'neutral', label: 'NEUTRAL'},
};
