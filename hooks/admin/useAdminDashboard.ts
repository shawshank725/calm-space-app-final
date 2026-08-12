import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { AdminUser, UserStatistics } from '@/types/Admin';
import { CommunityPost } from '@/types/Community';
import { profilePics } from '@/constants/ProfilePhotos';
import { formatRelativeTime } from '@/lib/utils';
import Toast from 'react-native-toast-message';

export const useAdminDashboard = (activeTab: string) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [changingType, setChangingType] = useState(false);

  // Statistics
  const stats: UserStatistics = {
    studentCount: users.filter(u => u.type === 'STUDENT').length,
    expertCount: users.filter(u => u.type === 'EXPERT').length,
    peerCount: users.filter(u => u.type === 'PEER').length,
    totalCount: users.length,
  };

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      logger.debug('Fetching users from profiles table');
      const { data: profilesData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, username, type, registration_number, email, course, phone_number, date_of_birth');

      if (profileError) throw profileError;

      const allUsers: AdminUser[] = (profilesData || []).map(profile => ({
        id: profile.id,
        name: profile.name,
        username: profile.username || profile.registration_number.toString(),
        reg_no: profile.registration_number,
        email: profile.email || 'N/A',
        course: profile.course || 'N/A',
        type: profile.type,
        request_status: 'approved',
        phone: profile.phone_number || 0,
        dob: profile.date_of_birth || 'N/A',
        details: 'N/A',
        category: profile.type?.toLowerCase() || 'student'
      }));

      // Sort by type order, then by name
      allUsers.sort((a, b) => {
        if (a.type !== b.type) {
          const typeOrder: { [key: string]: number } = {
            'STUDENT': 1,
            'EXPERT': 2,
            'PEER': 3,
            'ADMIN': 4
          };
          return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
        }
        return a.name.localeCompare(b.name);
      });

      setUsers(allUsers);
    } catch (error) {
      logger.error('Error fetching users', error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

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
              .from('profiles') // Changed from user_requests as per app consistency
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

  const handleChangeUserType = async (userId: string, userName: string, oldType: string, newType: string) => {
    setChangingType(true);
    logger.info(`Changing user type for ${userName}`, { from: oldType, to: newType });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ type: newType })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, type: newType, category: newType.toLowerCase() }
          : u
      ));

      Toast.show({
        type: 'success',
        text1: 'User type updated',
        text2: `${userName} is now ${newType}`,
      });
      return true;
    } catch (error: any) {
      logger.error('Failed to update user type', error);
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: error.message || 'An unexpected error occurred',
      });
      return false;
    } finally {
      setChangingType(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'home') {
      fetchUsers();
      const profileSubscription = supabase
        .channel('admin_profiles_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          fetchUsers(); // Refresh on any change for simplicity/consistency
        })
        .subscribe();

      return () => {
        profileSubscription.unsubscribe();
      };
    }
  }, [activeTab, fetchUsers]);

  useEffect(() => {
    if (activeTab === 'BuddyConnect') {
      fetchPosts();
    }
  }, [activeTab, fetchPosts]);

  return {
    users,
    loadingUsers,
    posts,
    loadingPosts,
    stats,
    changingType,
    refreshUsers: fetchUsers,
    refreshPosts: fetchPosts,
    handleChangeUserType
  };
};
