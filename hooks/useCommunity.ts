import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useCommunity = (userRegNo: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['community_posts'],
    queryFn: async () => {
      const { data: postsData, error: postsError } = await supabase
        .from('community_post')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      if (!postsData) return [];

      const userIds = Array.from(new Set(postsData.map(post => post.user_id)));
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('name, username, profile_picture_index, registration_number, type')
        .in('registration_number', userIds);

      const profileMap = new Map();
      profilesData?.forEach(p => profileMap.set(String(p.registration_number), p));

      return postsData.map(post => {
        const userData = profileMap.get(String(post.user_id));
        return {
          ...post,
          username: userData?.name || userData?.username || `User ${post.user_id}`,
          userLabel: userData?.type || 'USER',
          profilePicIndex: userData?.profile_picture_index || 0
        };
      });
    },
    staleTime: 1000 * 60 * 5,
  });

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from('community_post').delete().eq('id', postId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['community_posts'] });
      return true;
    } catch (err) {
      console.error('Error deleting post:', err);
      Alert.alert('Error', 'Failed to delete post');
      return false;
    }
  };

  return {
    posts,
    loadingPosts,
    deletePost
  };
};
