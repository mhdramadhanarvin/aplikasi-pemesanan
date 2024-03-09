import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions';

// Define interfaces for options if not already defined
interface DirectionsOptions {
  accessToken: string;
  unit?: 'metric' | 'imperial';
  profile?: 'driving' | 'walking' | 'cycling';
  // Add more options as needed
}

// Define wrapper class
class DirectionsWrapper {
  private directions: any; // Use 'any' if there's no type definition available

  constructor(options: DirectionsOptions) {
    this.directions = new MapboxDirections(options);
  }

  // Add methods as needed
  addTo(map: mapboxgl.Map) {
    this.directions.addTo(map);
  }

  // Add more methods as needed
}

export default DirectionsWrapper;
