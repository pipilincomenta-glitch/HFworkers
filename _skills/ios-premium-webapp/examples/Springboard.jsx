/* 
  ios-premium-webapp: Springboard Layout Blueprint
  
  This component demonstrates the classic iPhone home screen 
  modular architecture with app icons and a bottom dock.
*/

import React from 'react';

const Springboard = ({ apps, onAppClick, settingsLabel }) => {
  return (
    <div className="home-screen">
      {/* App Grid */}
      <div className="home-grid">
        {apps.map(app => (
          <div key={app.id} className="app-icon-wrapper" onClick={() => onAppClick(app.id)}>
            <div className="app-icon" style={{ background: app.bg }}>
              {app.icon}
            </div>
            <span className="app-label">{app.name}</span>
          </div>
        ))}
        
        {/* Settings row (example of specific styling) */}
        <div className="app-icon-wrapper" onClick={() => onAppClick('settings')}>
          <div className="app-icon" style={{ background: 'linear-gradient(135deg, #8e8e93 0%, #3a3a3c 100%)' }}>
            <SettingsIcon />
          </div>
          <span className="app-label">{settingsLabel}</span>
        </div>
      </div>
      
      {/* Bottom Dock */}
      <div className="dock">
         {/* Persistent app shortcuts go here */}
         <div className="dock-icon" onClick={() => onAppClick('messenger')}><MessagesIcon /></div>
         <div className="dock-icon" onClick={() => onAppClick('tasks')}><TasksIcon /></div>
      </div>
    </div>
  );
};

export default Springboard;
 Wilmington
