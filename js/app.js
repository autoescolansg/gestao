// Main Application
class BetManagerApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalEvents();
        this.initializeManagers();
    }

    setupGlobalEvents() {
        // Evento para fechar modais
        document.addEventListener('click', (e) => {
            // Fechar modais com o botão X
            if (e.target.classList.contains('close-modal')) {
                document.getElementById('addBetModal').style.display = 'none';
                document.getElementById('addBankModal').style.display = 'none';
            }
            
            // Fechar modais clicando fora
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }

            // Fechar notificações
            if (e.target.classList.contains('close-notification')) {
                e.target.closest('.notification').remove();
            }
        });

        // Theme toggle global
        document.addEventListener('click', (e) => {
            if (e.target.closest('#themeToggle')) {
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    initializeManagers() {
        // Inicializar managers na ordem correta
        window.validationManager = new ValidationManager();
        window.loadingManager = new LoadingManager();
        window.banksManager = new BanksManager();
        window.betsManager = new BetsManager();
        window.chartsManager = new ChartsManager();
        window.modalManager = new ModalManager();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BetManagerApp();
});