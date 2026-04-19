/* ======================================
   TECHNICAL INDICATORS
   RSI, MACD, Bollinger Bands, Moving Averages
   Sumber: BAB 25 "Technical Analysis for Mega Profit"
   ====================================== */

/* ──── INDICATOR SVG RENDERER ──── */
const IndicatorRenderer = {
  /* Draw a generic line indicator (RSI, MACD histogram, etc) */
  drawIndicatorLine(data, options = {}) {
    const {
      width = 360, height = 120,
      padding = {top: 16, bottom: 16, left: 8, right: 8},
      lineColor = '#5b9cf6',
      hlines = [],    // [{y, color, dash, label}]
      fill = false,
      fillPositiveColor = 'rgba(38,166,154,0.3)',
      fillNegativeColor = 'rgba(239,83,80,0.3)',
      minY, maxY,
      label = '',
    } = options;

    const iw = width - padding.left - padding.right;
    const ih = height - padding.top - padding.bottom;
    const n = data.length;
    const computedMinY = minY !== undefined ? minY : Math.min(...data) - 2;
    const computedMaxY = maxY !== undefined ? maxY : Math.max(...data) + 2;

    const toX = (i) => padding.left + (i / (n - 1)) * iw;
    const toY = (v) => padding.top + ih - ((v - computedMinY) / (computedMaxY - computedMinY)) * ih;

    const elements = [];

    // Horizontal reference lines
    hlines.forEach(hl => {
      const sy = toY(hl.y);
      const dash = hl.dash ? `stroke-dasharray="${hl.dash}"` : '';
      elements.push(`<line x1="${padding.left}" y1="${sy}" x2="${width - padding.right}" y2="${sy}" stroke="${hl.color || '#526070'}" stroke-width="1" ${dash}/>`);
      if (hl.label) {
        elements.push(`<text x="${padding.left + 3}" y="${sy - 3}" font-size="9" fill="${hl.color || '#526070'}" font-family="monospace">${hl.label}</text>`);
      }
    });

    // Path
    const pathD = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ');
    elements.push(`<path d="${pathD}" fill="none" stroke="${lineColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`);

    // Label
    if (label) {
      elements.push(`<text x="${padding.left + 4}" y="${padding.top + 12}" font-size="9" fill="#8899b4" font-family="monospace" font-weight="bold">${label}</text>`);
    }

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#0c1220;border-radius:4px">${elements.join('')}</svg>`;
  },

  /* RSI visual: oscillator 0-100 with 70/30 levels */
  drawRSI() {
    const data = [45,48,52,58,62,67,72,75,71,66,61,56,50,45,42,38,35,31,29,32,36,42,48,54,60,65,68,64,60,55];
    return this.drawIndicatorLine(data, {
      minY: 0, maxY: 100,
      lineColor: '#a78bfa',
      label: 'RSI (14)',
      hlines: [
        {y: 70, color: '#ef5350', dash: '4,3', label: 'Overbought 70'},
        {y: 30, color: '#26a69a', dash: '4,3', label: 'Oversold 30'},
        {y: 50, color: '#526070', dash: '2,4'},
      ],
    });
  },

  /* MACD visual: MACD line + Signal line */
  drawMACD() {
    const macd = [2,3,4,5,4,3,2,1,0,-1,-2,-3,-2,-1,0,1,2,3,2,1,0,-1,-2,-1,0,1,2,3,4,3];
    const signal = [1,2,3,4,4,3.5,3,2,1,0,-1,-2,-2,-1.5,-1,0,1,2,2,1.5,1,0,-1,-1,0,0.5,1,2,3,3];
    const w = 360, h = 120, pad = {top:16,bottom:16,left:8,right:8};
    const iw = w - pad.left - pad.right;
    const ih = h - pad.top - pad.bottom;
    const n = macd.length;
    const minY = -6, maxY = 6;
    const toX = i => pad.left + (i / (n-1)) * iw;
    const toY = v => pad.top + ih - ((v - minY) / (maxY - minY)) * ih;
    const zeroY = toY(0);

    const elems = [];
    // Zero line
    elems.push(`<line x1="${pad.left}" y1="${zeroY}" x2="${w-pad.right}" y2="${zeroY}" stroke="#526070" stroke-width="1"/>`);

    // Histogram bars
    macd.forEach((v, i) => {
      const x = toX(i);
      const y = toY(v);
      const color = v >= 0 ? '#26a69a' : '#ef5350';
      const barH = Math.abs(zeroY - y);
      const barY = v >= 0 ? y : zeroY;
      elems.push(`<rect x="${x - 4}" y="${barY}" width="8" height="${barH}" fill="${color}" opacity="0.7"/>`);
    });

    // MACD line
    const macdPath = macd.map((v,i) => `${i===0?'M':'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ');
    elems.push(`<path d="${macdPath}" fill="none" stroke="#5b9cf6" stroke-width="1.5" stroke-linejoin="round"/>`);

    // Signal line
    const sigPath = signal.map((v,i) => `${i===0?'M':'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ');
    elems.push(`<path d="${sigPath}" fill="none" stroke="#ef5350" stroke-width="1.5" stroke-linejoin="round" stroke-dasharray="4,2"/>`);

    // Labels
    elems.push(`<text x="12" y="14" font-size="9" fill="#5b9cf6" font-family="monospace">MACD</text>`);
    elems.push(`<text x="50" y="14" font-size="9" fill="#ef5350" font-family="monospace">Signal</text>`);

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#0c1220;border-radius:4px">${elems.join('')}</svg>`;
  },

  /* Bollinger Bands visual: price + upper + lower + middle */
  drawBollingerBands() {
    const price = [50,52,54,58,62,66,68,64,60,56,52,48,44,46,50,54,58,62,60,56,52,50,52,56,60,58,54,50,48,52];
    const upper = price.map((p, i) => p + 8 + Math.sin(i * 0.5) * 3);
    const lower = price.map((p, i) => p - 8 - Math.sin(i * 0.5) * 3);
    const middle = price.map((p, i) => p + Math.sin(i * 0.3) * 1);
    const w = 360, h = 160, pad = {top:12,bottom:12,left:8,right:8};
    const iw = w - pad.left - pad.right;
    const ih = h - pad.top - pad.bottom;
    const n = price.length;
    const allVals = [...upper, ...lower];
    const minY = Math.min(...allVals) - 3;
    const maxY = Math.max(...allVals) + 3;
    const toX = i => pad.left + (i / (n-1)) * iw;
    const toY = v => pad.top + ih - ((v - minY) / (maxY - minY)) * ih;

    const makePath = (data) => data.map((v,i) => `${i===0?'M':'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ');
    const upperPath = makePath(upper);
    const lowerPath = makePath(lower);
    const midPath = makePath(middle);
    const pricePath = makePath(price);

    // Fill between bands
    const fillD = upperPath + ' ' + lower.map((v,i) => `L ${toX(n-1-i).toFixed(1)} ${toY(lower[n-1-i]).toFixed(1)}`).join(' ') + ' Z';

    const elems = [];
    elems.push(`<path d="${fillD}" fill="rgba(91,156,246,0.07)"/>`);
    elems.push(`<path d="${upperPath}" fill="none" stroke="#5b9cf6" stroke-width="1" stroke-dasharray="4,3" opacity="0.7"/>`);
    elems.push(`<path d="${lowerPath}" fill="none" stroke="#5b9cf6" stroke-width="1" stroke-dasharray="4,3" opacity="0.7"/>`);
    elems.push(`<path d="${midPath}" fill="none" stroke="#8899b4" stroke-width="1" stroke-dasharray="3,3"/>`);
    elems.push(`<path d="${pricePath}" fill="none" stroke="#f0b429" stroke-width="2" stroke-linejoin="round"/>`);

    elems.push(`<text x="8" y="14" font-size="9" fill="#f0b429" font-family="monospace">Price</text>`);
    elems.push(`<text x="45" y="14" font-size="9" fill="#5b9cf6" font-family="monospace">BB(20,2)</text>`);

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#0c1220;border-radius:4px">${elems.join('')}</svg>`;
  },

  /* Moving Average visual */
  drawMA() {
    const price = [48,50,47,52,55,53,58,62,60,64,68,65,70,72,68,65,60,56,54,58,62,66,70,68,64,60,58,62,66,70];
    const sma20 = price.map((p,i) => {
      if (i < 19) return null;
      return price.slice(i-19, i+1).reduce((a,b)=>a+b,0)/20;
    });
    const ema9 = (() => {
      const k = 2/(9+1);
      let res = [price[0]];
      for (let i = 1; i < price.length; i++) res.push(price[i]*k + res[i-1]*(1-k));
      return res;
    })();

    const w = 360, h = 160, pad = {top:16,bottom:12,left:8,right:8};
    const iw = w-pad.left-pad.right, ih = h-pad.top-pad.bottom;
    const n = price.length;
    const minY = Math.min(...price) - 3, maxY = Math.max(...price) + 3;
    const toX = i => pad.left + (i/(n-1))*iw;
    const toY = v => pad.top + ih - ((v-minY)/(maxY-minY))*ih;
    const makePath = (data) => data.map((v,i) => v === null ? null : `${i===0||data[i-1]===null?'M':'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).filter(Boolean).join(' ');

    const elems = [];
    elems.push(`<path d="${makePath(price.map((v,i)=>({x:i,y:v})).map((_,i)=>price[i]))}" fill="none" stroke="#f0b429" stroke-width="1.5" opacity="0.6"/>`);
    elems.push(`<path d="${makePath(sma20)}" fill="none" stroke="#5b9cf6" stroke-width="2"/>`);
    elems.push(`<path d="${makePath(ema9)}" fill="none" stroke="#ef5350" stroke-width="1.5" stroke-dasharray="4,2"/>`);

    elems.push(`<text x="8" y="14" font-size="9" fill="#f0b429" font-family="monospace">Price</text>`);
    elems.push(`<text x="42" y="14" font-size="9" fill="#5b9cf6" font-family="monospace">SMA(20)</text>`);
    elems.push(`<text x="88" y="14" font-size="9" fill="#ef5350" font-family="monospace">EMA(9)</text>`);

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#0c1220;border-radius:4px">${elems.join('')}</svg>`;
  },
};

/* ──── INDICATOR KNOWLEDGE BASE ──── */
const INDICATORS = {

  rsi: {
    id: 'rsi',
    name: 'RSI — Relative Strength Index',
    shortName: 'RSI',
    category: 'oscillator',
    defaultPeriod: 14,
    description: `RSI (dikembangkan J. Welles Wilder) mengukur kecepatan dan besaran pergerakan harga dalam skala 0-100.
    RSI menunjukkan apakah sebuah aset overbought (terlalu mahal secara teknikal) atau oversold (terlalu murah).`,

    levels: [
      {level: 70, meaning: 'Overbought — potensi koreksi/reversal bearish', color: '#ef5350'},
      {level: 50, meaning: 'Midline — bullish jika di atas, bearish jika di bawah', color: '#8899b4'},
      {level: 30, meaning: 'Oversold — potensi bounce/reversal bullish', color: '#26a69a'},
    ],

    usages: [
      {icon: '🔴', text: '<b>Overbought (RSI > 70):</b> Harga naik terlalu cepat. Bersiap untuk reversal atau koreksi. Cari bearish candlestick pattern di level ini.'},
      {icon: '🟢', text: '<b>Oversold (RSI < 30):</b> Harga turun terlalu cepat. Potensi bounce. Cari bullish candlestick pattern di sini.'},
      {icon: '📊', text: '<b>Divergence Bullish:</b> Harga buat lower low, tapi RSI buat higher low. Sinyal reversal bullish kuat — momentum seller melemah.'},
      {icon: '📉', text: '<b>Divergence Bearish:</b> Harga buat higher high, tapi RSI buat lower high. Sinyal reversal bearish — momentum buyer melemah.'},
      {icon: '🔀', text: '<b>RSI 50 Midline:</b> RSI di atas 50 = bullish bias. Di bawah 50 = bearish bias.'},
    ],

    tips: [
      'RSI terbaik dikombinasikan dengan candlestick pattern — jangan pakai sendiri',
      'Di strong trend, RSI bisa stuck overbought/oversold lama (divergence lebih valid dari OB/OS saja)',
      'RSI period 14 = default. Period lebih kecil (9) = lebih sensitif. Period lebih besar (21) = lebih smooth',
      'Gunakan di timeframe H4 ke atas untuk sinyal lebih reliable',
    ],

    tradingView: 'RSI@tv-basicstudies',
  },

  macd: {
    id: 'macd',
    name: 'MACD — Moving Average Convergence Divergence',
    shortName: 'MACD',
    category: 'momentum',
    defaultPeriod: '12,26,9',
    description: `MACD (dikembangkan Gerald Appel) menunjukkan hubungan antara dua exponential moving average (EMA).
    Terdiri dari: MACD Line, Signal Line, dan Histogram.`,

    components: [
      {name: 'MACD Line', formula: 'EMA(12) − EMA(26)', color: '#5b9cf6', desc: 'Garis utama — selisih antara 2 EMA'},
      {name: 'Signal Line', formula: 'EMA(9) dari MACD', color: '#ef5350', desc: 'Garis rata-rata MACD — trigger sinyal'},
      {name: 'Histogram', formula: 'MACD − Signal', color: '#26a69a', desc: 'Bar yang menunjukkan momentum (tinggi bar = momentum kuat)'},
    ],

    usages: [
      {icon: '✅', text: '<b>MACD Cross Bullish:</b> MACD Line memotong ke atas Signal Line = sinyal BUY (lebih kuat jika terjadi di bawah zero line)'},
      {icon: '❌', text: '<b>MACD Cross Bearish:</b> MACD Line memotong ke bawah Signal Line = sinyal SELL (lebih kuat jika di atas zero line)'},
      {icon: '📊', text: '<b>Zero Line Cross:</b> MACD cross ke atas zero = momentum bullish. Cross ke bawah = momentum bearish.'},
      {icon: '📈', text: '<b>Histogram Divergence:</b> Histogram mengecil (bars semakin kecil) = momentum melemah = potensi reversal'},
      {icon: '🔍', text: '<b>Divergence:</b> Harga higher high tapi MACD lower high = bearish divergence. Harga lower low tapi MACD higher low = bullish divergence.'},
    ],

    tips: [
      'MACD lagging indicator (berbasis MA) — jangan harap sinyal di exact top/bottom',
      'Paling powerful di trending market — kurang efektif di sideways',
      'Gunakan bersama RSI dan candlestick pattern untuk konfirmasi triple',
      'MACD default (12,26,9) bisa disesuaikan: untuk crypto (8,21,5) sering lebih responsif',
    ],

    tradingView: 'MACD@tv-basicstudies',
  },

  bollinger_bands: {
    id: 'bollinger_bands',
    name: 'Bollinger Bands',
    shortName: 'BB',
    category: 'volatility',
    defaultPeriod: '20,2',
    description: `Bollinger Bands (John Bollinger) terdiri dari 3 garis: Middle Band (SMA 20), Upper Band (+2 standar deviasi), Lower Band (−2 standar deviasi).
    Bands melebar ketika volatility tinggi dan menyempit ketika volatility rendah.`,

    components: [
      {name: 'Middle Band', formula: 'SMA(20)', color: '#8899b4', desc: 'Moving average 20 periode — area equilibrium'},
      {name: 'Upper Band', formula: 'SMA(20) + 2×StdDev', color: '#5b9cf6', desc: 'Resistance dinamis — harga "mahal" relatif'},
      {name: 'Lower Band', formula: 'SMA(20) − 2×StdDev', color: '#5b9cf6', desc: 'Support dinamis — harga "murah" relatif'},
    ],

    usages: [
      {icon: '🎯', text: '<b>Touch Upper Band + Bearish Candle:</b> Harga menyentuh upper band dan muncul bearish candlestick (Shooting Star, Bearish Engulfing) = sell signal'},
      {icon: '🎯', text: '<b>Touch Lower Band + Bullish Candle:</b> Harga menyentuh lower band dan muncul bullish candlestick (Hammer, Bullish Engulfing) = buy signal'},
      {icon: '🤏', text: '<b>BB Squeeze:</b> Bands menyempit = volatility sangat rendah = akan segera ada breakout besar (arah tidak pasti)'},
      {icon: '💥', text: '<b>BB Expansion:</b> Bands melebar = trend kuat sedang berlangsung'},
      {icon: '🔄', text: '<b>Mean Reversion:</b> Harga yang terlalu jauh dari middle band cenderung kembali ke SMA 20'},
      {icon: '📊', text: '<b>%B Indicator:</b> Posisi harga relatif terhadap bands — di atas 1 = di atas upper band, di bawah 0 = di bawah lower band'},
    ],

    tips: [
      'BB bukan standalone indicator — selalu gunakan dengan candlestick pattern',
      'BB Squeeze + volume rendah = setup sebelum explosive move',
      'Upper dan Lower Band bukan support/resistance statis — mereka bergerak',
      'Jangan sell hanya karena harga di upper band di strong uptrend — harga bisa "walk the band"',
    ],

    tradingView: 'BB@tv-basicstudies',
  },

  moving_averages: {
    id: 'moving_averages',
    name: 'Moving Averages (SMA, EMA, WMA)',
    shortName: 'MA',
    category: 'trend',
    description: `Moving Average menghaluskan data harga dengan menghitung rata-rata selama periode tertentu.
    Hasilnya adalah garis yang mengikuti trend harga dan mengurangi "noise".`,

    types: [
      {name: 'SMA (Simple MA)', formula: 'Rata-rata aritmetis close N-periode', color: '#5b9cf6',
       desc: 'Sederhana, semua harga diperlakukan sama. Lebih lambat merespons harga baru.'},
      {name: 'EMA (Exponential MA)', formula: 'Memberikan bobot lebih pada harga terbaru', color: '#ef5350',
       desc: 'Lebih responsif dari SMA. Digunakan di MACD. Bagus untuk short-term signal.'},
      {name: 'WMA (Weighted MA)', formula: 'Harga terbaru lebih diprioritaskan (linier)', color: '#f0b429',
       desc: 'Antara SMA dan EMA. Jarang dipakai sendiri.'},
    ],

    keyLevels: [
      {period: 9, label: 'EMA 9', usage: 'Short-term momentum, scalping, intraday'},
      {period: 20, label: 'SMA/EMA 20', usage: 'Short-swing, BB middle band'},
      {period: 50, label: 'SMA 50', usage: 'Medium-term trend — "bull di atas 50, bear di bawah 50"'},
      {period: 100, label: 'SMA 100', usage: 'Medium-long term support/resistance'},
      {period: 200, label: 'SMA 200', usage: 'Long-term trend — paling penting. MA200 = golden/death cross'},
    ],

    usages: [
      {icon: '🏆', text: '<b>Golden Cross:</b> SMA 50 cross ke atas SMA 200 = sinyal bullish jangka panjang (sangat kuat di Weekly chart)'},
      {icon: '💀', text: '<b>Death Cross:</b> SMA 50 cross ke bawah SMA 200 = sinyal bearish jangka panjang'},
      {icon: '🛡️', text: '<b>MA sebagai S/R Dinamis:</b> Harga pullback ke MA kemudian bounce = entry buy opportunity (di uptrend). Sebaliknya untuk downtrend.'},
      {icon: '🎯', text: '<b>MA Confluence:</b> Harga di MA 50 + MA 200 + Fibonacci 61.8% = high-probability entry zone'},
      {icon: '📊', text: '<b>MA Ribbon:</b> Multiple MA menunjukkan trend strength — semakin lebar jarak antar MA = trend semakin kuat'},
    ],

    tips: [
      'MA 200 di Daily adalah yang paling diperhatikan semua trader institusional',
      'Bounce dari MA 200 + Hammer/Bullish Engulfing = setup kelas premium',
      'MA cross signals di Weekly sangat reliable untuk swing/position trading',
      'Gunakan EMA untuk short-term, SMA untuk long-term analysis',
    ],

    tradingView: 'MAExp@tv-basicstudies',
  },

  atr: {
    id: 'atr',
    name: 'ATR — Average True Range',
    shortName: 'ATR',
    category: 'volatility',
    defaultPeriod: 14,
    description: `ATR mengukur volatility pasar — berapa rata-rata range gerak harga per periode.
    ATR bukan indikator arah (tidak menunjukkan bullish/bearish), tapi menunjukkan SEBERAPA JAUH harga biasanya bergerak.`,

    usages: [
      {icon: '🛑', text: '<b>Stop Loss Sizing:</b> Stop Loss = Entry ± 1.5× ATR. Ini menghindari stop yang terlalu sempit (kena noise)'},
      {icon: '📏', text: '<b>Take Profit Sizing:</b> TP = Entry ± 2-3× ATR untuk R:R yang baik'},
      {icon: '🎚️', text: '<b>Trailing Stop:</b> Trailing stop 2× ATR — mengikuti trend tanpa kena whipsaw'},
      {icon: '⚡', text: '<b>Breakout Validity:</b> Breakout valid jika move > 1× ATR. Breakout < 0.5× ATR sering false'},
    ],

    tips: [
      'ATR tinggi = volatility tinggi = gunakan SL lebih lebar',
      'ATR rendah = volatility rendah = hati-hati, breakout bisa explosive',
      'Untuk XAUUSD Daily, ATR biasanya $15-40 — sesuaikan position size',
    ],

    tradingView: 'ATR@tv-basicstudies',
  },
};

/* ──── Indicator Modules ──── */
const INDICATORS_MODULE = {
  id: 'm11_indicators',
  order: 11,
  title: 'Technical Indicators',
  subtitle: 'RSI, MACD, Bollinger Bands, Moving Averages, ATR',
  icon: '📉',
  color: '#5b9cf6',
  tags: [{type: 'neutral', label: 'Tools'}, {type: 'neutral', label: 'Konfirmasi'}],
  xp: 150,
  lessons: [
    {id: 'ind_ma', title: 'Moving Averages (SMA, EMA)', duration: '12 menit', xp: 30, type: 'indicator', indicatorId: 'moving_averages'},
    {id: 'ind_rsi', title: 'RSI — Relative Strength Index', duration: '12 menit', xp: 30, type: 'indicator', indicatorId: 'rsi'},
    {id: 'ind_macd', title: 'MACD — Momentum & Trend', duration: '12 menit', xp: 30, type: 'indicator', indicatorId: 'macd'},
    {id: 'ind_bb', title: 'Bollinger Bands — Volatility', duration: '10 menit', xp: 25, type: 'indicator', indicatorId: 'bollinger_bands'},
    {id: 'ind_atr', title: 'ATR — Sizing Stop Loss', duration: '8 menit', xp: 20, type: 'indicator', indicatorId: 'atr'},
    {id: 'q_indicators', title: 'Quiz: Technical Indicators', duration: '8 menit', xp: 20, type: 'quiz', quizId: 'indicators'},
  ],
};
