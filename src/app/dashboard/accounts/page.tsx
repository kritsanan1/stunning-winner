'use client';

import { useState, useEffect } from 'react';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  isActive: boolean;
  connectedAt: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      // This would typically fetch from your database
      // For now, we'll show mock data
      const mockAccounts: SocialAccount[] = [
        {
          id: '1',
          platform: 'facebook',
          username: 'john_doe',
          displayName: 'John Doe',
          profileImageUrl: 'https://via.placeholder.com/40',
          isActive: true,
          connectedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          platform: 'twitter',
          username: '@johndoe',
          displayName: 'John Doe',
          profileImageUrl: 'https://via.placeholder.com/40',
          isActive: true,
          connectedAt: '2024-01-20T14:15:00Z'
        },
        {
          id: '3',
          platform: 'instagram',
          username: 'john_doe_photo',
          displayName: 'John Doe Photography',
          profileImageUrl: 'https://via.placeholder.com/40',
          isActive: false,
          connectedAt: '2024-01-10T09:45:00Z'
        }
      ];
      setAccounts(mockAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      facebook: '📘',
      twitter: '🐦',
      instagram: '📷',
      linkedin: '💼',
      tiktok: '🎵'
    };
    return icons[platform] || '📱';
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      facebook: 'bg-blue-100 text-blue-800',
      twitter: 'bg-sky-100 text-sky-800',
      instagram: 'bg-pink-100 text-pink-800',
      linkedin: 'bg-blue-100 text-blue-800',
      tiktok: 'bg-gray-100 text-gray-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  const handleConnectAccount = (platform: string) => {
    // This would typically redirect to OAuth flow
    alert(`Connect ${platform} account - OAuth flow would start here`);
  };

  const handleDisconnectAccount = (accountId: string) => {
    if (confirm('Are you sure you want to disconnect this account?')) {
      setAccounts(prev => prev.filter(account => account.id !== accountId));
    }
  };

  const availablePlatforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  ];

  const connectedPlatforms = accounts.map(account => account.platform);
  const unconnectedPlatforms = availablePlatforms.filter(
    platform => !connectedPlatforms.includes(platform.id)
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Social Media Accounts</h1>
        <p className="mt-2 text-gray-600">Manage your connected social media accounts</p>
      </div>

      {/* Connected Accounts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Accounts</h2>
        {accounts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
            <p className="text-gray-600">Connect your social media accounts to start posting</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{getPlatformIcon(account.platform)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{getPlatformName(account.platform)}</h3>
                      <p className="text-sm text-gray-500">@{account.username}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    account.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {account.profileImageUrl && (
                  <div className="flex items-center mb-4">
                    <img
                      src={account.profileImageUrl}
                      alt={account.displayName}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{account.displayName}</p>
                      <p className="text-sm text-gray-500">
                        Connected {new Date(account.connectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDisconnectAccount(account.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                  {!account.isActive && (
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Reconnect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Platforms */}
      {unconnectedPlatforms.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect New Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unconnectedPlatforms.map((platform) => (
              <div key={platform.id} className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">{platform.icon}</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{platform.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">Connect your {platform.name} account</p>
                  <button
                    onClick={() => handleConnectAccount(platform.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Connect {platform.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Status Overview */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {availablePlatforms.map((platform) => {
            const isConnected = connectedPlatforms.includes(platform.id);
            const account = accounts.find(acc => acc.platform === platform.id);
            const isActive = account?.isActive || false;
            
            return (
              <div key={platform.id} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                  isConnected && isActive 
                    ? 'bg-green-100 text-green-600' 
                    : isConnected 
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-xl">{platform.icon}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                <p className={`text-xs ${
                  isConnected && isActive 
                    ? 'text-green-600' 
                    : isConnected 
                    ? 'text-yellow-600'
                    : 'text-gray-400'
                }`}>
                  {isConnected && isActive 
                    ? 'Connected' 
                    : isConnected 
                    ? 'Inactive'
                    : 'Not Connected'
                  }
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
