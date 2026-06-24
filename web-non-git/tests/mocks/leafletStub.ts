/**
 * Mock implementation of Leaflet for testing
 * This stub provides minimal Leaflet API to avoid loading heavy map library in tests
 */

import { vi } from 'vitest';

export const createLeafletStub = () => {
  const mockMap = {
    on: vi.fn(),
    off: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    hasLayer: vi.fn(() => false),
    setView: vi.fn(),
    flyTo: vi.fn(),
    getCenter: vi.fn(() => ({ lat: 48.5734, lng: 7.7521 })),
    getZoom: vi.fn(() => 13),
    getBounds: vi.fn(() => ({
      getNorthEast: () => ({ lat: 48.6, lng: 7.8 }),
      getSouthWest: () => ({ lat: 48.5, lng: 7.7 }),
    })),
    fitBounds: vi.fn(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
    eachLayer: vi.fn(),
    pm: {
      addControls: vi.fn(),
      removeControls: vi.fn(),
      enableDraw: vi.fn(),
      disableDraw: vi.fn(),
      setGlobalOptions: vi.fn(),
      Toolbar: {
        copyDrawControl: vi.fn(),
      },
    },
  };

  const mockLayer = {
    on: vi.fn(),
    off: vi.fn(),
    addTo: vi.fn(() => mockLayer),
    remove: vi.fn(),
    setLatLng: vi.fn(),
    setLatLngs: vi.fn(),
    getLatLng: vi.fn(() => ({ lat: 48.5734, lng: 7.7521 })),
    getLatLngs: vi.fn(() => []),
    bindPopup: vi.fn(() => mockLayer),
    unbindPopup: vi.fn(),
    openPopup: vi.fn(),
    closePopup: vi.fn(),
    setStyle: vi.fn(),
    pm: {
      enable: vi.fn(),
      disable: vi.fn(),
      enabled: vi.fn(() => false),
    },
  };

  const L: any = {
    map: vi.fn(() => mockMap),
    tileLayer: vi.fn(() => mockLayer),
    marker: vi.fn(() => mockLayer),
    polyline: vi.fn(() => mockLayer),
    polygon: vi.fn(() => mockLayer),
    circle: vi.fn(() => mockLayer),
    circleMarker: vi.fn(() => mockLayer),
    divIcon: vi.fn(() => ({})),
    icon: vi.fn(() => ({})),
    latLng: vi.fn((lat, lng) => ({ lat, lng })),
    latLngBounds: vi.fn(() => ({
      extend: vi.fn(),
      isValid: vi.fn(() => true),
    })),
    control: {
      zoom: vi.fn(() => ({ addTo: vi.fn() })),
      scale: vi.fn(() => ({ addTo: vi.fn() })),
      layers: vi.fn(() => ({ addTo: vi.fn() })),
    },
    DomEvent: {
      disableClickPropagation: vi.fn((el) => el),
      disableScrollPropagation: vi.fn((el) => el),
      preventDefault: vi.fn(),
      stop: vi.fn(),
      stopPropagation: vi.fn(),
    },
    Map: vi.fn(function () {
      return mockMap;
    }),
    Marker: vi.fn(function () {
      return mockLayer;
    }),
    Polyline: vi.fn(function () {
      return mockLayer;
    }),
    Polygon: vi.fn(function () {
      return mockLayer;
    }),
  };

  return { L, mockMap, mockLayer };
};

// Mock leaflet module
vi.mock('leaflet', () => {
  const { L } = createLeafletStub();
  return { default: L };
});

// Mock react-leaflet
vi.mock('react-leaflet', async () => {
  const React = await import('react');
  return {
    MapContainer: ({ children }: any) => React.createElement('div', { 'data-testid': 'map-container' }, children),
    TileLayer: () => React.createElement('div', { 'data-testid': 'tile-layer' }),
    Marker: ({ children }: any) => React.createElement('div', { 'data-testid': 'marker' }, children),
    Polyline: () => React.createElement('div', { 'data-testid': 'polyline' }),
    Polygon: () => React.createElement('div', { 'data-testid': 'polygon' }),
    Popup: ({ children }: any) => React.createElement('div', { 'data-testid': 'popup' }, children),
    Rectangle: () => React.createElement('div', { 'data-testid': 'rectangle' }),
    useMap: () => createLeafletStub().mockMap,
    useMapEvents: (handlers: any) => {
      // Mock implementation that doesn't actually attach events
      return createLeafletStub().mockMap;
    },
  };
});

// Mock leaflet-geosearch
vi.mock('leaflet-geosearch', () => ({
  OpenStreetMapProvider: vi.fn(() => ({
    search: vi.fn(() => Promise.resolve([])),
  })),
  GeoSearchControl: vi.fn(() => ({
    addTo: vi.fn(),
  })),
}));

// Mock leaflet-easyprint
vi.mock('leaflet-easyprint', () => ({
  default: vi.fn(() => ({
    addTo: vi.fn(),
  })),
}));

// Mock leaflet-simple-map-screenshoter
vi.mock('leaflet-simple-map-screenshoter', () => ({
  default: vi.fn(function () {
    return {
      takeScreen: vi.fn(() => Promise.resolve('data:image/png;base64,mock')),
    };
  }),
}));
