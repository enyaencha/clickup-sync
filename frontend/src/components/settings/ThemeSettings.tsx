import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import CustomThemeBuilder from './CustomThemeBuilder';

const ThemeSettings: React.FC = () => {
  const {
    currentTheme,
    setTheme,
    availableThemes,
    addCustomTheme,
    updateCustomTheme,
    updateDefaultTheme,
    deleteCustomTheme,
    followSystemTheme,
    setFollowSystemTheme
  } = useTheme();
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTheme, setEditingTheme] = useState<any>(null);

  const defaultThemes = availableThemes.filter(t => !t.isCustom);
  const userCustomThemes = availableThemes.filter(t => t.isCustom);

  const extractGradientStops = (gradient: string, fallbackStart: string, fallbackEnd: string) => {
    const matches = gradient.match(/#[0-9a-fA-F]{3,8}/g);
    if (matches && matches.length >= 2) {
      return [matches[0], matches[1]];
    }
    return [fallbackStart, fallbackEnd];
  };

  const toEditableTheme = (theme: any) => {
    const [sidebarBg1, sidebarBg2] = extractGradientStops(
      theme.colors.sidebarBackground,
      theme.colors.accentPrimary,
      theme.colors.accentSecondary
    );
    const [mainBg1, mainBg2] = extractGradientStops(
      theme.colors.mainBackground,
      theme.colors.cardBackground,
      theme.colors.cardBackground
    );

    return {
      ...theme,
      colors: {
        ...theme.colors,
        sidebarBg1,
        sidebarBg2,
        sidebarText: theme.colors.sidebarText,
        sidebarActiveBg: theme.colors.accentPrimary,
        sidebarActiveBorder: theme.colors.sidebarActiveBorder,
        mainBg1,
        mainBg2,
        mainText: theme.colors.mainText,
        cardBg: theme.colors.cardBackground,
        cardBorder: theme.colors.cardBorder,
      }
    };
  };

  const handleCreateTheme = () => {
    setEditingTheme(null);
    setShowBuilder(true);
  };

  const handleEditTheme = (theme: any) => {
    setEditingTheme(toEditableTheme(theme));
    setShowBuilder(true);
  };

  const handleSaveTheme = (theme: any) => {
    if (editingTheme) {
      if (editingTheme.isCustom) {
        updateCustomTheme(theme);
      } else {
        updateDefaultTheme(theme);
      }
    } else {
      addCustomTheme(theme);
    }
    setShowBuilder(false);
    setEditingTheme(null);
  };

  const handleDeleteTheme = (themeId: string, themeName: string) => {
    if (window.confirm(`Are you sure you want to delete "${themeName}"? This cannot be undone.`)) {
      deleteCustomTheme(themeId);
    }
  };

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
            {(currentTheme as any).isCustom && (
              <span className="inline-flex items-center mt-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                ✨ Custom Theme
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: currentTheme.colors.accentPrimary }}></div>
            <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: currentTheme.colors.sidebarBackground }}></div>
          </div>
        </div>
      </div>

      {/* System Theme Toggle */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
              🌓
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Follow System Theme</h3>
              <p className="text-sm text-gray-600">Automatically switch theme based on your device's appearance settings</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={followSystemTheme}
              onChange={(e) => setFollowSystemTheme(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500"></div>
          </label>
        </div>
        {followSystemTheme && (
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-indigo-900">System Theme Active</p>
                <p className="text-sm text-indigo-700 mt-1">
                  Your theme will automatically switch between light and dark modes when your device settings change. Manual theme selection is disabled while this is enabled.
                </p>
              </div>
            </div>
          </div>
        )}
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
              Your theme preference is saved per device. Each device can have its own theme setting. Custom themes are also stored locally on your device.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Theme Builder Button */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-dashed border-purple-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              🎨
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Create Your Own Theme</h3>
              <p className="text-sm text-gray-600">Design a custom color scheme with millions of colors</p>
            </div>
          </div>
          <button
            onClick={handleCreateTheme}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            + New Theme
          </button>
        </div>
      </div>

      {/* Custom Themes Section */}
      {userCustomThemes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">✨</span>
              My Custom Themes ({userCustomThemes.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCustomThemes.map((theme) => {
              const isActive = currentTheme.id === theme.id;
              return (
                <div
                  key={theme.id}
                  className={`
                    relative group rounded-xl overflow-hidden transition-all duration-300 transform
                    ${isActive
                      ? 'ring-4 ring-purple-500 shadow-2xl scale-105'
                      : 'hover:scale-105 hover:shadow-xl ring-2 ring-purple-200 hover:ring-purple-400'
                    }
                  `}
                >
                  <button
                    onClick={() => setTheme(theme.id)}
                    className="w-full text-left"
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
                        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Active</span>
                        </div>
                      )}

                      {/* Custom Theme Badge */}
                      <div className="absolute bottom-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Custom
                      </div>
                    </div>

                    {/* Theme Info */}
                    <div className="p-4 bg-white">
                      <h4 className="font-bold text-gray-900 text-base mb-1 flex items-center justify-between">
                        {theme.name}
                        {isActive && (
                          <span className="text-purple-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{theme.description}</p>

                      {/* Color Palette */}
                      <div className="flex items-center space-x-1 mb-3">
                        <div className="w-6 h-6 rounded shadow-sm border border-gray-200" style={{ background: theme.colors.accentPrimary }} title="Primary Color"></div>
                        <div className="w-6 h-6 rounded shadow-sm border border-gray-200" style={{ background: theme.colors.accentSecondary }} title="Secondary Color"></div>
                        <div className="flex-1"></div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTheme(theme);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded hover:bg-purple-200 transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTheme(theme.id, theme.name);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Default Themes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Built-in Themes ({defaultThemes.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {defaultThemes.map((theme) => {
            const isActive = currentTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                className={`
                  relative group text-left rounded-xl overflow-hidden transition-all duration-300 transform
                  ${isActive
                    ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                    : 'hover:scale-105 hover:shadow-xl ring-2 ring-gray-200 hover:ring-blue-300'
                  }
                `}
              >
                <button
                  onClick={() => setTheme(theme.id)}
                  className="w-full text-left"
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

                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTheme(theme);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors shadow-sm"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
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
            <span className="text-indigo-500 mt-0.5">🌓</span>
            <span>Enable <strong>Follow System Theme</strong> to automatically match your device's light/dark mode</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>The default theme is <strong>Dark Professional</strong> - Modern Cyan/Black</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Create unlimited custom themes with your favorite colors</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-0.5">✨</span>
            <span>Custom themes are stored locally and won't be visible on other devices</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>All themes are optimized for readability and aesthetics</span>
          </li>
        </ul>
      </div>

      {/* Custom Theme Builder Modal */}
      {showBuilder && (
        <CustomThemeBuilder
          onSave={handleSaveTheme}
          onCancel={() => {
            setShowBuilder(false);
            setEditingTheme(null);
          }}
          editingTheme={editingTheme}
        />
      )}
    </div>
  );
};

export default ThemeSettings;
