import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';
import { DESIGN_CATEGORIES } from '../context/DesignContext';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import FormTextarea from '../components/ui/FormTextarea';
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

function UploadDesign() {
  const { addDesign } = useDesign();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Redirect to login if not authenticated
  if (!currentUser) {
    navigate('/login', { state: { from: { pathname: '/upload' } } });
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ 
        ...prev, 
        image: 'Please upload an image (JPEG, PNG, GIF) or PDF file' 
      }));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrors((prev) => ({ 
        ...prev, 
        image: 'File size must be less than 5MB' 
      }));
      return;
    }

    // Clear previous errors
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }

    setImageFile(file);

    // Create preview URL for image types
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Set a placeholder for PDFs
      setImagePreview('pdf');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!imageFile) {
      newErrors.image = 'Please upload an image or PDF file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, we'd upload the file to a server/cloud storage
      // Here we'll just use the file preview URL directly for demo purposes
      const imageUrl = imagePreview === 'pdf'
        ? 'https://placehold.co/600x400?text=PDF+Document'
        : imagePreview;

      // Add the new design
      const design = await addDesign({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl,
        fileName: imageFile.name,
        fileType: imageFile.type,
      });

      // Navigate to the newly created design
      navigate(`/design/${design.id}`);
    } catch (err) {
      setGeneralError(err.message || 'Failed to upload design. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-16 rounded-xl overflow-hidden">
        {/* Abstract geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 10 + 2}rem`,
                  height: `${Math.random() * 10 + 2}rem`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                  transform: `scale(${Math.random() * 0.8 + 0.6})`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Upload Your Design</h1>
          <p className="text-primary-100 max-w-2xl mx-auto text-lg">
            Share your creative work with others and get feedback from the community
          </p>
        </div>
      </div>

      {generalError && (
        <div className="bg-red-50 text-red-600 p-5 rounded-xl shadow-sm border border-red-100 flex items-start">
          <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <p>{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Upload Area - Left Side */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Design Preview</h2>
                <p className="text-gray-500 text-sm">
                  Upload your design file (JPG, PNG, GIF, or PDF)
                </p>
              </div>
              
              <div className={`border-2 ${errors.image ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'} border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-80`}>
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {imagePreview === 'pdf' ? (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="mt-2 font-medium">PDF Document</span>
                        <span className="text-sm mt-1">{imageFile.name}</span>
                      </div>
                    ) : (
                      <img 
                        src={imagePreview} 
                        alt="Design preview" 
                        className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                      />
                    )}
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-4">
                      Drag and drop your file here, or click to browse
                    </p>
                    <Button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="rounded-full"
                    >
                      Select File
                    </Button>
                    {errors.image && (
                      <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                    )}
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif,application/pdf"
                  className="hidden"
                />
              </div>
              
              <p className="mt-2 text-sm text-gray-500">
                Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, PDF
              </p>
            </div>
            
            {/* Design Details - Right Side */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-6">Design Details</h2>
              </div>

              <FormInput
                label="Design Title"
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your design a descriptive title"
                error={errors.title}
                required
                className="rounded-lg"
              />

              <FormTextarea
                label="Description"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your design, including your inspiration and process"
                rows={4}
                error={errors.description}
                required
                className="rounded-lg"
              />

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-select block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.category ? 'border-red-300' : ''
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  {Object.entries(DESIGN_CATEGORIES).map(([id, category]) => (
                    <option key={id} value={id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags (Optional)</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Add tags to help others discover your design
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
                    UI Design
                    <button type="button" className="ml-1 rounded-full hover:bg-primary-200 h-4 w-4 inline-flex items-center justify-center">
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
                    Web
                    <button type="button" className="ml-1 rounded-full hover:bg-primary-200 h-4 w-4 inline-flex items-center justify-center">
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                  <FormInput
                    type="text"
                    placeholder="Add a tag"
                    className="w-40 px-3 py-1 text-sm rounded-full"
                    containerClassName="mb-0 inline-block"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="rounded-full px-8"
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Upload Design
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadDesign; 