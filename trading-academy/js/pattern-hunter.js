/* ======================================
   PATTERN HUNTER — Interactive Game
   Identify candlestick patterns in context
   ====================================== */

const PatternHunter = {
  state: {
    active: false,
    score: 0,
    streak: 0,
    bestStreak: 0,
    round: 0,
    totalRounds: 10,
    timeLeft: 20,
    timer: null,
    currentChallenge: null,
    answered: false,
    results: [],
  },

  /* Pool of challenges: {candles, answer, options, context, hint} */
  CHALLENGES: [
    {
      candles: PATTERN_CANDLES?.hammer?.candles || [{o:56,h:62,l:10,c:60,type:'bull'}],
      answer: 'Hammer',
      options: ['Hammer', 'Shooting Star', 'Doji', 'Hanging Man'],
      context: 'Setelah downtrend 5 candle',
      hint: 'Body kecil di atas, ekor bawah panjang',
      signal: 'bullish',
    },
    {
      candles: PATTERN_CANDLES?.shooting_star?.candles || [{o:56,h:92,l:52,c:54,type:'bear'}],
      answer: 'Shooting Star',
      options: ['Inverted Hammer', 'Shooting Star', 'Gravestone Doji', 'Hanging Man'],
      context: 'Di puncak uptrend',
      hint: 'Body kecil di bawah, ekor atas panjang, di uptrend',
      signal: 'bearish',
    },
    {
      candles: PATTERN_CANDLES?.bullish_engulfing?.candles || [],
      answer: 'Bullish Engulfing',
      options: ['Bullish Engulfing', 'Bullish Harami', 'Piercing Line', 'Tweezer Bottom'],
      context: 'Di support setelah downtrend',
      hint: 'Candle hijau besar menelan penuh candle merah sebelumnya',
      signal: 'bullish',
    },
    {
      candles: PATTERN_CANDLES?.bearish_engulfing?.candles || [],
      answer: 'Bearish Engulfing',
      options: ['Dark Cloud Cover', 'Bearish Engulfing', 'Bearish Harami', 'Shooting Star'],
      context: 'Di resistance setelah uptrend',
      hint: 'Candle merah besar menelan candle hijau sebelumnya',
      signal: 'bearish',
    },
    {
      candles: PATTERN_CANDLES?.morning_star?.candles || [],
      answer: 'Morning Star',
      options: ['Evening Star', 'Morning Star', 'Three White Soldiers', 'Morning Doji Star'],
      context: 'Di bottom downtrend',
      hint: '3 candle: merah panjang → bintang kecil → hijau panjang',
      signal: 'bullish',
    },
    {
      candles: PATTERN_CANDLES?.evening_star?.candles || [],
      answer: 'Evening Star',
      options: ['Morning Star', 'Evening Star', 'Three Black Crows', 'Evening Doji Star'],
      context: 'Di puncak uptrend',
      hint: '3 candle: hijau panjang → bintang kecil → merah panjang',
      signal: 'bearish',
    },
    {
      candles: PATTERN_CANDLES?.dragonfly_doji?.candles || [],
      answer: 'Dragonfly Doji',
      options: ['Hammer', 'Dragonfly Doji', 'Southern Doji', 'Long-legged Doji'],
      context: 'Di support setelah turun',
      hint: 'Open = Close = High, ekor bawah sangat panjang',
      signal: 'bullish',
    },
    {
      candles: PATTERN_CANDLES?.gravestone_doji?.candles || [],
      answer: 'Gravestone Doji',
      options: ['Shooting Star', 'Gravestone Doji', 'Northern Doji', 'Inverted Hammer'],
      context: 'Di resistance',
      hint: 'Open = Close = Low, ekor atas sangat panjang',
      signal: 'bearish',
    },
    {
      candles: PATTERN_CANDLES?.three_white_soldiers?.candles || [],
      answer: 'Three White Soldiers',
      options: ['Three White Soldiers', 'Morning Star', 'Three Line Strike', 'Bullish Marubozu'],
      context: 'Setelah bottom reversal',
      hint: '3 candle hijau panjang berturut-turut, close makin tinggi',
      signal: 'bullish',
    },
    {
      candles: PATTERN_CANDLES?.three_black_crows?.candles || [],
      answer: 'Three Black Crows',
      options: ['Three Black Crows', 'Evening Star', 'Three Line Strike', 'Bearish Marubozu'],
      context: 'Di puncak uptrend',
      hint: '3 candle merah panjang berturut, close makin rendah',
      signal: 'bearish',
    },
    {
      candles: PATTERN_CANDLES?.bullish_harami?.candles || [],
      answer: 'Bullish Harami',
      options: ['Bullish Engulfing', 'Bullish Harami', 'Piercing Line', 'Tweezer Bottom'],
      context: 'Di bottom downtrend',
      hint: 'Candle hijau kecil DALAM body candle merah besar',
      signal: 'bullish',
    },
    {
      candles: PATTERN_CANDLES?.dark_cloud_cover?.candles || [],
      answer: 'Dark Cloud Cover',
      options: ['Bearish Engulfing', 'Dark Cloud Cover', 'Bearish Harami', 'Tweezer Top'],
      context: 'Di puncak uptrend',
      hint: 'C2 open gap up, tapi close menembus > 50% body C1 ke bawah',
      signal: 'bearish',
    },
    {
      candles: PATTERN_CANDLES?.tweezer_bottom?.candles || [],
      answer: 'Tweezer Bottom',
      options: ['Double Bottom', 'Tweezer Bottom', 'Bullish Harami', 'Piercing Line'],
      context: 'Di support level',
      hint: '2 candle dengan low yang identik di support',
      signal: 'bullish',
    },
    {
      candles: PATTERN_CANDLES?.piercing_line?.candles || [],
      answer: 'Piercing Line',
      options: ['Bullish Engulfing', 'Bullish Harami', 'Piercing Line', 'Morning Star'],
      context: 'Setelah downtrend',
      hint: 'C2 bullish menembus > 50% body C1 merah (bukan full engulf)',
      signal: 'bullish',
    },
    {
      candles: PATTERN_CANDLES?.hanging_man?.candles || [],
      answer: 'Hanging Man',
      options: ['Hammer', 'Hanging Man', 'Shooting Star', 'Inverted Hammer'],
      context: 'Di puncak uptrend',
      hint: 'Bentuk seperti Hammer tapi di puncak uptrend',
      signal: 'bearish',
    },
  ],

  getRandomChallenges(count = 10) {
    const shuffled = [...this.CHALLENGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  start() {
    const s = this.state;
    s.active = true;
    s.score = 0;
    s.streak = 0;
    s.bestStreak = 0;
    s.round = 0;
    s.results = [];
    s.challenges = this.getRandomChallenges(s.totalRounds);
    s.answered = false;
    s.currentChallenge = null;
    this.nextRound();
  },

  nextRound() {
    const s = this.state;
    if (s.round >= s.totalRounds || s.round >= s.challenges.length) {
      this.end();
      return;
    }
    s.currentChallenge = s.challenges[s.round];
    s.answered = false;
    s.timeLeft = 20;
    this.renderRound();
    this.startTimer();
  },

  startTimer() {
    clearInterval(this.state.timer);
    this.state.timer = setInterval(() => {
      this.state.timeLeft -= 1;
      const el = document.getElementById('ph-timer');
      if (el) {
        el.textContent = this.state.timeLeft;
        el.style.color = this.state.timeLeft <= 5 ? 'var(--red)' : 'var(--text-primary)';
      }
      if (this.state.timeLeft <= 0) {
        clearInterval(this.state.timer);
        this.answer(null); // timeout = wrong
      }
    }, 1000);
  },

  answer(chosen) {
    const s = this.state;
    if (s.answered) return;
    s.answered = true;
    clearInterval(s.timer);

    const correct = s.currentChallenge.answer;
    const isCorrect = chosen === correct;

    if (isCorrect) {
      const timeBonus = Math.ceil(s.timeLeft / 4);
      s.score += 10 + timeBonus;
      s.streak += 1;
      if (s.streak > s.bestStreak) s.bestStreak = s.streak;
    } else {
      s.streak = 0;
    }

    s.results.push({challenge: s.currentChallenge, chosen, isCorrect});
    this.showAnswer(chosen, correct, isCorrect);
  },

  showAnswer(chosen, correct, isCorrect) {
    // Highlight options
    document.querySelectorAll('.ph-option').forEach(el => {
      el.classList.add('disabled');
      if (el.dataset.ans === correct) el.classList.add('correct');
      if (el.dataset.ans === chosen && !isCorrect) el.classList.add('wrong');
    });

    // Show feedback
    const fb = document.getElementById('ph-feedback');
    if (fb) {
      fb.style.display = 'flex';
      fb.innerHTML = `
        <span style="font-size:22px">${isCorrect ? '✅' : '❌'}</span>
        <div>
          <b style="color:${isCorrect ? 'var(--green)' : 'var(--red)'}">${isCorrect ? 'Benar! +' + (10 + Math.ceil(this.state.timeLeft / 4)) + ' poin' : 'Salah!'}</b>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">
            ${!isCorrect ? `<b>Jawaban:</b> ${correct} · ` : ''}Hint: ${this.state.currentChallenge.hint}
          </div>
        </div>
      `;
    }

    const nextBtn = document.getElementById('ph-next');
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  },

  nextChallenge() {
    this.state.round += 1;
    this.nextRound();
  },

  end() {
    this.state.active = false;
    clearInterval(this.state.timer);
    const s = this.state;
    const correct = s.results.filter(r => r.isCorrect).length;
    const percent = Math.round((correct / s.totalRounds) * 100);

    // Save best score to progress
    Progress.saveQuizScore('pattern_hunter', correct, s.totalRounds, 50);

    document.getElementById('page-content').innerHTML = this.renderResults(s.score, correct, s.bestStreak, percent);
  },

  renderRound() {
    const s = this.state;
    const ch = s.currentChallenge;
    const letters = ['A', 'B', 'C', 'D'];
    // Shuffle options
    const shuffledOpts = [...ch.options].sort(() => Math.random() - 0.5);

    const optHtml = shuffledOpts.map((opt, i) => `
      <div class="ph-option quiz-option" data-ans="${opt}" onclick="PatternHunter.answer('${opt}')">
        <div class="opt-letter">${letters[i]}</div>
        <div>${opt}</div>
      </div>
    `).join('');

    document.getElementById('page-content').innerHTML = `
      <div class="animate-in quiz-container">
        <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
          <a href="#/pattern-hunter" style="color:var(--text-secondary);text-decoration:none;font-size:13px" onclick="PatternHunter.state.active=false;clearInterval(PatternHunter.state.timer)">✕ Keluar</a>
          <div style="display:flex;gap:16px;align-items:center">
            <span style="font-size:13px;color:var(--text-secondary)">Ronde ${s.round+1}/${s.totalRounds}</span>
            <span style="font-size:13px;color:var(--gold);font-weight:700">🏆 ${s.score} poin</span>
            ${s.streak > 1 ? `<span style="font-size:13px;color:var(--green);font-weight:700">🔥 ${s.streak}x streak</span>` : ''}
          </div>
        </div>

        <!-- Progress -->
        <div style="height:6px;background:var(--bg-3);border-radius:3px;margin-bottom:20px;overflow:hidden">
          <div style="height:100%;width:${(s.round/s.totalRounds)*100}%;background:linear-gradient(90deg,var(--blue),var(--purple));border-radius:3px;transition:width 0.4s"></div>
        </div>

        <div class="quiz-question-card">
          <!-- Timer -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div class="quiz-question-type">🔍 IDENTIFIKASI POLA</div>
            <div style="display:flex;align-items:center;gap:6px;background:var(--bg-2);border:1px solid var(--border);border-radius:20px;padding:4px 12px">
              <span style="font-size:12px;color:var(--text-muted)">⏱</span>
              <span id="ph-timer" style="font-size:16px;font-weight:700;min-width:20px;text-align:center">${s.timeLeft}</span>
            </div>
          </div>

          <div class="quiz-question-text">Pola candlestick apa ini?</div>

          <!-- Context badge -->
          <div style="margin-bottom:14px">
            <span style="font-size:12px;background:var(--blue-bg);color:var(--blue);border:1px solid rgba(91,156,246,0.3);border-radius:4px;padding:4px 10px">
              📍 Context: ${ch.context}
            </span>
          </div>

          <!-- Visual -->
          <div class="quiz-visual">
            ${CandlestickRenderer.draw(ch.candles, {width: 300, height: 180, showLabels: false})}
          </div>

          <!-- Options -->
          <div class="quiz-options">${optHtml}</div>

          <!-- Feedback (hidden) -->
          <div id="ph-feedback" style="display:none;gap:12px;align-items:flex-start;margin-top:14px;padding:14px;border-radius:var(--radius);background:var(--bg-2);border:1px solid var(--border)"></div>

          <!-- Next btn -->
          <div style="display:flex;justify-content:flex-end;margin-top:14px">
            <button id="ph-next" class="btn btn-primary" onclick="PatternHunter.nextChallenge()" style="display:none">
              ${s.round + 1 >= s.totalRounds ? 'Lihat Hasil →' : 'Berikutnya →'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderResults(score, correct, bestStreak, percent) {
    const total = this.state.totalRounds;
    const grade = percent >= 90 ? 'S' : percent >= 80 ? 'A' : percent >= 70 ? 'B' : percent >= 50 ? 'C' : 'D';
    const gradeColor = percent >= 70 ? 'var(--green)' : percent >= 50 ? 'var(--gold)' : 'var(--red)';
    const msg = percent >= 90 ? '🏆 Pattern Master! Refleks identifikasi kamu luar biasa!' :
                percent >= 70 ? '🎯 Bagus! Pemahaman pola visual sudah solid.' :
                percent >= 50 ? '📚 Lumayan — review pola yang salah, latihan lagi!' :
                '💪 Masih perlu banyak latihan — tapi ingat, practice makes perfect!';

    return `
      <div class="animate-in quiz-container">
        <div class="quiz-result-card">
          <div style="font-size:48px;margin-bottom:12px">🎯</div>
          <div class="result-grade" style="color:${gradeColor}">Grade ${grade} · ${score} poin</div>
          <div class="result-message">${msg}</div>
          <div class="result-stats">
            <div class="result-stat"><span class="val text-green">${correct}</span><span class="lbl">Benar</span></div>
            <div class="result-stat"><span class="val text-red">${total - correct}</span><span class="lbl">Salah</span></div>
            <div class="result-stat"><span class="val" style="color:var(--gold)">${bestStreak}🔥</span><span class="lbl">Best Streak</span></div>
          </div>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-ghost" onclick="PatternHunter.start()">🔄 Main Lagi</button>
            <button class="btn btn-primary" onclick="Router.go('/')">Kembali →</button>
          </div>
        </div>
      </div>
    `;
  },

  /* Render start screen */
  renderStartScreen() {
    const record = Progress.load().quizScores?.pattern_hunter;
    const bestScore = record?.bestScore;
    return `
      <div class="animate-in" style="max-width:600px;margin:0 auto">
        <div style="margin-bottom:16px">
          <a href="#/" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← Dashboard</a>
        </div>

        <div class="welcome-banner" style="text-align:center;padding:40px 32px">
          <div style="font-size:56px;margin-bottom:16px">🎯</div>
          <h1 style="font-size:28px;margin-bottom:12px">Pattern Hunter</h1>
          <p style="font-size:15px;margin-bottom:8px">Identifikasi candlestick pattern secepat mungkin!</p>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:24px">10 ronde · 20 detik per soal · Streak bonus</p>

          <div style="display:flex;gap:16px;justify-content:center;margin-bottom:28px">
            <div class="stat-pill" style="min-width:80px">
              <span class="value">${this.CHALLENGES.length}</span>
              <span class="label">Pattern Pool</span>
            </div>
            <div class="stat-pill" style="min-width:80px">
              <span class="value">${bestScore !== undefined ? bestScore + '/' + this.state.totalRounds : '—'}</span>
              <span class="label">Best Score</span>
            </div>
            <div class="stat-pill" style="min-width:80px">
              <span class="value">20s</span>
              <span class="label">Per soal</span>
            </div>
          </div>

          <button class="btn btn-primary btn-large" onclick="PatternHunter.start()">🚀 Mulai Berburu!</button>
        </div>

        <div class="lesson-card">
          <div class="lesson-card-title">📋 Cara Main</div>
          <ul class="rules-list">
            <li><span class="rule-icon">🔍</span><span>Lihat candlestick pattern yang ditampilkan</span></li>
            <li><span class="rule-icon">⏱️</span><span>Pilih jawaban sebelum 20 detik habis</span></li>
            <li><span class="rule-icon">⚡</span><span>Jawab cepat = bonus poin lebih banyak</span></li>
            <li><span class="rule-icon">🔥</span><span>Streak bonus: jawab berturut benar untuk reward</span></li>
            <li><span class="rule-icon">📍</span><span>Perhatikan context (uptrend/downtrend) sebagai petunjuk</span></li>
          </ul>
        </div>
      </div>
    `;
  },
};

/* Module entry */
const PATTERN_HUNTER_MODULE = {
  id: 'm13_pattern_hunter',
  order: 13,
  title: 'Pattern Hunter 🎯',
  subtitle: 'Uji refleks identifikasi pola — game mode interaktif',
  icon: '🎯',
  color: '#f0b429',
  tags: [{type: 'quiz', label: 'Game'}, {type: 'neutral', label: 'Interaktif'}],
  xp: 100,
  lessons: [
    {id: 'pattern_hunter_game', title: 'Mulai Berburu Pattern!', duration: '~5 menit', xp: 50, type: 'pattern_hunter'},
  ],
};
