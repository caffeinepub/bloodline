import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetActiveLocations } from '../hooks/useGetActiveLocations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Users, Droplet } from 'lucide-react';
import { formatBloodGroup } from '../utils/bloodGroupUtils';

export default function LocationTrackingPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: locations, isLoading, isError, error } = useGetActiveLocations();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    }
  }, [identity, navigate]);

  // Initialize Google Maps
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (typeof window !== 'undefined' && (window as any).google?.maps) {
        setIsMapLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  // Create map instance
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || googleMapRef.current) return;

    const google = (window as any).google;
    
    // Initialize map with a default center (can be adjusted based on user location or first marker)
    googleMapRef.current = new google.maps.Map(mapRef.current, {
      zoom: 11,
      center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC, will adjust when markers load
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });
  }, [isMapLoaded]);

  // Update markers when locations change
  useEffect(() => {
    if (!isMapLoaded || !googleMapRef.current || !locations) return;

    const google = (window as any).google;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (locations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    locations.forEach((location) => {
      const position = {
        lat: location.coordinates.latitude,
        lng: location.coordinates.longitude,
      };

      // Determine marker color and icon based on type
      const isDonor = location.type === 'donor';
      const markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: isDonor ? '#10b981' : '#ef4444', // Green for donors, red for requests
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      };

      const marker = new google.maps.Marker({
        position,
        map: googleMapRef.current,
        icon: markerIcon,
        title: isDonor ? 'Available Donor' : 'Blood Request',
      });

      // Create info window content
      let infoContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: ${isDonor ? '#10b981' : '#ef4444'};">
            ${isDonor ? '🩸 Available Donor' : '🆘 Blood Request'}
          </h3>
          <p style="margin: 4px 0;"><strong>Blood Group:</strong> ${formatBloodGroup(location.bloodGroup)}</p>
      `;

      if (!isDonor && location.urgency) {
        const urgencyText = location.urgency === 'critical' ? 'Critical' : 
                           location.urgency === 'high' ? 'High' : 'Normal';
        const urgencyColor = location.urgency === 'critical' ? '#dc2626' : 
                            location.urgency === 'high' ? '#f59e0b' : '#10b981';
        infoContent += `<p style="margin: 4px 0;"><strong>Urgency:</strong> <span style="color: ${urgencyColor}; font-weight: bold;">${urgencyText}</span></p>`;
      }

      if (isDonor && location.availability !== undefined) {
        infoContent += `<p style="margin: 4px 0;"><strong>Status:</strong> ${location.availability ? 'Available' : 'Unavailable'}</p>`;
      }

      infoContent += '</div>';

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
      });

      marker.addListener('click', () => {
        // Close all other info windows
        markersRef.current.forEach(m => {
          if (m.infoWindow) {
            m.infoWindow.close();
          }
        });
        infoWindow.open(googleMapRef.current, marker);
      });

      marker.infoWindow = infoWindow;
      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // Fit map to show all markers
    if (locations.length > 0) {
      googleMapRef.current.fitBounds(bounds);
      
      // Adjust zoom if only one marker
      if (locations.length === 1) {
        const listener = google.maps.event.addListenerOnce(googleMapRef.current, 'bounds_changed', () => {
          if (googleMapRef.current.getZoom() > 15) {
            googleMapRef.current.setZoom(15);
          }
        });
      }
    }
  }, [isMapLoaded, locations]);

  if (!identity) {
    return null;
  }

  const donorCount = locations?.filter(l => l.type === 'donor').length || 0;
  const requestCount = locations?.filter(l => l.type === 'request').length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Location Tracking</h1>
        <p className="text-muted-foreground">
          Real-time map showing available donors and active blood requests
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active on map</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Donors</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{donorCount}</div>
            <p className="text-xs text-muted-foreground">Ready to donate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Droplet className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{requestCount}</div>
            <p className="text-xs text-muted-foreground">Pending or matched</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle>Live Map</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center gap-2 mr-4">
              <span className="inline-block w-3 h-3 rounded-full bg-green-600"></span>
              Available Donors
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-600"></span>
              Blood Requests
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-[600px] w-full rounded-lg" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load location data: {error?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (
            <>
              {!isMapLoaded && (
                <div className="h-[600px] w-full rounded-lg bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Loading Google Maps...</p>
                </div>
              )}
              <div
                ref={mapRef}
                className="h-[600px] w-full rounded-lg"
                style={{ display: isMapLoaded ? 'block' : 'none' }}
              />
              {isMapLoaded && locations && locations.length === 0 && (
                <div className="mt-4 text-center text-muted-foreground">
                  <p>No active locations to display at the moment.</p>
                  <p className="text-sm mt-2">
                    Locations will appear when donors become available or blood requests are created.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
