import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, firstName, lastName, imageUrl } = await req.json();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (existingUser) {
      // Update existing user
      const { data: updatedUser } = await supabase
        .from('users')
        .update({
          email,
          first_name: firstName,
          last_name: lastName,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', userId)
        .select()
        .single();

      return NextResponse.json({ user: updatedUser, isNew: false });
    } else {
      // Create new user
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          clerk_id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          image_url: imageUrl,
        })
        .select()
        .single();

      // Create default subscription for new user
      await supabase
        .from('subscriptions')
        .insert({
          user_id: newUser.id,
          status: 'active',
          plan_type: 'free',
        });

      return NextResponse.json({ user: newUser, isNew: true });
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
