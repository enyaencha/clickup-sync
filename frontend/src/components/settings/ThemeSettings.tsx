import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSettings: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="space-y-6">
      {/* Current Theme Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="text-5xl">{currentTheme.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Current Theme</h3>
            <p className="text-lg text-gray-700 font-semibold">{currentTheme.name}</p>
            <p className="text-sm text-gray-600">{currentTheme.description}</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: currentTheme.colors.accentPrimary }}></div>
            <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: currentTheme.colors.sidebarBackground }}></div>
          </div>
        </div>
      </div>

      {/* Theme Description */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">Theme Preferences</p>
            <p className="text-sm text-blue-700 mt-1">
              Your theme preference is saved per device. Each device can have its own theme setting.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Themes ({availableThemes.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableThemes.map((theme) => {
            const isActive = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`
                  relative group text-left rounded-xl overflow-hidden transition-all duration-300 transform
                  ${isActive
                    ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                    : 'hover:scale-105 hover:shadow-xl ring-2 ring-gray-200 hover:ring-blue-300'
                  }
                `}
              >
                {/* Theme Preview */}
                <div className="h-32 relative" style={{ background: theme.colors.sidebarBackground }}>
                  <div className="absolute inset-0 opacity-50" style={{ background: theme.colors.mainBackground }}></div>
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-white/80"></div>
                      <div className="w-3 h-3 rounded-full bg-white/60"></div>
                      <div className="w-3 h-3 rounded-full bg-white/40"></div>
                    </div>
                    <div className="text-3xl">{theme.icon}</div>
                  </div>

                  {/* Mini Preview Cards */}
                  <div className="absolute bottom-3 left-4 right-4 flex space-x-2">
                    <div
                      className="flex-1 h-8 rounded shadow-lg"
                      style={{
                        background: theme.colors.cardBackground,
                        border: `1px solid ${theme.colors.cardBorder}`
                      }}
                    ></div>
                    <div
                      className="flex-1 h-8 rounded shadow-lg"
                      style={{
                        background: theme.colors.cardBackground,
                        border: `1px solid ${theme.colors.cardBorder}`
                      }}
                    ></div>
                  </div>

                  {/* Active Badge */}
                  {isActive && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Active</span>
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="p-4 bg-white">
                  <h4 className="font-bold text-gray-900 text-base mb-1 flex items-center justify-between">
                    {theme.name}
                    {isActive && (
                      <span className="text-blue-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{theme.description}</p>

                  {/* Color Palette */}
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 rounded shadow-sm border border-gray-200" style={{ background: theme.colors.accentPrimary }} title="Primary Color"></div>
                    <div className="w-6 h-6 rounded shadow-sm border border-gray-200" style={{ background: theme.colors.accentSecondary }} title="Secondary Color"></div>
                    <div className="flex-1"></div>
                    {!isActive && (
                      <span className="text-xs text-blue-600 font-semibold group-hover:text-blue-700">
                        Apply →
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>About Themes</span>
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Themes are saved per device - each device can have its own preference</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>The default theme is <strong>Dark Professional</strong> - Modern Cyan/Black</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Click on any theme card to instantly apply it to your interface</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>All themes are professionally designed for optimal readability and aesthetics</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeSettings;
