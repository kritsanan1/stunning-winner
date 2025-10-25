import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ayrshareAPI } from '@/lib/ayrshare';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { post, platforms, mediaUrls, scheduleDate, autoSchedule } = await req.json();

    if (!post || !platforms || platforms.length === 0) {
      return NextResponse.json({ error: 'Post content and platforms are required' }, { status: 400 });
    }

    // Get user from database
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create post in Ayrshare
    const ayrshareData = {
      post,
      platforms,
      mediaUrls: mediaUrls || [],
      scheduleDate,
      autoSchedule: autoSchedule || false,
    };

    const ayrshareResponse = await ayrshareAPI.postContent(ayrshareData);

    // Save post to database
    const { data: savedPost } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        ayrshare_post_id: ayrshareResponse.id,
        content: post,
        platforms,
        media_urls: mediaUrls || [],
        status: scheduleDate ? 'scheduled' : 'published',
        scheduled_at: scheduleDate ? new Date(scheduleDate).toISOString() : null,
        published_at: !scheduleDate ? new Date().toISOString() : null,
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      post: savedPost,
      ayrshareResponse,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's posts from database
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
