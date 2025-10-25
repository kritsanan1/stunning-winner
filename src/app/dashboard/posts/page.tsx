'use client';

import { useState } from 'react';
import { ayrshareAPI, PostData } from '@/lib/ayrshare';

export default function PostsPage() {
  const [postData, setPostData] = useState<PostData>({
    post: '',
    platforms: [],
    mediaUrls: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setPostData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await ayrshareAPI.postContent(postData);
      setMessage('Post created successfully!');
      setPostData({ post: '', platforms: [], mediaUrls: [] });
    } catch (error) {
      setMessage('Error creating post. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="mt-2 text-gray-600">Share your content across multiple social media platforms</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label htmlFor="post" className="block text-sm font-medium text-gray-700 mb-2">
            Post Content
          </label>
          <textarea
            id="post"
            rows={4}
            value={postData.post}
            onChange={(e) => setPostData(prev => ({ ...prev, post: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="What's on your mind?"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Platforms
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {platforms.map((platform) => (
              <label
                key={platform.id}
                className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  postData.platforms.includes(platform.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={postData.platforms.includes(platform.id)}
                  onChange={() => handlePlatformToggle(platform.id)}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl mb-1">{platform.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="mediaUrls" className="block text-sm font-medium text-gray-700 mb-2">
            Media URLs (optional)
          </label>
          <input
            type="text"
            id="mediaUrls"
            value={postData.mediaUrls?.join(', ') || ''}
            onChange={(e) => setPostData(prev => ({ 
              ...prev, 
              mediaUrls: e.target.value.split(',').map(url => url.trim()).filter(url => url)
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          <p className="mt-1 text-sm text-gray-500">Separate multiple URLs with commas</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSchedule"
              checked={postData.autoSchedule || false}
              onChange={(e) => setPostData(prev => ({ ...prev, autoSchedule: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoSchedule" className="ml-2 text-sm text-gray-700">
              Auto-schedule for optimal times
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !postData.post || postData.platforms.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {isLoading ? 'Posting...' : 'Post Now'}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
