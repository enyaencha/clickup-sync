import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose(); // Close mobile menu after navigation
  };

  const menuItems = [
    {
      section: 'Main',
      items: [
        {
          icon: '🏠',
          label: 'Dashboard',
          path: '/dashboard',
          description: 'Overview & Analytics'
        },
        {
          icon: '🌾',
          label: 'Programs',
          path: '/',
          description: 'Program Modules'
        }
      ]
    },
    {
      section: 'Implementation',
      items: [
        {
          icon: '📋',
          label: 'Activities',
          path: '/activities',
          description: 'Field Activities'
        },
        {
          icon: '👥',
          label: 'Beneficiaries',
          path: '/beneficiaries',
          description: 'Beneficiary Registry'
        },
        {
          icon: '📍',
          label: 'Locations',
          path: '/locations',
          description: 'Geographic Areas'
        }
      ]
    },
    {
      section: 'Logframe & M&E',
      items: [
        {
          icon: '📐',
          label: 'Logframe Dashboard',
          path: '/logframe',
          description: 'RBM Overview'
        },
        {
          icon: '📊',
          label: 'Indicators',
          path: '/logframe/indicators',
          description: 'SMART Indicators'
        },
        {
          icon: '⚠️',
          label: 'Assumptions',
          path: '/logframe/assumptions',
          description: 'Risk Management'
        },
        {
          icon: '✅',
          label: 'Approvals',
          path: '/approvals',
          description: 'Review Activities'
        }
      ]
    },
    {
      section: 'Reports',
      items: [
        {
          icon: '📈',
          label: 'Analytics',
          path: '/reports',
          description: 'Analytics & Reports'
        }
      ]
    },
    {
      section: 'System',
      items: [
        {
          icon: '⚙️',
          label: 'Settings',
          path: '/settings',
          description: 'System Settings'
        },
        {
          icon: '🔄',
          label: 'Sync Status',
          path: '/sync',
          description: 'ClickUp Integration'
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white transition-all duration-300 shadow-2xl z-50 ${
          isExpanded ? 'w-72' : 'w-20'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header with Logo */}
        <div className="p-4 lg:p-6 border-b border-blue-700/50">
          <div className="flex items-center justify-between">
            {isExpanded ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <img
                    src="https://imgs.search.brave.com/PNdTlANN4NjysSONK0pXebhL-xL6RK-nVoIgcy_oPMo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9ob2x5/Y3Jvc3NkYW5kb3Jh/c2hnLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8wOC9X/aGF0c0FwcC1JbWFn/ZS0yMDIxLTA4LTIz/LWF0LTkuMzYuNTAt/QU0tMzAweDExMy5q/cGVn"
                    alt="Caritas Nairobi"
                    className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-base lg:text-lg leading-tight truncate">Caritas Nairobi</h1>
                  <p className="text-xs text-blue-200">M&E System</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto">
                <img
                  src="https://imgs.search.brave.com/PNdTlANN4NjysSONK0pXebhL-xL6RK-nVoIgcy_oPMo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9ob2x5/Y3Jvc3NkYW5kb3Jh/c2hnLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8wOC9X/aGF0c0FwcC1JbWFn/ZS0yMDIxLTA4LTIz/LWF0LTkuMzYuNTAt/QU0tMzAweDExMy5q/cGVn"
                  alt="Caritas"
                  className="w-8 h-8 object-contain"
                />
              </div>
            )}

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-blue-700/50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Toggle Button - Desktop only */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:block absolute -right-3 top-8 w-6 h-6 bg-blue-600 rounded-full items-center justify-center text-xs hover:bg-blue-500 transition-colors shadow-lg"
          >
            {isExpanded ? '‹' : '›'}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="overflow-y-auto h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] py-4 custom-scrollbar">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              {isExpanded && (
                <h3 className="px-6 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1 px-3">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 lg:py-3 rounded-lg transition-all duration-200 group active:scale-95 ${
                      isActive(item.path)
                        ? 'bg-white/10 shadow-lg border-l-4 border-yellow-400'
                        : 'hover:bg-white/5 border-l-4 border-transparent hover:border-blue-400 active:bg-white/10'
                    }`}
                    title={!isExpanded ? item.label : ''}
                  >
                    <span className="text-xl lg:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    {isExpanded && (
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-sm truncate">{item.label}</div>
                        <div className="text-xs text-blue-200 opacity-75 truncate">
                          {item.description}
                        </div>
                      </div>
                    )}
                    {isExpanded && isActive(item.path) && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse flex-shrink-0"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer - User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-blue-700/50 bg-blue-900/50 backdrop-blur">
          {isExpanded ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-blue-900 shadow-lg flex-shrink-0 text-sm">
                MO
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">M&E Officer</p>
                <p className="text-xs text-blue-200 truncate">officer@caritas.org</p>
              </div>
              <button className="text-blue-200 hover:text-white transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-blue-900 shadow-lg text-sm">
                MO
              </div>
            </div>
          )}
        </div>

        {/* Custom Scrollbar Styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;
