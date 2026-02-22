declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng): LatLngBounds;
    }

    namespace places {
      interface AutocompleteOptions {
        bounds?: LatLngBounds;
        componentRestrictions?: { country: string | string[] };
        fields?: string[];
        strictBounds?: boolean;
        types?: string[];
      }

      interface PlaceGeometry {
        location: LatLng;
        viewport?: LatLngBounds;
      }

      interface PlaceAddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }

      interface PlaceResult {
        address_components?: PlaceAddressComponent[];
        formatted_address?: string;
        geometry?: PlaceGeometry;
        name?: string;
        place_id?: string;
      }

      class Autocomplete {
        constructor(input: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: () => void): MapsEventListener;
        getPlace(): PlaceResult;
      }
    }

    namespace event {
      function removeListener(listener: MapsEventListener): void;
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}

export {};
