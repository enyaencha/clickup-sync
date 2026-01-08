import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface Location {
  id: number;
  name: string;
  type: 'country' | 'county' | 'sub_county' | 'ward' | 'parish';
  parent_id: number | null;
}

interface LocationSelectorProps {
  value?: number | null;
  onChange: (locationId: number | null, locationData: Location | null) => void;
  required?: boolean;
  showAllLevels?: boolean;
  maxLevel?: 'country' | 'county' | 'sub_county' | 'ward' | 'parish';
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  required = false,
  showAllLevels = true,
  maxLevel = 'parish'
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [selectedSubCounty, setSelectedSubCounty] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [selectedParish, setSelectedParish] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const levelOrder = ['country', 'county', 'sub_county', 'ward', 'parish'];
  const maxLevelIndex = levelOrder.indexOf(maxLevel);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (value && locations.length > 0) {
      loadSelectedLocation(value);
    }
  }, [value, locations]);

  const fetchLocations = async () => {
    try {
      const response = await authFetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedLocation = async (locationId: number) => {
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    // Build hierarchy
    let current: Location | undefined = location;
    const hierarchy: Location[] = [current];

    while (current.parent_id) {
      current = locations.find(l => l.id === current!.parent_id);
      if (current) hierarchy.unshift(current);
    }

    // Set selections based on hierarchy
    hierarchy.forEach(loc => {
      switch (loc.type) {
        case 'country':
          setSelectedCountry(loc.id);
          break;
        case 'county':
          setSelectedCounty(loc.id);
          break;
        case 'sub_county':
          setSelectedSubCounty(loc.id);
          break;
        case 'ward':
          setSelectedWard(loc.id);
          break;
        case 'parish':
          setSelectedParish(loc.id);
          break;
      }
    });
  };

  const getFilteredLocations = (type: string, parentId: number | null = null) => {
    return locations.filter(l => l.type === type && l.parent_id === parentId);
  };

  const handleCountryChange = (countryId: string) => {
    const id = countryId ? parseInt(countryId) : null;
    setSelectedCountry(id);
    setSelectedCounty(null);
    setSelectedSubCounty(null);
    setSelectedWard(null);
    setSelectedParish(null);

    if (id && maxLevel === 'country') {
      const location = locations.find(l => l.id === id);
      onChange(id, location || null);
    }
  };

  const handleCountyChange = (countyId: string) => {
    const id = countyId ? parseInt(countyId) : null;
    setSelectedCounty(id);
    setSelectedSubCounty(null);
    setSelectedWard(null);
    setSelectedParish(null);

    if (id && maxLevel === 'county') {
      const location = locations.find(l => l.id === id);
      onChange(id, location || null);
    }
  };

  const handleSubCountyChange = (subCountyId: string) => {
    const id = subCountyId ? parseInt(subCountyId) : null;
    setSelectedSubCounty(id);
    setSelectedWard(null);
    setSelectedParish(null);

    if (id && maxLevel === 'sub_county') {
      const location = locations.find(l => l.id === id);
      onChange(id, location || null);
    }
  };

  const handleWardChange = (wardId: string) => {
    const id = wardId ? parseInt(wardId) : null;
    setSelectedWard(id);
    setSelectedParish(null);

    if (id && maxLevel === 'ward') {
      const location = locations.find(l => l.id === id);
      onChange(id, location || null);
    }
  };

  const handleParishChange = (parishId: string) => {
    const id = parishId ? parseInt(parishId) : null;
    setSelectedParish(id);

    if (id) {
      const location = locations.find(l => l.id === id);
      onChange(id, location || null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const countries = getFilteredLocations('country');
  const counties = selectedCountry ? getFilteredLocations('county', selectedCountry) : [];
  const subCounties = selectedCounty ? getFilteredLocations('sub_county', selectedCounty) : [];
  const wards = selectedSubCounty ? getFilteredLocations('ward', selectedSubCounty) : [];
  const parishes = selectedWard ? getFilteredLocations('parish', selectedWard) : [];

  const shouldShowLevel = (level: string) => {
    return levelOrder.indexOf(level) <= maxLevelIndex;
  };

  return (
    <div className="space-y-3">
      {/* Country */}
      {shouldShowLevel('country') && showAllLevels && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country {required && '*'}
          </label>
          <select
            value={selectedCountry || ''}
            onChange={(e) => handleCountryChange(e.target.value)}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* County */}
      {shouldShowLevel('county') && selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            County {required && maxLevel === 'county' && '*'}
          </label>
          <select
            value={selectedCounty || ''}
            onChange={(e) => handleCountyChange(e.target.value)}
            required={required && maxLevel === 'county'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select County</option>
            {counties.map(county => (
              <option key={county.id} value={county.id}>
                {county.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sub-County */}
      {shouldShowLevel('sub_county') && selectedCounty && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub-County {required && maxLevel === 'sub_county' && '*'}
          </label>
          <select
            value={selectedSubCounty || ''}
            onChange={(e) => handleSubCountyChange(e.target.value)}
            required={required && maxLevel === 'sub_county'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Sub-County</option>
            {subCounties.map(subCounty => (
              <option key={subCounty.id} value={subCounty.id}>
                {subCounty.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Ward */}
      {shouldShowLevel('ward') && selectedSubCounty && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ward {required && maxLevel === 'ward' && '*'}
          </label>
          <select
            value={selectedWard || ''}
            onChange={(e) => handleWardChange(e.target.value)}
            required={required && maxLevel === 'ward'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Ward</option>
            {wards.map(ward => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Parish */}
      {shouldShowLevel('parish') && selectedWard && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parish {required && '*'}
          </label>
          <select
            value={selectedParish || ''}
            onChange={(e) => handleParishChange(e.target.value)}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Parish</option>
            {parishes.map(parish => (
              <option key={parish.id} value={parish.id}>
                {parish.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Path Display */}
      {(selectedCountry || selectedCounty || selectedSubCounty || selectedWard || selectedParish) && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <span className="font-medium">Selected:</span>{' '}
          {[
            selectedCountry && locations.find(l => l.id === selectedCountry)?.name,
            selectedCounty && locations.find(l => l.id === selectedCounty)?.name,
            selectedSubCounty && locations.find(l => l.id === selectedSubCounty)?.name,
            selectedWard && locations.find(l => l.id === selectedWard)?.name,
            selectedParish && locations.find(l => l.id === selectedParish)?.name
          ].filter(Boolean).join(' → ')}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
