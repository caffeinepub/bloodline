import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import BloodRequestPage from './pages/BloodRequestPage';
import BloodDonationPage from './pages/BloodDonationPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import LocationTrackingPage from './pages/LocationTrackingPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
});

const bloodRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blood-request',
  component: BloodRequestPage,
});

const bloodDonationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blood-donation',
  component: BloodDonationPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$userId',
  component: ChatPage,
});

const requestDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request/$requestId',
  component: RequestDetailsPage,
});

const locationTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/location-tracking',
  component: LocationTrackingPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  bloodRequestRoute,
  bloodDonationRoute,
  dashboardRoute,
  profileRoute,
  chatRoute,
  requestDetailsRoute,
  locationTrackingRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
