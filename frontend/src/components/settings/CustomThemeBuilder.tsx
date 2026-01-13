import React, { useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, description }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      {description && <p className="text-xs text-gray-600">{description}</p>}
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 rounded border-2 border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

interface CustomThemeBuilderProps {
  onSave: (theme: any) => void;
  onCancel: () => void;
  editingTheme?: any;
}

const CustomThemeBuilder: React.FC<CustomThemeBuilderProps> = ({ onSave, onCancel, editingTheme }) => {
  const [themeName, setThemeName] = useState(editingTheme?.name || '');
  const [themeIcon, setThemeIcon] = useState(editingTheme?.icon || '🎨');

  // Sidebar colors
  const [sidebarBg1, setSidebarBg1] = useState(editingTheme?.colors.sidebarBg1 || '#0f0f1e');
  const [sidebarBg2, setSidebarBg2] = useState(editingTheme?.colors.sidebarBg2 || '#1a1a2e');
  const [sidebarText, setSidebarText] = useState(editingTheme?.colors.sidebarText || '#e0e0e0');
  const [sidebarActiveBg, setSidebarActiveBg] = useState(editingTheme?.colors.sidebarActiveBg || '#00fff5');
  const [sidebarActiveBorder, setSidebarActiveBorder] = useState(editingTheme?.colors.sidebarActiveBorder || '#00fff5');

  // Main content colors
  const [mainBg1, setMainBg1] = useState(editingTheme?.colors.mainBg1 || '#16213e');
  const [mainBg2, setMainBg2] = useState(editingTheme?.colors.mainBg2 || '#0f3460');
  const [mainText, setMainText] = useState(editingTheme?.colors.mainText || '#e0e0e0');

  // Card colors
  const [cardBg, setCardBg] = useState(editingTheme?.colors.cardBg || '#1a1a2e');
  const [cardBorder, setCardBorder] = useState(editingTheme?.colors.cardBorder || '#00fff5');

  // Accent colors
  const [accentPrimary, setAccentPrimary] = useState(editingTheme?.colors.accentPrimary || '#00fff5');
  const [accentSecondary, setAccentSecondary] = useState(editingTheme?.colors.accentSecondary || '#00d4d4');

  const handleSave = () => {
    if (!themeName.trim()) {
      alert('Please enter a theme name');
      return;
    }

    const isCustom = editingTheme?.isCustom ?? true;

    const customTheme = {
      id: editingTheme?.id || `custom-${Date.now()}`,
      name: themeName,
      description: editingTheme?.description || 'Custom Theme',
      icon: themeIcon,
      isCustom,
      colors: {
        sidebarBg1,
        sidebarBg2,
        sidebarText,
        sidebarActiveBg,
        sidebarActiveBorder,
        mainBg1,
        mainBg2,
        mainText,
        cardBg,
        cardBorder,
        accentPrimary,
        accentSecondary,
        // Derived values
        sidebarBackground: `linear-gradient(180deg, ${sidebarBg1} 0%, ${sidebarBg2} 100%)`,
        sidebarActiveItem: `${sidebarActiveBg}33`,
        sidebarHover: `${sidebarActiveBg}1a`,
        mainBackground: `linear-gradient(to bottom, ${mainBg1}, ${mainBg2})`,
        cardBackground: cardBg,
        cardShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        accentGradient: `linear-gradient(135deg, ${accentPrimary} 0%, ${accentSecondary} 100%)`,
        statCardBackground: cardBg,
        statCardBorderColor: `linear-gradient(to bottom, ${accentPrimary}, ${accentSecondary})`,
        activityCardBackground: `${accentPrimary}1a`,
        activityCardBorder: accentPrimary,
        programCardBackground: cardBg,
        programCardBorder: accentPrimary,
        programIconBackground: `${accentPrimary}33`,
        programIconColor: accentPrimary,
        programStatusBackground: `${accentPrimary}33`,
        programStatusColor: accentPrimary,
      }
    };

    onSave(customTheme);
  };

  const popularIcons = ['🎨', '🌈', '⭐', '💎', '🎭', '🌟', '✨', '🔮', '🎪', '🎯', '🎸', '🎹', '🎺', '🎻', '🎬'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">🎨 Custom Theme Builder</h2>
          <p className="text-blue-100 text-sm mt-1">Create your own unique color scheme</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Theme Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Theme Name *</label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="My Awesome Theme"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Theme Icon</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={themeIcon}
                    onChange={(e) => setThemeIcon(e.target.value)}
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center text-2xl"
                    maxLength={2}
                  />
                  <div className="flex-1 flex flex-wrap gap-1">
                    {popularIcons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setThemeIcon(icon)}
                        className="w-8 h-8 text-lg hover:bg-blue-100 rounded transition-colors"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Colors */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📱</span> Sidebar Colors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Sidebar Background (Top)"
                value={sidebarBg1}
                onChange={setSidebarBg1}
                description="Top color of sidebar gradient"
              />
              <ColorPicker
                label="Sidebar Background (Bottom)"
                value={sidebarBg2}
                onChange={setSidebarBg2}
                description="Bottom color of sidebar gradient"
              />
              <ColorPicker
                label="Sidebar Text Color"
                value={sidebarText}
                onChange={setSidebarText}
                description="Navigation text color"
              />
              <ColorPicker
                label="Active Item Background"
                value={sidebarActiveBg}
                onChange={setSidebarActiveBg}
                description="Active navigation item color"
              />
              <ColorPicker
                label="Active Item Border"
                value={sidebarActiveBorder}
                onChange={setSidebarActiveBorder}
                description="Left border for active items"
              />
            </div>
          </div>

          {/* Main Content Colors */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🖥️</span> Main Content Colors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Main Background (Top)"
                value={mainBg1}
                onChange={setMainBg1}
                description="Top color of main area"
              />
              <ColorPicker
                label="Main Background (Bottom)"
                value={mainBg2}
                onChange={setMainBg2}
                description="Bottom color of main area"
              />
              <ColorPicker
                label="Main Text Color"
                value={mainText}
                onChange={setMainText}
                description="Primary text color"
              />
            </div>
          </div>

          {/* Card Colors */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📄</span> Card & Container Colors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Card Background"
                value={cardBg}
                onChange={setCardBg}
                description="Background for cards and panels"
              />
              <ColorPicker
                label="Card Border"
                value={cardBorder}
                onChange={setCardBorder}
                description="Border color for cards"
              />
            </div>
          </div>

          {/* Accent Colors */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎯</span> Accent Colors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Primary Accent"
                value={accentPrimary}
                onChange={setAccentPrimary}
                description="Primary buttons and highlights"
              />
              <ColorPicker
                label="Secondary Accent"
                value={accentSecondary}
                onChange={setAccentSecondary}
                description="Hover states and gradients"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 Preview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="h-32 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
                style={{ background: `linear-gradient(180deg, ${sidebarBg1} 0%, ${sidebarBg2} 100%)`, color: sidebarText }}
              >
                Sidebar
              </div>
              <div
                className="h-32 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
                style={{ background: `linear-gradient(to bottom, ${mainBg1}, ${mainBg2})`, color: mainText }}
              >
                Main Content
              </div>
              <div
                className="h-20 rounded-lg shadow-lg flex items-center justify-center font-bold"
                style={{ background: cardBg, color: mainText, border: `2px solid ${cardBorder}` }}
              >
                Card
              </div>
              <div
                className="h-20 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
                style={{ background: accentPrimary }}
              >
                Button
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 border-t-2 border-gray-200 rounded-b-2xl flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg"
          >
            {editingTheme ? 'Update Theme' : 'Save Theme'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomThemeBuilder;
