import React from 'react';

const TopNav = () => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xl border-b-0">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold uppercase tracking-tighter text-red-950 dark:text-red-100 font-headline">Servicio Técnico de Ferrominera</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 ml-4">
          <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
            <img alt="User profile avatar" className="w-full h-full object-cover" data-alt="professional portrait of an industrial engineer in a clean tech environment with subtle bokeh background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa-x8UdZc7jv5r2HimlZTRd0usRqL1tQmivp_pzO9_J36rW2wy1sozyg_wGGStlRsc4dfh7_EgwpazVrHxDZYWjTOZnSitY84njIsMI_8x-7WnRCiLAxbsfh92TXXNYYaLW_bsowI6HmRhdAN_Fqh0vnbY_RHysNSxqSpCOVhcNZz2qBFTG-oe2NallkkZOaQAsamde47NgRdg-TrVoDBQiyEFf3OvBlsiaTJNYODUtJjieP0cCdP41FAI9iQyClTldA0_m1yJG2fk"/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
