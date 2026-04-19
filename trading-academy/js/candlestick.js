/* ======================================
   CANDLESTICK SVG RENDERER
   Draws accurate candlestick patterns
   ====================================== */

const CandlestickRenderer = {
  COLORS: {
    bull: '#26a69a',
    bear: '#ef5350',
    doji: '#8899b4',
    dojiStar: '#f0b429',
    neutral: '#8899b4',
    bullWick: '#26a69a',
    bearWick: '#ef5350',
    gridLine: 'rgba(255,255,255,0.05)',
    bg: '#0c1220',
  },

  /* Draw a pattern given candle data
   * candles: [{o,h,l,c, type?}]  — values in 0-100 price units
   * type: 'bull' | 'bear' | 'doji' | 'dojiStar'
   */
  draw(candles, options = {}) {
    const {
      width = 320,
      height = 180,
      padding = { top: 20, bottom: 20, left: 20, right: 20 },
      showLabels = true,
      labelTexts = [],
    } = options;

    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    // Normalize prices
    let allVals = [];
    candles.forEach(c => allVals.push(c.o, c.h, c.l, c.c));
    let minP = Math.min(...allVals);
    let maxP = Math.max(...allVals);
    const range = maxP - minP || 10;
    // Add 10% buffer
    minP -= range * 0.08;
    maxP += range * 0.08;

    const priceToY = (p) => {
      const normalized = (p - minP) / (maxP - minP);
      return padding.top + innerH - normalized * innerH;
    };

    const n = candles.length;
    const gapRatio = 0.3;
    const candleAreaW = innerW / n;
    const candleW = candleAreaW * (1 - gapRatio);
    const halfW = candleW / 2;

    let svgElems = [];

    // Background grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (innerH / 4) * i;
      svgElems.push(`<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${this.COLORS.gridLine}" stroke-width="1"/>`);
    }

    candles.forEach((c, i) => {
      const cx = padding.left + candleAreaW * i + candleAreaW / 2;
      const type = c.type || (Math.abs(c.c - c.o) < 0.5 ? 'doji' : c.c >= c.o ? 'bull' : 'bear');
      const color = this.COLORS[type] || this.COLORS.bull;

      const yHigh = priceToY(c.h);
      const yLow = priceToY(c.l);
      const yOpen = priceToY(c.o);
      const yClose = priceToY(c.c);

      const bodyTop = Math.min(yOpen, yClose);
      const bodyBottom = Math.max(yOpen, yClose);
      const bodyH = Math.max(bodyBottom - bodyTop, 2);

      // Upper wick
      svgElems.push(`<line x1="${cx}" y1="${yHigh}" x2="${cx}" y2="${bodyTop}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`);
      // Lower wick
      svgElems.push(`<line x1="${cx}" y1="${bodyBottom}" x2="${cx}" y2="${yLow}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`);

      if (type === 'doji' || type === 'dojiStar') {
        // Doji: draw as cross line (no filled body)
        svgElems.push(`<line x1="${cx - halfW}" y1="${(yOpen + yClose) / 2}" x2="${cx + halfW}" y2="${(yOpen + yClose) / 2}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`);
      } else {
        // Normal candle body
        svgElems.push(`<rect x="${cx - halfW}" y="${bodyTop}" width="${candleW}" height="${bodyH}" rx="1.5" fill="${color}" opacity="0.9"/>`);
      }

      // Label
      if (showLabels && labelTexts[i]) {
        svgElems.push(`<text x="${cx}" y="${height - 4}" text-anchor="middle" font-size="9" fill="#526070" font-family="monospace">${labelTexts[i]}</text>`);
      }
    });

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${svgElems.join('')}</svg>`;
  },

  /* Anatomy diagram — shows labeled parts of a candle */
  drawAnatomy() {
    const w = 360, h = 260;
    const cx = 180, bodyTop = 80, bodyBottom = 170, wickTop = 30, wickBottom = 230;
    const bw = 50;

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <!-- Upper wick -->
      <line x1="${cx}" y1="${wickTop}" x2="${cx}" y2="${bodyTop}" stroke="#26a69a" stroke-width="2"/>
      <!-- Lower wick -->
      <line x1="${cx}" y1="${bodyBottom}" x2="${cx}" y2="${wickBottom}" stroke="#26a69a" stroke-width="2"/>
      <!-- Body -->
      <rect x="${cx - bw / 2}" y="${bodyTop}" width="${bw}" height="${bodyBottom - bodyTop}" rx="2" fill="#26a69a" opacity="0.85"/>
      <!-- Label: High -->
      <line x1="${cx + bw / 2 + 5}" y1="${wickTop}" x2="${cx + bw / 2 + 50}" y2="${wickTop}" stroke="#526070" stroke-width="1" stroke-dasharray="3"/>
      <text x="${cx + bw / 2 + 55}" y="${wickTop + 4}" fill="#8899b4" font-size="11" font-family="sans-serif">HIGH</text>
      <!-- Label: Open -->
      <line x1="${cx + bw / 2 + 5}" y1="${bodyTop}" x2="${cx + bw / 2 + 50}" y2="${bodyTop}" stroke="#526070" stroke-width="1" stroke-dasharray="3"/>
      <text x="${cx + bw / 2 + 55}" y="${bodyTop + 4}" fill="#8899b4" font-size="11" font-family="sans-serif">OPEN</text>
      <!-- Body label -->
      <text x="${cx - bw / 2 - 10}" y="${(bodyTop + bodyBottom) / 2 + 4}" fill="#26a69a" font-size="10" font-family="sans-serif" text-anchor="end">BODY</text>
      <!-- Label: Close -->
      <line x1="${cx + bw / 2 + 5}" y1="${bodyBottom}" x2="${cx + bw / 2 + 50}" y2="${bodyBottom}" stroke="#526070" stroke-width="1" stroke-dasharray="3"/>
      <text x="${cx + bw / 2 + 55}" y="${bodyBottom + 4}" fill="#8899b4" font-size="11" font-family="sans-serif">CLOSE</text>
      <!-- Label: Low -->
      <line x1="${cx + bw / 2 + 5}" y1="${wickBottom}" x2="${cx + bw / 2 + 50}" y2="${wickBottom}" stroke="#526070" stroke-width="1" stroke-dasharray="3"/>
      <text x="${cx + bw / 2 + 55}" y="${wickBottom + 4}" fill="#8899b4" font-size="11" font-family="sans-serif">LOW</text>
      <!-- Upper shadow label -->
      <line x1="${cx - bw / 2 - 5}" y1="${wickTop + (bodyTop - wickTop) / 2}" x2="${cx - bw / 2 - 50}" y2="${wickTop + (bodyTop - wickTop) / 2}" stroke="#526070" stroke-width="1" stroke-dasharray="3"/>
      <text x="${cx - bw / 2 - 55}" y="${wickTop + (bodyTop - wickTop) / 2 + 4}" fill="#8899b4" font-size="10" font-family="sans-serif" text-anchor="end">Upper Shadow</text>
      <!-- Lower shadow label -->
      <line x1="${cx - bw / 2 - 5}" y1="${bodyBottom + (wickBottom - bodyBottom) / 2}" x2="${cx - bw / 2 - 50}" y2="${bodyBottom + (wickBottom - bodyBottom) / 2}" stroke="#526070" stroke-width="1" stroke-dasharray="3"/>
      <text x="${cx - bw / 2 - 55}" y="${bodyBottom + (wickBottom - bodyBottom) / 2 + 4}" fill="#8899b4" font-size="10" font-family="sans-serif" text-anchor="end">Lower Shadow</text>
    </svg>`;
  },

  /* Draw comparison: bull vs bear candle side by side */
  drawBullBear() {
    const w = 280, h = 160;
    // Bull candle
    const bullSvg = this.draw(
      [{o: 25, h: 85, l: 15, c: 75, type: 'bull'}],
      {width: 100, height: 160, showLabels: false}
    );
    // Bear candle
    const bearSvg = this.draw(
      [{o: 75, h: 85, l: 15, c: 25, type: 'bear'}],
      {width: 100, height: 160, showLabels: false}
    );

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="${h - 5}" text-anchor="middle" fill="#26a69a" font-size="12" font-weight="bold">Bullish</text>
      <text x="200" y="${h - 5}" text-anchor="middle" fill="#ef5350" font-size="12" font-weight="bold">Bearish</text>
      <image href="data:image/svg+xml;base64,${btoa(bullSvg)}" x="0" y="0" width="150" height="${h - 20}"/>
      <image href="data:image/svg+xml;base64,${btoa(bearSvg)}" x="130" y="0" width="150" height="${h - 20}"/>
    </svg>`;
  },

  /* Render inline for a given pattern key */
  forPattern(patternKey) {
    const data = PATTERN_CANDLES[patternKey];
    if (!data) return '<div style="color:#526070;text-align:center;padding:20px">Pattern visual N/A</div>';
    return this.draw(data.candles, {
      width: 300,
      height: 180,
      showLabels: data.labels !== false,
      labelTexts: data.labelTexts || [],
    });
  },
};

/* ======================================
   PATTERN CANDLE DATA
   All values in 0-100 price units
   ====================================== */
const PATTERN_CANDLES = {

  // ── SINGLE CANDLE BULLISH ──────────────────────────────────────

  hammer: {
    candles: [
      {o: 56, h: 62, l: 10, c: 60, type: 'bull'},
    ],
    labelTexts: ['Hammer'],
  },
  inverted_hammer: {
    candles: [
      {o: 42, h: 90, l: 38, c: 46, type: 'bull'},
    ],
    labelTexts: ['Inv. Hammer'],
  },
  dragonfly_doji: {
    candles: [
      {o: 60, h: 61, l: 10, c: 60, type: 'doji'},
    ],
    labelTexts: ['Dragonfly Doji'],
  },
  bullish_belt_hold: {
    candles: [
      {o: 20, h: 78, l: 18, c: 78, type: 'bull'},
    ],
    labelTexts: ['Belt Hold'],
  },

  // ── SINGLE CANDLE BEARISH ──────────────────────────────────────

  hanging_man: {
    candles: [
      {o: 58, h: 63, l: 10, c: 56, type: 'bear'},
    ],
    labelTexts: ['Hanging Man'],
  },
  shooting_star: {
    candles: [
      {o: 56, h: 92, l: 52, c: 54, type: 'bear'},
    ],
    labelTexts: ['Shooting Star'],
  },
  gravestone_doji: {
    candles: [
      {o: 40, h: 90, l: 39, c: 40, type: 'doji'},
    ],
    labelTexts: ['Gravestone Doji'],
  },
  bearish_belt_hold: {
    candles: [
      {o: 80, h: 82, l: 22, c: 22, type: 'bear'},
    ],
    labelTexts: ['Bearish Belt Hold'],
  },
  northern_doji: {
    candles: [
      {o: 60, h: 85, l: 35, c: 60, type: 'doji'},
    ],
    labelTexts: ['Northern Doji'],
  },
  southern_doji: {
    candles: [
      {o: 40, h: 65, l: 15, c: 40, type: 'doji'},
    ],
    labelTexts: ['Southern Doji'],
  },

  // ── 2-CANDLE BULLISH ──────────────────────────────────────────

  bullish_engulfing: {
    candles: [
      {o: 62, h: 66, l: 50, c: 52, type: 'bear'},
      {o: 48, h: 72, l: 44, c: 70, type: 'bull'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },
  bullish_harami: {
    candles: [
      {o: 70, h: 75, l: 28, c: 30, type: 'bear'},
      {o: 35, h: 55, l: 32, c: 52, type: 'bull'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },
  piercing_line: {
    candles: [
      {o: 70, h: 74, l: 35, c: 36, type: 'bear'},
      {o: 33, h: 67, l: 30, c: 65, type: 'bull'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },
  tweezer_bottom: {
    candles: [
      {o: 60, h: 64, l: 20, c: 45, type: 'bear'},
      {o: 44, h: 62, l: 20, c: 58, type: 'bull'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },
  bullish_homing_pigeon: {
    candles: [
      {o: 70, h: 74, l: 25, c: 27, type: 'bear'},
      {o: 55, h: 60, l: 35, c: 37, type: 'bear'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },

  // ── 2-CANDLE BEARISH ──────────────────────────────────────────

  bearish_engulfing: {
    candles: [
      {o: 38, h: 50, l: 34, c: 48, type: 'bull'},
      {o: 52, h: 56, l: 30, c: 32, type: 'bear'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },
  bearish_harami: {
    candles: [
      {o: 30, h: 72, l: 26, c: 70, type: 'bull'},
      {o: 60, h: 66, l: 44, c: 46, type: 'bear'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },
  dark_cloud_cover: {
    candles: [
      {o: 30, h: 68, l: 26, c: 66, type: 'bull'},
      {o: 70, h: 74, l: 35, c: 36, type: 'bear'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },
  tweezer_top: {
    candles: [
      {o: 40, h: 80, l: 36, c: 56, type: 'bull'},
      {o: 58, h: 80, l: 37, c: 40, type: 'bear'},
    ],
    labelTexts: ['Candle 1', 'Candle 2'],
  },

  // ── 3-CANDLE BULLISH ──────────────────────────────────────────

  morning_star: {
    candles: [
      {o: 70, h: 74, l: 40, c: 42, type: 'bear'},
      {o: 37, h: 44, l: 30, c: 36, type: 'bear'},
      {o: 38, h: 74, l: 34, c: 72, type: 'bull'},
    ],
    labelTexts: ['Bear', 'Star', 'Bull'],
  },
  morning_doji_star: {
    candles: [
      {o: 70, h: 74, l: 40, c: 42, type: 'bear'},
      {o: 37, h: 44, l: 28, c: 37, type: 'doji'},
      {o: 38, h: 74, l: 34, c: 72, type: 'bull'},
    ],
    labelTexts: ['Bear', 'Doji', 'Bull'],
  },
  three_white_soldiers: {
    candles: [
      {o: 20, h: 40, l: 16, c: 38, type: 'bull'},
      {o: 36, h: 58, l: 32, c: 56, type: 'bull'},
      {o: 54, h: 78, l: 50, c: 76, type: 'bull'},
    ],
    labelTexts: ['Candle 1', 'Candle 2', 'Candle 3'],
  },
  bullish_abandoned_baby: {
    candles: [
      {o: 70, h: 74, l: 40, c: 42, type: 'bear'},
      {o: 32, h: 36, l: 26, c: 32, type: 'doji'},
      {o: 42, h: 76, l: 38, c: 74, type: 'bull'},
    ],
    labelTexts: ['Bear', 'Gap Doji', 'Bull'],
  },

  // ── 3-CANDLE BEARISH ──────────────────────────────────────────

  evening_star: {
    candles: [
      {o: 30, h: 60, l: 26, c: 58, type: 'bull'},
      {o: 62, h: 74, l: 60, c: 66, type: 'bull'},
      {o: 64, h: 68, l: 28, c: 30, type: 'bear'},
    ],
    labelTexts: ['Bull', 'Star', 'Bear'],
  },
  evening_doji_star: {
    candles: [
      {o: 30, h: 60, l: 26, c: 58, type: 'bull'},
      {o: 63, h: 74, l: 59, c: 63, type: 'doji'},
      {o: 62, h: 66, l: 26, c: 28, type: 'bear'},
    ],
    labelTexts: ['Bull', 'Doji', 'Bear'],
  },
  three_black_crows: {
    candles: [
      {o: 80, h: 84, l: 62, c: 64, type: 'bear'},
      {o: 62, h: 66, l: 42, c: 44, type: 'bear'},
      {o: 42, h: 46, l: 24, c: 26, type: 'bear'},
    ],
    labelTexts: ['Candle 1', 'Candle 2', 'Candle 3'],
  },
  bearish_abandoned_baby: {
    candles: [
      {o: 30, h: 60, l: 26, c: 58, type: 'bull'},
      {o: 68, h: 74, l: 64, c: 68, type: 'doji'},
      {o: 58, h: 62, l: 24, c: 26, type: 'bear'},
    ],
    labelTexts: ['Bull', 'Gap Doji', 'Bear'],
  },

  // ── CONTEXT CANDLES ───────────────────────────────────────────

  downtrend_context: {
    candles: [
      {o: 80, h: 84, l: 68, c: 70, type: 'bear'},
      {o: 69, h: 73, l: 57, c: 58, type: 'bear'},
      {o: 56, h: 60, l: 44, c: 46, type: 'bear'},
      {o: 45, h: 49, l: 33, c: 35, type: 'bear'},
      {o: 34, h: 36, l: 8, c: 32, type: 'bull'},
    ],
    labelTexts: ['', '', '', '', 'Hammer!'],
  },
  uptrend_context: {
    candles: [
      {o: 20, h: 34, l: 17, c: 32, type: 'bull'},
      {o: 31, h: 45, l: 28, c: 43, type: 'bull'},
      {o: 42, h: 56, l: 39, c: 54, type: 'bull'},
      {o: 53, h: 67, l: 50, c: 65, type: 'bull'},
      {o: 64, h: 95, l: 60, c: 62, type: 'bear'},
    ],
    labelTexts: ['', '', '', '', 'Shooting Star!'],
  },
};
