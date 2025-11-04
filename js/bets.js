// BetsManager - global class (no auto instance)
(function(){
  function escapeHtml(s){return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}

  class BetsManager{
    constructor(){
      this.betForm = document.getElementById('betForm');
      this.bind();
    }

    bind(){
      if (!this.betForm) return;
      this.betForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const game = (document.getElementById('game')?.value || '').trim();
        const odd  = Number(document.getElementById('odd')?.value || 0);
        const stake= Number(document.getElementById('stake')?.value || 0);
        if (!game) return this._notify('Informe o evento/jogo.','warn');
        if (!(odd>0)) return this._notify('Odd inválida.','warn');
        if (!(stake>0)) return this._notify('Stake inválida.','warn');
        const bet = {
          bankId: document.getElementById('bank')?.value || null,
          sport: (document.getElementById('sport')?.value || '').trim(),
          game, market: (document.getElementById('market')?.value || '').trim(),
          odd, stake,
          bookmaker: (document.getElementById('bookmaker')?.value || '').trim(),
          tipster: (document.getElementById('tipster')?.value || '').trim(),
          result: document.getElementById('result')?.value || 'pending',
          date: new Date().toISOString()
        };
        if (window.dataStorage?.saveBet) dataStorage.saveBet(bet);
        this._notify('Aposta cadastrada com sucesso!');
        this.clearForm();
        this.loadRecentBets();
        this.loadAllBets();
        if (window.chartsManager?.updateCharts) chartsManager.updateCharts();
      });

      ['addBetBtn','addBetBtnPage'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', ()=>{
          const modal = document.getElementById('addBetModal');
          if (modal) modal.style.display = 'flex';
        });
      });
    }

    loadRecentBets(){
      const bets = (window.dataStorage?.getBets) ? dataStorage.getBets().slice(-5).reverse() : [];
      const container = document.getElementById('recentBetsTable') || document.querySelector('#recentBets tbody');
      if (!container) return;
      if (container.tagName === 'TBODY'){
        container.innerHTML = '';
        bets.forEach(b => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${new Date(b.date).toLocaleString('pt-BR')}</td>
                          <td>${escapeHtml(b.game)}</td>
                          <td>${(Number(b.odd)||0).toFixed(2)}</td>
                          <td>${(Number(b.stake)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                          <td>${escapeHtml(b.result||'pending')}</td>`;
          container.appendChild(tr);
        });
      } else {
        container.innerHTML = '';
        bets.forEach(b => {
          const item = document.createElement('div');
          item.className = 'bet-item';
          item.textContent = `${new Date(b.date).toLocaleString('pt-BR')} • ${b.game} • ${b.odd} • ${b.result}`;
          container.appendChild(item);
        });
      }
    }

    loadAllBets(){
      const bets = (window.dataStorage?.getBets) ? dataStorage.getBets().slice().reverse() : [];
      const container = document.querySelector('#allBetsTable tbody') || document.querySelector('#betsTable tbody');
      if (!container) return;
      container.innerHTML = '';
      bets.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${new Date(b.date).toLocaleString('pt-BR')}</td>
                        <td>${escapeHtml(b.game)}</td>
                        <td>${escapeHtml(b.market||'')}</td>
                        <td>${(Number(b.odd)||0).toFixed(2)}</td>
                        <td>${(Number(b.stake)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                        <td>${escapeHtml(b.result||'pending')}</td>`;
        container.appendChild(tr);
      });
    }

    clearForm(){
      ['bank','sport','game','market','odd','stake','bookmaker','tipster','result'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = '';
      });
      const modal = document.getElementById('addBetModal');
      if (modal) modal.style.display = 'none';
    }

    _notify(message, type='info'){
      const note = document.createElement('div');
      note.className = `notification ${type}`;
      note.textContent = message;
      document.body.appendChild(note);
      setTimeout(()=> note.remove(), 3000);
    }
  }

  // expose class for app.js: new BetsManager()
  window.BetsManager = BetsManager;
})();