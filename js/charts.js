// ChartsManager - global class (no auto instance)
(function(){
  class ChartsManager{
    constructor(){
      this.performanceChart = null;
      this.banksPerformanceChart = null;
      this.currentPeriod = 'weekly';
      this.init();
    }

    init(){
      this.updateCharts();
      this._bindPeriodButtons();
    }

    _bindPeriodButtons(){
      const buttons = document.querySelectorAll('.period-btn');
      if (!buttons) return;
      buttons.forEach(btn => {
        btn.addEventListener('click', (e)=>{
          const t = e.currentTarget;
          document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
          t.classList.add('active');
          this.currentPeriod = t.getAttribute('data-period') || 'weekly';
          this.updateCharts();
        });
      });
    }

    _safeBuild(canvasId, type, data, options){
      const canvas = document.getElementById(canvasId);
      if (!canvas || !canvas.getContext || !window.Chart) return null;
      const existing = (window.Chart && Chart.getChart) ? Chart.getChart(canvasId) : null;
      if (existing){ try{ existing.destroy(); }catch(e){} }
      const ctx = canvas.getContext('2d');
      return new Chart(ctx, { type, data, options });
    }

    updateCharts(){
      const s = (window.dataStorage?.getStats) ? dataStorage.getStats() : { totalBalance:0, totalProfit:0 };
      this.performanceChart = this._safeBuild('performanceChart','line',{
        labels:['S','T','Q','Q','S','S','D'],
        datasets:[{ label:'Lucro', data:[0, s.totalProfit, 0, 0, 0, 0, 0] }]
      }, { responsive:true, maintainAspectRatio:false });

      this.banksPerformanceChart = this._safeBuild('banksPerformanceChart','bar',{
        labels:['Saldo','Lucro'],
        datasets:[{ label:'R$', data:[s.totalBalance||0, s.totalProfit||0] }]
      }, { responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true } } });
    }

    updateReportCharts(){ this.updateCharts(); }
  }

  // expose class for app.js: new ChartsManager()
  window.ChartsManager = ChartsManager;
})();