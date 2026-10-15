import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// Central route mapping for automatic breadcrumb derivation
const ROUTE_MAP = {
  // Public Routes
  '/': [
    { label: 'Home' }
  ],
  '/explore': [
    { label: 'Home', path: '/' },
    { label: 'Explore Food' }
  ],
  '/about': [
    { label: 'Home', path: '/' },
    { label: 'About Us' }
  ],
  '/partner': [
    { label: 'Home', path: '/' },
    { label: 'Partner with Us' }
  ],

  // Customer Routes
  '/customer/explore': [
    { label: 'Home', path: '/' },
    { label: 'Explore Food' }
  ],
  '/customer/cart': [
    { label: 'Home', path: '/' },
    { label: 'Cart' }
  ],
  '/customer/checkout': [
    { label: 'Home', path: '/' },
    { label: 'Cart', path: '/customer/cart' },
    { label: 'Checkout' }
  ],
  '/customer/orders': [
    { label: 'Home', path: '/' },
    { label: 'My Orders' }
  ],
  '/customer/wishlist': [
    { label: 'Home', path: '/' },
    { label: 'Wishlist' }
  ],
  '/customer/profile': [
    { label: 'Home', path: '/' },
    { label: 'My Profile' }
  ],
  '/customer/impact': [
    { label: 'Home', path: '/' },
    { label: 'My Impact' }
  ],

  // Merchant Portal Routes
  '/dashboard/merchant': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard' }
  ],
  '/dashboard/merchant/overview': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard' }
  ],
  '/dashboard/merchant/listings': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'My Listings' }
  ],
  '/dashboard/merchant/add': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'My Listings', path: '/dashboard/merchant/listings' },
    { label: 'Add Food' }
  ],
  '/dashboard/merchant/orders': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'Orders' }
  ],
  '/dashboard/merchant/donations': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'Donations' }
  ],
  '/dashboard/merchant/analytics': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'Analytics' }
  ],
  '/dashboard/merchant/reviews': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'Reviews' }
  ],
  '/dashboard/merchant/notifications': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'Notifications' }
  ],
  '/dashboard/merchant/profile': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'Profile' }
  ],
  '/dashboard/merchant/settings': [
    { label: 'Home', path: '/' },
    { label: 'Merchant Dashboard', path: '/dashboard/merchant/overview' },
    { label: 'Settings' }
  ],

  // Admin Portal Routes
  '/dashboard/admin': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard' }
  ],
  '/dashboard/admin/overview': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard' }
  ],
  '/dashboard/admin/users': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'User Management' }
  ],
  '/dashboard/admin/restaurants': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Restaurant Management' }
  ],
  '/dashboard/admin/ngos': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'NGO Management' }
  ],
  '/dashboard/admin/listings': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Food Listings' }
  ],
  '/dashboard/admin/orders': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Orders' }
  ],
  '/dashboard/admin/pickups': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Pickups' }
  ],
  '/dashboard/admin/analytics': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Analytics' }
  ],
  '/dashboard/admin/notifications': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Notifications' }
  ],
  '/dashboard/admin/feedback': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Feedback' }
  ],
  '/dashboard/admin/impact': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Impact' }
  ],
  '/dashboard/admin/settings': [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: '/dashboard/admin/overview' },
    { label: 'Settings' }
  ],

  // NGO Portal Routes
  '/dashboard/ngo': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal' }
  ],
  '/dashboard/ngo/overview': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal' }
  ],
  '/dashboard/ngo/donations': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Donations' }
  ],
  '/dashboard/ngo/pickups': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Pickups' }
  ],
  '/dashboard/ngo/requests': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Requests' }
  ],
  '/dashboard/ngo/beneficiaries': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Beneficiaries' }
  ],
  '/dashboard/ngo/partners': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Partners' }
  ],
  '/dashboard/ngo/volunteers': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Volunteers' }
  ],
  '/dashboard/ngo/analytics': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Analytics' }
  ],
  '/dashboard/ngo/campaigns': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Campaigns' }
  ],
  '/dashboard/ngo/chat': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Chat' }
  ],
  '/dashboard/ngo/reports': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Reports' }
  ],
  '/dashboard/ngo/profile': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Profile' }
  ],
  '/dashboard/ngo/notifications': [
    { label: 'Home', path: '/' },
    { label: 'NGO Portal', path: '/dashboard/ngo/overview' },
    { label: 'Notifications' }
  ],
};

const Breadcrumbs = ({ items, className = '' }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Do not render breadcrumbs on authentication pages
  if (currentPath === '/login' || currentPath === '/register') {
    return null;
  }

  // Derive breadcrumbs if no explicit items prop is provided
  let breadcrumbItems = items;

  if (!breadcrumbItems) {
    if (ROUTE_MAP[currentPath]) {
      breadcrumbItems = ROUTE_MAP[currentPath];
    } else if (currentPath.startsWith('/customer/food/') || currentPath.startsWith('/food/')) {
      const isCustomer = currentPath.startsWith('/customer');
      breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Explore Food', path: isCustomer ? '/customer/explore' : '/explore' },
        { label: 'Food Details' }
      ];
    } else {
      // Dynamic fallback parser for nested paths
      const segments = currentPath.split('/').filter(Boolean);
      breadcrumbItems = [{ label: 'Home', path: '/' }];
      let accumulated = '';
      
      segments.forEach((seg, idx) => {
        accumulated += `/${seg}`;
        const isLast = idx === segments.length - 1;
        const formatted = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
        breadcrumbItems.push({
          label: formatted,
          path: isLast ? undefined : accumulated
        });
      });
    }
  }

  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center text-xs sm:text-sm text-slate-500 py-2 sm:py-3 select-none ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isHome = index === 0;

          return (
            <li key={item.path || item.label || index} className="flex items-center gap-1.5 sm:gap-2">
              {index > 0 && (
                <ChevronRight 
                  className="w-3.5 h-3.5 text-slate-400 shrink-0" 
                  aria-hidden="true" 
                />
              )}

              {isLast || !item.path ? (
                <span 
                  aria-current={isLast ? "page" : undefined}
                  className={`truncate max-w-[150px] xs:max-w-[220px] sm:max-w-xs md:max-w-md ${
                    isLast ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'
                  }`}
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="group flex items-center gap-1 text-slate-600 hover:text-red-600 hover:underline underline-offset-2 transition-colors font-medium shrink-0"
                  title={item.label}
                >
                  {isHome && (
                    <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 transition-colors shrink-0" />
                  )}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
