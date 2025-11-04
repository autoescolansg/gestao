// Navigation Management - Versão Simplificada
class Navigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadPage('dashboard');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Load the page
                this.loadPage(pageId);
            });
        });
    }

    loadPage(pageId) {
        console.log('Carregando página:', pageId);
        
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
            
            // Load page content
            this.loadPageContent(pageId, targetPage);
        }
        
        this.currentPage = pageId;
    }

    loadPageContent(pageId, container) {
        // Clear container first
        container.innerHTML = '';

        switch(pageId) {
            case 'dashboard':
                this.loadDashboard(container);
                break;
            case 'banks':
                this.loadBanks(container);
                break;
            case 'bets':
                this.loadBets(container);
                break;
            case 'reports':
                this.loadReports(container);
                break;
            case 'settings':
                this.loadSettings(container);
                break;
            case 'strategies':
                this.loadStrategies(container);
                break;
            case 'notes':
                this.loadNotes(container);
                break;
        }
    }

    loadDashboard(container) {
        container.innerHTML = `
            <div class="header">
                <h2 class="page-title">Dashboard</h2>
                <div class="user-actions">
                    <button class="theme-toggle" id="themeToggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="user-profile">
                        <i class="fas fa-user-circle"></i>
                        <span>Usuário</span>
                    </button>
                </div>
            </div>

            <div class="cards-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Saldo Total</h3>
                        <div class="card-icon primary">
                            <i class="fas fa-wallet"></i>
                        </div>
                    </div>
                    <div class="card-value" id="totalBalance">R$ 0,00</div>
                    <div class="card-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>0%</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Lucro/Prejuízo</h3>
                        <div class="card-icon success">
                            <i class="fas fa-chart-line"></i>
                        </div>
                    </div>
                    <div class="card-value" id="totalProfit">R$ 0,00</div>
                    <div class="card-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>0%</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">ROI</h3>
                        <div class="card-icon warning">
                            <i class="fas fa-percentage"></i>
                        </div>
                    </div>
                    <div class="card-value" id="totalRoi">0%</div>
                    <div class="card-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>0%</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Taxa de Acerto</h3>
                        <div class="card-icon danger">
                            <i class="fas fa-bullseye"></i>
                        </div>
                    </div>
                    <div class="card-value" id="totalWinRate">0%</div>
                    <div class="card-change negative">
                        <i class="fas fa-arrow-down"></i>
                        <span>0%</span>
                    </div>
                </div>
            </div>

            <div class="charts-container">
                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">Desempenho por Período</h3>
                        <div class="chart-actions">
                            <button class="chart-btn active" data-period="weekly">Semanal</button>
                            <button class="chart-btn" data-period="monthly">Mensal</button>
                            <button class="chart-btn" data-period="total">Total</button>
                        </div>
                    </div>
                    <canvas id="performanceChart"></canvas>
                </div>
                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">Distribuição por Esporte</h3>
                    </div>
                    <canvas id="sportsChart"></canvas>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h3>Apostas Recentes</h3>
                    <button class="btn btn-primary" id="addBetBtn">
                        <i class="fas fa-plus"></i>
                        Nova Aposta
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Banca</th>
                            <th>Esporte</th>
                            <th>Jogo</th>
                            <th>Mercado</th>
                            <th>Odd</th>
                            <th>Stake</th>
                            <th>Retorno</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="recentBetsTable">
                        <tr>
                            <td colspan="9" style="text-align: center; padding: 20px;">Nenhuma aposta cadastrada</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h3>Visão Geral das Bancas</h3>
                    <button class="btn btn-primary" id="addBankBtn">
                        <i class="fas fa-plus"></i>
                        Nova Banca
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nome da Banca</th>
                            <th>Saldo</th>
                            <th>Lucro/Prejuízo</th>
                            <th>ROI</th>
                            <th>Taxa de Acerto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="banksTable">
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 20px;">Nenhuma banca cadastrada</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Initialize dashboard components
        this.initializeDashboardEvents();
        
        // Load data
        if (window.banksManager) {
            window.banksManager.updateDashboardStats();
            window.banksManager.loadBanks();
        }
        if (window.betsManager) {
            window.betsManager.loadRecentBets();
        }
        if (window.chartsManager) {
            window.chartsManager.updateCharts();
        }
    }

    loadBanks(container) {
        container.innerHTML = `
            <div class="header">
                <h2 class="page-title">Minhas Bancas</h2>
                <div class="user-actions">
                    <button class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="user-profile">
                        <i class="fas fa-user-circle"></i>
                        <span>Usuário</span>
                    </button>
                </div>
            </div>
            <div class="table-container">
                <div class="table-header">
                    <h3>Gerenciar Bancas</h3>
                    <button class="btn btn-primary" id="addBankBtnPage">
                        <i class="fas fa-plus"></i>
                        Nova Banca
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nome da Banca</th>
                            <th>Saldo</th>
                            <th>Lucro/Prejuízo</th>
                            <th>ROI</th>
                            <th>Taxa de Acerto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="banksPageTable">
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 20px;">Nenhuma banca cadastrada</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('addBankBtnPage').addEventListener('click', () => {
            document.getElementById('addBankModal').style.display = 'flex';
        });

        if (window.banksManager) {
            window.banksManager.updateBanksPageTable(dataStorage.getBanks());
        }
    }

    loadBets(container) {
        container.innerHTML = `
            <div class="header">
                <h2 class="page-title">Apostas</h2>
                <div class="user-actions">
                    <button class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="user-profile">
                        <i class="fas fa-user-circle"></i>
                        <span>Usuário</span>
                    </button>
                </div>
            </div>
            <div class="table-container">
                <div class="table-header">
                    <h3>Histórico de Apostas</h3>
                    <button class="btn btn-primary" id="addBetBtnPage">
                        <i class="fas fa-plus"></i>
                        Nova Aposta
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Banca</th>
                            <th>Esporte</th>
                            <th>Jogo</th>
                            <th>Mercado</th>
                            <th>Odd</th>
                            <th>Stake</th>
                            <th>Retorno</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="betsPageTable">
                        <tr>
                            <td colspan="9" style="text-align: center; padding: 20px;">Nenhuma aposta cadastrada</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('addBetBtnPage').addEventListener('click', () => {
            document.getElementById('addBetModal').style.display = 'flex';
        });

        if (window.betsManager) {
            window.betsManager.loadAllBets();
        }
    }

    loadReports(container) {
        container.innerHTML = `
            <div class="header">
                <h2 class="page-title">Relatórios</h2>
                <div class="user-actions">
                    <button class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="user-profile">
                        <i class="fas fa-user-circle"></i>
                        <span>Usuário</span>
                    </button>
                </div>
            </div>
            <div class="charts-container">
                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">Desempenho por Banca</h3>
                    </div>
                    <canvas id="banksPerformanceChart"></canvas>
                </div>
                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">Lucro por Esporte</h3>
                    </div>
                    <canvas id="profitBySportChart"></canvas>
                </div>
            </div>
        `;

        if (window.chartsManager) {
            window.chartsManager.updateReportCharts();
        }
    }

    loadSettings(container) {
        container.innerHTML = `
            <div class="header">
                <h2 class="page-title">Configurações</h2>
                <div class="user-actions">
                    <button class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="user-profile">
                        <i class="fas fa-user-circle"></i>
                        <span>Usuário</span>
                    </button>
                </div>
            </div>
            <div class="card">
                <h3>Configurações Gerais</h3>
                <div class="form-group">
                    <label class="form-label">Moeda</label>
                    <select class="form-control">
                        <option>Real (R$)</option>
                        <option>Dólar ($)</option>
                        <option>Euro (€)</option>
                    </select>
                </div>
            </div>
        `;
    }

    loadStrategies(container) {
        container.innerHTML = `
            <div class="header">
                <h2 class="page-title">Estratégias</h2>
                <div class="user-actions">
                    <button class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="user-profile">
                        <i class="fas fa-user-circle"></i>
                        <span>Usuário</span>
                    </button>
                </div>
            </div>
            <div class="card">
                <h3>Minhas Estratégias</h3>
                <p>Área para gerenciar estratégias de apostas.</p>
            </div>
        `;
    }

    loadNotes(container) {
        container.innerHTML = `
            <div class="header">
                <h2 class="page-title">Anotações</h2>
                <div class="user-actions">
                    <button class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="user-profile">
                        <i class="fas fa-user-circle"></i>
                        <span>Usuário</span>
                    </button>
                </div>
            </div>
            <div class="card">
                <h3>Minhas Anotações</h3>
                <p>Área para anotações pessoais sobre apostas.</p>
            </div>
        `;
    }

    initializeDashboardEvents() {
        const addBetBtn = document.getElementById('addBetBtn');
        const addBankBtn = document.getElementById('addBankBtn');

        if (addBetBtn) {
            addBetBtn.addEventListener('click', () => {
                document.getElementById('addBetModal').style.display = 'flex';
            });
        }

        if (addBankBtn) {
            addBankBtn.addEventListener('click', () => {
                document.getElementById('addBankModal').style.display = 'flex';
            });
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
});