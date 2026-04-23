import React from 'react';

const FloatingActionButton = () => {
  return (
    <div className="hidden md:block fixed bottom-8 right-8 z-40">
      <a className="flex items-center gap-3 bg-primary text-white pl-4 pr-6 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all" href="#modal-new-incident">
        <span className="material-symbols-outlined">add_task</span>
        <span className="font-headline font-bold text-sm uppercase tracking-wider">Nueva Solicitud</span>
      </a>
    </div>
  );
};

export default FloatingActionButton;
