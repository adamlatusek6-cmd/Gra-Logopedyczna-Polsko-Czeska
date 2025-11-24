// Custom Alert/Confirm Modal
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
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            const titles = {
                success: title || 'Sukces!',
                error: title || 'Błąd!',
                warning: title || 'Uwaga!',
                info: title || 'Informacja'
            };

            alertBox.className = 'custom-alert-box ' + type;
            alertBox.innerHTML = `
                <div class="custom-alert-icon ${type}">${icons[type] || icons.info}</div>
                <div class="custom-alert-title">${titles[type]}</div>
                <div class="custom-alert-message">${message}</div>
                <button class="custom-alert-button" autofocus>OK</button>
            `;

            overlay.classList.add('show');

            const okButton = alertBox.querySelector('.custom-alert-button');
            const closeModal = () => {
                this.close();
                resolve();
                okButton.removeEventListener('click', closeModal);
            };

            okButton.addEventListener('click', closeModal);

            // Focus na przycisku OK
            okButton.focus();
        });
    }

    confirm(message, title = 'Potwierdzenie') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('customAlertOverlay');
            const alertBox = document.getElementById('customAlertBox');
            alertBox.className = 'custom-alert-box warning';

            alertBox.innerHTML = `
                <div class="custom-alert-icon warning">❓</div>
                <div class="custom-alert-title">${title}</div>
                <div class="custom-alert-message">${message}</div>
                <div class="custom-alert-buttons">
                    <button class="custom-alert-button confirm-yes" autofocus>Tak</button>
                    <button class="custom-alert-button confirm-no">Nie</button>
                </div>
            `;

            overlay.classList.add('show');

            const yesBtn = alertBox.querySelector('.confirm-yes');
            const noBtn = alertBox.querySelector('.confirm-no');

            const cleanUp = () => {
                yesBtn.removeEventListener('click', onYes);
                noBtn.removeEventListener('click', onNo);
            };
            const onYes = () => {
                this.close();
                cleanUp();
                resolve(true);
            };
            const onNo = () => {
                this.close();
                cleanUp();
                resolve(false);
            };

            yesBtn.addEventListener('click', onYes);
            noBtn.addEventListener('click', onNo);

            // Focus domyślnie na przycisku Tak
            yesBtn.focus();
        });
    }

    close() {
        const overlay = document.getElementById('customAlertOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    success(message, title) { return this.show(message, 'success', title); }
    error(message, title) { return this.show(message, 'error', title); }
    warning(message, title) { return this.show(message, 'warning', title); }
    info(message, title) { return this.show(message, 'info', title); }
}

const customAlert = new CustomAlert();
/*
// Nadpisanie natywnych alert i confirm
window.alert = function (msg) {
    return customAlert.info(msg);
};
window.confirm = function (msg) {
    return customAlert.confirm(msg);
};
*/