// Validation Manager
class ValidationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
    }

    setupFormValidation() {
        // Validação em tempo real para formulários
        this.setupBetFormValidation();
        this.setupBankFormValidation();
    }

    setupBetFormValidation() {
        const form = document.getElementById('betForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupBankFormValidation() {
        const form = document.getElementById('bankForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        this.clearFieldError(field);

        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.id;

        switch(fieldName) {
            case 'bank':
            case 'sport':
            case 'result':
                if (!value) {
                    this.showFieldError(field, 'Este campo é obrigatório');
                    return false;
                }
                break;

            case 'odd':
                const odd = parseFloat(value);
                if (!value || isNaN(odd) || odd < 1.01 || odd > 1000) {
                    this.showFieldError(field, 'Odd deve estar entre 1.01 e 1000');
                    return false;
                }
                break;

            case 'stake':
            case 'initialBalance':
                const amount = parseFloat(value);
                if (!value || isNaN(amount) || amount <= 0) {
                    this.showFieldError(field, 'Valor deve ser maior que 0');
                    return false;
                }
                break;

            case 'bankName':
                if (!value) {
                    this.showFieldError(field, 'Nome da banca é obrigatório');
                    return false;
                }
                if (value.length < 2) {
                    this.showFieldError(field, 'Nome muito curto');
                    return false;
                }
                break;
        }

        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateBetForm() {
        const form = document.getElementById('betForm');
        if (!form) return true;

        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Validação de saldo
        const bankSelect = document.getElementById('bank');
        const stakeInput = document.getElementById('stake');
        
        if (bankSelect && stakeInput) {
            const selectedBankId = bankSelect.value;
            const stake = parseFloat(stakeInput.value);
            
            if (selectedBankId && stake) {
                const bank = dataStorage.getBank(selectedBankId);
                if (bank && stake > bank.balance) {
                    this.showFieldError(stakeInput, 'Stake maior que o saldo disponível');
                    isValid = false;
                }
            }
        }

        return isValid;
    }

    validateBankForm() {
        const form = document.getElementById('bankForm');
        if (!form) return true;

        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }
}

// Create global instance
let validationManager;