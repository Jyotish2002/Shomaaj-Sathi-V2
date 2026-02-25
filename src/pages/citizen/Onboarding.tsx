import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { useAuth } from "@/contexts/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;


export default function Onboarding() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { user, updateProfile } = useAuth();
  const [epic, setEpic] = useState<string>(user?.epicNumber || "");
  const [language, setLanguage] = useState<string>(() => {
    return user?.language || localStorage.getItem('appLanguage') || "";
  });
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
  
  const handleNext = async () => {
    if (!epic || !language) {
      alert(t('pleaseSelectAll'));
      return;
    }

    setLoading(true);
    try {
      // Fetch voter data by EPIC
      const voterRes = await axios.get(`${API_URL}/voter/${epic}`);
      const voter = voterRes.data;

      // Prepare profile updates with voter data
      // Always use official voter DB data (overrides Google name etc.)
      const updateData: any = {
        epicNumber: epic,
        language,
        name: voter.name,           // always use official voter name
        mobile: voter.mobile,
        address: voter.address,
        wardNumber: voter.wardNumber,
        district: voter.district,
        municipality: voter.municipality,
      };

      // Photo: prefer existing Google photo, otherwise voter record
      if (!user?.photo && voter.photo) updateData.photo = voter.photo;
      if (photoFile) {
        // Upload photo via backend
        const form = new FormData();
        form.append('image', photoFile);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        updateData.photo = uploadRes.data.url;
      }

      await updateProfile(updateData);
      localStorage.setItem("appLanguage", language);
      i18n.changeLanguage(language);

      // Always navigate to profile setup after onboarding
      navigate("/citizen/profile-setup");
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert('EPIC number not found in database');
      } else {
        console.error('Onboarding error', error);
        alert(t('updateFailed') || 'Failed to update preferences');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">
          {t('selectPreferences')}
        </h2>

        {/* EPIC number */}
        <div>
          <label className="block mb-2 font-medium">EPIC Number</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={epic}
            onChange={(e) => setEpic(e.target.value.trim())}
            placeholder="XXXX0000000"
          />
        </div>

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

        {/* optional photo upload if Google photo not present */}
        {!user?.photo && (
          <div className="space-y-2">
            <label className="block mb-1 font-medium">Upload Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files?.[0]) setPhotoFile(e.target.files[0]);
              }}
            />
          </div>
        )}

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