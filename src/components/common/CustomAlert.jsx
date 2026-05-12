import React from 'react';

const CustomAlert = ({ config, setConfig }) => {
  if (!config.show) return null;

  const {
    type = 'warning', // 'warning', 'success', 'error', 'info'
    message = '',
    title = '',
    redirectHash = '',
    onConfirm = null,
    onCancel = null,
    showCancel = true,
    confirmText = 'Continuar',
    cancelText = 'Cancelar'
  } = config;

  const handleClose = () => {
    setConfig({ ...config, show: false });
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else if (redirectHash) {
      window.location.hash = redirectHash;
    }
    handleClose();
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };

  const getStyleParams = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check_circle',
          colorClass: 'text-emerald-500',
          bgClass: 'bg-emerald-500/10',
          pingClass: 'bg-emerald-500/30',
          defaultTitle: 'Éxito'
        };
      case 'error':
        return {
          icon: 'error',
          colorClass: 'text-rose-500',
          bgClass: 'bg-rose-500/10',
          pingClass: 'bg-rose-500/30',
          defaultTitle: 'Error'
        };
      case 'info':
        return {
          icon: 'info',
          colorClass: 'text-blue-500',
          bgClass: 'bg-blue-500/10',
          pingClass: 'bg-blue-500/30',
          defaultTitle: 'Información'
        };
      case 'warning':
      default:
        return {
          icon: 'warning',
          colorClass: 'text-amber-500',
          bgClass: 'bg-amber-500/10',
          pingClass: 'bg-amber-500/30',
          defaultTitle: 'Aviso Importante'
        };
    }
  };

  const styles = getStyleParams();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200 pointer-events-auto">
      <div className="bg-surface w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/10">
        <div className="p-6 text-center">
          <div className={`w-16 h-16 ${styles.bgClass} ${styles.colorClass} rounded-full flex items-center justify-center mx-auto mb-4 relative`}>
            <span className={`absolute inset-0 ${styles.pingClass} rounded-full animate-ping opacity-75`}></span>
            <span className="material-symbols-outlined text-3xl relative z-10 animate-pulse">{styles.icon}</span>
          </div>
          <h3 className="text-xl font-headline font-bold text-on-surface mb-2 tracking-tight uppercase">
            {title || styles.defaultTitle}
          </h3>
          <p className="text-sm font-body text-stone-500 dark:text-on-surface-variant mb-6">{message}</p>
          
          <div className="flex gap-3">
            {showCancel && (
              <button 
                type="button"
                onClick={handleCancelClick}
                className="flex-1 py-3 text-on-surface-variant font-headline font-bold text-xs uppercase tracking-wider rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button 
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-wider rounded-lg transition-transform active:scale-95 shadow-lg shadow-primary/20"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
