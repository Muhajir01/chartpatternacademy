/* ======================================
   PAPER TRADING SIMULATOR
   Practice trading candlestick patterns
   with virtual money — risk free
   ====================================== */

const PaperTrade = {
  INITIAL_BALANCE: 10000,

  state: {
    balance: 10000,
    equity: 10000,
    trades: [],
    currentScenario: null,
    scenarioIndex: 0,
    phase: 'setup', // 'setup' | 'result' | 'summary'
    riskPercent: 1,
  },

  /* ──── TRADING SCENARIOS ──── */
  SCENARIOS: [
    {
      id: 'hammer_support',
      title: 'Hammer di MA200 Support',
      symbol: 'XAUUSD',
      timeframe: 'Daily',
      pattern: 'hammer',
      context: 'XAUUSD telah downtrend 8 hari. Harga menyentuh MA200 dan membentuk Hammer. RSI oversold (28). Volume spike.',
      candles: [
        {o:80,h:84,l:68,c:70,type:'bear'},{o:69,h:73,l:57,c:58,type:'bear'},
        {o:56,h:60,l:44,c:46,type:'bear'},{o:45,h:49,l:33,c:35,type:'bear'},
        {o:34,h:37,l:8,c:33,type:'bull'},
      ],
      entryPrice: 1980,
      suggestedSL: 1965,    // below hammer low
      suggestedTP: 2010,    // 2:1 RR
      actualOutcome: 'win',
      outcomePrice: 2010,
      outcomeDesc: 'Hammer dikonfirmasi dengan bullish candle berikutnya. RSI bounce dari oversold. Harga naik 30 pips menuju TP.',
      tags: ['hammer', 'ma200', 'oversold'],
      difficulty: 1,
    },
    {
      id: 'bearish_engulfing_ath',
      title: 'Bearish Engulfing di All-Time High',
      symbol: 'XAUUSD',
      timeframe: 'Daily',
      pattern: 'bearish_engulfing',
      context: 'XAUUSD rally 12 hari ke all-time high 2265. Muncul Bearish Engulfing besar. RSI overbought (78). Volume tinggi.',
      candles: [
        {o:20,h:34,l:17,c:32,type:'bull'},{o:31,h:45,l:28,c:43,type:'bull'},
        {o:42,h:56,l:39,c:54,type:'bull'},{o:45,h:58,l:40,c:48,type:'bull'},
        {o:52,h:56,l:30,c:32,type:'bear'},
      ],
      entryPrice: 2265,
      suggestedSL: 2280,
      suggestedTP: 2235,
      actualOutcome: 'win',
      outcomePrice: 2235,
      outcomeDesc: 'Bearish Engulfing di ATH dengan RSI divergence bearish. Harga turun 30 pips ke TP dalam 3 sesi.',
      tags: ['bearish_engulfing', 'ath', 'overbought'],
      difficulty: 1,
    },
    {
      id: 'morning_star_fib',
      title: 'Morning Star di Fibonacci 61.8%',
      symbol: 'XAUUSD',
      timeframe: '4H',
      pattern: 'morning_star',
      context: 'XAUUSD koreksi dari 2150 ke 2085 (Fib 61.8% dari swing 1980-2150). Morning Star terbentuk di 2085. RSI: 32. Support level kuat.',
      candles: [
        {o:70,h:74,l:50,c:52,type:'bear'},{o:51,h:55,l:35,c:37,type:'bear'},
        {o:36,h:38,l:28,c:33,type:'doji'},{o:34,h:68,l:30,c:66,type:'bull'},
        {o:65,h:78,l:61,c:76,type:'bull'},
      ],
      entryPrice: 2090,
      suggestedSL: 2075,
      suggestedTP: 2120,
      actualOutcome: 'win',
      outcomePrice: 2120,
      outcomeDesc: 'Morning Star + Fibonacci 61.8% = setup premium. Harga bounce kuat. Candle konfirmasi besar. TP tercapai.',
      tags: ['morning_star', 'fibonacci', 'oversold'],
      difficulty: 2,
    },
    {
      id: 'false_signal_harami',
      title: 'Bullish Harami — False Signal!',
      symbol: 'XAUUSD',
      timeframe: 'Daily',
      pattern: 'bullish_harami',
      context: 'XAUUSD di downtrend kuat. Muncul Bullish Harami tanpa konfirmasi lain. RSI di 42 (belum oversold). Tidak ada support jelas.',
      candles: [
        {o:70,h:74,l:28,c:30,type:'bear'},{o:35,h:55,l:32,c:52,type:'bull'},
        {o:50,h:54,l:30,c:32,type:'bear'},{o:31,h:35,l:15,c:17,type:'bear'},
      ],
      entryPrice: 2100,
      suggestedSL: 2085,
      suggestedTP: 2130,
      actualOutcome: 'loss',
      outcomePrice: 2085,
      outcomeDesc: 'Harami tanpa konfirmasi di downtrend kuat = false signal. RSI belum oversold. Tidak ada support. Harga lanjut turun dan hit SL. Pelajaran: Harami SELALU perlu konfirmasi!',
      tags: ['harami', 'false_signal', 'lesson'],
      difficulty: 2,
    },
    {
      id: 'shooting_star_resistance',
      title: 'Shooting Star di Resistance Psikologis',
      symbol: 'XAUUSD',
      timeframe: 'Daily',
      pattern: 'shooting_star',
      context: 'XAUUSD rally ke 2100 (round number resistance). Shooting Star terbentuk. RSI: 72 (overbought). Resistance sebelumnya di 2100.',
      candles: [
        {o:20,h:34,l:17,c:32,type:'bull'},{o:31,h:45,l:28,c:43,type:'bull'},
        {o:42,h:56,l:39,c:54,type:'bull'},{o:53,h:67,l:50,c:65,type:'bull'},
        {o:64,h:95,l:60,c:62,type:'bear'},
      ],
      entryPrice: 2100,
      suggestedSL: 2115,
      suggestedTP: 2070,
      actualOutcome: 'win',
      outcomePrice: 2070,
      outcomeDesc: 'Shooting Star + round number resistance + RSI overbought = perfect bearish setup. TP 2070 tercapai.',
      tags: ['shooting_star', 'round_number', 'overbought'],
      difficulty: 1,
    },
    {
      id: 'double_top_breakdown',
      title: 'Double Top Breakdown',
      symbol: 'XAUUSD',
      timeframe: 'Daily',
      pattern: 'double_top',
      context: 'XAUUSD membentuk Double Top di 2200. Volume puncak 2 lebih rendah dari puncak 1. RSI bearish divergence. Breakdown neckline di 2175.',
      candles: [
        {o:30,h:55,l:26,c:53,type:'bull'},{o:52,h:72,l:48,c:70,type:'bull'},
        {o:68,h:72,l:46,c:48,type:'bear'},{o:47,h:68,l:43,c:66,type:'bull'},
        {o:65,h:72,l:35,c:37,type:'bear'},
      ],
      entryPrice: 2175,
      suggestedSL: 2200,
      suggestedTP: 2150,
      actualOutcome: 'win',
      outcomePrice: 2150,
      outcomeDesc: 'Double Top breakdown + bearish divergence RSI = setup klasik. Harga turun ke target measured move.',
      tags: ['double_top', 'chart_pattern', 'divergence'],
      difficulty: 2,
    },
    {
      id: 'engulfing_without_context',
      title: 'Bullish Engulfing — Sideway Trap!',
      symbol: 'XAUUSD',
      timeframe: 'H4',
      pattern: 'bullish_engulfing',
      context: 'XAUUSD sideways 5 hari tanpa trend jelas. Muncul Bullish Engulfing besar di tengah range. Tidak ada support/resistance jelas.',
      candles: [
        {o:50,h:60,l:42,c:55,type:'bull'},{o:54,h:58,l:40,c:42,type:'bear'},
        {o:41,h:52,l:36,c:50,type:'bull'},{o:48,h:55,l:32,c:34,type:'bear'},
        {o:33,h:56,l:29,c:54,type:'bull'},
      ],
      entryPrice: 2050,
      suggestedSL: 2035,
      suggestedTP: 2080,
      actualOutcome: 'breakeven',
      outcomePrice: 2050,
      outcomeDesc: 'Bullish Engulfing di sideways = tidak reliable. Harga bergerak random, akhirnya kembali ke entry. Pelajaran: pattern reversal butuh trend yang jelas sebelumnya!',
      tags: ['engulfing', 'sideways', 'lesson'],
      difficulty: 3,
    },
    {
      id: 'three_white_soldiers_breakout',
      title: 'Three White Soldiers + Breakout',
      symbol: 'AAPL',
      timeframe: 'Daily',
      pattern: 'three_white_soldiers',
      context: 'AAPL setelah earnings positif. Three White Soldiers terbentuk di atas resistance $185 (breakout). Volume 3x rata-rata.',
      candles: [
        {o:20,h:40,l:16,c:38,type:'bull'},{o:36,h:58,l:32,c:56,type:'bull'},
        {o:54,h:78,l:50,c:76,type:'bull'},
      ],
      entryPrice: 186,
      suggestedSL: 182,
      suggestedTP: 194,
      actualOutcome: 'win',
      outcomePrice: 194,
      outcomeDesc: 'Three White Soldiers + breakout resistance + volume tinggi = konfirmasi kuat. AAPL naik ke $194 dalam 4 hari.',
      tags: ['three_white_soldiers', 'breakout', 'volume'],
      difficulty: 2,
    },
  ],

  /* ──── VIEWS ──── */
  renderDashboard() {
    const s = this.state;
    const totalTrades = s.trades.length;
    const wins = s.trades.filter(t => t.outcome === 'win').length;
    const losses = s.trades.filter(t => t.outcome === 'loss').length;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
    const pnl = s.equity - this.INITIAL_BALANCE;
    const pnlColor = pnl >= 0 ? 'var(--green)' : 'var(--red)';

    const scenarioCards = this.SCENARIOS.map((sc, idx) => {
      const played = s.trades.find(t => t.scenarioId === sc.id);
      const diffStars = '⭐'.repeat(sc.difficulty);
      return `
        <div class="lesson-item ${played ? 'completed-lesson' : ''}" onclick="PaperTrade.startScenario(${idx})">
          <div class="lesson-num" style="${played ? 'background:var(--green-bg);color:var(--green)' : ''}">${played ? '✓' : idx + 1}</div>
          <div class="lesson-item-info">
            <h4>${sc.title}</h4>
            <p>${sc.symbol} · ${sc.timeframe} · ${diffStars} · Pola: ${sc.pattern.replace('_',' ')}</p>
          </div>
          <div class="lesson-item-meta">
            ${played ? `<span style="font-size:12px;font-weight:700;color:${played.outcome==='win'?'var(--green)':played.outcome==='loss'?'var(--red)':'var(--gold)'}">
              ${played.outcome==='win'?'✅ WIN':played.outcome==='loss'?'❌ LOSS':'〰️ BE'}
            </span>` : '<span class="lesson-xp">Play</span>'}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="animate-in">
        <div style="margin-bottom:16px">
          <a href="#/" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← Dashboard</a>
        </div>

        <div class="welcome-banner" style="padding:24px 28px;margin-bottom:24px">
          <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
            <div style="flex:1">
              <h1 style="font-size:22px">💹 Paper Trading Simulator</h1>
              <p style="margin-top:4px">Latihan trading pola candlestick dengan uang virtual — belajar dari win DAN loss tanpa risiko nyata.</p>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <div class="stat-pill" style="min-width:90px">
                <span class="value" style="color:${pnlColor}">${pnl >= 0 ? '+' : ''}$${pnl.toFixed(0)}</span>
                <span class="label">P&L</span>
              </div>
              <div class="stat-pill" style="min-width:90px">
                <span class="value">${winRate}%</span>
                <span class="label">Win Rate</span>
              </div>
              <div class="stat-pill" style="min-width:90px">
                <span class="value">${wins}W/${losses}L</span>
                <span class="label">Record</span>
              </div>
            </div>
          </div>
        </div>

        <h2 class="section-title">📋 Skenario Trading</h2>
        <div class="lesson-list">${scenarioCards}</div>

        ${totalTrades > 0 ? `
          <div style="margin-top:24px">
            <h2 class="section-title">📊 Riwayat Trade</h2>
            ${this.renderTradeHistory()}
          </div>
        ` : ''}

        ${totalTrades > 0 ? `
          <div style="margin-top:16px;display:flex;gap:10px">
            <button class="btn btn-ghost" onclick="if(confirm('Reset semua trade?')){PaperTrade.state.trades=[];PaperTrade.state.equity=PaperTrade.INITIAL_BALANCE;PaperTrade.renderDashboard();Router.handle();}">Reset Trade History</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  renderTradeHistory() {
    return `<div class="lesson-list">
      ${this.state.trades.slice(-5).reverse().map(t => {
        const oc = t.outcome === 'win' ? 'var(--green)' : t.outcome === 'loss' ? 'var(--red)' : 'var(--gold)';
        return `<div class="lesson-item" style="border-left:3px solid ${oc}">
          <div style="font-size:20px">${t.outcome==='win'?'✅':t.outcome==='loss'?'❌':'〰️'}</div>
          <div class="lesson-item-info">
            <h4>${t.title}</h4>
            <p>Entry: $${t.entry} · SL: $${t.sl} · TP: $${t.tp} · Pattern: ${t.pattern}</p>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700;color:${oc}">${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(0)}</div>
            <div style="font-size:11px;color:var(--text-muted)">${t.rr} R:R</div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },

  startScenario(idx) {
    const sc = this.SCENARIOS[idx];
    this.state.currentScenario = sc;
    this.state.scenarioIndex = idx;
    this.state.phase = 'setup';
    document.getElementById('page-content').innerHTML = this.renderSetupPhase(sc);
  },

  renderSetupPhase(sc) {
    const balance = this.state.equity;
    const riskAmount = balance * (this.state.riskPercent / 100);
    const priceDiff = Math.abs(sc.entryPrice - sc.suggestedSL);
    const suggestedSize = priceDiff > 0 ? (riskAmount / priceDiff).toFixed(2) : '1.00';
    const suggestedRR = Math.abs(sc.suggestedTP - sc.entryPrice) / Math.abs(sc.entryPrice - sc.suggestedSL);
    const diffStars = '⭐'.repeat(sc.difficulty);
    const dir = sc.suggestedTP > sc.entryPrice ? 'LONG (BUY)' : 'SHORT (SELL)';
    const dirColor = sc.suggestedTP > sc.entryPrice ? 'var(--green)' : 'var(--red)';

    return `
      <div class="animate-in">
        <div style="margin-bottom:16px">
          <a href="#/paper-trade" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← Paper Trade</a>
        </div>

        <div class="lesson-layout">
          <div class="lesson-main">
            <div class="pattern-header">
              <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                  <h1>${sc.title}</h1>
                  <div class="pattern-subtitle">${sc.symbol} · ${sc.timeframe} · ${diffStars}</div>
                </div>
                <span class="pattern-signal-badge ${sc.suggestedTP > sc.entryPrice ? 'bullish' : 'bearish'}">${dir}</span>
              </div>
            </div>

            <!-- Context -->
            <div class="lesson-card">
              <div class="lesson-card-title">📋 Setup Context</div>
              <div class="lesson-text"><p>${sc.context}</p></div>
            </div>

            <!-- Chart -->
            <div class="lesson-card">
              <div class="lesson-card-title">🕯️ Chart (${sc.timeframe})</div>
              <div style="background:#0c1220;border:1px solid var(--border);border-radius:var(--radius);padding:20px;display:flex;justify-content:center">
                ${CandlestickRenderer.draw(sc.candles, {width: 320, height: 200, showLabels: false})}
              </div>
            </div>

            <!-- Trade Setup -->
            <div class="lesson-card">
              <div class="lesson-card-title">🎯 Isi Setup Trade Kamu</div>

              <div class="signal-box ${sc.suggestedTP > sc.entryPrice ? 'bullish' : 'bearish'}" style="margin-bottom:16px">
                <div class="signal-rows">
                  <div class="signal-row"><span class="key">Arah:</span><span class="val" style="color:${dirColor};font-weight:700">${dir}</span></div>
                  <div class="signal-row"><span class="key">Entry Price:</span><span class="val">$${sc.entryPrice}</span></div>
                  <div class="signal-row" style="color:var(--text-muted);font-size:12px"><span class="key">Saran SL:</span><span class="val">$${sc.suggestedSL}</span></div>
                  <div class="signal-row" style="color:var(--text-muted);font-size:12px"><span class="key">Saran TP:</span><span class="val">$${sc.suggestedTP} (R:R ${suggestedRR.toFixed(1)})</span></div>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
                <div>
                  <label style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:6px">Stop Loss ($)</label>
                  <input type="number" id="pt-sl" value="${sc.suggestedSL}" step="5"
                    style="width:100%;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;color:var(--text-primary);font-size:14px">
                </div>
                <div>
                  <label style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:6px">Take Profit ($)</label>
                  <input type="number" id="pt-tp" value="${sc.suggestedTP}" step="5"
                    style="width:100%;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;color:var(--text-primary);font-size:14px">
                </div>
              </div>

              <div style="margin-bottom:16px">
                <label style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:6px">Risk per Trade: <span id="pt-risk-label">${this.state.riskPercent}%</span> = $<span id="pt-risk-amt">${riskAmount.toFixed(0)}</span></label>
                <input type="range" id="pt-risk" min="0.5" max="5" step="0.5" value="${this.state.riskPercent}" oninput="PaperTrade.updateRisk(this.value)"
                  style="width:100%;accent-color:var(--blue)">
              </div>

              <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px;font-size:13px;margin-bottom:16px">
                <div style="display:flex;justify-content:space-between;color:var(--text-secondary)">
                  <span>Balance: <b style="color:var(--text-primary)">$${balance.toFixed(0)}</b></span>
                  <span>Risk: <b style="color:var(--red)">$${riskAmount.toFixed(0)}</b></span>
                  <span>R:R: <b id="pt-rr-display" style="color:var(--gold)">${suggestedRR.toFixed(1)}:1</b></span>
                </div>
              </div>

              <button class="btn btn-${sc.suggestedTP > sc.entryPrice ? 'success' : 'primary'} btn-large" style="width:100%" onclick="PaperTrade.executeTrade()">
                ${sc.suggestedTP > sc.entryPrice ? '📈 Eksekusi LONG (BUY)' : '📉 Eksekusi SHORT (SELL)'}
              </button>
            </div>
          </div>

          <!-- Sidebar hints -->
          <div class="lesson-sidebar-card">
            <div class="pattern-visual-card">
              <div class="card-title">💡 Pertanyaan Panduan</div>
              <ul class="rules-list" style="font-size:12px">
                <li><span class="rule-icon">🔍</span><span>Apakah ada downtrend/uptrend jelas sebelum pattern?</span></li>
                <li><span class="rule-icon">📊</span><span>Apakah ada support/resistance di level entry?</span></li>
                <li><span class="rule-icon">📈</span><span>RSI di overbought/oversold?</span></li>
                <li><span class="rule-icon">🎯</span><span>R:R minimal 1:2?</span></li>
                <li><span class="rule-icon">✅</span><span>Ada konfirmasi candle berikutnya?</span></li>
              </ul>
            </div>

            <div class="pattern-visual-card">
              <div class="card-title">📋 Pattern Tags</div>
              <div class="module-tags">${sc.tags.map(t=>`<span class="tag neutral">${t}</span>`).join('')}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updateRisk(val) {
    this.state.riskPercent = parseFloat(val);
    const riskAmt = this.state.equity * (this.state.riskPercent / 100);
    document.getElementById('pt-risk-label').textContent = val + '%';
    document.getElementById('pt-risk-amt').textContent = riskAmt.toFixed(0);
    this.updateRRDisplay();
  },

  updateRRDisplay() {
    const sc = this.state.currentScenario;
    if (!sc) return;
    const sl = parseFloat(document.getElementById('pt-sl')?.value || sc.suggestedSL);
    const tp = parseFloat(document.getElementById('pt-tp')?.value || sc.suggestedTP);
    const rr = Math.abs(tp - sc.entryPrice) / Math.abs(sc.entryPrice - sl);
    const el = document.getElementById('pt-rr-display');
    if (el) el.textContent = rr.toFixed(1) + ':1';
  },

  executeTrade() {
    const sc = this.state.currentScenario;
    const sl = parseFloat(document.getElementById('pt-sl').value);
    const tp = parseFloat(document.getElementById('pt-tp').value);
    const riskAmt = this.state.equity * (this.state.riskPercent / 100);
    const slPips = Math.abs(sc.entryPrice - sl);
    const tpPips = Math.abs(sc.suggestedTP - sc.entryPrice); // use designed TP for outcome
    const rr = (Math.abs(tp - sc.entryPrice) / slPips).toFixed(1);

    let pnl = 0;
    let outcome = sc.actualOutcome;

    if (outcome === 'win') {
      pnl = riskAmt * (tpPips / slPips);
    } else if (outcome === 'loss') {
      pnl = -riskAmt;
    } else {
      pnl = 0;
    }

    this.state.equity += pnl;

    const trade = {
      scenarioId: sc.id,
      title: sc.title,
      pattern: sc.pattern,
      entry: sc.entryPrice,
      sl, tp,
      riskAmt,
      pnl,
      outcome,
      rr: rr + ':1',
      timestamp: Date.now(),
    };
    this.state.trades.push(trade);
    this.state.phase = 'result';

    document.getElementById('page-content').innerHTML = this.renderResultPhase(sc, trade);
  },

  renderResultPhase(sc, trade) {
    const isWin = trade.outcome === 'win';
    const isBE = trade.outcome === 'breakeven';
    const pnlColor = isWin ? 'var(--green)' : isBE ? 'var(--gold)' : 'var(--red)';
    const emoji = isWin ? '🎉' : isBE ? '〰️' : '😤';

    const nextIdx = this.state.scenarioIndex + 1;
    const hasNext = nextIdx < this.SCENARIOS.length;

    return `
      <div class="animate-in" style="max-width:700px;margin:0 auto">
        <div class="quiz-result-card" style="margin-bottom:20px">
          <div style="font-size:52px;margin-bottom:12px">${emoji}</div>
          <div class="result-grade" style="color:${pnlColor}">
            ${isWin ? 'PROFIT!' : isBE ? 'Break Even' : 'LOSS — Belajar!'}
          </div>
          <div style="font-size:28px;font-weight:700;color:${pnlColor};margin:8px 0">
            ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(0)}
          </div>
          <div class="result-message">${sc.outcomeDesc}</div>

          <div class="result-stats">
            <div class="result-stat"><span class="val">$${sc.entryPrice}</span><span class="lbl">Entry</span></div>
            <div class="result-stat"><span class="val text-red">$${trade.sl}</span><span class="lbl">Stop Loss</span></div>
            <div class="result-stat"><span class="val text-green">$${sc.outcomePrice}</span><span class="lbl">Outcome</span></div>
            <div class="result-stat"><span class="val text-gold">${trade.rr}</span><span class="lbl">R:R</span></div>
          </div>

          <!-- Lesson box -->
          <div class="highlight-box ${isWin ? 'info' : 'warning'}" style="text-align:left;margin:16px 0">
            <div class="hb-icon">${isWin ? '💡' : '⚠️'}</div>
            <div>
              <b>Lesson:</b> ${isWin
                ? 'Setup ini valid karena: context trend jelas + konfirmasi pattern + support/resistance confluence. Ingat kombinasi ini!'
                : isBE ? 'Market sideways = candlestick pattern tidak reliable. Selalu cek trend sebelum entry!'
                : 'False signal terjadi saat pattern muncul tanpa context yang tepat. Konfirmasi adalah kunci!'}
            </div>
          </div>

          <div style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">
            Balance baru: <b style="color:var(--text-primary)">$${this.state.equity.toFixed(0)}</b>
          </div>

          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-ghost" onclick="Router.go('/paper-trade')">← Semua Skenario</button>
            ${hasNext ? `<button class="btn btn-primary" onclick="PaperTrade.startScenario(${nextIdx})">Skenario Berikutnya →</button>` : ''}
          </div>
        </div>
      </div>
    `;
  },
};

/* Module entry */
const PAPER_TRADE_MODULE = {
  id: 'm14_paper_trade',
  order: 14,
  title: 'Paper Trading Simulator 💹',
  subtitle: '8 skenario trading nyata — latihan entry, SL, TP dengan uang virtual',
  icon: '💹',
  color: '#26a69a',
  tags: [{type: 'bullish', label: 'Simulator'}, {type: 'neutral', label: 'Praktik'}],
  xp: 200,
  lessons: [
    {id: 'paper_trade_sim', title: 'Buka Simulator Trading', duration: '~20 menit', xp: 0, type: 'paper_trade'},
  ],
};
