(() => {
  const view = document.getElementById('view-academic');
  if (!view) return;

  const $ = selector => view.querySelector(selector);
  const $$ = selector => [...view.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const icon = name => `<i class="iconfont icon-${name}" aria-hidden="true"></i>`;
  const toast = message => {
    if (window.showToast) window.showToast(message);
  };

  const papers = [
    {
      id: 1,
      title: '人工智能赋能个性化阅读的路径研究',
      authors: '林知远、周宁',
      journal: '教育技术观察',
      year: 2026,
      type: '综述',
      subject: '教育科技',
      abstract: '梳理 AI 推荐、对话式导读和阅读反馈在个性化阅读中的应用，讨论技术效率与深度理解之间的平衡。',
      keywords: ['人工智能', '个性化阅读', '教育技术'],
      note: '研究认为，AI 更适合承担线索整理、词汇解释和进度反馈；价值判断、文本细读与观点比较仍需要读者主动完成。'
    },
    {
      id: 2,
      title: '数字阅读中的深度注意力变化',
      authors: '许闻',
      journal: '新闻与传播评论',
      year: 2026,
      type: '研究论文',
      subject: '阅读文化',
      abstract: '从阅读场景、信息切换频率和文本长度三个维度，分析数字环境中深度注意力的形成条件。',
      keywords: ['数字阅读', '深度阅读', '注意力'],
      note: '研究建议通过明确阅读目标、减少无关通知、保留批注与回看路径，帮助读者维持连续阅读。'
    },
    {
      id: 3,
      title: '城市更新中的公共空间再生产',
      authors: '陈岸、何青',
      journal: '城市研究辑刊',
      year: 2025,
      type: '案例研究',
      subject: '城市研究',
      abstract: '以三个街区改造项目为例，讨论公共空间如何在规划、商业运营和居民日常使用中被重新定义。',
      keywords: ['城市更新', '公共空间', '社区'],
      note: '案例显示，空间更新能否持续，取决于居民是否能参与日常维护、活动组织和使用规则协商。'
    },
    {
      id: 4,
      title: '社区阅读空间如何影响日常交往',
      authors: '韩静',
      journal: '公共文化导刊',
      year: 2025,
      type: '案例研究',
      subject: '城市研究',
      abstract: '观察社区图书室、读书会和亲子阅读活动，分析阅读空间对邻里交往和社区认同的影响。',
      keywords: ['社区阅读', '公共文化', '日常交往'],
      note: '社区阅读空间的价值不只在借阅，还在于提供低压力、可持续的公共交往场景。'
    },
    {
      id: 5,
      title: '生成式 AI 与学术信息检索素养',
      authors: '顾言、梁澈',
      journal: '图书情报前沿',
      year: 2026,
      type: '研究方法',
      subject: '信息传播',
      abstract: '探讨生成式 AI 环境下，研究者如何提出问题、核验来源、识别幻觉并维护可追溯的检索记录。',
      keywords: ['生成式AI', '信息检索', '学术素养'],
      note: '文章提出“提问—检索—溯源—复核—归档”的检索流程，强调 AI 输出不能替代原始文献。'
    },
    {
      id: 6,
      title: '期刊知识服务中的可信来源机制',
      authors: '沈柏',
      journal: '出版科学',
      year: 2025,
      type: '研究论文',
      subject: '信息传播',
      abstract: '分析期刊平台在 AI 问答中如何通过引用、权限控制和原文回链建立可信知识服务。',
      keywords: ['期刊', '知识服务', '可信来源'],
      note: '可信机制需要同时覆盖内容授权、引用粒度、访问日志、证据不足提示和原文回链。'
    },
    {
      id: 7,
      title: '地方叙事与人文地理传播',
      authors: '罗见山',
      journal: '人文地理笔记',
      year: 2024,
      type: '案例研究',
      subject: '人文地理',
      abstract: '以地方杂志、游记和口述资料为对象，讨论地方叙事如何塑造读者对地域文化的理解。',
      keywords: ['地方叙事', '人文地理', '游记'],
      note: '多来源叙事能够补充单一旅游介绍的不足，让地方经验呈现更丰富的层次。'
    },
    {
      id: 8,
      title: '青少年家庭阅读习惯的影响因素',
      authors: '叶禾、孟然',
      journal: '家庭教育研究',
      year: 2024,
      type: '研究论文',
      subject: '阅读文化',
      abstract: '结合家庭阅读环境、陪伴方式和读物可获得性，分析青少年阅读习惯形成的关键因素。',
      keywords: ['家庭阅读', '青少年', '阅读习惯'],
      note: '固定阅读时间、共读讨论和适合年龄的读物选择，比单纯增加阅读数量更能形成长期习惯。'
    }
  ];

  const journals = [
    { title: '读者', copy: '人文故事、生活观察与随笔，适合作为日常轻阅读入口。', icon: 'Knowledge' },
    { title: '第一财经', copy: '商业趋势、公司观察与经济议题，连接行业变化与个人决策。', icon: 'Card' },
    { title: '南风窗', copy: '社会议题与公共事务报道，适合展开深度理解。', icon: 'Paper2' },
    { title: '环球人文地理', copy: '地域文化、旅行叙事与地理发现，拓展对世界的感知。', icon: 'Compass' },
    { title: '科幻世界', copy: '科幻小说、想象世界与未来议题，提供另一种观察现实的方式。', icon: 'AI' },
    { title: '中国新闻周刊', copy: '新闻事件、时代人物与深度专题，帮助理解当下语境。', icon: 'Paper2' }
  ];

  const state = {
    tab: 'papers',
    subject: 'all',
    query: '',
    field: 'all',
    type: 'all',
    year: 'all',
    sort: 'relevance'
  };

  let saved = [];
  try {
    const stored = JSON.parse(localStorage.getItem('longyuan-academic-saved') || '[]');
    saved = Array.isArray(stored) ? stored.filter(id => papers.some(p => p.id === Number(id))) : [];
  } catch (error) {
    saved = [];
  }

  function persistSaved() {
    try {
      localStorage.setItem('longyuan-academic-saved', JSON.stringify(saved));
    } catch (error) {}
  }

  function filteredPapers() {
    const q = state.query.trim().toLowerCase();
    let result = papers.filter(paper => {
      const haystack = {
        all: [paper.title, paper.abstract, paper.keywords.join(' '), paper.authors, paper.subject].join(' '),
        title: paper.title,
        keywords: paper.keywords.join(' ')
      }[state.field].toLowerCase();
      const matchQuery = !q || haystack.includes(q);
      const matchSubject = state.subject === 'all' || paper.subject === state.subject;
      const matchType = state.type === 'all' || paper.type === state.type;
      const matchYear = state.year === 'all' || String(paper.year) === state.year;
      return matchQuery && matchSubject && matchType && matchYear;
    });

    if (state.sort === 'newest') result = result.sort((a, b) => b.year - a.year || a.id - b.id);
    if (state.sort === 'oldest') result = result.sort((a, b) => a.year - b.year || a.id - b.id);
    return result;
  }

  function renderSubjects() {
    const names = ['all', ...new Set(papers.map(paper => paper.subject))];
    $('#academic-subject-list').innerHTML = names.map(name => {
      const label = name === 'all' ? '全部方向' : name;
      const count = name === 'all' ? papers.length : papers.filter(paper => paper.subject === name).length;
      return `<button type="button" data-ac-subject="${name}" aria-pressed="${state.subject === name}"><span>${label}</span><small>${count}</small></button>`;
    }).join('');
  }

  function paperCard(paper) {
    const isSaved = saved.includes(paper.id);
    return `
      <article class="academic-paper" data-ac-paper="${paper.id}">
        <div class="academic-paper-eyebrow"><span>${escape(paper.type)}</span><span>${paper.year}</span><span>${escape(paper.subject)}</span></div>
        <button type="button" class="academic-paper-title" data-ac-open="${paper.id}">${escape(paper.title)}</button>
        <p>${escape(paper.abstract)}</p>
        <div class="academic-paper-keywords">${paper.keywords.map(word => `<button type="button" data-ac-keyword="${escape(word)}">${escape(word)}</button>`).join('')}</div>
        <div class="academic-paper-actions">
          <button type="button" data-ac-save="${paper.id}" aria-pressed="${isSaved}">${icon('Knowledge')} ${isSaved ? '已加入清单' : '加入清单'}</button>
          <button type="button" data-ac-open="${paper.id}">${icon('Paper2')} 研读摘要</button>
          <a href="#/search?q=${encodeURIComponent(paper.title)}">${icon('AI')} 问 AI 梳理论据</a>
        </div>
      </article>`;
  }

  function emptyState(title, copy, action) {
    return `<div class="academic-empty"><h3>${escape(title)}</h3><p>${escape(copy)}</p>${action || ''}</div>`;
  }

  function renderJournals() {
    return journals.map(item => `
      <article class="academic-journal">
        <div class="academic-journal-mark">${icon(item.icon)}</div>
        <div>
          <h3>${escape(item.title)}</h3>
          <p>${escape(item.copy)}</p>
          <a class="btn-text" href="#/magazine/${encodeURIComponent(item.title)}">进入期刊 ${icon('Arrow_Forward-2')}</a>
        </div>
      </article>`).join('');
  }

  function renderResults() {
    const list = $('#academic-results-list');
    if (state.tab === 'journals') {
      $('#academic-result-count').textContent = `共 ${journals.length} 本可导航期刊`;
      list.innerHTML = renderJournals();
      return;
    }

    if (state.tab === 'saved') {
      const savedPapers = papers.filter(paper => saved.includes(paper.id));
      $('#academic-result-count').textContent = savedPapers.length ? `阅读清单中有 ${savedPapers.length} 条研究线索` : '阅读清单为空';
      list.innerHTML = savedPapers.length
        ? savedPapers.map(paperCard).join('')
        : emptyState('还没有保存文献', '看到需要稍后研读的论文，可以点击“加入清单”。', '<button class="btn" type="button" data-ac-tab-jump="papers">去发现文献</button>');
      return;
    }

    const result = filteredPapers();
    $('#academic-result-count').textContent = result.length
      ? `找到 ${result.length} 条示例文献${state.query ? ` · 关键词“${state.query}”` : ''}`
      : '没有找到匹配文献';
    list.innerHTML = result.length
      ? result.map(paperCard).join('')
      : emptyState('没有找到匹配文献', '可以换一个关键词，或重置筛选条件。', '<button class="btn btn-outline" type="button" data-ac-reset-filters>重置筛选</button>');
  }

  function renderTabs() {
    $$('[data-ac-tab]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.acTab === state.tab));
    });
    $('#academic-saved-count').textContent = String(saved.length);
    $('#academic-saved-hint').textContent = saved.length ? `已保存 ${saved.length} 条研究线索` : '收藏研究线索，稍后接着读';
  }

  function render() {
    renderSubjects();
    renderTabs();
    renderResults();
  }

  function openPaper(id) {
    const paper = papers.find(item => item.id === Number(id));
    if (!paper) return;
    const isSaved = saved.includes(paper.id);
    const body = $('#academic-reader-body');
    body.innerHTML = `
      <div class="academic-paper-eyebrow"><span>${escape(paper.type)}</span><span>${paper.year}</span><span>${escape(paper.subject)}</span></div>
      <h2 id="academic-reader-title">${escape(paper.title)}</h2>
      <p>${escape(paper.authors)} · ${escape(paper.journal)}</p>
      <h3>摘要</h3>
      <p>${escape(paper.abstract)}</p>
      <h3>示例研读片段</h3>
      <p>${escape(paper.note)}</p>
      <h3>关键词</h3>
      <div class="academic-paper-keywords">${paper.keywords.map(word => `<button type="button" data-ac-keyword="${escape(word)}">${escape(word)}</button>`).join('')}</div>
      <div class="academic-dialog-actions">
        <button class="btn" type="button" data-ac-save="${paper.id}">${isSaved ? '已加入清单' : '加入阅读清单'}</button>
        <a class="btn btn-outline" href="#/search?q=${encodeURIComponent(paper.title)}">问 AI 梳理</a>
        <button class="btn btn-outline" type="button" data-ac-close-dialog>稍后再读</button>
      </div>`;
    $('#academic-reader-dialog').showModal();
  }

  function toggleSave(id) {
    const numberId = Number(id);
    if (saved.includes(numberId)) {
      saved = saved.filter(item => item !== numberId);
      toast('已从阅读清单移除');
    } else {
      saved.push(numberId);
      toast('已加入阅读清单');
    }
    persistSaved();
    render();
  }

  function resetFilters() {
    state.subject = 'all';
    state.query = '';
    state.field = 'all';
    state.type = 'all';
    state.year = 'all';
    state.sort = 'relevance';
    $('#academic-query').value = '';
    $('#academic-field').value = 'all';
    $('#academic-type').value = 'all';
    $('#academic-year').value = 'all';
    $('#academic-sort').value = 'relevance';
    $('#academic-advanced').hidden = true;
    $('#academic-advanced-toggle').setAttribute('aria-expanded', 'false');
    render();
  }

  function exportSaved() {
    const savedPapers = papers.filter(paper => saved.includes(paper.id));
    if (!savedPapers.length) {
      toast('请先加入需要导出的文献');
      return;
    }
    const text = savedPapers.map((paper, index) => [
      `${index + 1}. ${paper.title}`,
      `作者：${paper.authors}`,
      `来源：${paper.journal} · ${paper.year}`,
      `方向：${paper.subject} · ${paper.type}`,
      `关键词：${paper.keywords.join('、')}`,
      `摘要：${paper.abstract}`
    ].join('\n')).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = '学术阅读清单.txt';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('阅读清单已导出');
  }

  $('#academic-search-form').addEventListener('submit', event => {
    event.preventDefault();
    state.query = $('#academic-query').value.trim();
    state.field = $('#academic-field').value;
    state.tab = 'papers';
    render();
  });

  $('#academic-advanced-toggle').addEventListener('click', () => {
    const panel = $('#academic-advanced');
    panel.hidden = !panel.hidden;
    $('#academic-advanced-toggle').setAttribute('aria-expanded', String(!panel.hidden));
  });

  $('#academic-type').addEventListener('change', event => { state.type = event.target.value; render(); });
  $('#academic-year').addEventListener('change', event => { state.year = event.target.value; render(); });
  $('#academic-sort').addEventListener('change', event => { state.sort = event.target.value; render(); });
  $('#academic-reset').addEventListener('click', resetFilters);
  $('#academic-export').addEventListener('click', exportSaved);
  $('#academic-saved-shortcut').addEventListener('click', () => { state.tab = 'saved'; render(); });
  $('#academic-reader-close').addEventListener('click', () => $('#academic-reader-dialog').close());

  view.addEventListener('click', event => {
    const tab = event.target.closest('[data-ac-tab]');
    if (tab) { state.tab = tab.dataset.acTab; render(); return; }

    const jump = event.target.closest('[data-ac-tab-jump]');
    if (jump) { state.tab = jump.dataset.acTabJump; render(); return; }

    const subject = event.target.closest('[data-ac-subject]');
    if (subject) { state.subject = subject.dataset.acSubject; state.tab = 'papers'; render(); return; }

    const hot = event.target.closest('[data-ac-query]');
    if (hot) {
      state.query = hot.dataset.acQuery;
      $('#academic-query').value = state.query;
      state.tab = 'papers';
      render();
      return;
    }

    const keyword = event.target.closest('[data-ac-keyword]');
    if (keyword) {
      state.query = keyword.dataset.acKeyword;
      state.field = 'keywords';
      $('#academic-query').value = state.query;
      $('#academic-field').value = 'keywords';
      state.tab = 'papers';
      render();
      return;
    }

    const opened = event.target.closest('[data-ac-open]');
    if (opened) { openPaper(opened.dataset.acOpen); return; }

    const save = event.target.closest('[data-ac-save]');
    if (save) { toggleSave(save.dataset.acSave); return; }

    const reset = event.target.closest('[data-ac-reset-filters]');
    if (reset) { resetFilters(); return; }

    const closeDialog = event.target.closest('[data-ac-close-dialog]');
    if (closeDialog) $('#academic-reader-dialog').close();
  });

  render();
})();
