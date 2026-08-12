import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { CommunityPost, PostComment } from '@/types/Community';
import { uploadMediaToSupabase } from '@/lib/utils';
import { profilePics } from '@/constants/ProfilePhotos';
import { Alert } from 'react-native';

export const useAdminCommunity = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('community_post')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithUserData = await Promise.all(
        (data || []).map(async (post) => {
          try {
            let username = `User ${post.user_id}`;
            const { data: userData } = await supabase
              .from('profiles')
              .select('username, name')
              .eq('registration_number', post.user_id)
              .maybeSingle();

            if (userData) {
              username = userData.name || userData.username || `User ${post.user_id}`;
            }

            return {
              ...post,
              username,
              profilePicIndex: Math.floor(Math.random() * profilePics.length)
            };
          } catch (error) {
            return {
              ...post,
              username: `User ${post.user_id}`,
              profilePicIndex: 0
            };
          }
        })
      );

      setPosts(postsWithUserData);
    } catch (error) {
      logger.error('Error fetching posts', error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const createPost = async (text: string, media: { uri: string; type: 'image' | 'video' } | null, adminRegNo: string) => {
    if (!text.trim() && !media) return false;

    setIsPosting(true);
    try {
      let mediaUrl = null;
      if (media) {
        mediaUrl = await uploadMediaToSupabase(media.uri, media.type);
      }

      const { error } = await supabase
        .from('community_post')
        .insert([{
          user_id: adminRegNo || 'admin',
          content: text.trim(),
          media_url: mediaUrl,
          media_type: media?.type || null,
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      await fetchPosts();
      return true;
    } catch (error) {
      logger.error('Error creating post', error);
      return false;
    } finally {
      setIsPosting(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('community_post')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== postId));
      return true;
    } catch (error) {
      logger.error('Error deleting post', error);
      return false;
    }
  };

  const updatePost = async (postId: string, text: string, media: { uri: string; type: 'image' | 'video' } | null, existingMediaUrl: string | null) => {
    setIsPosting(true);
    try {
      let mediaUrl = existingMediaUrl;
      let mediaType = media?.type || null;

      if (media && media.uri !== existingMediaUrl) {
        mediaUrl = await uploadMediaToSupabase(media.uri, media.type);
      } else if (!media) {
        mediaUrl = null;
        mediaType = null;
      }

      const { error } = await supabase
        .from('community_post')
        .update({
          content: text.trim(),
          media_url: mediaUrl,
          media_type: mediaType,
        })
        .eq('id', postId);

      if (error) throw error;
      await fetchPosts();
      return true;
    } catch (error) {
      logger.error('Error updating post', error);
      return false;
    } finally {
      setIsPosting(false);
    }
  };

  const fetchComments = async (postId: string) => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('post_comment')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithUserData = await Promise.all(
        (data || []).map(async (comment) => {
          let username = `User ${comment.user_id}`;
          let userLabel = 'USER';

          if (comment.user_id === 'admin') {
            username = 'Admin';
            userLabel = 'ADMIN';
          } else {
            const { data: userData } = await supabase
              .from('profiles')
              .select('name, username, type, registration_number')
              .eq('registration_number', comment.user_id)
              .maybeSingle();

            if (userData) {
              username = userData.username || userData.name || `User ${comment.user_id}`;
              userLabel = userData.type === 'EXPERT' ? 'EXPERT' :
                          userData.type === 'PEER' ? 'PEER LISTENER' : 'USER';
            }
          }

          return { ...comment, username, userLabel };
        })
      );

      setComments(commentsWithUserData);
    } catch (error) {
      logger.error('Error fetching comments', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const addComment = async (postId: string, text: string, adminRegNo: string) => {
    try {
      const { error } = await supabase
        .from('post_comment')
        .insert([{
          post_id: postId,
          user_id: adminRegNo || 'admin',
          content: text.trim(),
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      await fetchComments(postId);
      return true;
    } catch (error) {
      logger.error('Error adding comment', error);
      return false;
    }
  };

  const deleteComment = async (commentId: string, postId: string) => {
    try {
      const { error } = await supabase
        .from('post_comment')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      await fetchComments(postId);
      return true;
    } catch (error) {
      logger.error('Error deleting comment', error);
      return false;
    }
  };

  return {
    posts,
    loadingPosts,
    isPosting,
    comments,
    loadingComments,
    fetchPosts,
    createPost,
    deletePost,
    updatePost,
    fetchComments,
    addComment,
    deleteComment
  };
};
