// BanksManager - global class (no auto instance)
(function(){
  function escapeHtml(s){return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}

  class BanksManager{
    constructor(){
      this.bankForm = document.getElementById('bankForm');
      this.bind();
    }

    bind(){
      if (!this.bankForm) return;
      this.bankForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        if (!this.bankForm.checkValidity()){ this.bankForm.reportValidity(); return; }
        const name = (document.getElementById('bankName')?.value || '').trim();
        const balance = Number(document.getElementById('initialBalance')?.value || 0);
        const strategy = (document.getElementById('bankStrategy')?.value || '').trim();
        if (!name){ this._notify('Informe o nome da banca.','warn'); return; }
        if (!isFinite(balance) || balance < 0){ this._notify('Saldo inicial inválido.','warn'); return; }
        if (window.dataStorage?.saveBank) dataStorage.saveBank({ name, balance, strategy });
        this.clearForm();
        this._notify('Banca salva com sucesso!');
        this.loadBanks();
        this.updateBanksPageTable();
        this.updateDashboardStats();
        if (window.chartsManager?.updateCharts) chartsManager.updateCharts();
      });

      // open modal buttons if exist
      ['addBankBtn','addBankBtnPage'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', ()=>{
          const modal = document.getElementById('addBankModal');
          if (modal) modal.style.display = 'flex';
        });
      });
    }

    // Called by navigation.js in dashboard/banks
    loadBanks(){
      const container = document.getElementById('banksList') || document.querySelector('#banks .banks-list');
      if (container){
        const banks = (window.dataStorage?.getBanks) ? dataStorage.getBanks() : [];
        container.innerHTML = '';
        banks.forEach(b => {
          const item = document.createElement('div');
          item.className = 'bank-item';
          item.innerHTML = `<strong>${escapeHtml(b.name)}</strong> — ${(Number(b.balance)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}<br><small>${escapeHtml(b.strategy||'')}</small>`;
          container.appendChild(item);
        });
      }
    }

    updateBanksPageTable(){
      const banks = (window.dataStorage?.getBanks) ? dataStorage.getBanks() : [];
      const tbody = document.querySelector('#banksTable tbody') || document.querySelector('#banksPageTable tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      banks.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${escapeHtml(b.name)}</td>
                        <td>${(Number(b.balance)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                        <td>${escapeHtml(b.strategy||'')}</td>`;
        tbody.appendChild(tr);
      });
    }

    updateDashboardStats(){
      if (!window.dataStorage?.getStats) return;
      const s = dataStorage.getStats();
      const set = (id,val)=>{ const el=document.getElementById(id); if (el) el.textContent = val; };
      set('totalBalance', (s.totalBalance||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}));
      set('totalProfit',  (s.totalProfit||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}));
      set('totalRoi', ((s.roi||0).toFixed(2)+'%'));
      set('totalWinrate', ((s.winRate||0).toFixed(2)+'%'));
    }

    clearForm(){
      ['bankName','initialBalance','bankStrategy'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const modal = document.getElementById('addBankModal');
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

  // expose class globally for app.js: new BanksManager()
  window.BanksManager = BanksManager;
})();