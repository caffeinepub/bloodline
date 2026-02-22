/// <reference types="../types/google-maps" />

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GoogleMapsPlacePickerProps {
  value?: string;
  onChange: (data: { address: string; city: string; latitude: number; longitude: number }) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function GoogleMapsPlacePicker({
  value = '',
  onChange,
  label = 'Location',
  placeholder = 'Search for a location',
  required = false,
}: GoogleMapsPlacePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMaps = () => {
      if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const google = (window as any).google;

    // Initialize autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['address_components', 'geometry', 'formatted_address', 'name'],
      types: ['geocode', 'establishment'],
    });

    // Add place changed listener
    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place || !place.geometry || !place.geometry.location) {
        return;
      }

      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      const address = place.formatted_address || place.name || '';
      
      // Extract city from address components
      let city = '';
      if (place.address_components) {
        for (const component of place.address_components) {
          if (component.types.includes('locality')) {
            city = component.long_name;
            break;
          }
          if (component.types.includes('administrative_area_level_1')) {
            city = component.long_name;
          }
        }
      }
      
      if (!city && address) {
        // Fallback: extract first part of address as city
        city = address.split(',')[0];
      }

      onChange({ address, city, latitude, longitude });
    });

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded, onChange]);

  return (
    <div>
      <Label htmlFor="location-input">
        {label} {required && '*'}
      </Label>
      <Input
        ref={inputRef}
        id="location-input"
        type="text"
        placeholder={isLoaded ? placeholder : 'Loading Google Maps...'}
        defaultValue={value}
        disabled={!isLoaded}
        required={required}
      />
    </div>
  );
}
