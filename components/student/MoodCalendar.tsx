import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { getTodayKey } from '@/hooks/useMoodTracking';

interface MoodCalendarProps {
  moodHistory: { [key: string]: string };
  dailyMoodEntries: { [key: string]: any[] };
  todayMoodProgress: { completed: number, total: number };
}

export const MoodCalendar = ({
  moodHistory,
  dailyMoodEntries,
  todayMoodProgress
}: MoodCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const generateCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const calendar: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) calendar.push(null);
    for (let day = 1; day <= daysInMonth; day++) calendar.push(day);

    return calendar;
  };

  const getMoodForDate = (day: number | null): string => {
    if (day === null) return '';
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moodHistory[dateKey] || '';
  };

  const handleCalendarPress = (day: number) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEntries = dailyMoodEntries[dateKey];

    if (dayEntries && dayEntries.length > 0) {
      let entriesText = `📊 Mood check-ins for this day (${dayEntries.length}/6):\n\n`;
      dayEntries.forEach((entry: any, index: number) => {
        entriesText += `${index + 1}. ${entry.emoji} ${entry.label} at ${entry.time}\n`;
      });

      Alert.alert(`📅 ${dateKey}`, entriesText);
    } else {
      Alert.alert(`📅 ${dateKey}`, "No mood entries found for this date.");
    }
  };

  const calendar = generateCalendar();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <View style={{ alignItems: 'center', backgroundColor: Colors.backgroundLight, borderRadius: 20, margin: 10, paddingVertical: 20, borderWidth: 1, borderColor: Colors.border }}>
      <Text style={{ color: Colors.text, fontSize: 32, fontWeight: 'bold', marginBottom: 10 }}>Mood Calendar</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <TouchableOpacity onPress={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)} style={{ padding: 10 }}>
          <Text style={{ fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '600', minWidth: 150, textAlign: 'center' }}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity onPress={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)} style={{ padding: 10 }}>
          <Text style={{ fontSize: 24 }}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        {calendar.map((day, index) => {
          const isToday = day && `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` === getTodayKey();
          return (
            <TouchableOpacity
              key={index}
              style={{
                width: 45, height: 55, alignItems: 'center', justifyContent: 'center', margin: 4,
                backgroundColor: isToday ? Colors.accent + '30' : Colors.white,
                borderRadius: 12, borderWidth: 1, borderColor: isToday ? Colors.primary : Colors.border
              }}
              onPress={() => day && handleCalendarPress(day)}
              disabled={!day}
            >
              {day && (
                <>
                  <Text style={{ fontSize: 18 }}>{getMoodForDate(day)}</Text>
                  <Text style={{ fontSize: 10 }}>{day}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
