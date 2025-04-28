"use client";
import React, { useState } from 'react';

const CreateEpisode = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    duration: 0,
    type: 'Movie',
    thumbnailID: null,
    videoID: null,
    analyticsID: null,
    subscriptionPlanID: null,
    countryAvailability: [],
    isFeatured: false,
    subtitles: [],
    audios: [],
    status: 'active',
    portraitImage: null,
    landscapeImage: null,
    videoFile: null,
    videoUrl: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [contentId, setContentId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    try {
      const parsedValue = JSON.parse(e.target.value);
      setFormData(prev => ({ ...prev, [field]: parsedValue }));
    } catch (error) {
      console.error('Invalid JSON input');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'portrait' | 'landscape') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          [type === 'portrait' ? 'portraitImage' : 'landscapeImage']: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('video', file);

      try {
        const response = await fetch('/api/upload-video', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setFormData(prev => ({ ...prev, videoUrl: data.url }));
        setSuccessMessage('Video uploaded successfully!');
      } catch (error) {
        console.error('Video upload failed:', error);
      }
    }
  };

  const saveStepData = async (stepData: any) => {
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...stepData, contentId }),
      });
      const data = await response.json();
      if (!contentId) setContentId(data.id);
      setSuccessMessage(`Step ${step} data saved successfully!`);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const nextStep = async () => {
    await saveStepData(formData);
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const finishProcess = async () => {
    await saveStepData(formData);
    setSuccessMessage('Content creation completed successfully!');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Tabs for Steps */}
      <div className="flex justify-between mb-8">
        <div
          className={`flex-1 text-center py-2 cursor-pointer ${
            step === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setStep(1)}
        >
          Step 1: Episode Details
        </div>
        <div
          className={`flex-1 text-center py-2 cursor-pointer ${
            step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => step >= 2 && setStep(2)}
        >
          Step 2: Upload Images
        </div>
        <div
          className={`flex-1 text-center py-2 cursor-pointer ${
            step === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => step >= 3 && setStep(3)}
        >
          Step 3: Upload Video
        </div>
      </div>

      {/* Step 1: Content Details */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Step 1: Episode Meta Details</h2>
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>

            {/* Release Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (in minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter duration"
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
              >
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
                <option value="Web Series">Web Series</option>
                <option value="Live">Live</option>
              </select>
            </div>

            {/* Country Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Country Availability (JSON)</label>
              <textarea
                name="countryAvailability"
                value={JSON.stringify(formData.countryAvailability)}
                onChange={(e) => handleJsonChange(e, 'countryAvailability')}
                placeholder='Enter JSON array, e.g., ["US", "IN"]'
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>

            {/* Is Featured */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Is Featured?</label>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="mt-1 p-2 border rounded"
              />
            </div>

            {/* Subtitles */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitles (JSON)</label>
              <textarea
                name="subtitles"
                value={JSON.stringify(formData.subtitles)}
                onChange={(e) => handleJsonChange(e, 'subtitles')}
                placeholder='Enter JSON array, e.g., ["English", "Spanish"]'
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>

            {/* Audios */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Audios (JSON)</label>
              <textarea
                name="audios"
                value={JSON.stringify(formData.audios)}
                onChange={(e) => handleJsonChange(e, 'audios')}
                placeholder='Enter JSON array, e.g., ["English", "Hindi"]'
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Upload Images */}
      {step === 2 && (
        <div>
            <h2 className="text-2xl font-bold mb-6">Step 2: Upload Images</h2>
            <div className="flex space-x-6">
            {/* Portrait Image */}
            <div className="flex-1">
                <div className="flex-1 border-b-2 border-gray-300 p-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Portrait Image (1080x1920)</label>
                </div>
                
                <div className="mt-1">
                {formData.portraitImage ? (
                    <div className="w-full h-[400px] flex items-center justify-center overflow-hidden rounded">
                    <img
                        src={formData.portraitImage}
                        alt="Portrait Preview"
                        className="h-full w-auto object-cover"
                    />
                    </div>
                ) : (
                    <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-500">No Image</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'portrait')}
                    className="hidden"
                    id="portraitUpload"
                />
                <label
                    htmlFor="portraitUpload"
                    className="mt-2 block w-full px-4 py-2 bg-blue-500 text-white text-center rounded cursor-pointer hover:bg-blue-600"
                >
                    Choose File
                </label>
                </div>

                {/* Portrait Previews */}
                <div className="mt-6">                
                <div className="flex-1 border-b-2 border-gray-300 p-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Portrait Previews</label>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                {['720p', '480p', '260p'].map((resolution, index) => {
                    const heightClass =
                        resolution === '720p' ? 'h-[200px]' :
                        resolution === '480p' ? 'h-[133px]' :
                        'h-[86px]';

                    return (
                        <div key={index} className="flex flex-col items-center">
                        <div className={`w-full ${heightClass} bg-gray-200 flex items-center justify-center rounded`}>
                            {formData.portraitImage ? (
                            <img
                                src={formData.portraitImage}
                                alt={`Portrait Preview ${resolution}`}
                                className="h-full w-auto object-cover"
                            />
                            ) : (
                            <span className="text-gray-500">No Image</span>
                            )}
                        </div>
                        <span className="mt-2 text-sm text-gray-600">{resolution}</span>
                        </div>
                    );
                    })}
                </div>
                </div>
            </div>

            {/* Landscape Image */}
            <div className="flex-1">
                <div className="flex-1 border-b-2 border-gray-300 p-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Landscape Image (1920x1080)</label>
                </div>
                <div className="mt-1">
                {formData.landscapeImage ? (
                    <div className="w-full h-[400px] flex items-center justify-center overflow-hidden rounded">
                    <img
                        src={formData.landscapeImage}
                        alt="Landscape Preview"
                        className="w-full h-auto object-cover"
                    />
                    </div>
                ) : (
                    <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-500">No Image</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'landscape')}
                    className="hidden"
                    id="landscapeUpload"
                />
                <label
                    htmlFor="landscapeUpload"
                    className="mt-2 block w-full px-4 py-2 bg-blue-500 text-white text-center rounded cursor-pointer hover:bg-blue-600"
                >
                    Choose File
                </label>
                </div>

                {/* Landscape Previews */}
                <div className="mt-6">
                
                <div className="flex-1 border-b-2 border-gray-300 p-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Landscape Previews</label>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {/* {['720p', '480p', '260p'].map((resolution, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded">
                        {formData.landscapeImage ? (
                            <img
                            src={formData.landscapeImage}
                            alt={`Landscape Preview ${resolution}`}
                            className="w-full h-auto object-cover"
                            />
                        ) : (
                            <span className="text-gray-500">No Image</span>
                        )}
                        </div>
                        <span className="mt-2 text-sm text-gray-600">{resolution}</span>
                    </div>
                    ))} */}
                    {['720p', '480p', '260p'].map((resolution, index) => {
                    const heightClass =
                        resolution === '720p' ? 'h-[112.5px]' :
                        resolution === '480p' ? 'h-[75px]' :
                        'h-[48.75px]';

                    return (
                        <div key={index} className="flex flex-col items-center">
                        <div className={`w-full ${heightClass} bg-gray-200 flex items-center justify-center rounded`}>
                            {formData.landscapeImage ? (
                            <img
                                src={formData.landscapeImage}
                                alt={`Portrait Preview ${resolution}`}
                                className="h-full w-auto object-cover"
                            />
                            ) : (
                            <span className="text-gray-500">No Image</span>
                            )}
                        </div>
                        <span className="mt-2 text-sm text-gray-600">{resolution}</span>
                        </div>
                    );
                    })}
                </div>
                </div>
            </div>
            </div>
            <div className="mt-8 flex justify-between">
            <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
                Back
            </button>
            <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Next
            </button>
            </div>
        </div>
        )}

      {/* Step 3: Upload Video */}
      {step === 3 && (
  <div>
    <h2 className="text-2xl font-bold mb-6">Step 3: Upload Video</h2>
    <div className="space-y-6 my-6">
      {/* Video Upload Options */}
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, videoUrl: 'later' }));
            setShowVideoUpload(false);
          }}
          className={`px-6 py-2 rounded ${
            formData.videoUrl === 'later'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Video Upload Later
        </button>
        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, videoUrl: '' }));
            setShowVideoUpload(true);
          }}
          className={`px-6 py-2 rounded ${
            formData.videoUrl !== 'later'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Video Upload Now
        </button>
      </div>

      {/* Video Upload Now Section */}
      {showVideoUpload && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="mt-1 block w-full p-2 border rounded"
          />
          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className="mt-2 w-full bg-gray-200 rounded">
              <div
                className="bg-blue-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video Preview */}
      {formData.videoUrl && formData.videoUrl !== 'later' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Video Preview</label>
          <video controls className="mt-1 w-full max-w-2xl rounded">
            <source src={formData.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Video Upload Later Message */}
      {formData.videoUrl === 'later' && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded">
          <p>You can upload the video later. A unique URL will be provided for future uploads.</p>
        </div>
      )}
    </div>
    <div className="mt-8 flex justify-between">
      <button
        onClick={prevStep}
        className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back
      </button>
      <button
        onClick={finishProcess}
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save Episode
      </button>
    </div>
  </div>
)}

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default CreateEpisode;