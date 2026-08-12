import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { AdminUser, UserStatistics } from '@/types/Admin';
import Toast from 'react-native-toast-message';

export const useAdminUsers = (activeTab: string) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [changingType, setChangingType] = useState(false);

  const stats: UserStatistics = {
    studentCount: users.filter(u => u.type === 'STUDENT').length,
    expertCount: users.filter(u => u.type === 'EXPERT').length,
    peerCount: users.filter(u => u.type === 'PEER').length,
    totalCount: users.length,
  };

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, type, registration_number, email, course, phone_number, date_of_birth');

      if (error) throw error;

      const allUsers: AdminUser[] = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        username: p.username || p.registration_number.toString(),
        reg_no: p.registration_number,
        email: p.email || 'N/A',
        course: p.course || 'N/A',
        type: p.type,
        request_status: 'approved',
        phone: p.phone_number || 0,
        dob: p.date_of_birth || 'N/A',
        details: 'N/A',
        category: p.type?.toLowerCase() || 'student'
      }));

      allUsers.sort((a, b) => {
        if (a.type !== b.type) {
          const typeOrder: Record<string, number> = { 'STUDENT': 1, 'EXPERT': 2, 'PEER': 3, 'ADMIN': 4 };
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

  const handleChangeUserType = async (userId: string, userName: string, newType: string) => {
    setChangingType(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ type: newType })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(u => u.id === userId ? { ...u, type: newType } : u));
      Toast.show({ type: 'success', text1: 'User type updated', text2: `${userName} is now ${newType}` });
      return true;
    } catch (error) {
      logger.error('Failed to update user type', error);
      return false;
    } finally {
      setChangingType(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'home') {
      fetchUsers();
      const sub = supabase.channel('admin_users').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchUsers()).subscribe();
      return () => { sub.unsubscribe(); };
    }
  }, [activeTab, fetchUsers]);

  return { users, loadingUsers, stats, changingType, fetchUsers, handleChangeUserType };
};
