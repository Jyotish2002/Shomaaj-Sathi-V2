import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { WEST_BENGAL_DATA } from "@/data/westBengal";
import { useAuth } from "@/contexts/AuthContext";


export default function Onboarding() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { user, updateProfile } = useAuth();
  const [language, setLanguage] = useState<string>(() => {
    return user?.language || localStorage.getItem('appLanguage') || "";
  });
  const [district, setDistrict] = useState<string>(
    user?.district || localStorage.getItem('district') || ""
  );
  const [municipality, setMunicipality] = useState<string>(
    user?.municipality || localStorage.getItem('municipality') || ""
  );
  const [loading, setLoading] = useState(false);

  const districts = Object.keys(WEST_BENGAL_DATA);
  const municipalities = district ? WEST_BENGAL_DATA[district] : [];

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
  
  const handleNext = async () => {
    if (!language || !district || !municipality) {
      alert(t('pleaseSelectAll'));
      return;
    }

    localStorage.setItem("appLanguage", language);
    localStorage.setItem("district", district);
    localStorage.setItem("municipality", municipality);

    i18n.changeLanguage(language);

    // If user already has a complete profile, just update language preferences
    if (user?.isProfileComplete) {
      setLoading(true);
      try {
        await updateProfile({
          language,
          district,
          municipality,
        });
        
        // Navigate based on verification status
        if (!user.isVerified && user.role !== 'admin') {
          navigate("/citizen/waiting");
        } else {
          navigate("/citizen");
        }
      } catch (error) {
        console.error('Failed to update language preferences:', error);
        alert(t('updateFailed') || 'Failed to update preferences');
      } finally {
        setLoading(false);
      }
    } else {
      // New user, proceed to profile setup
      navigate("/citizen/profile-setup");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">
          {t('selectPreferences')}
        </h2>

        {/* Language */}
        <div>
          <label className="block mb-2 font-medium">{t('selectLanguage')}</label>
          <select
            className="w-full border rounded p-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">{t('choose')}</option>
            <option value="en">{t('english')}</option>
            <option value="hi">{t('hindi')}</option>
            <option value="bn">{t('bengali')}</option>
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block mb-2 font-medium">{t('selectDistrict')}</label>
          <select
            className="w-full border rounded p-2"
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setMunicipality("");
            }}
          >
            <option value="">{t('choose')}</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Municipality */}
        <div>
          <label className="block mb-2 font-medium">{t('selectMunicipality')}</label>
          <select
            className="w-full border rounded p-2"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            disabled={!district}
          >
            <option value="">{t('choose')}</option>
            {municipalities.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('saving') || 'Saving...' : t('next')}
        </button>
      </div>
    </div>
  );
}