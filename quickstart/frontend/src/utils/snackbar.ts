type SnackbarType = 'success' | 'error' | 'info';

const colors: Record<SnackbarType, { bg: string; text: string }> = {
  success: { bg: '#D1FAE5', text: '#065F46' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
};

export function showSnackbar(message: string, type: SnackbarType = 'info'): void {
  const existing = document.getElementById('cl-snackbar');
  if (existing) existing.remove();

  const snackbar = document.createElement('div');
  snackbar.id = 'cl-snackbar';
  snackbar.textContent = message;

  Object.assign(snackbar.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    minWidth: '280px',
    padding: '14px 24px',
    backgroundColor: colors[type].bg,
    color: colors[type].text,
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: '10000',
    opacity: '0',
    transform: 'translateY(-10px)',
    transition: 'opacity 0.2s, transform 0.2s',
  });

  document.body.appendChild(snackbar);

  requestAnimationFrame(() => {
    snackbar.style.opacity = '1';
    snackbar.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    snackbar.style.opacity = '0';
    snackbar.style.transform = 'translateY(-10px)';
    setTimeout(() => snackbar.remove(), 200);
  }, 2500);
}
