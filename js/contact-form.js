(() => {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.contact-status');
    const tokenField = form.elements.namedItem('csrf_token');
    const endpoint = form.getAttribute('action');
    const showStatus = (message, error = false) => {
        status.textContent = message;
        status.dataset.error = String(error);
    };
    async function prepare() {
        const response = await fetch(endpoint, { credentials: 'same-origin', cache: 'no-store' });
        if (!response.ok) throw new Error('Form unavailable');
        const data = await response.json();
        if (!data.csrf_token) throw new Error('Form unavailable');
        tokenField.value = data.csrf_token;
        button.disabled = false;
    }
    prepare().then(() => showStatus('')).catch(() => {
        showStatus('The contact form is temporarily unavailable. Please email cbc@dabu.dk.', true);
    });
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        button.disabled = true;
        showStatus('Sending your message…');
        try {
            const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), credentials: 'same-origin' });
            const data = await response.json();
            if (!response.ok || !data.ok) {
                showStatus(data.message || 'Your message could not be sent. Please email cbc@dabu.dk.', true);
                if (response.status === 403) await prepare();
                return;
            }
            form.reset();
            showStatus('Thank you — your message has been submitted.');
        } catch {
            showStatus('We could not confirm that your message was sent. Please email cbc@dabu.dk instead.', true);
        } finally {
            button.disabled = false;
        }
    });
})();
