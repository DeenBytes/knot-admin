// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    eventName: '',
    eventType: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    ticketPrice: '',
    capacity: '',
    featuredImage: null,
    galleryImages: [],
    isPublished: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value
    });
  };

  const handleToggleChange = () => {
    setEventData({
      ...eventData,
      isPublished: !eventData.isPublished
    });
  };

  const handleImageUpload = (e, type= 'featured' | 'gallery') => {
    if (e.target.files) {
      if (type === 'featured') {
        setEventData({
          ...eventData,
          featuredImage: e.target.files[0]
        });
      } else {
        setEventData({
          ...eventData,
          galleryImages: [...Array.from(e.target.files)]
        });
      }
    }
  };

  const handleSubmit = () => {
    e.preventDefault();
    console.log('Form submitted:', eventData);
    // Submit logic here
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      {/* Sidebar */}
      <div className="w-64 bg-[#F0F0F0] fixed h-full shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-8">Knot Delhi</h2>
        </div>
        <nav>
          <ul className="space-y-2">
            {['Dashboard', 'Events', 'Bookings', 'Customers', 'Analytics', 'Marketing', 'Settings'].map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center px-6 py-3 text-[#444444] hover:bg-[#E5E5E5] transition-colors ${item === 'Events' ? 'bg-[#E5E5E5] border-l-4 border-[#C5A572] text-[#C5A572] font-medium' : ''}`}
                >
                  <i className={`fa fa-${
                    item === 'Dashboard' ? 'home' : 
                    item === 'Events' ? 'calendar' : 
                    item === 'Bookings' ? 'ticket' : 
                    item === 'Customers' ? 'users' : 
                    item === 'Analytics' ? 'chart-bar' : 
                    item === 'Marketing' ? 'bullhorn' : 
                    'cog'
                  } mr-3`}></i>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-[#666666] mb-2">
            <a href="#" className="hover:text-[#C5A572]">Events</a>
            <i className="fa fa-chevron-right mx-2 text-xs"></i>
            <span>Add Event</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Add Event</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
            <h2 className="text-xl font-semibold text-[#C5A572] mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventName" className="block text-[#333333] font-medium mb-2">Event Name</label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={eventData.eventName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A572] bg-white text-[#333333]"
                  placeholder="Enter event name"
                />
              </div>
              
              <div>
                <label htmlFor="eventType" className="block text-[#333333] font-medium mb-2">Event Type</label>
                <div className="relative">
                  <select
                    id="eventType"
                    name="eventType"
                    value={eventData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded appearance-none bg-white text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#C5A572] cursor-pointer"
                  >
                    <option value="">Select event type</option>
                    <option value="party">Party</option>
                    <option value="concert">Concert</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="private">Private Event</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fa fa-chevron-down text-[#666666]"></i>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="eventDate" className="block text-[#333333] font-medium mb-2">Date</label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={eventData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A572] bg-white text-[#333333]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-[#333333] font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={eventData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A572] bg-white text-[#333333]"
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-[#333333] font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={eventData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A572] bg-white text-[#333333]"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-[#333333] font-medium mb-2">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A572] bg-white text-[#333333]"
                  placeholder="Enter event location"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-[#333333] font-medium mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={eventData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A572] bg-white text-[#333333]"
                  placeholder="Describe your event"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
            <h2 className="text-xl font-semibold text-[#C5A572] mb-6">Ticket Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ticketPrice" className="block text-[#333333] font-medium mb-2">Ticket Price (₹)</label>
                <input
                  type="text"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={eventData.ticketPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A572] bg-white text-[#333333]"
                  placeholder="Enter ticket price"
                />
              </div>
              
              <div>
                <label htmlFor="capacity" className="block text-[#333333] font-medium mb-2">Capacity</label>
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  value={eventData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:ring-2 focus:ring-[#C5A572] bg-white text-[#333333]"
                  placeholder="Enter maximum capacity"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
            <h2 className="text-xl font-semibold text-[#C5A572] mb-6">Media</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[#333333] font-medium mb-2">Featured Image</label>
                <div className="border-2 border-dashed border-[#E5E5E5] rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="featuredImage"
                    onChange={(e) => handleImageUpload(e, 'featured')}
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="featuredImage" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <i className="fa fa-cloud-upload-alt text-4xl text-[#C5A572] mb-3"></i>
                      <p className="text-[#666666] mb-2">Drag and drop your image here or</p>
                      <span className="px-4 py-2 bg-[#C5A572] text-white rounded !rounded-button whitespace-nowrap cursor-pointer">Browse Files</span>
                      <p className="text-xs text-[#999999] mt-3">Recommended size: 1200 x 600 px</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-[#333333] font-medium mb-2">Gallery Images</label>
                <div className="border-2 border-dashed border-[#E5E5E5] rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="galleryImages"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  <label htmlFor="galleryImages" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <i className="fa fa-images text-4xl text-[#C5A572] mb-3"></i>
                      <p className="text-[#666666] mb-2">Upload multiple images for your event gallery</p>
                      <span className="px-4 py-2 bg-[#C5A572] text-white rounded !rounded-button whitespace-nowrap cursor-pointer">Select Images</span>
                      <p className="text-xs text-[#999999] mt-3">You can select multiple files at once</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
            <h2 className="text-xl font-semibold text-[#C5A572] mb-6">Publishing Options</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#333333] font-medium">Publish Event</h3>
                <p className="text-[#666666] text-sm">Make this event visible on the website</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={eventData.isPublished} 
                  onChange={handleToggleChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A572]"></div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              className="px-6 py-2 border border-[#C5A572] text-[#C5A572] rounded hover:bg-[#F9F7F2] transition-colors !rounded-button whitespace-nowrap cursor-pointer"
            >
              Save as Draft
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-[#C5A572] text-white rounded hover:bg-[#B3956A] transition-colors !rounded-button whitespace-nowrap cursor-pointer"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
