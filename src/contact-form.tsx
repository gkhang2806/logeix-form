import { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart,
  ShoppingBag, 
  Globe, 
  Facebook,
  Package,
  Store,
  TextSearch,
  Briefcase,
  Asterisk
} from 'lucide-react';

// Define form data interface
interface FormData {
  name: string;
  email: string;
  phone: string;
  websiteUrl: string;
  businessModel: string;
  monthlyRevenue: string;
  monthlySpend: string;
  marketingChannels: string[];
  otherMarketingChannel: string;
  agencyMessage: string;
  pageSource: string;
  qualified: boolean;
}

const ContactForm = () => {
  // Form state with typed interface
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    websiteUrl: '',
    businessModel: '',
    monthlyRevenue: '',
    monthlySpend: '',
    marketingChannels: [],
    otherMarketingChannel: '',
    agencyMessage: '',
    pageSource: '',
    qualified: false
  });

  const [isUK, setIsUK] = useState<boolean>(false);

  // Check if user is in UK timezone
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isUKParam = urlParams.get('isUK');
    setIsUK(isUKParam === 'true');
  }, []);

  // Get page source from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get('source');
    if (sourceParam) {
      setFormData(prev => ({...prev, pageSource: sourceParam}));
    }
  }, []);

  const isAgencyConsultant = formData.businessModel === 'Agency or Consultant';

  // Qualification logic
  const checkQualification = (): boolean => {
    const isDropshipping = formData.businessModel === 'Dropshipping';
    const isAgencyConsultant = formData.businessModel === 'Agency or Consultant';
    const isRevenueBelow50k = formData.monthlyRevenue === 'Zero (Startup)';
    const qualified = !isDropshipping && !isAgencyConsultant && !isRevenueBelow50k;
    
    setFormData(prev => ({...prev, qualified}));
    return qualified;
  };

  // Update qualification status whenever relevant fields change
  useEffect(() => {
    if (formData.businessModel || formData.monthlyRevenue) {
      checkQualification();
    }
  }, [formData.businessModel, formData.monthlyRevenue]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const isQualified = checkQualification();
    
    // Get the correct hostname - check if we're in an iframe
    const isInIframe = window !== window.parent;
    let parentDomain: string;
    
    if (isInIframe) {
      // Try to get parent's location, fallback to referrer if not accessible
      try {
        const parentLocation = window.parent.location.hostname;
        
        if (parentLocation.includes('webflow.io')) {
          parentDomain = 'https://logeix.webflow.io';
        } else {
          parentDomain = 'https://logeix.com';
        }
      } catch (e) {
        // If we can't access parent location (CORS), use document.referrer
        const referrer = document.referrer;
        
        if (referrer.includes('webflow.io')) {
          parentDomain = 'https://logeix.webflow.io';
        } else {
          parentDomain = 'https://logeix.com';
        }
      }
    } else {
      // Not in iframe, use current location
      parentDomain = window.location.hostname.includes('webflow.io') 
        ? 'https://logeix.webflow.io' 
        : 'https://logeix.com';
    }
        
    const redirectUrl = isQualified 
      ? `${parentDomain}/schedule?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`
      : `${parentDomain}/thank-you`;
  
      // Start the fetch but don't await it
      fetch('https://script.google.com/macros/s/AKfycbykBWLSsxgBaHSQ72jjxOfluK9JIZT6BB7gHuCLEImwan0pfAZOqwB9__UrC13DsUeXIQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ...formData,
          isQualified
        })
      }).catch(error => console.error('Error submitting form:', error));

      // Redirect immediately
      if (isInIframe) {
        window.parent.location.href = redirectUrl;
      } else {
        window.location.href = redirectUrl;
      }
  };

  const currencySymbol = isUK ? '£' : '$';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6 bg-[#f4fdfa] text-[#333] rounded-lg">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-[#000037b3] mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[#000037b3] mb-2 font-semibold">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[#000037b3] mb-2 font-semibold">
            Phone Number <span className="text-gray-500 text-sm">(Include country code)</span>
          </label>
          <input
            type="tel"
            required
            placeholder={isUK ? '+44 123-456-7890' : '+1 123-456-7890'}
            className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[#000037b3] mb-2 font-semibold">Website URL</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
          />
        </div>
      </div>

      {/* Hidden input for page source */}
      <input 
        type="hidden" 
        name="Page-Source" 
        value={formData.pageSource}
      />

      {/* Hidden input for qualified status */}
      <input 
        type="hidden" 
        name="fields[qualified]" 
        value={formData.qualified.toString()}
      />

      {/* Business Model */}
      <div className="space-y-4">
        <label className="block text-[#000037b3] mb-2 font-semibold">
          Which of these best describes your business model?
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dtc-brand', label: 'DTC Brand', icon: Package },
            { id: 'online-retailer', label: 'Online Retailer', icon: ShoppingBag },
            { id: 'online-offline-retailer', label: 'Online & Offline Retailer', icon: Store },
            { id: 'dropshipping', label: 'Dropshipping', icon: Globe },
            { id: 'agency-consultant', label: 'Agency or Consultant', icon: Briefcase },
          ].map((option) => (
            <label
              key={option.id}
              className={`flex items-center px-4 py-[10px] border-2 rounded-lg cursor-pointer bg-white 
                ${formData.businessModel === option.label ? 'border-emerald-500 bg-white hover:bg-gray-50' : 'hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name="Business-Model"
                value={option.label}
                checked={formData.businessModel === option.label}
                onChange={(e) => setFormData({...formData, businessModel: e.target.value})}
                className="sr-only"
                required
              />
              <option.icon className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {!isAgencyConsultant && (
        <>
          {/* Monthly Revenue */}
          <div className="space-y-4">
            <label className="block text-[#000037b3] mb-2 font-semibold">
              What was your average monthly Shopify revenue over the last 3 months?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Zero (Startup)',
                `Less than ${currencySymbol}15,000`,
                `${currencySymbol}15,000 - ${currencySymbol}29,999`,
                `${currencySymbol}30,000 - ${currencySymbol}49,999`,
                `${currencySymbol}50,000 - ${currencySymbol}79,999`,
                `${currencySymbol}80,000 - ${currencySymbol}149,999`,
                `${currencySymbol}150,000+`,
              ].map((option) => (
                <label
                  key={option}
                  className={`flex items-center px-4 py-[10px] border-2 rounded-lg cursor-pointer bg-white 
                    ${formData.monthlyRevenue === option ? 'border-emerald-500 bg-white hover:bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name="Monthly-Revenue"
                    value={option}
                    checked={formData.monthlyRevenue === option}
                    onChange={(e) => setFormData({...formData, monthlyRevenue: e.target.value})}
                    className="sr-only"
                    required
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Monthly Marketing Spend */}
          <div className="space-y-4">
            <label className="block text-[#000037b3] mb-2 font-semibold">
              How much do you currently spend on digital marketing per month?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                `Less than ${currencySymbol}10,000`,
                `${currencySymbol}10,000 - ${currencySymbol}14,999`,
                `${currencySymbol}15,000+`,
              ].map((option) => (
                <label
                  key={option}
                  className={`flex items-center px-4 py-[10px] border-2 rounded-lg cursor-pointer bg-white 
                    ${formData.monthlySpend === option ? 'border-emerald-500 bg-white hover:bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name="Monthly-Spend"
                    value={option}
                    checked={formData.monthlySpend === option}
                    onChange={(e) => setFormData({...formData, monthlySpend: e.target.value})}
                    className="sr-only"
                    required
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Marketing Channels */}
          <div className="space-y-4">
            <label className="block text-[#000037b3] mb-2 font-semibold">
              Which channels do you use for marketing? <span className="text-gray-500">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'Marketing-Channel-SEO', label: 'SEO', icon: TextSearch },
                { id: 'Marketing-Channel-Google-Shopping', label: 'Google Shopping', icon: ShoppingCart },
                { id: 'Marketing-Channel-Google-Search', label: 'Google Search', icon: Search },
                { id: 'Marketing-Channel-FB-IG', label: 'FB/IG', icon: Facebook },
              ].map((channel) => (
                <label
                  key={channel.id}
                  className={`flex items-center px-4 py-[10px] border-2 rounded-lg cursor-pointer bg-white 
                    ${formData.marketingChannels.includes(channel.label) ? 'border-emerald-500 bg-white hover:bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="checkbox"
                    name={channel.id}
                    value={channel.label}
                    checked={formData.marketingChannels.includes(channel.label)}
                    onChange={(e) => {
                      const channels = e.target.checked
                        ? [...formData.marketingChannels, channel.label]
                        : formData.marketingChannels.filter(c => c !== channel.label);
                      setFormData({...formData, marketingChannels: channels});
                    }}
                    className="sr-only"
                  />
                  <channel.icon className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm">{channel.label}</span>
                </label>
              ))}
              
              {/* Other Marketing Channel */}
              <label
                className={`flex items-center px-4 py-[10px] border-2 rounded-lg cursor-pointer bg-white 
                  ${formData.marketingChannels.includes('Other') ? 'border-emerald-500 bg-white hover:bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                <input
                  type="checkbox"
                  name="Marketing-Channel-Other"
                  value="Other"
                  checked={formData.marketingChannels.includes('Other')}
                  onChange={(e) => {
                    const channels = e.target.checked
                      ? [...formData.marketingChannels, 'Other']
                      : formData.marketingChannels.filter(c => c !== 'Other');
                    setFormData({...formData, marketingChannels: channels});
                  }}
                  className="sr-only"
                />
                <Asterisk className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">Other</span>
              </label>
              
              {formData.marketingChannels.includes('Other') && (
                <input
                  type="text"
                  name="Marketing-Channel-Other"
                  placeholder="Please specify"
                  className="w-full mt-2 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none col-span-2"
                  value={formData.otherMarketingChannel}
                  onChange={(e) => setFormData({...formData, otherMarketingChannel: e.target.value})}
                  required={formData.marketingChannels.includes('Other')}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Agency Message */}
      {isAgencyConsultant && (
        <div className="space-y-4">
          <label className="block text-[#000037b3] mb-2 font-semibold">How can we help you?</label>
          <textarea
            name="Agency-Message"
            required
            className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none h-32"
            value={formData.agencyMessage}
            onChange={(e) => setFormData({...formData, agencyMessage: e.target.value})}
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-[#ffd749] text-xl text-[#2e2e2e] font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out
          ${isSubmitting 
            ? 'opacity-75 cursor-not-allowed'
            : 'hover:translate-y-[10px]'
          }`}
      >
        {isSubmitting ? 'Working on it...' : 'Submit'}
      </button>
    </form>
  );
};

export default ContactForm;