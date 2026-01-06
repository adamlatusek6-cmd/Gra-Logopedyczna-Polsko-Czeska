// Vlastní výstražné/potvrzovací modální okno
class CustomAlert {
    constructor() {
        if (!document.getElementById('customAlertOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'customAlertOverlay';
            overlay.className = 'custom-alert-overlay';
            const alertBox = document.createElement('div');
            alertBox.id = 'customAlertBox';
            alertBox.className = 'custom-alert-box';
            overlay.appendChild(alertBox);
            document.body.appendChild(overlay);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.close();
            });
        }
    }

    show(message, type = 'info', title = '') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('customAlertOverlay');
            const alertBox = document.getElementById('customAlertBox');
            const icons = {
                success: '🎉',
                success1: '🎉',
                error: '❌',
                error1: '❌',
                warning: '⚠️',
                warning1: '⚠️',
                info: 'ℹ️',
                info1: 'ℹ️'
            };
            const titles = {
                success: title || 'Úspěch!',
                success1: title || 'Success!',
                error: title || 'Chyba!',
                error1: title || 'Error!',
                warning: title || 'Upozornění!',
                warning1: title || 'Warning!',
                info: title || 'Informace',
                info1: title || 'Information'
            };
            alertBox.className = 'custom-alert-box ' + type;
            alertBox.innerHTML = `
                <div class="custom-alert-header">
                    <span class="custom-alert-icon">${icons[type]}</span>
                    <h2 class="custom-alert-title">${titles[type]}</h2>
                </div>
                <div class="custom-alert-body">
                    <p>${message}</p>
                </div>
                <div class="custom-alert-footer">
                    <button class="custom-alert-btn">OK</button>
                </div>
            `;
            overlay.style.display = 'flex';
            const btn = alertBox.querySelector('.custom-alert-btn');
            btn.addEventListener('click', () => {
                this.close();
                resolve();
            });
            btn.focus();
        });
    }

    success(message, title = 'Úspěch!') {
        return this.show(message, 'success', title);
    }

    success1(message, title = 'Success!') {
        return this.show(message, 'success1', title);
    }

    error(message, title = 'Chyba!') {
        return this.show(message, 'error', title);
    }

    error1(message, title = 'Error!') {
        return this.show(message, 'error1', title);
    }

    warning(message, title = 'Upozornění!', buttons = []) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('customAlertOverlay');
            const alertBox = document.getElementById('customAlertBox');
            const icons = { warning: '⚠️', warning1: '⚠️' };
            alertBox.className = 'custom-alert-box warning';
            let buttonsHtml = '';
            buttons.forEach((btn) => {
                buttonsHtml += `<button class="custom-alert-btn ${btn.class}">${btn.text}</button>`;
            });
            alertBox.innerHTML = `
                <div class="custom-alert-header">
                    <span class="custom-alert-icon">${icons.warning}</span>
                    <h2 class="custom-alert-title">${title}</h2>
                </div>
                <div class="custom-alert-body">
                    <p>${message}</p>
                </div>
                <div class="custom-alert-footer">
                    ${buttonsHtml}
                </div>
            `;
            overlay.style.display = 'flex';
            const btns = alertBox.querySelectorAll('.custom-alert-btn');
            btns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.close();
                    resolve(btn.textContent);
                });
            });
            btns[0].focus();
        });
    }

    warning1(message, title = 'Warning!', buttons = []) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('customAlertOverlay');
            const alertBox = document.getElementById('customAlertBox');
            const icons = { warning1: '⚠️' };
            alertBox.className = 'custom-alert-box warning1';
            let buttonsHtml = '';
            buttons.forEach((btn) => {
                buttonsHtml += `<button class="custom-alert-btn ${btn.class}">${btn.text}</button>`;
            });
            alertBox.innerHTML = `
                <div class="custom-alert-header">
                    <span class="custom-alert-icon">${icons.warning1}</span>
                    <h2 class="custom-alert-title">${title}</h2>
                </div>
                <div class="custom-alert-body">
                    <p>${message}</p>
                </div>
                <div class="custom-alert-footer">
                    ${buttonsHtml}
                </div>
            `;
            overlay.style.display = 'flex';
            const btns = alertBox.querySelectorAll('.custom-alert-btn');
            btns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.close();
                    resolve(btn.textContent);
                });
            });
            btns[0].focus();
        });
    }

    info(message, title = 'Informace') {
        return this.show(message, 'info', title);
    }

    info1(message, title = 'Information') {
        return this.show(message, 'info1', title);
    }

    close() {
        const overlay = document.getElementById('customAlertOverlay');
        if (overlay) overlay.style.display = 'none';
    }
}

// Vytvoř globální instanci
const customAlert = new CustomAlert();