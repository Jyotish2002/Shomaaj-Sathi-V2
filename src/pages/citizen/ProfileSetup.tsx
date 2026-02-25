import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, MapPin, User, Loader2, CheckCircle2, ArrowLeft, Lock } from 'lucide-react';
import { WARD_NUMBERS } from '@/types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function ProfileSetup() {
  const { user, updateProfile, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { t } = useTranslation();

  const photoInputRef = useRef<HTMLInputElement>(null);

  const [photoError, setPhotoError] = useState(false);

  // Check if user data came from EPIC voter database (read-only)
  const isFromVoterDB = !!user?.epicNumber;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    wardNumber: user?.wardNumber?.toString() || '',
    photo: user?.photo || '',
  });

  const uploadImage = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    setUploadingPhoto(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formDataUpload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, photo: response.data.url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!formData.photo) {
      setPhotoError(true);
      hasError = true;
    } else {
      setPhotoError(false);
    }

    if (!formData.wardNumber) {
      alert("Please select your ward number");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      // Include language and location from localStorage
      const language = localStorage.getItem('appLanguage') || 'en';
      const district = localStorage.getItem('district') || '';
      const municipality = localStorage.getItem('municipality') || '';
      
      await updateProfile({
        ...formData,
        wardNumber: parseInt(formData.wardNumber),
        language,
        district,
        municipality,
      });
      navigate("/citizen");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/citizen/onboarding')}
            className="-ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold">{t('completeProfile')}</h1>
            <p className="text-muted-foreground">{t('fewMoreDetails')}</p>
          </div>
          <div style={{ width: 40 }} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('profileDetails')}</CardTitle>
            <CardDescription>{t('allFieldsRequired')}</CardDescription>
            {isFromVoterDB && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Your profile data is auto-filled from official voter records and cannot be edited. You can only update your photos.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('fullName')} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    className="pl-10"
                    placeholder={t('enterFullName')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isFromVoterDB}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('mobileNumber')} <span className="text-red-500">*</span>
                </Label>

                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder={t('enterMobile')}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    maxLength={10}
                    disabled={isFromVoterDB}
                    required
                  />

                </div>

              </div>


              <div className="space-y-2">
                <Label htmlFor="address">
                  {t('residentialAddress')} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pl-10 min-h-[100px]"
                    placeholder={t('enterAddress')}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isFromVoterDB}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Ward Number <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.wardNumber}
                  onValueChange={(v) => setFormData({ ...formData, wardNumber: v })}
                  disabled={isFromVoterDB}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {WARD_NUMBERS.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Ward {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>
                  {t('profilePhoto')} <span className="text-red-500">*</span>
                </Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center space-y-2 transition-colors cursor-pointer relative overflow-hidden 
                  ${photoError ? "border-red-500 bg-red-50" : "hover:bg-muted/50"}`}
                  onClick={() => photoInputRef.current?.click()}
                >
                  {photoError && (
                    <p className="text-red-500 text-sm">{t('photoRequired')}</p>
                  )}
                  {formData.photo ? (
                    <div className="relative">
                      <img src={formData.photo} alt="Profile" className="w-full h-32 object-cover rounded-lg" />
                      <CheckCircle2 className="absolute top-2 right-2 h-6 w-6 text-green-500" />
                    </div>
                  ) : uploadingPhoto ? (
                    <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{t('clickToUpload')}</p>
                    </>
                  )}
                  <Input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  loading ||
                  uploadingPhoto ||
                  !formData.photo
                }
              >

                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('completeProfile') || 'Complete Profile'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
