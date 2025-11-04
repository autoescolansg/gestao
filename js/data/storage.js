// Data Storage Management (localStorage)
(function () {
  class DataStorage {
    constructor() {
      this._banksKey = 'banks';
      this._betsKey = 'bets';
      this.banks = this._load(this._banksKey);
      this.bets  = this._load(this._betsKey);
      if (!Array.isArray(this.banks)) this.banks = [];
      if (!Array.isArray(this.bets)) this.bets = [];
    }

    // ---- Banks ----
    saveBank(bank) {
      const b = {
        id: this._id(),
        name: String(bank.name||'').trim(),
        balance: Number(bank.balance)||0,
        strategy: String(bank.strategy||'').trim()
      };
      this.banks.push(b);
      this._save(this._banksKey, this.banks);
      return b;
    }
    getBanks(){ return this.banks.slice(); }
    deleteBank(id){
      this.banks = this.banks.filter(b=>b.id!==id);
      this._save(this._banksKey, this.banks);
    }

    // ---- Bets ----
    saveBet(bet){
      const b = {
        id: this._id(),
        bankId: bet.bankId || null,
        sport: String(bet.sport||'').trim(),
        game: String(bet.game||'').trim(),
        market: String(bet.market||'').trim(),
        odd: Number(bet.odd)||0,
        stake: Number(bet.stake)||0,
        bookmaker: String(bet.bookmaker||'').trim(),
        tipster: String(bet.tipster||'').trim(),
        result: bet.result || 'pending',
        date: bet.date || new Date().toISOString()
      };
      this.bets.push(b);
      this._save(this._betsKey, this.bets);
      return b;
    }
    getBets(){ return this.bets.slice(); }
    deleteBet(id){
      this.bets = this.bets.filter(b=>b.id!==id);
      this._save(this._betsKey, this.bets);
    }

    // ---- Stats ----
    getStats(){
      const totalBalance = this.banks.reduce((sum,b)=> sum + (Number(b.balance)||0), 0);
      const agg = this.bets.reduce((acc,b)=>{
        const stake = Number(b.stake)||0;
        const odd = Number(b.odd)||0;
        let ret = 0, pnl = 0;
        if (b.result==='green'){ ret = stake * odd; pnl = ret - stake; }
        else if (b.result==='void'){ ret = stake; pnl = 0; }
        else if (b.result==='red'){ ret = 0; pnl = -stake; }
        acc.totalStake += stake;
        acc.totalReturn += ret;
        acc.totalProfit += pnl;
        acc.totalBets++;
        if (b.result==='green') acc.wonBets++;
        if (b.result==='red') acc.lostBets++;
        return acc;
      }, { totalStake:0,totalReturn:0,totalProfit:0,totalBets:0,wonBets:0,lostBets:0 });
      const roi = agg.totalStake>0 ? (agg.totalProfit/agg.totalStake)*100 : 0;
      const winRate = agg.totalBets>0 ? (agg.wonBets/agg.totalBets)*100 : 0;
      return { totalBalance, ...agg, roi, winRate };
    }

    // ---- utils ----
    _save(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
    _load(k){ try{ return JSON.parse(localStorage.getItem(k)||'[]'); }catch(e){ return []; } }
    _id(){ try{ return crypto.randomUUID(); } catch(e){ return (Date.now().toString(36)+Math.random().toString(36).slice(2,8)); } }
  }

  // global instance
  window.dataStorage = new DataStorage();
})();
