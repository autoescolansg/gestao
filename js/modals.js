// ModalManager - global class
(function(){
  class ModalManager{
    constructor(){
      document.addEventListener('click', (e)=>{
        if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')){
          this.closeAll();
        }
      });
    }
    open(id){
      const el = document.getElementById(id);
      if (el){ el.style.display='flex'; el.setAttribute('aria-hidden','false'); }
    }
    closeAll(){
      document.querySelectorAll('.modal').forEach(m=>{
        m.style.display='none';
        m.setAttribute('aria-hidden','true');
      });
    }
  }
  window.ModalManager = ModalManager;
})();