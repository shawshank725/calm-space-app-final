import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { Alert } from 'react-native';
import { Profile } from '@/types/Profile';

export const useStudentBooking = (profile: Profile | null | undefined) => {
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  const loadSlots = useCallback(async (registrationNumber: string, date: string, type: 'EXPERT' | 'PEER') => {
    setLoadingSlots(true);
    const table = type === 'EXPERT' ? 'expert_schedule' : 'student_schedule';
    const regField = type === 'EXPERT' ? 'expert_registration_number' : 'peer_registration_number';

    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(regField, registrationNumber)
        .eq('date', date)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAvailableSlots(data || []);
    } catch (error) {
      logger.error(`Error loading slots from ${table}`, error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const bookSession = async (params: {
    expertId: string;
    expertName: string;
    expertReg: string;
    date: string;
    time: string;
    mode: 'online' | 'offline' | null;
    type: 'EXPERT' | 'PEER';
  }) => {
    if (!profile) return false;

    try {
      const sessionRequestData = {
        student_id: profile.id,
        student_name: profile.name,
        student_email: profile.email,
        student_course: profile.course,
        student_registration_number: profile.registration_number,
        expert_registration_number: params.expertReg,
        expert_name: params.expertName,
        expert_id: params.expertId,
        session_date: params.date,
        session_time: params.time,
        booking_mode: params.mode,
        status: 'pending',
        session_type: params.type === 'PEER' ? 'peer_listener' : 'expert',
      };

      const { data, error } = await supabase
        .from('book_request')
        .insert([sessionRequestData])
        .select()
        .maybeSingle();

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error booking session', error);
      return false;
    }
  };

  return { loadingSlots, availableSlots, loadSlots, bookSession };
};
