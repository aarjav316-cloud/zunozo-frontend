import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../api/eventApi";
import FormSection from "../../components/organizer/CreateEvent/FormSection";
import InputField from "../../components/organizer/CreateEvent/InputField";
import DatePickerField from "../../components/organizer/CreateEvent/DatePickerField";
import StateSelector from "../../components/organizer/CreateEvent/StateSelector";
import CategorySelector from "../../components/organizer/CreateEvent/CategorySelector";
import TagsInput from "../../components/organizer/CreateEvent/TagsInput";
import PricingToggle from "../../components/organizer/CreateEvent/PricingToggle";
import Toast from "../../components/ui/Toast";

const EditEvent = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [eventStatus, setEventStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    tags: [],
    startDate: "",
    endDate: "",
    venue: {
      venueName: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
    coverImage: "",
    galleryImages: [""],
    capacity: "",
    isFree: true,
    price: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await getEventById(eventId);
        if (data.success && data.event) {
          const event = data.event;
          
          setFormData({
            title: event.title || "",
            shortDescription: event.shortDescription || "",
            description: event.description || "",
            category: event.category || "",
            tags: event.tags || [],
            startDate: event.startDate ? new Date(event.startDate).toISOString() : "",
            endDate: event.endDate ? new Date(event.endDate).toISOString() : "",
            venue: {
              venueName: event.venue?.venueName || "",
              address: event.venue?.address || "",
              city: event.venue?.city || "",
              state: event.venue?.state || "",
              country: event.venue?.country || "India",
              pincode: event.venue?.pincode || "",
            },
            coverImage: event.coverImage || "",
            galleryImages: event.galleryImages?.length ? event.galleryImages : [""],
            capacity: event.capacity || "",
            isFree: event.isFree,
            price: event.price || 0,
          });
          setEventStatus(event.status);
        }
      } catch (err) {
        setToast({ type: "error", message: err.message || "Failed to fetch event." });
        setTimeout(() => navigate("/organizer/events"), 3000);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("venue.")) {
      const venueField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        venue: { ...prev.venue, [venueField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGalleryImageChange = (index, value) => {
    const newGalleryImages = [...formData.galleryImages];
    newGalleryImages[index] = value;
    setFormData((prev) => ({ ...prev, galleryImages: newGalleryImages }));
  };

  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ""],
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length > 100) newErrors.title = "Title max 100 characters";

    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    else if (formData.shortDescription.length > 200) newErrors.shortDescription = "Short description max 200 characters";

    if (!formData.description.trim()) newErrors.description = "Description is required";

    if (!formData.category) newErrors.category = "Category is required";

    if (!formData.startDate) newErrors.startDate = "Start Date & Time is required";
    if (!formData.endDate) newErrors.endDate = "End Date & Time is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End Date cannot be before Start Date";
    }

    if (!formData.venue.venueName.trim()) newErrors["venue.venueName"] = "Venue name is required";
    if (!formData.venue.address.trim()) newErrors["venue.address"] = "Address is required";
    if (!formData.venue.city.trim()) newErrors["venue.city"] = "City is required";
    if (!formData.venue.state.trim()) newErrors["venue.state"] = "State is required";
    if (!formData.venue.pincode.trim()) newErrors["venue.pincode"] = "Pincode is required";

    if (!formData.capacity) newErrors.capacity = "Capacity is required";
    else if (formData.capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";

    if (!formData.isFree) {
      if (!formData.price) newErrors.price = "Price is required for paid events";
      else if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    }

    if (!formData.coverImage.trim()) newErrors.coverImage = "Cover image URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      setToast({ type: "error", message: "Please fix all validation errors before submitting" });
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        galleryImages: formData.galleryImages.filter(url => url.trim() !== ""),
        price: formData.isFree ? 0 : Number(formData.price),
        capacity: Number(formData.capacity)
      };

      await updateEvent(eventId, submitData);
      
      setToast({ type: "success", message: "Event updated successfully!" });
      
      setTimeout(() => {
        navigate("/organizer/events");
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update event. Please try again.";
      setToast({ type: "error", message: errorMessage });
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
        setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] pb-12 font-geist flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-zinc-800 rounded mb-4"></div>
          <div className="h-4 w-64 bg-zinc-900 rounded"></div>
        </div>
      </div>
    );
  }

  const formatStatus = (status) => {
    if (!status) return "";
    return status.replace(/_/g, " ");
  };

  return (
    <div className="min-h-screen bg-[#09090B] pb-12 font-geist">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* Header Section */}
      <div className="bg-[#09090B] border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white tracking-tight">Edit Event</h1>
              {eventStatus && (
                <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-medium">
                  {formatStatus(eventStatus)}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400 mt-1">Update your event details and ticketing.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/organizer/events")}
              className="px-5 py-2.5 text-sm font-medium text-white bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#6366F1] hover:bg-[#5558E6] rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Column 1 */}
          <div className="space-y-8">
            
            {/* Basic Information */}
            <FormSection title="Basic Information" description="Name your event and tell attendees what it's about.">
              <div className="space-y-5">
                <InputField
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="e.g. Neon Nights Tech Summit"
                  maxLength={100}
                  required
                />
                
                <InputField
                  label="Short Description"
                  name="shortDescription"
                  type="textarea"
                  rows={2}
                  value={formData.shortDescription}
                  onChange={handleChange}
                  error={errors.shortDescription}
                  placeholder="A brief summary for discovery cards..."
                  maxLength={200}
                  required
                />
                
                <InputField
                  label="Full Description"
                  name="description"
                  type="textarea"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  placeholder="Detailed information, agenda, what to expect..."
                  required
                />
              </div>
            </FormSection>

            {/* Date & Time */}
            <FormSection title="Date & Time" description="Set the start and end schedule for your event.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DatePickerField
                  label="Start Date & Time"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                  required
                />
                <DatePickerField
                  label="End Date & Time"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                  required
                />
              </div>
            </FormSection>
            
            {/* Images */}
            <FormSection title="Images" description="Visuals to make your event stand out. Use image URLs for now.">
              <div className="space-y-5">
                <InputField
                  label="Cover Image URL"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  error={errors.coverImage}
                  placeholder="https://example.com/cover.jpg"
                  required
                />
                {formData.coverImage && (
                  <div className="mt-2 h-40 w-full rounded-xl overflow-hidden border border-zinc-800 relative bg-zinc-900">
                    <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
                
                <div className="pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-zinc-300">Gallery Image URLs (Optional)</label>
                    <button
                      type="button"
                      onClick={addGalleryImage}
                      className="text-xs font-medium text-[#6366F1] hover:text-[#5558E6] transition-colors"
                    >
                      + Add Another
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.galleryImages.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <InputField
                            name={`galleryImages.${index}`}
                            value={url}
                            onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                            placeholder="https://example.com/gallery.jpg"
                          />
                        </div>
                        {formData.galleryImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="mt-7 px-3 h-[46px] rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 text-zinc-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </FormSection>

          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            
            {/* Category & Tags */}
            <FormSection title="Category & Tags" description="Help attendees discover your event.">
              <div className="space-y-6">
                <CategorySelector
                  value={formData.category}
                  onChange={(val) => {
                    setFormData((prev) => ({ ...prev, category: val }));
                    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                  error={errors.category}
                />
                
                <div className="pt-2">
                  <TagsInput
                    value={formData.tags}
                    onChange={(val) => setFormData((prev) => ({ ...prev, tags: val }))}
                  />
                </div>
              </div>
            </FormSection>

            {/* Venue */}
            <FormSection title="Venue Location" description="Where will your event take place?">
              <div className="space-y-5">
                <InputField
                  label="Venue Name"
                  name="venue.venueName"
                  value={formData.venue.venueName}
                  onChange={handleChange}
                  error={errors["venue.venueName"]}
                  placeholder="e.g. Madison Square Garden"
                  required
                />
                <InputField
                  label="Address"
                  name="venue.address"
                  value={formData.venue.address}
                  onChange={handleChange}
                  error={errors["venue.address"]}
                  placeholder="Street address"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="City"
                    name="venue.city"
                    value={formData.venue.city}
                    onChange={handleChange}
                    error={errors["venue.city"]}
                    placeholder="City"
                    required
                  />
                  <StateSelector
                    label="State"
                    name="venue.state"
                    value={formData.venue.state}
                    onChange={handleChange}
                    error={errors["venue.state"]}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Country"
                    name="venue.country"
                    value={formData.venue.country}
                    onChange={handleChange}
                    error={errors["venue.country"]}
                    placeholder="Country"
                    required
                  />
                  <InputField
                    label="Pincode / ZIP"
                    name="venue.pincode"
                    value={formData.venue.pincode}
                    onChange={handleChange}
                    error={errors["venue.pincode"]}
                    placeholder="110001"
                    required
                  />
                </div>
              </div>
            </FormSection>
            
            {/* Pricing & Capacity */}
            <FormSection title="Ticketing & Capacity" description="Set your attendee limits and pricing structure.">
              <div className="space-y-6">
                <InputField
                  label="Total Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  error={errors.capacity}
                  placeholder="Maximum number of attendees"
                  required
                />
                
                <div className="pt-2 border-t border-zinc-800/50">
                  <PricingToggle
                    isFree={formData.isFree}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, isFree: val, price: val ? 0 : prev.price }));
                      if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    price={formData.price}
                    onPriceChange={(val) => {
                      setFormData((prev) => ({ ...prev, price: val }));
                      if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    error={errors.price}
                  />
                </div>
              </div>
            </FormSection>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
