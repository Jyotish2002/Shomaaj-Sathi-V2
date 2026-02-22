import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Common
      welcome: "Welcome",
      welcomeBack: "Welcome back,",
      login: "Login",
      logout: "Logout",
      next: "Next",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      choose: "Choose",
      viewAll: "View All",
      goToHome: "Go to Home",
      success: "Success!",
      loading: "Loading...",
      
      // Onboarding
      selectPreferences: "Select Your Preferences",
      selectLanguage: "Select Language",
      selectDistrict: "Select District",
      selectMunicipality: "Select Municipality",
      english: "English",
      hindi: "Hindi",
      bengali: "Bengali",
      pleaseSelectAll: "Please select all fields",
      
      // Home Page
      reportIssue: "Report an Issue",
      helpImproveWard: "Help Improve Your Ward!",
      location: "Location",
      photo: "Photo",
      ward: "Ward",
      yourComplaints: "Your Complaints",
      trackIssues: "Track your submitted issues",
      recentActivity: "Recent Activity",
      total: "Total",
      pending: "Pending",
      inProgress: "In Progress",
      solved: "Solved",
      citizenAppreciation: "Citizen Appreciation",
      
      // Register Complaint
      registerComplaint: "Register Complaint",
      photosOfProblem: "Photos of Problem",
      uploadPhotos: "Upload up to 4 clear photos showing the problem",
      selectCategory: "Select Category",
      describeIssue: "Describe the issue",
      wardNumber: "Ward Number",
      selectWard: "Select Ward",
      currentLocation: "Current Location",
      locationCaptured: "Location captured",
      gettingLocation: "Getting your location...",
      locationRequired: "Location is required. Please enable GPS.",
      submitComplaint: "Submit Complaint",
      complaintSubmitted: "Your complaint has been successfully submitted.",
      viewMyComplaints: "View My Complaints",
      
      // Categories
      roads: "Roads & Footpath",
      streetlights: "Street Lights",
      garbage: "Garbage & Waste",
      water: "Water Supply",
      drainage: "Drainage & Sewer",
      publicToilet: "Public Toilet",
      mosquito: "Mosquito Problem",
      trees: "Trees & Parks",
      encroachment: "Encroachment",
      other: "Other Issues",
      
      // My Complaints
      trackComplaints: "Track Your Complaints",
      monitorProgress: "Monitor the progress of all your submitted issues",
      all: "All",
      noComplaints: "No complaints found",
      registerFirst: "Register your first complaint to get started",
      tryChangingFilter: "Try changing the filter",
      complaintDetails: "Complaint Details",
      
      // Profile
      profile: "Profile",
      email: "Email",
      mobile: "Mobile",
      address: "Address",
      notSet: "Not set",
      verifiedCitizen: "Verified Citizen",
      pendingVerification: "Pending Verification",
      profileWarning: "Profile details cannot be changed after initial setup. Contact admin for corrections.",
      contactMLAOffice: "Contact MLA Office",
      urgentMatters: "For urgent matters or profile corrections, contact the MLA office directly.",
      
      // Settings
      settings: "Settings",
      languageSettings: "Language Settings",
      changeLanguage: "Change Language",
      languageUpdated: "Language updated successfully",
      
      // Status
      statusPending: "Pending",
      statusInProgress: "In Progress",
      statusSolved: "Solved",
      
      // Waiting Verification
      verificationPending: "Verification Pending",
      verificationPendingDesc: "Your profile has been submitted and is under review. Please wait while the admin verifies your details.",
      profileSubmitted: "Profile Submitted",
      profileSubmittedDesc: "Your details have been received",
      adminReview: "Under Admin Review",
      adminReviewDesc: "Your Aadhaar and details are being verified",
      accountActivation: "Account Activation",
      accountActivationDesc: "You'll get access once verified",
      registeredAs: "Registered as",
      checkingStatus: "Checking...",
      checkStatus: "Check Verification Status",
      needHelp: "Need Help?",
      contactForHelp: "Contact the MLA office for verification queries",
      
      // Login Page
      signingIn: "Signing you in...",
      securePortal: "Secure Government Portal",
      reportWithGPS: "Report issues with GPS location",
      trackRealTime: "Track complaint status in real-time",
      getNotified: "Get notified when solved",
      signInWithGoogle: "Sign in with Google to continue",
      termsAndPrivacy: "By continuing, you agree to our Terms of Service and Privacy Policy.",
      initiativeBy: "An initiative by",
      ourGovernment: "Our Government",
      loginFailed: "Login failed. Please try again.",
      error: "Error",
      
      // Profile Setup
      completeProfile: "Complete Your Profile",
      fewMoreDetails: "We need a few more details to verify your account",
      profileDetails: "Profile Details",
      allFieldsRequired: "All fields are required for verification",
      fullName: "Full Name",
      enterFullName: "Enter your full name",
      mobileNumber: "Mobile Number",
      enterMobile: "Enter your 10-digit mobile number",
      residentialAddress: "Residential Address",
      enterAddress: "Enter your complete address",
      profilePhoto: "Profile Photo",
      aadharPhoto: "Aadhar Card Photo",
      clickToUpload: "Click to upload photo",
      clickToUploadAadhar: "Click to upload Aadhar Card",
      photoRequired: "Profile photo is required",
      aadharRequired: "Aadhar photo is required",
      submitForVerification: "Submit for Verification",
      
      // Bottom Nav
      home: "Home",
      register: "Register",
      complaints: "Complaints",
      
      // Header
      buildingBetterTomorrow: "Building a Better Tomorrow",
      notifications: "Notifications",
      noNotifications: "No notifications",
    }
  },
  hi: {
    translation: {
      // Common
      welcome: "स्वागत है",
      welcomeBack: "फिर से स्वागत है,",
      login: "लॉगिन",
      logout: "लॉग आउट",
      next: "आगे बढ़ें",
      submit: "जमा करें",
      cancel: "रद्द करें",
      save: "सहेजें",
      choose: "चुनें",
      viewAll: "सभी देखें",
      goToHome: "होम पर जाएं",
      success: "सफलता!",
      loading: "लोड हो रहा है...",
      
      // Onboarding
      selectPreferences: "अपनी प्राथमिकताएं चुनें",
      selectLanguage: "भाषा चुनें",
      selectDistrict: "जिला चुनें",
      selectMunicipality: "नगर पालिका चुनें",
      english: "अंग्रेजी",
      hindi: "हिंदी",
      bengali: "बंगाली",
      pleaseSelectAll: "कृपया सभी फ़ील्ड चुनें",
      
      // Home Page
      reportIssue: "समस्या दर्ज करें",
      helpImproveWard: "अपने वार्ड को बेहतर बनाने में मदद करें!",
      location: "स्थान",
      photo: "फोटो",
      ward: "वार्ड",
      yourComplaints: "आपकी शिकायतें",
      trackIssues: "अपने दर्ज किए गए मुद्दों को ट्रैक करें",
      recentActivity: "हालिया गतिविधि",
      total: "कुल",
      pending: "लंबित",
      inProgress: "प्रगति में",
      solved: "हल हो गया",
      citizenAppreciation: "नागरिक सम्मान",
      
      // Register Complaint
      registerComplaint: "शिकायत दर्ज करें",
      photosOfProblem: "समस्या की तस्वीरें",
      uploadPhotos: "समस्या दिखाने वाली 4 स्पष्ट तस्वीरें अपलोड करें",
      selectCategory: "श्रेणी चुनें",
      describeIssue: "समस्या का वर्णन करें",
      wardNumber: "वार्ड नंबर",
      selectWard: "वार्ड चुनें",
      currentLocation: "वर्तमान स्थान",
      locationCaptured: "स्थान प्राप्त हुआ",
      gettingLocation: "आपका स्थान प्राप्त किया जा रहा है...",
      locationRequired: "स्थान आवश्यक है। कृपया GPS चालू करें।",
      submitComplaint: "शिकायत जमा करें",
      complaintSubmitted: "आपकी शिकायत सफलतापूर्वक दर्ज हो गई है।",
      viewMyComplaints: "मेरी शिकायतें देखें",
      
      // Categories
      roads: "सड़क और फुटपाथ",
      streetlights: "स्ट्रीट लाइट",
      garbage: "कचरा और अपशिष्ट",
      water: "जल आपूर्ति",
      drainage: "जल निकासी और सीवर",
      publicToilet: "सार्वजनिक शौचालय",
      mosquito: "मच्छर की समस्या",
      trees: "पेड़ और पार्क",
      encroachment: "अतिक्रमण",
      other: "अन्य समस्याएं",
      
      // My Complaints
      trackComplaints: "अपनी शिकायतें ट्रैक करें",
      monitorProgress: "अपनी सभी दर्ज समस्याओं की प्रगति देखें",
      all: "सभी",
      noComplaints: "कोई शिकायत नहीं मिली",
      registerFirst: "शुरू करने के लिए अपनी पहली शिकायत दर्ज करें",
      tryChangingFilter: "फ़िल्टर बदलकर देखें",
      complaintDetails: "शिकायत विवरण",
      
      // Profile
      profile: "प्रोफ़ाइल",
      email: "ईमेल",
      mobile: "मोबाइल",
      address: "पता",
      notSet: "सेट नहीं",
      verifiedCitizen: "सत्यापित नागरिक",
      pendingVerification: "सत्यापन लंबित",
      profileWarning: "प्रारंभिक सेटअप के बाद प्रोफ़ाइल विवरण बदला नहीं जा सकता। सुधार के लिए व्यवस्थापक से संपर्क करें।",
      contactMLAOffice: "MLA कार्यालय से संपर्क करें",
      urgentMatters: "तत्काल मामलों या प्रोफ़ाइल सुधार के लिए, सीधे MLA कार्यालय से संपर्क करें।",
      
      // Settings
      settings: "सेटिंग्स",
      languageSettings: "भाषा सेटिंग्स",
      changeLanguage: "भाषा बदलें",
      languageUpdated: "भाषा सफलतापूर्वक अपडेट की गई",
      
      // Status
      statusPending: "लंबित",
      statusInProgress: "प्रगति में",
      statusSolved: "हल हो गया",
      
      // Waiting Verification
      verificationPending: "सत्यापन लंबित",
      verificationPendingDesc: "आपकी प्रोफ़ाइल जमा हो गई है और समीक्षा में है। कृपया प्रतीक्षा करें जब तक व्यवस्थापक आपके विवरण सत्यापित करता है।",
      profileSubmitted: "प्रोफ़ाइल जमा हो गई",
      profileSubmittedDesc: "आपका विवरण प्राप्त हो गया है",
      adminReview: "व्यवस्थापक समीक्षा में",
      adminReviewDesc: "आपका आधार और विवरण सत्यापित किया जा रहा है",
      accountActivation: "खाता सक्रियण",
      accountActivationDesc: "सत्यापन के बाद आपको एक्सेस मिलेगा",
      registeredAs: "के रूप में पंजीकृत",
      checkingStatus: "जाँच हो रही है...",
      checkStatus: "सत्यापन स्थिति जाँचें",
      needHelp: "मदद चाहिए?",
      contactForHelp: "सत्यापन प्रश्नों के लिए MLA कार्यालय से संपर्क करें",
      
      // Login Page
      signingIn: "साइन इन हो रहा है...",
      securePortal: "सुरक्षित सरकारी पोर्टल",
      reportWithGPS: "GPS स्थान के साथ समस्याएं रिपोर्ट करें",
      trackRealTime: "रीयल-टाइम में शिकायत स्थिति ट्रैक करें",
      getNotified: "हल होने पर सूचना पाएं",
      signInWithGoogle: "जारी रखने के लिए Google से साइन इन करें",
      termsAndPrivacy: "जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं।",
      initiativeBy: "द्वारा एक पहल",
      ourGovernment: "हमारी सरकार",
      loginFailed: "लॉगिन विफल। कृपया पुनः प्रयास करें।",
      error: "त्रुटि",
      
      // Profile Setup
      completeProfile: "अपनी प्रोफ़ाइल पूर्ण करें",
      fewMoreDetails: "आपके खाते को सत्यापित करने के लिए हमें कुछ और विवरण चाहिए",
      profileDetails: "प्रोफ़ाइल विवरण",
      allFieldsRequired: "सत्यापन के लिए सभी फ़ील्ड आवश्यक हैं",
      fullName: "पूरा नाम",
      enterFullName: "अपना पूरा नाम दर्ज करें",
      mobileNumber: "मोबाइल नंबर",
      enterMobile: "अपना 10-अंकीय मोबाइल नंबर दर्ज करें",
      residentialAddress: "आवासीय पता",
      enterAddress: "अपना पूरा पता दर्ज करें",
      profilePhoto: "प्रोफ़ाइल फोटो",
      aadharPhoto: "आधार कार्ड फोटो",
      clickToUpload: "फोटो अपलोड करने के लिए क्लिक करें",
      clickToUploadAadhar: "आधार कार्ड अपलोड करने के लिए क्लिक करें",
      photoRequired: "प्रोफ़ाइल फोटो आवश्यक है",
      aadharRequired: "आधार फोटो आवश्यक है",
      submitForVerification: "सत्यापन के लिए जमा करें",
      
      // Bottom Nav
      home: "होम",
      register: "रजिस्टर",
      complaints: "शिकायतें",
      
      // Header
      buildingBetterTomorrow: "एक बेहतर कल का निर्माण",
      notifications: "सूचनाएं",
      noNotifications: "कोई सूचना नहीं",
    }
  },
  bn: {
    translation: {
      // Common
      welcome: "স্বাগতম",
      welcomeBack: "আবার স্বাগতম,",
      login: "লগইন",
      logout: "লগ আউট",
      next: "পরবর্তী",
      submit: "জমা দিন",
      cancel: "বাতিল",
      save: "সংরক্ষণ করুন",
      choose: "বেছে নিন",
      viewAll: "সব দেখুন",
      goToHome: "হোম এ যান",
      success: "সফল!",
      loading: "লোড হচ্ছে...",
      
      // Onboarding
      selectPreferences: "আপনার পছন্দ নির্বাচন করুন",
      selectLanguage: "ভাষা নির্বাচন করুন",
      selectDistrict: "জেলা নির্বাচন করুন",
      selectMunicipality: "পৌরসভা নির্বাচন করুন",
      english: "ইংরেজি",
      hindi: "হিন্দি",
      bengali: "বাংলা",
      pleaseSelectAll: "দয়া করে সব ক্ষেত্র নির্বাচন করুন",
      
      // Home Page
      reportIssue: "সমস্যা রিপোর্ট করুন",
      helpImproveWard: "আপনার ওয়ার্ড উন্নত করতে সাহায্য করুন!",
      location: "অবস্থান",
      photo: "ছবি",
      ward: "ওয়ার্ড",
      yourComplaints: "আপনার অভিযোগ",
      trackIssues: "আপনার জমা দেওয়া সমস্যা ট্র্যাক করুন",
      recentActivity: "সাম্প্রতিক কার্যকলাপ",
      total: "মোট",
      pending: "অমীমাংসিত",
      inProgress: "চলমান",
      solved: "সমাধান হয়েছে",
      citizenAppreciation: "নাগরিক সম্মান",
      
      // Register Complaint
      registerComplaint: "অভিযোগ দাখিল করুন",
      photosOfProblem: "সমস্যার ছবি",
      uploadPhotos: "সমস্যা দেখানো ৪টি পরিষ্কার ছবি আপলোড করুন",
      selectCategory: "বিভাগ নির্বাচন করুন",
      describeIssue: "সমস্যার বিবরণ দিন",
      wardNumber: "ওয়ার্ড নম্বর",
      selectWard: "ওয়ার্ড নির্বাচন করুন",
      currentLocation: "বর্তমান অবস্থান",
      locationCaptured: "অবস্থান ধরা হয়েছে",
      gettingLocation: "আপনার অবস্থান নেওয়া হচ্ছে...",
      locationRequired: "অবস্থান প্রয়োজন। দয়া করে GPS চালু করুন।",
      submitComplaint: "অভিযোগ জমা দিন",
      complaintSubmitted: "আপনার অভিযোগ সফলভাবে জমা হয়েছে।",
      viewMyComplaints: "আমার অভিযোগ দেখুন",
      
      // Categories
      roads: "রাস্তা ও ফুটপাথ",
      streetlights: "রাস্তার আলো",
      garbage: "আবর্জনা ও বর্জ্য",
      water: "পানি সরবরাহ",
      drainage: "নর্দমা ও পয়ঃনিষ্কাশন",
      publicToilet: "পাবলিক টয়লেট",
      mosquito: "মশার সমস্যা",
      trees: "গাছ ও পার্ক",
      encroachment: "দখল",
      other: "অন্যান্য সমস্যা",
      
      // My Complaints
      trackComplaints: "আপনার অভিযোগ ট্র্যাক করুন",
      monitorProgress: "আপনার সব জমা দেওয়া সমস্যার অগ্রগতি দেখুন",
      all: "সব",
      noComplaints: "কোন অভিযোগ পাওয়া যায়নি",
      registerFirst: "শুরু করতে আপনার প্রথম অভিযোগ দাখিল করুন",
      tryChangingFilter: "ফিল্টার পরিবর্তন করে দেখুন",
      complaintDetails: "অভিযোগের বিবরণ",
      
      // Profile
      profile: "প্রোফাইল",
      email: "ইমেইল",
      mobile: "মোবাইল",
      address: "ঠিকানা",
      notSet: "সেট করা নেই",
      verifiedCitizen: "যাচাইকৃত নাগরিক",
      pendingVerification: "যাচাই অপেক্ষমান",
      profileWarning: "প্রাথমিক সেটআপের পর প্রোফাইল বিবরণ পরিবর্তন করা যাবে না। সংশোধনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।",
      contactMLAOffice: "MLA অফিসে যোগাযোগ করুন",
      urgentMatters: "জরুরি বিষয় বা প্রোফাইল সংশোধনের জন্য, সরাসরি MLA অফিসে যোগাযোগ করুন।",
      
      // Settings
      settings: "সেটিংস",
      languageSettings: "ভাষা সেটিংস",
      changeLanguage: "ভাষা পরিবর্তন করুন",
      languageUpdated: "ভাষা সফলভাবে আপডেট হয়েছে",
      
      // Status
      statusPending: "অমীমাংসিত",
      statusInProgress: "চলমান",
      statusSolved: "সমাধান হয়েছে",
      
      // Waiting Verification
      verificationPending: "যাচাই অপেক্ষমান",
      verificationPendingDesc: "আপনার প্রোফাইল জমা হয়েছে এবং পর্যালোচনা চলছে। অ্যাডমিন আপনার বিবরণ যাচাই করার সময় অপেক্ষা করুন।",
      profileSubmitted: "প্রোফাইল জমা হয়েছে",
      profileSubmittedDesc: "আপনার বিবরণ পাওয়া গেছে",
      adminReview: "অ্যাডমিন পর্যালোচনায়",
      adminReviewDesc: "আপনার আধার এবং বিবরণ যাচাই করা হচ্ছে",
      accountActivation: "অ্যাকাউন্ট সক্রিয়করণ",
      accountActivationDesc: "যাচাই হলে আপনি অ্যাক্সেস পাবেন",
      registeredAs: "হিসাবে নিবন্ধিত",
      checkingStatus: "চেক করা হচ্ছে...",
      checkStatus: "যাচাই স্ট্যাটাস দেখুন",
      needHelp: "সাহায্য দরকার?",
      contactForHelp: "যাচাই প্রশ্নের জন্য MLA অফিসে যোগাযোগ করুন",
      
      // Login Page
      signingIn: "সাইন ইন হচ্ছে...",
      securePortal: "নিরাপদ সরকারি পোর্টাল",
      reportWithGPS: "GPS অবস্থান সহ সমস্যা রিপোর্ট করুন",
      trackRealTime: "রিয়েল-টাইমে অভিযোগ স্ট্যাটাস ট্র্যাক করুন",
      getNotified: "সমাধান হলে বিজ্ঞপ্তি পান",
      signInWithGoogle: "চালিয়ে যেতে Google দিয়ে সাইন ইন করুন",
      termsAndPrivacy: "চালিয়ে যাওয়ায়, আপনি আমাদের পরিষেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হচ্ছেন।",
      initiativeBy: "একটি উদ্যোগ",
      ourGovernment: "আমাদের সরকার",
      loginFailed: "লগইন ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।",
      error: "ত্রুটি",
      
      // Profile Setup
      completeProfile: "আপনার প্রোফাইল সম্পূর্ণ করুন",
      fewMoreDetails: "আপনার অ্যাকাউন্ট যাচাই করতে আমাদের আরও কিছু বিবরণ প্রয়োজন",
      profileDetails: "প্রোফাইল বিবরণ",
      allFieldsRequired: "যাচাইয়ের জন্য সমস্ত ক্ষেত্র প্রয়োজনীয়",
      fullName: "পুরো নাম",
      enterFullName: "আপনার পুরো নাম লিখুন",
      mobileNumber: "মোবাইল নম্বর",
      enterMobile: "আপনার 10-সংখ্যার মোবাইল নম্বর লিখুন",
      residentialAddress: "আবাসিক ঠিকানা",
      enterAddress: "আপনার সম্পূর্ণ ঠিকানা লিখুন",
      profilePhoto: "প্রোফাইল ছবি",
      aadharPhoto: "আধার কার্ড ছবি",
      clickToUpload: "ছবি আপলোড করতে ক্লিক করুন",
      clickToUploadAadhar: "আধার কার্ড আপলোড করতে ক্লিক করুন",
      photoRequired: "প্রোফাইল ছবি আবশ্যক",
      aadharRequired: "আধার ছবি আবশ্যক",
      submitForVerification: "যাচাইয়ের জন্য জমা দিন",
      
      // Bottom Nav
      home: "হোম",
      register: "রেজিস্টার",
      complaints: "অভিযোগ",
      
      // Header
      buildingBetterTomorrow: "আগামীকালকে আরও সুন্দর করছি",
      notifications: "বিজ্ঞপ্তি",
      noNotifications: "কোনো বিজ্ঞপ্তি নেই",
    }
  }
};

// Get saved language from localStorage
const savedLanguage = localStorage.getItem('appLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;