# Specification

## Summary
**Goal:** Add a location tracking page that displays real-time positions of available blood donors and active blood requests on a map.

**Planned changes:**
- Create LocationTrackingPage component with Google Maps interface
- Add '/location-tracking' route to the application
- Update Navigation component with 'Location Tracking' link
- Display map markers for available donors with blood group information
- Display map markers for active blood requests with urgency and status details
- Implement backend getActiveLocations endpoint to fetch donor and request locations
- Create useGetActiveLocations React Query hook for fetching and updating location data

**User-visible outcome:** Users can navigate to a location tracking page where they see a map showing available blood donors and active blood requests with their locations, blood groups, and relevant details.
