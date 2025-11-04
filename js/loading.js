// Loading Manager
class LoadingManager {
    constructor() {
        this.loadingOverlay = null;
        this.createLoadingOverlay();
    }

    createLoadingOverlay() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.id = 'loadingOverlay';
        this.loadingOverlay.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Carregando...</span>
            </div>
        `;
        document.body.appendChild(this.loadingOverlay);
    }

    show(message = 'Carregando...') {
        if (this.loadingOverlay) {
            this.loadingOverlay.querySelector('span').textContent = message;
            this.loadingOverlay.classList.add('active');
        }
    }

    hide() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('active');
        }
    }

    async withLoading(promise, message = 'Carregando...') {
        this.show(message);
        try {
            const result = await promise;
            return result;
        } finally {
            this.hide();
        }
    }
}

// Create global instance
let loadingManager;