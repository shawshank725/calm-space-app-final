import React from 'react';
import { ScrollView } from 'react-native';
import { MoodCalendar } from '@/components/student/MoodCalendar';

interface ExpertMoodTabProps {
  moodHistory: { [key: string]: string };
  dailyMoodEntries: { [key: string]: any[] };
  todayMoodProgress: { completed: number, total: number };
}

export const ExpertMoodTab = ({
  moodHistory,
  dailyMoodEntries,
  todayMoodProgress
}: ExpertMoodTabProps) => {
  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <MoodCalendar
        moodHistory={moodHistory}
        dailyMoodEntries={dailyMoodEntries}
        todayMoodProgress={todayMoodProgress}
      />
    </ScrollView>
  );
};
