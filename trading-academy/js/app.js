/* ======================================
   TRADING ACADEMY — MAIN APPLICATION
   ====================================== */

/* ──── PROGRESS MANAGER ──── */
const Progress = {
  KEY: 'tradingAcademy.progress.v1',

  _cache: null,

  load() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(this.KEY);
      this._cache = raw ? JSON.parse(raw) : this._defaults();
    } catch (e) {
      this._cache = this._defaults();
    }
    return this._cache;
  },

  _defaults() {
    return {
      xp: 0,
      streak: 0,
      lastActive: null,
      completedLessons: {}, // {lessonId: {completedAt, xp}}
      quizScores: {},       // {quizId: {bestScore, attempts, lastScore}}
      achievements: [],
    };
  },

  save() {
    localStorage.setItem(this.KEY, JSON.stringify(this._cache));
  },

  reset() {
    this._cache = this._defaults();
    this.save();
  },

  completeLesson(lessonId, xp) {
    const p = this.load();
    if (!p.completedLessons[lessonId]) {
      p.completedLessons[lessonId] = {completedAt: Date.now(), xp};
      p.xp += xp;
      this._updateStreak();
      this.save();
      return true; // newly completed
    }
    return false;
  },

  saveQuizScore(quizId, score, total, xp) {
    const p = this.load();
    if (!p.quizScores[quizId]) p.quizScores[quizId] = {bestScore: 0, attempts: 0};
    const record = p.quizScores[quizId];
    record.attempts += 1;
    record.lastScore = score;
    record.lastTotal = total;
    if (score > record.bestScore) {
      const newXp = Math.round(xp * (score / total));
      p.xp += newXp - (record.bestXp || 0);
      record.bestScore = score;
      record.bestXp = newXp;
    }
    this._updateStreak();
    this.save();
  },

  _updateStreak() {
    const p = this.load();
    const today = new Date().toDateString();
    const last = p.lastActive ? new Date(p.lastActive).toDateString() : null;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      p.streak = last === yesterday ? p.streak + 1 : 1;
      p.lastActive = Date.now();
    }
  },

  isCompleted(lessonId) {
    return !!this.load().completedLessons[lessonId];
  },

  moduleProgress(moduleId) {
    const mod = CURRICULUM.find(m => m.id === moduleId);
    if (!mod) return {done: 0, total: 0, percent: 0};
    const done = mod.lessons.filter(l => this.isCompleted(l.id)).length;
    return {done, total: mod.lessons.length, percent: Math.round((done / mod.lessons.length) * 100)};
  },

  totalProgress() {
    const totalLessons = CURRICULUM.reduce((s, m) => s + m.lessons.length, 0);
    const doneLessons = Object.keys(this.load().completedLessons).length;
    return {done: doneLessons, total: totalLessons, percent: Math.round((doneLessons / totalLessons) * 100)};
  },
};

/* ──── ROUTER ──── */
const Router = {
  current: null,

  init() {
    window.addEventListener('hashchange', () => this.handle());
    this.handle();
  },

  handle() {
    const hash = window.location.hash.slice(1) || '/';
    const parts = hash.split('/').filter(Boolean);
    App.render(parts);
  },

  go(path) {
    window.location.hash = path;
  },
};

/* ──── VIEW HELPERS ──── */
const starRating = (n) => {
  let out = '';
  for (let i = 0; i < 5; i++) out += `<span style="color:${i < n ? '#f0b429' : '#2a3550'}">★</span>`;
  return `<span class="stars">${out}</span>`;
};

const signalBadge = (signal) => {
  if (!signal) return '';
  const tag = SIGNAL_TAGS[signal] || SIGNAL_TAGS.neutral;
  const icon = tag.class === 'bullish' ? '📈' : tag.class === 'bearish' ? '📉' : '➡️';
  return `<span class="pattern-signal-badge ${tag.class}">${icon} ${tag.label}</span>`;
};

const escapeHtml = (str) =>
  str.replace(/[&<>"']/g, (m) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}[m]));

/* ──── VIEWS ──── */
const Views = {

  /* ========== HOME ========== */
  home() {
    const p = Progress.load();
    const total = Progress.totalProgress();

    const modulesHtml = CURRICULUM.map(mod => {
      const mp = Progress.moduleProgress(mod.id);
      const done = mp.percent === 100;
      const tagsHtml = mod.tags.map(t => `<span class="tag ${t.type}">${t.label}</span>`).join('');

      return `
        <div class="module-card ${done ? 'completed' : ''}" onclick="Router.go('/module/${mod.id}')">
          <div class="module-card-header">
            <div class="module-icon" style="background: linear-gradient(135deg, ${mod.color}33, ${mod.color}11); color: ${mod.color}; border: 1px solid ${mod.color}55;">${mod.icon}</div>
            <div class="module-card-info">
              <h3>Modul ${mod.order}: ${mod.title}</h3>
              <p>${mod.subtitle}</p>
            </div>
          </div>
          <div class="module-progress">
            <div class="bar"><div class="bar-fill" style="width:${mp.percent}%;background:${mod.color}"></div></div>
            <span>${mp.done}/${mp.total}</span>
          </div>
          <div class="module-tags">${tagsHtml}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="animate-in">
        <div class="welcome-banner">
          <h1>Selamat datang di Trading Academy 📊</h1>
          <p>Belajar candlestick chart pattern secara terstruktur, interaktif, dan visual — dari dasar sampai mahir. Setiap modul dilengkapi contoh chart nyata, kuis, dan panduan entry/exit.</p>
          <a href="#/module/${CURRICULUM[0].id}" class="start-btn">${total.done === 0 ? '🚀 Mulai Belajar' : '▶️ Lanjutkan Belajar'}</a>
        </div>

        <h2 class="section-title">📚 Kurikulum <span class="badge">${total.done}/${total.total} lesson</span></h2>
        <div class="module-grid">${modulesHtml}</div>

        <h2 class="section-title">⚡ Tools Cepat</h2>
        <div class="module-grid">
          <div class="module-card" onclick="Router.go('/module/m9_cheatsheet')">
            <div class="module-card-header">
              <div class="module-icon" style="background:#a78bfa22;color:#a78bfa;border:1px solid #a78bfa55">📒</div>
              <div class="module-card-info">
                <h3>Cheatsheet Semua Pola</h3>
                <p>Referensi cepat untuk semua candlestick pattern.</p>
              </div>
            </div>
          </div>
          <div class="module-card" onclick="Router.go('/module/m8_practice')">
            <div class="module-card-header">
              <div class="module-icon" style="background:#f0b42922;color:#f0b429;border:1px solid #f0b42955">🎯</div>
              <div class="module-card-info">
                <h3>Master Quiz</h3>
                <p>Uji kemampuan dengan 15 pertanyaan mixed pattern.</p>
              </div>
            </div>
          </div>
          <div class="module-card" onclick="if(confirm('Reset semua progress?')) { Progress.reset(); location.reload(); }">
            <div class="module-card-header">
              <div class="module-icon" style="background:#ef535022;color:#ef5350;border:1px solid #ef535055">🔄</div>
              <div class="module-card-info">
                <h3>Reset Progress</h3>
                <p>Hapus semua progress dan mulai dari awal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* ========== MODULE ========== */
  module(moduleId) {
    const mod = CURRICULUM.find(m => m.id === moduleId);
    if (!mod) return this.notFound();

    if (mod.id === 'm9_cheatsheet') return this.cheatsheet();

    const mp = Progress.moduleProgress(mod.id);

    const lessonsHtml = mod.lessons.map((lesson, idx) => {
      const done = Progress.isCompleted(lesson.id);
      const num = idx + 1;
      let path = '';
      if (lesson.type === 'quiz') path = `/quiz/${mod.id}/${lesson.quizId}`;
      else path = `/lesson/${mod.id}/${lesson.id}`;

      return `
        <div class="lesson-item ${done ? 'completed-lesson' : ''}" onclick="Router.go('${path}')">
          <div class="lesson-num">${done ? '✓' : num}</div>
          <div class="lesson-item-info">
            <h4>${lesson.title}</h4>
            <p>${lesson.type === 'pattern' ? 'Pattern Lesson' : lesson.type === 'quiz' ? 'Kuis' : 'Konsep'} · ${lesson.duration}</p>
          </div>
          <div class="lesson-item-meta">
            <span class="lesson-xp">+${lesson.xp} XP</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="animate-in">
        <div style="margin-bottom:20px;">
          <a href="#/" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← Kembali ke Dashboard</a>
        </div>

        <div class="welcome-banner" style="padding:24px 28px">
          <div style="display:flex;gap:16px;align-items:flex-start">
            <div class="module-icon" style="background:${mod.color}22;color:${mod.color};border:1px solid ${mod.color}55;width:50px;height:50px;font-size:24px">${mod.icon}</div>
            <div>
              <h1 style="font-size:22px">Modul ${mod.order}: ${mod.title}</h1>
              <p>${mod.subtitle}</p>
              <div style="display:flex;gap:14px;align-items:center;margin-top:14px;font-size:13px;color:var(--text-secondary)">
                <span>📊 ${mp.done}/${mp.total} lesson</span>
                <span>⭐ ${mod.xp} XP total</span>
              </div>
            </div>
          </div>
        </div>

        <h2 class="section-title">📖 Lessons</h2>
        <div class="lesson-list">${lessonsHtml}</div>
      </div>
    `;
  },

  /* ========== LESSON ========== */
  lesson(moduleId, lessonId) {
    const mod = CURRICULUM.find(m => m.id === moduleId);
    if (!mod) return this.notFound();
    const idx = mod.lessons.findIndex(l => l.id === lessonId);
    if (idx === -1) return this.notFound();
    const lesson = mod.lessons[idx];

    if (lesson.type === 'pattern') return this.patternLesson(mod, lesson, idx);
    if (lesson.type === 'concept') return this.conceptLesson(mod, lesson, idx);
    if (lesson.type === 'chart_pattern') return this.chartPatternLesson(mod, lesson, idx);
    if (lesson.type === 'indicator') return this.indicatorLesson(mod, lesson, idx);
    if (lesson.type === 'sr_lesson') return this.srFibLesson(mod, lesson, idx);
    if (lesson.type === 'pattern_hunter') { Router.go('/pattern-hunter'); return ''; }
    if (lesson.type === 'paper_trade') { Router.go('/paper-trade'); return ''; }
    return this.notFound();
  },

  /* ========== PATTERN LESSON ========== */
  patternLesson(mod, lesson, idx) {
    const pattern = PATTERNS[lesson.patternId];
    if (!pattern) return this.notFound();

    const prev = idx > 0 ? mod.lessons[idx - 1] : null;
    const next = idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
    const done = Progress.isCompleted(lesson.id);

    const rulesHtml = (pattern.rules || []).map(r =>
      `<li><span class="rule-icon">${r.icon}</span><span>${r.text}</span></li>`
    ).join('');

    const confirmHtml = (pattern.confirmation || []).map(c =>
      `<li><span class="rule-icon">✅</span><span>${c}</span></li>`
    ).join('');

    const mistakesHtml = (pattern.mistakes || []).map(m =>
      `<li><span class="rule-icon">⚠️</span><span>${m}</span></li>`
    ).join('');

    const signalClass = pattern.signal === 'bullish-reversal' || pattern.signal === 'bullish-continuation' ? 'bullish' : 'bearish';

    return `
      <div class="animate-in">
        <div style="margin-bottom:16px">
          <a href="#/module/${mod.id}" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← ${mod.title}</a>
        </div>

        <div class="lesson-layout">
          <div class="lesson-main">

            <!-- Pattern Header -->
            <div class="pattern-header">
              <div class="pattern-header-top">
                <div>
                  <h1>${pattern.name}</h1>
                  <div class="pattern-subtitle">${pattern.nameId || ''}</div>
                </div>
                ${signalBadge(pattern.signal)}
              </div>
              <div class="pattern-meta">
                <div class="meta-item"><span class="label">Reliability:</span> ${starRating(pattern.reliability)}</div>
                <div class="meta-item"><span class="label">Kategori:</span> <span style="color:var(--text-primary)">${pattern.category}</span></div>
              </div>
              <div style="margin-top:14px;padding:12px;background:var(--bg-2);border-radius:var(--radius);font-size:13px;color:var(--text-secondary);border-left:3px solid ${signalClass === 'bullish' ? 'var(--green)' : 'var(--red)'}">
                <b style="color:var(--text-primary)">Context:</b> ${pattern.context}
              </div>
            </div>

            <!-- Description -->
            <div class="lesson-card">
              <div class="lesson-card-title">📖 Deskripsi</div>
              <div class="lesson-text"><p>${pattern.description}</p></div>
            </div>

            <!-- Psychology -->
            ${pattern.psychology ? `
            <div class="lesson-card">
              <div class="lesson-card-title">🧠 Psikologi Pasar</div>
              <div class="lesson-text"><p>${pattern.psychology}</p></div>
            </div>` : ''}

            <!-- Rules -->
            ${rulesHtml ? `
            <div class="lesson-card">
              <div class="lesson-card-title">📋 Aturan Identifikasi</div>
              <ul class="rules-list">${rulesHtml}</ul>
            </div>` : ''}

            <!-- Trading Signal -->
            ${pattern.entry ? `
            <div class="lesson-card">
              <div class="lesson-card-title">🎯 Trading Setup</div>
              <div class="signal-box ${signalClass}">
                <div class="signal-box-title">${signalClass === 'bullish' ? '📈 BUY SIGNAL' : '📉 SELL SIGNAL'}</div>
                <div class="signal-rows">
                  <div class="signal-row"><span class="key">Signal:</span><span class="val">${pattern.entry.signal}</span></div>
                  ${pattern.entry.trigger ? `<div class="signal-row"><span class="key">Entry:</span><span class="val">${pattern.entry.trigger}</span></div>` : ''}
                  <div class="signal-row"><span class="key">Stop Loss:</span><span class="val">${pattern.entry.stopLoss}</span></div>
                  <div class="signal-row"><span class="key">Take Profit:</span><span class="val">${pattern.entry.takeProfit}</span></div>
                  <div class="signal-row"><span class="key">Timeframe:</span><span class="val">${pattern.entry.timing}</span></div>
                </div>
              </div>
            </div>` : ''}

            <!-- Confirmation -->
            ${confirmHtml ? `
            <div class="lesson-card">
              <div class="lesson-card-title">✅ Konfirmasi Tambahan (Wajib Dicek)</div>
              <ul class="rules-list">${confirmHtml}</ul>
            </div>` : ''}

            <!-- TradingView Chart Widget -->
            ${pattern.examples ? `
            <div class="lesson-card">
              <div class="lesson-card-title">📊 Live Chart — ${pattern.examples.symbol}</div>
              <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;line-height:1.6">${pattern.examples.description}</div>
              <div class="tv-widget-wrap" id="tv-widget-${pattern.id}"></div>
              <div style="margin-top:8px;font-size:11px;color:var(--text-muted);text-align:right">💡 Gunakan chart ini untuk mencari pola ${pattern.name} secara live</div>
            </div>` : ''}

            <!-- Mistakes -->
            ${mistakesHtml ? `
            <div class="lesson-card">
              <div class="lesson-card-title">⚠️ Kesalahan Umum (Hindari!)</div>
              <ul class="rules-list">${mistakesHtml}</ul>
            </div>` : ''}

            <!-- Nav Footer -->
            <div class="lesson-nav-footer">
              ${prev ? `<a href="#/lesson/${mod.id}/${prev.id}" class="btn btn-ghost">← ${prev.title}</a>` : '<span></span>'}
              <button class="btn btn-${done ? 'success' : 'primary'}" onclick="App.markLessonDone('${lesson.id}', ${lesson.xp})">
                ${done ? '✓ Selesai' : 'Tandai Selesai (+' + lesson.xp + ' XP)'}
              </button>
              ${next ?
                (next.type === 'quiz' ?
                  `<a href="#/quiz/${mod.id}/${next.quizId}" class="btn btn-primary">Quiz: ${next.title} →</a>` :
                  `<a href="#/lesson/${mod.id}/${next.id}" class="btn btn-primary">${next.title} →</a>`)
                : `<a href="#/module/${mod.id}" class="btn btn-primary">Kembali ke Modul →</a>`}
            </div>

          </div>

          <!-- Sidebar Card -->
          <div class="lesson-sidebar-card">
            <div class="pattern-visual-card">
              <div class="card-title">🕯️ Visual Pola</div>
              <div class="candle-stage">${CandlestickRenderer.forPattern(pattern.id)}</div>
              <div class="candle-label">${pattern.name}</div>
            </div>

            <div class="pattern-visual-card">
              <div class="card-title">📉 Context (Trend)</div>
              <div class="candle-stage">
                ${CandlestickRenderer.draw(
                  signalClass === 'bullish'
                    ? PATTERN_CANDLES.downtrend_context.candles
                    : PATTERN_CANDLES.uptrend_context.candles,
                  {width: 280, height: 160, labelTexts: signalClass === 'bullish' ? ['','','','',pattern.name] : ['','','','',pattern.name]}
                )}
              </div>
              <div class="candle-label">Muncul setelah ${signalClass === 'bullish' ? 'downtrend' : 'uptrend'}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* ========== CONCEPT LESSON ========== */
  conceptLesson(mod, lesson, idx) {
    const content = BASICS_CONTENT[lesson.content];
    if (!content) return this.notFound();

    const prev = idx > 0 ? mod.lessons[idx - 1] : null;
    const next = idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
    const done = Progress.isCompleted(lesson.id);

    const sectionsHtml = content.sections.map(s => {
      if (s.type === 'text') {
        return `<div class="lesson-card"><div class="lesson-card-title">${s.heading || 'Materi'}</div><div class="lesson-text"><p>${s.body}</p></div></div>`;
      }
      if (s.type === 'highlight') {
        return `<div class="highlight-box ${s.variant}"><div class="hb-icon">${s.icon}</div><div>${s.body}</div></div>`;
      }
      if (s.type === 'rules') {
        const rulesHtml = s.rules.map(r => `<li><span class="rule-icon">${r.icon}</span><span>${r.text}</span></li>`).join('');
        return `<div class="lesson-card"><div class="lesson-card-title">${s.heading || 'Poin Penting'}</div><ul class="rules-list">${rulesHtml}</ul></div>`;
      }
      if (s.type === 'anatomy') {
        return `<div class="lesson-card"><div class="lesson-card-title">🔬 Anatomi Visual</div><div class="anatomy-diagram">${CandlestickRenderer.drawAnatomy()}</div></div>`;
      }
      if (s.type === 'bullbear') {
        const bull = CandlestickRenderer.draw([{o: 25, h: 85, l: 18, c: 78, type: 'bull'}], {width: 90, height: 200, showLabels: false});
        const bear = CandlestickRenderer.draw([{o: 78, h: 85, l: 18, c: 25, type: 'bear'}], {width: 90, height: 200, showLabels: false});
        const doji = CandlestickRenderer.draw([{o: 50, h: 85, l: 18, c: 50, type: 'doji'}], {width: 90, height: 200, showLabels: false});
        return `<div class="lesson-card"><div class="lesson-card-title">🕯️ 3 Tipe Candle</div>
          <div style="display:flex;justify-content:space-around;padding:20px;background:#0c1220;border-radius:var(--radius);border:1px solid var(--border)">
            <div style="text-align:center"><div>${bull}</div><div style="margin-top:8px;color:var(--green);font-weight:600;font-size:13px">BULLISH</div><div style="color:var(--text-muted);font-size:11px">Close &gt; Open</div></div>
            <div style="text-align:center"><div>${bear}</div><div style="margin-top:8px;color:var(--red);font-weight:600;font-size:13px">BEARISH</div><div style="color:var(--text-muted);font-size:11px">Close &lt; Open</div></div>
            <div style="text-align:center"><div>${doji}</div><div style="margin-top:8px;color:var(--text-secondary);font-weight:600;font-size:13px">DOJI</div><div style="color:var(--text-muted);font-size:11px">Close ≈ Open</div></div>
          </div>
        </div>`;
      }
      return '';
    }).join('');

    return `
      <div class="animate-in">
        <div style="margin-bottom:16px">
          <a href="#/module/${mod.id}" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← ${mod.title}</a>
        </div>

        <div class="pattern-header">
          <h1>${content.title}</h1>
          <div class="pattern-subtitle">Lesson ${idx + 1} · ${lesson.duration} · +${lesson.xp} XP</div>
        </div>

        ${sectionsHtml}

        <div class="lesson-nav-footer">
          ${prev ? `<a href="#/lesson/${mod.id}/${prev.id}" class="btn btn-ghost">← ${prev.title}</a>` : '<span></span>'}
          <button class="btn btn-${done ? 'success' : 'primary'}" onclick="App.markLessonDone('${lesson.id}', ${lesson.xp})">
            ${done ? '✓ Selesai' : 'Tandai Selesai (+' + lesson.xp + ' XP)'}
          </button>
          ${next ?
            (next.type === 'quiz' ?
              `<a href="#/quiz/${mod.id}/${next.quizId}" class="btn btn-primary">${next.title} →</a>` :
              `<a href="#/lesson/${mod.id}/${next.id}" class="btn btn-primary">${next.title} →</a>`)
            : `<a href="#/module/${mod.id}" class="btn btn-primary">Kembali ke Modul →</a>`}
        </div>
      </div>
    `;
  },

  /* ========== QUIZ ========== */
  quiz(moduleId, quizId) {
    const quiz = QUIZZES[quizId];
    if (!quiz) return this.notFound();
    App.state.quiz = {
      moduleId, quizId,
      questions: quiz.questions,
      current: 0,
      answers: [],
      score: 0,
      started: true,
    };
    return this.quizQuestion();
  },

  quizQuestion() {
    const q = App.state.quiz;
    if (!q || q.current >= q.questions.length) return this.quizResult();

    const question = q.questions[q.current];
    const visual = question.visual
      ? `<div class="quiz-visual">${CandlestickRenderer.forPattern(question.visual)}</div>`
      : '';

    const letters = ['A', 'B', 'C', 'D', 'E'];
    const optionsHtml = question.options.map((opt, i) => `
      <div class="quiz-option" data-index="${i}" onclick="App.quizAnswer(${i})">
        <div class="opt-letter">${letters[i]}</div>
        <div>${opt}</div>
      </div>
    `).join('');

    return `
      <div class="animate-in quiz-container">
        <div style="margin-bottom:16px">
          <a href="#/module/${q.moduleId}" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← Keluar Quiz</a>
        </div>

        <div class="quiz-header">
          <span class="quiz-counter">${q.current + 1} / ${q.questions.length}</span>
          <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${((q.current) / q.questions.length) * 100}%"></div></div>
          <span class="quiz-counter">Score: ${q.score}</span>
        </div>

        <div class="quiz-question-card">
          <div class="quiz-question-type">${question.type === 'identify' ? '🔍 IDENTIFIKASI' : question.type === 'signal' ? '📊 SIGNAL' : '🎯 STRATEGI'}</div>
          <div class="quiz-question-text">${question.question}</div>
          ${visual}
          <div class="quiz-options" id="quiz-options">${optionsHtml}</div>
          <div class="quiz-feedback" id="quiz-feedback"></div>
          <div class="quiz-nav" id="quiz-nav" style="display:none">
            <button class="btn btn-primary" onclick="App.quizNext()">${q.current + 1 === q.questions.length ? 'Lihat Hasil →' : 'Pertanyaan Berikutnya →'}</button>
          </div>
        </div>
      </div>
    `;
  },

  quizResult() {
    const q = App.state.quiz;
    if (!q) return this.notFound();
    const total = q.questions.length;
    const score = q.score;
    const percent = Math.round((score / total) * 100);

    const grade = percent >= 90 ? 'A+' : percent >= 80 ? 'A' : percent >= 70 ? 'B' : percent >= 60 ? 'C' : 'D';
    const gradeColor = percent >= 70 ? 'var(--green)' : percent >= 50 ? 'var(--gold)' : 'var(--red)';
    const message = percent >= 90 ? 'Luar biasa! Kamu sudah master!' :
                    percent >= 70 ? 'Bagus! Pemahaman solid.' :
                    percent >= 50 ? 'Lumayan. Review lagi pola yang salah.' :
                    'Perlu review lebih banyak. Jangan menyerah!';

    // Save progress
    const mod = CURRICULUM.find(m => m.id === q.moduleId);
    const lesson = mod?.lessons.find(l => l.quizId === q.quizId);
    if (lesson) {
      Progress.saveQuizScore(q.quizId, score, total, lesson.xp);
      if (percent >= 70) Progress.completeLesson(lesson.id, 0); // XP already accounted
    }

    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (percent / 100) * circumference;

    return `
      <div class="animate-in quiz-container">
        <div class="quiz-result-card">
          <div class="result-score-ring">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-3)" stroke-width="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="${gradeColor}" stroke-width="10" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
            </svg>
            <div class="result-score-text" style="color:${gradeColor}">${percent}%</div>
          </div>
          <div class="result-grade" style="color:${gradeColor}">Grade ${grade}</div>
          <div class="result-message">${message}</div>
          <div class="result-stats">
            <div class="result-stat"><span class="val text-green">${score}</span><span class="lbl">Benar</span></div>
            <div class="result-stat"><span class="val text-red">${total - score}</span><span class="lbl">Salah</span></div>
            <div class="result-stat"><span class="val text-gold">+${Math.round((lesson?.xp || 0) * (score / total))}</span><span class="lbl">XP</span></div>
          </div>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-ghost" onclick="Router.go('/quiz/${q.moduleId}/${q.quizId}')">🔄 Ulangi</button>
            <button class="btn btn-primary" onclick="Router.go('/module/${q.moduleId}')">Kembali ke Modul →</button>
          </div>
        </div>
      </div>
    `;
  },

  /* ========== CHEATSHEET ========== */
  cheatsheet() {
    const cats = [
      {title: '🟢 Bullish — Single Candle', ids: ['hammer', 'inverted_hammer', 'dragonfly_doji', 'bullish_belt_hold']},
      {title: '🔴 Bearish — Single Candle', ids: ['hanging_man', 'shooting_star', 'gravestone_doji', 'bearish_belt_hold']},
      {title: '🟢 Bullish — 2 Candle', ids: ['bullish_engulfing', 'bullish_harami', 'piercing_line', 'tweezer_bottom']},
      {title: '🔴 Bearish — 2 Candle', ids: ['bearish_engulfing', 'bearish_harami', 'dark_cloud_cover', 'tweezer_top']},
      {title: '🟢 Bullish — 3 Candle', ids: ['morning_star', 'morning_doji_star', 'three_white_soldiers']},
      {title: '🔴 Bearish — 3 Candle', ids: ['evening_star', 'evening_doji_star', 'three_black_crows']},
    ];

    // Find module containing each pattern for navigation
    const findLesson = (patternId) => {
      for (const mod of CURRICULUM) {
        const lesson = mod.lessons.find(l => l.patternId === patternId);
        if (lesson) return {modId: mod.id, lessonId: lesson.id};
      }
      return null;
    };

    const sectionsHtml = cats.map(cat => {
      const cardsHtml = cat.ids.map(pid => {
        const p = PATTERNS[pid];
        if (!p) return '';
        const ref = findLesson(pid);
        const signalCls = p.signal.includes('bullish') ? 'bull' : 'bear';
        return `
          <div class="cheatsheet-card" onclick="${ref ? `Router.go('/lesson/${ref.modId}/${ref.lessonId}')` : ''}">
            <div style="background:#0c1220;border-radius:var(--radius);padding:8px;border:1px solid var(--border)">
              ${CandlestickRenderer.draw(PATTERN_CANDLES[pid]?.candles || [], {width: 180, height: 110, showLabels: false})}
            </div>
            <div class="name">${p.name}</div>
            <div class="signal ${signalCls}">${signalCls === 'bull' ? '📈 Bullish' : '📉 Bearish'} · ${starRating(p.reliability)}</div>
          </div>
        `;
      }).join('');
      return `
        <h2 class="section-title" style="margin-top:32px">${cat.title}</h2>
        <div class="cheatsheet-grid">${cardsHtml}</div>
      `;
    }).join('');

    return `
      <div class="animate-in">
        <div style="margin-bottom:16px">
          <a href="#/" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← Dashboard</a>
        </div>
        <div class="pattern-header">
          <h1>📒 Cheatsheet Candlestick</h1>
          <div class="pattern-subtitle">Referensi cepat semua pola. Klik kartu untuk detail lengkap.</div>
        </div>
        ${sectionsHtml}
      </div>
    `;
  },

  /* ========== CHART PATTERN LESSON ========== */
  chartPatternLesson(mod, lesson, idx) {
    const pattern = CHART_PATTERNS?.[lesson.patternId];
    if (!pattern) return this.notFound();
    const prev = idx > 0 ? mod.lessons[idx - 1] : null;
    const next = idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
    const done = Progress.isCompleted(lesson.id);
    const signalClass = pattern.signal?.includes('bullish') ? 'bullish' : pattern.signal?.includes('bearish') ? 'bearish' : 'neutral';

    const rulesHtml = (pattern.rules || []).map(r => `<li><span class="rule-icon">${r.icon}</span><span>${r.text}</span></li>`).join('');
    const confirmHtml = (pattern.confirmation || []).map(c => `<li><span class="rule-icon">✅</span><span>${c}</span></li>`).join('');
    const mistakesHtml = (pattern.mistakes || []).map(m => `<li><span class="rule-icon">⚠️</span><span>${m}</span></li>`).join('');

    return `
      <div class="animate-in">
        <div style="margin-bottom:16px"><a href="#/module/${mod.id}" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← ${mod.title}</a></div>
        <div class="lesson-layout">
          <div class="lesson-main">
            <div class="pattern-header">
              <div class="pattern-header-top">
                <div><h1>${pattern.name}</h1><div class="pattern-subtitle">${pattern.nameId || ''}</div></div>
                ${pattern.signal ? signalBadge(pattern.signal) : ''}
              </div>
              <div class="pattern-meta">
                <div class="meta-item"><span class="label">Reliability:</span> ${starRating(pattern.reliability)}</div>
                <div class="meta-item"><span class="label">Tipe:</span> <span style="color:var(--text-primary)">${pattern.category}</span></div>
              </div>
              <div style="margin-top:14px;padding:12px;background:var(--bg-2);border-radius:var(--radius);font-size:13px;color:var(--text-secondary);border-left:3px solid ${signalClass==='bullish'?'var(--green)':signalClass==='bearish'?'var(--red)':'var(--gold)'}">
                ${pattern.context}
              </div>
            </div>

            <div class="lesson-card"><div class="lesson-card-title">📖 Deskripsi</div><div class="lesson-text"><p>${pattern.description}</p></div></div>
            ${pattern.psychology ? `<div class="lesson-card"><div class="lesson-card-title">🧠 Psikologi</div><div class="lesson-text"><p>${pattern.psychology}</p></div></div>` : ''}
            ${rulesHtml ? `<div class="lesson-card"><div class="lesson-card-title">📋 Aturan Identifikasi</div><ul class="rules-list">${rulesHtml}</ul></div>` : ''}
            ${pattern.measurement ? `<div class="highlight-box info"><div class="hb-icon">📏</div><div><b>Measured Move (Target):</b> ${pattern.measurement}</div></div>` : ''}
            ${pattern.entry ? `
            <div class="lesson-card"><div class="lesson-card-title">🎯 Trading Setup</div>
              <div class="signal-box ${signalClass==='neutral'?'bullish':signalClass}">
                <div class="signal-box-title">${signalClass==='bullish'?'📈 BUY SIGNAL':signalClass==='bearish'?'📉 SELL SIGNAL':'🎯 SIGNAL'}</div>
                <div class="signal-rows">
                  <div class="signal-row"><span class="key">Entry:</span><span class="val">${pattern.entry.trigger}</span></div>
                  <div class="signal-row"><span class="key">Stop Loss:</span><span class="val">${pattern.entry.stopLoss}</span></div>
                  <div class="signal-row"><span class="key">Take Profit:</span><span class="val">${pattern.entry.takeProfit}</span></div>
                  <div class="signal-row"><span class="key">Timeframe:</span><span class="val">${pattern.entry.timing}</span></div>
                </div>
              </div>
            </div>` : ''}
            ${confirmHtml ? `<div class="lesson-card"><div class="lesson-card-title">✅ Konfirmasi</div><ul class="rules-list">${confirmHtml}</ul></div>` : ''}
            ${pattern.examples ? `
            <div class="lesson-card">
              <div class="lesson-card-title">📊 Live Chart — ${pattern.examples.symbol}</div>
              <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">${pattern.examples.description}</div>
              <div class="tv-widget-wrap" id="tv-widget-${pattern.id}"></div>
            </div>` : ''}
            ${mistakesHtml ? `<div class="lesson-card"><div class="lesson-card-title">⚠️ Kesalahan Umum</div><ul class="rules-list">${mistakesHtml}</ul></div>` : ''}

            <div class="lesson-nav-footer">
              ${prev ? `<a href="#/lesson/${mod.id}/${prev.id}" class="btn btn-ghost">← ${prev.title}</a>` : '<span></span>'}
              <button class="btn btn-${done?'success':'primary'}" onclick="App.markLessonDone('${lesson.id}',${lesson.xp})">${done?'✓ Selesai':'Tandai Selesai (+'+lesson.xp+' XP)'}</button>
              ${next?(next.type==='quiz'?`<a href="#/quiz/${mod.id}/${next.quizId}" class="btn btn-primary">${next.title} →</a>`:`<a href="#/lesson/${mod.id}/${next.id}" class="btn btn-primary">${next.title} →</a>`):
              `<a href="#/module/${mod.id}" class="btn btn-primary">Kembali ke Modul →</a>`}
            </div>
          </div>

          <div class="lesson-sidebar-card">
            <div class="pattern-visual-card">
              <div class="card-title">📊 Pattern Visual</div>
              <div style="background:#0c1220;border:1px solid var(--border);border-radius:var(--radius);padding:12px">
                ${typeof ChartPatternRenderer !== 'undefined' ? ChartPatternRenderer.forChartPattern(pattern.id) : ''}
              </div>
              <div class="candle-label">${pattern.name}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* ========== INDICATOR LESSON ========== */
  indicatorLesson(mod, lesson, idx) {
    const ind = INDICATORS?.[lesson.indicatorId];
    if (!ind) return this.notFound();
    const prev = idx > 0 ? mod.lessons[idx - 1] : null;
    const next = idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
    const done = Progress.isCompleted(lesson.id);

    // Build visual
    let visualHtml = '';
    if (ind.id === 'rsi') visualHtml = IndicatorRenderer.drawRSI();
    else if (ind.id === 'macd') visualHtml = IndicatorRenderer.drawMACD();
    else if (ind.id === 'bollinger_bands') visualHtml = IndicatorRenderer.drawBollingerBands();
    else if (ind.id === 'moving_averages') visualHtml = IndicatorRenderer.drawMA();

    const usagesHtml = (ind.usages || []).map(u => `<li><span class="rule-icon">${u.icon}</span><span>${u.text}</span></li>`).join('');
    const tipsHtml = (ind.tips || []).map(t => `<li><span class="rule-icon">💡</span><span>${t}</span></li>`).join('');

    return `
      <div class="animate-in">
        <div style="margin-bottom:16px"><a href="#/module/${mod.id}" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← ${mod.title}</a></div>

        <div class="pattern-header">
          <h1>${ind.name}</h1>
          <div class="pattern-subtitle">Kategori: ${ind.category}${ind.defaultPeriod ? ' · Default period: ' + ind.defaultPeriod : ''}</div>
        </div>

        <div class="lesson-card"><div class="lesson-card-title">📖 Apa itu ${ind.shortName}?</div><div class="lesson-text"><p>${ind.description}</p></div></div>

        ${visualHtml ? `<div class="lesson-card"><div class="lesson-card-title">📊 Visual ${ind.shortName}</div>${visualHtml}</div>` : ''}

        ${ind.levels ? `<div class="lesson-card"><div class="lesson-card-title">📏 Level Kunci</div>
          <ul class="rules-list">${ind.levels.map(l=>`<li><span class="rule-icon">📍</span><span><b style="color:${l.color}">${l.level}</b> — ${l.meaning}</span></li>`).join('')}</ul>
        </div>` : ''}

        ${ind.components ? `<div class="lesson-card"><div class="lesson-card-title">🔧 Komponen</div>
          <ul class="rules-list">${ind.components.map(c=>`<li><span class="rule-icon" style="color:${c.color}">●</span><span><b>${c.name}</b> (${c.formula}) — ${c.desc}</span></li>`).join('')}</ul>
        </div>` : ''}

        ${ind.types ? `<div class="lesson-card"><div class="lesson-card-title">🔧 Tipe Moving Average</div>
          <ul class="rules-list">${ind.types.map(t=>`<li><span class="rule-icon" style="color:${t.color}">●</span><span><b>${t.name}:</b> ${t.desc}</span></li>`).join('')}</ul>
        </div>` : ''}

        ${ind.keyLevels ? `<div class="lesson-card"><div class="lesson-card-title">📊 Period MA yang Penting</div>
          <ul class="rules-list">${ind.keyLevels.map(l=>`<li><span class="rule-icon">📏</span><span><b>${l.label}:</b> ${l.usage}</span></li>`).join('')}</ul>
        </div>` : ''}

        ${usagesHtml ? `<div class="lesson-card"><div class="lesson-card-title">🎯 Cara Menggunakan</div><ul class="rules-list">${usagesHtml}</ul></div>` : ''}

        ${tipsHtml ? `<div class="lesson-card"><div class="lesson-card-title">💡 Pro Tips</div><ul class="rules-list">${tipsHtml}</ul></div>` : ''}

        <div class="lesson-card">
          <div class="lesson-card-title">📊 Live Chart dengan ${ind.shortName}</div>
          <div class="tv-widget-wrap" id="tv-widget-ind-${ind.id}"></div>
        </div>

        <div class="lesson-nav-footer">
          ${prev ? `<a href="#/lesson/${mod.id}/${prev.id}" class="btn btn-ghost">← ${prev.title}</a>` : '<span></span>'}
          <button class="btn btn-${done?'success':'primary'}" onclick="App.markLessonDone('${lesson.id}',${lesson.xp})">${done?'✓ Selesai':'Tandai Selesai (+'+lesson.xp+' XP)'}</button>
          ${next?(next.type==='quiz'?`<a href="#/quiz/${mod.id}/${next.quizId}" class="btn btn-primary">${next.title} →</a>`:`<a href="#/lesson/${mod.id}/${next.id}" class="btn btn-primary">${next.title} →</a>`):
          `<a href="#/module/${mod.id}" class="btn btn-primary">Kembali ke Modul →</a>`}
        </div>
      </div>
    `;
  },

  /* ========== S/R & FIB LESSON ========== */
  srFibLesson(mod, lesson, idx) {
    const content = SR_FIB_CONTENT?.[lesson.contentId];
    if (!content) return this.notFound();
    const prev = idx > 0 ? mod.lessons[idx - 1] : null;
    const next = idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
    const done = Progress.isCompleted(lesson.id);

    const sectionsHtml = content.sections.map(s => {
      if (s.type === 'text') return `<div class="lesson-card"><div class="lesson-card-title">${s.heading||'Materi'}</div><div class="lesson-text"><p>${s.body}</p></div></div>`;
      if (s.type === 'highlight') return `<div class="highlight-box ${s.variant}"><div class="hb-icon">${s.icon}</div><div>${s.body}</div></div>`;
      if (s.type === 'rules') {
        const rHtml = s.rules.map(r=>`<li><span class="rule-icon">${r.icon}</span><span>${r.text}</span></li>`).join('');
        return `<div class="lesson-card"><div class="lesson-card-title">${s.heading||'Poin Penting'}</div><ul class="rules-list">${rHtml}</ul></div>`;
      }
      if (s.type === 'sr_visual') return `<div class="lesson-card"><div class="lesson-card-title">📊 S/R Visual</div><div style="display:flex;justify-content:center;padding:8px;background:#0c1220;border-radius:var(--radius);border:1px solid var(--border)">${typeof FibRenderer!=='undefined'?FibRenderer.drawSRZones():''}</div></div>`;
      if (s.type === 'fib_visual') return `<div class="lesson-card"><div class="lesson-card-title">🌀 Fibonacci Retracement Visual</div><div style="display:flex;justify-content:center;padding:8px;background:#0c1220;border-radius:var(--radius);border:1px solid var(--border)">${typeof FibRenderer!=='undefined'?FibRenderer.drawFibRetracement(2150,1980,38):''}</div></div>`;
      return '';
    }).join('');

    return `
      <div class="animate-in">
        <div style="margin-bottom:16px"><a href="#/module/${mod.id}" style="color:var(--text-secondary);text-decoration:none;font-size:13px">← ${mod.title}</a></div>
        <div class="pattern-header"><h1>${content.icon} ${content.title}</h1><div class="pattern-subtitle">Lesson ${idx+1} · ${lesson.duration} · +${lesson.xp} XP</div></div>
        ${sectionsHtml}
        <div class="lesson-nav-footer">
          ${prev ? `<a href="#/lesson/${mod.id}/${prev.id}" class="btn btn-ghost">← ${prev.title}</a>` : '<span></span>'}
          <button class="btn btn-${done?'success':'primary'}" onclick="App.markLessonDone('${lesson.id}',${lesson.xp})">${done?'✓ Selesai':'Tandai Selesai (+'+lesson.xp+' XP)'}</button>
          ${next?(next.type==='quiz'?`<a href="#/quiz/${mod.id}/${next.quizId}" class="btn btn-primary">${next.title} →</a>`:`<a href="#/lesson/${mod.id}/${next.id}" class="btn btn-primary">${next.title} →</a>`):
          `<a href="#/module/${mod.id}" class="btn btn-primary">Kembali ke Modul →</a>`}
        </div>
      </div>
    `;
  },

  notFound() {
    return `<div class="empty-state">
      <div class="icon">🔍</div>
      <h3>Halaman tidak ditemukan</h3>
      <p>Kembali ke <a href="#/" style="color:var(--blue)">Dashboard</a></p>
    </div>`;
  },
};

/* ──── SIDEBAR RENDERER ──── */
function renderSidebar(activeModule, activeLesson) {
  const p = Progress.load();
  const total = Progress.totalProgress();
  const levelXp = p.xp;
  const nextLevel = Math.max(100, Math.ceil(levelXp / 100) * 100);
  const levelPercent = (levelXp % 100);

  const items = CURRICULUM.map(mod => {
    const mp = Progress.moduleProgress(mod.id);
    const done = mp.percent === 100;
    const active = mod.id === activeModule;
    return `
      <div class="nav-item ${active ? 'active' : ''} ${done ? 'completed' : ''}" onclick="Router.go('/module/${mod.id}')">
        <span class="nav-icon">${mod.icon}</span>
        <span class="nav-label">${mod.title}</span>
        ${done ? '<span class="check">✓</span>' : `<span class="nav-badge">${mp.done}/${mp.total}</span>`}
      </div>
    `;
  }).join('');

  return `
    <div class="sidebar-logo">
      <div class="logo-icon">📈</div>
      <div>
        <div class="logo-text">Trading Academy</div>
        <div class="logo-sub">Candlestick Mastery</div>
      </div>
    </div>

    <div class="sidebar-progress">
      <div class="xp-bar-label">
        <span>Level ${Math.floor(levelXp / 100) + 1}</span>
        <span>${levelXp} XP</span>
      </div>
      <div class="xp-bar"><div class="xp-bar-fill" style="width:${levelPercent}%"></div></div>
      <div class="progress-stats">
        <div class="stat-pill"><span class="value">${total.done}</span><span class="label">Lesson</span></div>
        <div class="stat-pill"><span class="value">${p.streak}🔥</span><span class="label">Streak</span></div>
      </div>
    </div>

    <div class="sidebar-nav">
      <div class="nav-item ${!activeModule ? 'active' : ''}" onclick="Router.go('/')">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Dashboard</span>
      </div>
      <div class="nav-section-title">Kurikulum</div>
      ${items}
    </div>
  `;
}

/* ──── MAIN APP ──── */
const App = {
  state: {
    quiz: null,
  },

  init() {
    Router.init();
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('sidebar-overlay').classList.toggle('active');
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').classList.remove('active');
    });
  },

  render(parts) {
    const [route, ...rest] = parts;
    let content = '';
    let breadcrumb = 'Dashboard';
    let activeModule = null, activeLesson = null;

    if (!route || route === '') {
      content = Views.home();
    } else if (route === 'module') {
      activeModule = rest[0];
      const mod = CURRICULUM.find(m => m.id === activeModule);
      breadcrumb = mod ? mod.title : 'Modul';
      content = Views.module(activeModule);
    } else if (route === 'lesson') {
      activeModule = rest[0];
      activeLesson = rest[1];
      const mod = CURRICULUM.find(m => m.id === activeModule);
      const les = mod?.lessons.find(l => l.id === activeLesson);
      breadcrumb = `${mod?.title || ''} / ${les?.title || ''}`;
      content = Views.lesson(activeModule, activeLesson);
    } else if (route === 'quiz') {
      activeModule = rest[0];
      const quizId = rest[1];
      breadcrumb = 'Quiz';
      content = Views.quiz(activeModule, quizId);
    } else if (route === 'pattern-hunter') {
      breadcrumb = 'Pattern Hunter 🎯';
      content = typeof PatternHunter !== 'undefined' ? PatternHunter.renderStartScreen() : Views.notFound();
    } else if (route === 'paper-trade') {
      breadcrumb = 'Paper Trading Simulator 💹';
      content = typeof PaperTrade !== 'undefined' ? PaperTrade.renderDashboard() : Views.notFound();
    } else {
      content = Views.notFound();
    }

    document.getElementById('sidebar').innerHTML = renderSidebar(activeModule, activeLesson);
    document.getElementById('breadcrumb').innerHTML = `<span>🏠</span><span class="separator">/</span><span class="current">${breadcrumb}</span>`;
    document.getElementById('page-content').innerHTML = content;

    // Load TradingView widget if present
    if (route === 'lesson' && rest[1]) {
      const mod = CURRICULUM.find(m => m.id === rest[0]);
      const les = mod?.lessons.find(l => l.id === rest[1]);
      if (les?.type === 'pattern') {
        const pattern = PATTERNS[les.patternId];
        if (pattern?.examples) this.loadTVWidget(pattern.id, pattern.examples);
      } else if (les?.type === 'chart_pattern') {
        const cp = CHART_PATTERNS?.[les.patternId];
        if (cp?.examples) this.loadTVWidget(cp.id, cp.examples);
      } else if (les?.type === 'indicator') {
        const ind = typeof INDICATORS !== 'undefined' ? INDICATORS[les.indicatorId] : null;
        if (ind) {
          // Default to BBCA daily chart for indicator examples
          const defaultExample = ind.examples || { symbol: 'IDX:BBCA', tf: 'D' };
          this.loadTVWidgetById(`tv-widget-ind-${ind.id}`, `tv-ind-${ind.id}`, defaultExample, ind.tvStudy);
        }
      }
    }

    window.scrollTo(0, 0);
  },

  loadTVWidget(patternId, examples) {
    const container = document.getElementById(`tv-widget-${patternId}`);
    if (!container) return;
    const innerDivId = `tv-${patternId}`;
    container.innerHTML = `<div class="tradingview-widget-container" style="height:400px;width:100%"><div id="${innerDivId}" style="height:100%"></div></div>`;
    const widgetDiv = document.getElementById(innerDivId);
    const loadWidget = () => {
      if (window.TradingView && widgetDiv) {
        new window.TradingView.widget({
          container_id: innerDivId,
          symbol: examples.symbol,
          interval: examples.tf || 'D',
          timezone: 'Asia/Jakarta',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1a2035',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: ['RSI@tv-basicstudies'],
          autosize: true,
        });
      }
    };
    if (window.TradingView) {
      loadWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = loadWidget;
      document.head.appendChild(script);
    }
  },

  // Generic widget loader — takes explicit container ID and inner div ID
  loadTVWidgetById(containerId, innerDivId, examples, tvStudy) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const studies = tvStudy ? [tvStudy] : ['RSI@tv-basicstudies'];
    container.innerHTML = `<div class="tradingview-widget-container" style="height:400px;width:100%"><div id="${innerDivId}" style="height:100%"></div></div>`;
    const widgetDiv = document.getElementById(innerDivId);
    const loadWidget = () => {
      if (window.TradingView && widgetDiv) {
        new window.TradingView.widget({
          container_id: innerDivId,
          symbol: examples.symbol || 'IDX:BBCA',
          interval: examples.tf || 'D',
          timezone: 'Asia/Jakarta',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1a2035',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies,
          autosize: true,
        });
      }
    };
    if (window.TradingView) {
      loadWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = loadWidget;
      document.head.appendChild(script);
    }
  },

  markLessonDone(lessonId, xp) {
    const newlyDone = Progress.completeLesson(lessonId, xp);
    if (newlyDone) {
      // toast/celebrate
      this.showToast(`✅ +${xp} XP earned!`);
    }
    Router.handle(); // re-render
  },

  quizAnswer(index) {
    const q = this.state.quiz;
    if (!q) return;
    const question = q.questions[q.current];
    const correct = question.correct;
    const isCorrect = index === correct;
    if (isCorrect) q.score += 1;
    q.answers.push({chosen: index, correct, isCorrect});

    // Update UI
    const opts = document.querySelectorAll('#quiz-options .quiz-option');
    opts.forEach((el, i) => {
      el.classList.add('disabled');
      if (i === correct) el.classList.add('correct');
      if (i === index && !isCorrect) el.classList.add('wrong');
    });

    const feedback = document.getElementById('quiz-feedback');
    feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong');
    feedback.innerHTML = `
      <b>${isCorrect ? '✅ Benar!' : '❌ Salah.'}</b><br>
      ${question.explain}
    `;
    document.getElementById('quiz-nav').style.display = 'flex';
  },

  quizNext() {
    this.state.quiz.current += 1;
    document.getElementById('page-content').innerHTML = Views.quizQuestion();
  },

  showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 30px; right: 30px;
      background: var(--green); color: white;
      padding: 12px 20px; border-radius: 8px;
      font-weight: 600; z-index: 9999;
      box-shadow: 0 4px 20px rgba(38,166,154,0.4);
      animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  },
};

/* ──── BOOTSTRAP ──── */
document.addEventListener('DOMContentLoaded', () => {
  // Inject extended modules (chart patterns, indicators, S/R+Fib, pattern hunter, paper trade)
  if (typeof injectExtraModules === 'function') injectExtraModules();
  App.init();
});
