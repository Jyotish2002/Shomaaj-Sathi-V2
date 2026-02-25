import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Bell, X, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useTranslation } from 'react-i18next';
const API_URL = import.meta.env.VITE_API_URL || 'https://shomaaj-sathi.onrender.com';


export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const translateRef = useRef(null);

  // Example Admin Notifications (connected to DB)
  const [notifications, setNotifications] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }

      if (
        translateRef.current &&
        !translateRef.current.contains(event.target)
      ) {
        setIsTranslateOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const userRes = await axios.get(
          `${API_URL}/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const wardNumber = userRes.data.wardNumber;

        const alertRes = await axios.get(
          `${API_URL}/api/alerts/${wardNumber}`
        );

        setNotifications(alertRes.data);

      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Get current language from googtrans cookie
  const getCurrentLanguage = (): string => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]+)/);
    return match ? match[1] : 'en';
  };

  const [currentLang, setCurrentLang] = useState(getCurrentLanguage);

  // Initialize Google Translate
  useEffect(() => {
    if (!(window as any).google?.translate && !document.querySelector('script[src*="translate.google.com"]')) {
      (window as any).googleTranslateElementInit = () => {
        const element = document.getElementById('google_translate_element');
        if (element && (window as any).google?.translate) {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,gu,kn,ml,mr,pa,ta,te,ur',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          }, 'google_translate_element');
        }
      };

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Switch language using googtrans cookie + reload
  const switchLanguage = (langCode: string) => {
    if (langCode === 'en') {
      // Clear the cookie to revert to original
      document.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
    } else {
      // Set the cookie for the target language
      document.cookie = `googtrans=/en/${langCode};path=/;`;
      document.cookie = `googtrans=/en/${langCode};path=/;domain=${window.location.hostname};`;
    }
    setIsTranslateOpen(false);
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-md overflow-hidden border-2 border-primary/20">
            <img
              src="/munilogo.png"
              alt="Municipal Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl lg:text-2xl font-extrabold text-primary leading-tight notranslate">
              সমাজ সাথী
            </h1>
            <h2 className="text-sm md:text-base font-semibold text-primary/85 -mt-1">
              Shomaaj Sathi
            </h2>
            <p className="text-xs text-gray-500 leading-tight">
              {t('buildingBetterTomorrow')}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">

          {/* 🌐 Google Translate */}
          <div className="relative" ref={translateRef}>
            <button
              onClick={() => {
                setIsTranslateOpen(!isTranslateOpen);
                setIsNotificationOpen(false);
                setIsDropdownOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              title="Translate"
            >
              <Languages className="w-5 h-5 text-gray-600" />
            </button>

            {/* Translate Dropdown - Always rendered, visibility controlled by CSS */}
            <div 
              className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-[9999] translate-dropdown transition-all duration-200 ${
                isTranslateOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-2'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Select Language</h3>
                <button onClick={() => setIsTranslateOpen(false)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-1">
                {[
                  { code: 'en', name: 'English', native: 'English' },
                  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
                  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
                  { code: 'gu', name: 'Gujarati', native: 'ગુજરાতી' },
                  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
                  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
                  { code: 'mr', name: 'Marathi', native: 'मराठी' },
                  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
                  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
                  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
                  { code: 'ur', name: 'Urdu', native: 'اردو' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`w-full p-2 text-left rounded-lg transition-colors duration-150 flex justify-between items-center ${
                      currentLang === lang.code
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm text-gray-700">{lang.name}</span>
                    <span className="text-sm text-gray-500">{lang.native}</span>
                  </button>
                ))}
              </div>
              
              {/* Hidden Google Translate element for functionality */}
              <div id="google_translate_element" style={{ display: 'none' }}></div>
            </div>
          </div>

          {/* 🔔 Notification Icon */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsDropdownOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-gray-600" />

              {/* Red Badge */}
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Panel */}
            {isNotificationOpen && (
   <div className="
  fixed sm:absolute
  right-3 sm:right-0
  top-16 sm:top-full
  mt-0 sm:mt-2
  w-[92vw] sm:w-80
  max-w-sm
  bg-white
  rounded-xl
  shadow-lg
  border
  border-gray-100
  animate-fade-in
  z-[9999]
">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {t('notifications')}
                  </h3>
                  <button onClick={() => setIsNotificationOpen(false)}>
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 px-4 py-6 text-center">
                      {t('noNotifications')}
                    </p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {item.date}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {item.time}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 👤 Profile Icon */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsNotificationOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                <button
                  onClick={() => navigate('/citizen/profile')}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  {t('profile')}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  {t('logout')}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}