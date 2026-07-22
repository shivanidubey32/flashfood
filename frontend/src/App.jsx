import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Partner from './pages/Partner';
import MerchantDashboard from './pages/MerchantDashboard';
import { CartProvider } from './context/CartContext';
import CustomerLayout from './components/customer/CustomerLayout';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';
import Impact from './pages/customer/Impact';
import Wishlist from './pages/customer/Wishlist';
import FoodDetails from './pages/customer/FoodDetails';
import CustomerProfile from './pages/customer/Profile';

import MerchantLayout from './components/merchant/MerchantLayout';
import Overview from './pages/merchant/Overview';
import MyListings from './pages/merchant/MyListings';
import AddListing from './pages/merchant/AddListing';
import Orders from './pages/merchant/Orders';
import Donations from './pages/merchant/Donations';
import Analytics from './pages/merchant/Analytics';
import Notifications from './pages/merchant/Notifications';
import Profile from './pages/merchant/Profile';
import Settings from './pages/merchant/Settings';
import Reviews from './pages/merchant/Reviews';

import NGOLayout from './components/ngo/NGOLayout';
import NGOOverview from './pages/ngo/Overview';
import NGODonations from './pages/ngo/Donations';
import NGOPickups from './pages/ngo/Pickups';
import NGORequests from './pages/ngo/Requests';
import NGOBeneficiaries from './pages/ngo/Beneficiaries';
import NGOPartners from './pages/ngo/Partners';
import NGOVolunteers from './pages/ngo/Volunteers';
import NGOAnalytics from './pages/ngo/Analytics';
import NGOCampaigns from './pages/ngo/Campaigns';
import NGOChat from './pages/ngo/Chat';
import NGOReports from './pages/ngo/Reports';
import NGOProfile from './pages/ngo/Profile';
import NGONotifications from './pages/ngo/Notifications';

import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import UserManagement from './pages/admin/UserManagement';
import RestaurantManagement from './pages/admin/RestaurantManagement';
import NGOManagement from './pages/admin/NGOManagement';
import AdminListings from './pages/admin/FoodListings';
import AdminOrders from './pages/admin/Orders';
import AdminPickups from './pages/admin/Pickups';
import AdminAnalytics from './pages/admin/Analytics';
import AdminNotifications from './pages/admin/Notifications';
import AdminFeedback from './pages/admin/Feedback';
import AdminImpact from './pages/admin/Impact';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {/* We only show Navbar/Footer on public routes. For merchant dashboard, the layout handles it. */}
        <Routes>
          {/* Public Routes with standard Navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="flex-grow pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/partner" element={<Partner />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />

          {/* Customer Portal Routes (Sleek Top/Bottom Nav) */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route path="explore" element={<Explore />} />
            <Route path="food/:id" element={<FoodDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="impact" element={<Impact />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="profile" element={<CustomerProfile />} />
            {/* Reuse existing pages or placeholders for others as needed */}
          </Route>

          {/* Merchant Portal Routes (No global Navbar/Footer) */}
          <Route path="/dashboard/merchant" element={<MerchantLayout />}>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="listings" element={<MyListings />} />
            <Route path="add" element={<AddListing />} />
            <Route path="orders" element={<Orders />} />
            <Route path="donations" element={<Donations />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* NGO Portal Routes */}
          <Route path="/dashboard/ngo" element={<NGOLayout />}>
            <Route index element={<NGOOverview />} />
            <Route path="overview" element={<NGOOverview />} />
            <Route path="donations" element={<NGODonations />} />
            <Route path="pickups" element={<NGOPickups />} />
            <Route path="requests" element={<NGORequests />} />
            <Route path="beneficiaries" element={<NGOBeneficiaries />} />
            <Route path="partners" element={<NGOPartners />} />
            <Route path="volunteers" element={<NGOVolunteers />} />
            <Route path="analytics" element={<NGOAnalytics />} />
            <Route path="campaigns" element={<NGOCampaigns />} />
            <Route path="chat" element={<NGOChat />} />
            <Route path="reports" element={<NGOReports />} />
            <Route path="profile" element={<NGOProfile />} />
            <Route path="notifications" element={<NGONotifications />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route path="/dashboard/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="restaurants" element={<RestaurantManagement />} />
            <Route path="ngos" element={<NGOManagement />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="pickups" element={<AdminPickups />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="impact" element={<AdminImpact />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
