import axios from 'axios'

const AYRSHARE_API_URL = process.env.AYRSHARE_API_URL || 'https://app.ayrshare.com/api'
const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY!

const ayrshareClient = axios.create({
  baseURL: AYRSHARE_API_URL,
  headers: {
    'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
    'Content-Type': 'application/json',
  },
})

export interface PostData {
  post: string
  platforms: string[]
  mediaUrls?: string[]
  scheduleDate?: string
  autoSchedule?: boolean
}

export interface AnalyticsData {
  postId: string
  platform: string
  metrics: {
    likes?: number
    shares?: number
    comments?: number
    views?: number
  }
}

export const ayrshareAPI = {
  // Post content to social media platforms
  async postContent(data: PostData) {
    const response = await ayrshareClient.post('/post', data)
    return response.data
  },

  // Get analytics for a post
  async getAnalytics(postId: string) {
    const response = await ayrshareClient.get(`/analytics/${postId}`)
    return response.data
  },

  // Get user's social media accounts
  async getAccounts() {
    const response = await ayrshareClient.get('/accounts')
    return response.data
  },

  // Connect a social media account
  async connectAccount(platform: string, authData: any) {
    const response = await ayrshareClient.post('/connect', {
      platform,
      ...authData,
    })
    return response.data
  },

  // Schedule a post
  async schedulePost(data: PostData & { scheduleDate: string }) {
    const response = await ayrshareClient.post('/schedule', data)
    return response.data
  },

  // Get scheduled posts
  async getScheduledPosts() {
    const response = await ayrshareClient.get('/schedule')
    return response.data
  },

  // Delete a scheduled post
  async deleteScheduledPost(postId: string) {
    const response = await ayrshareClient.delete(`/schedule/${postId}`)
    return response.data
  },
}

export default ayrshareAPI
