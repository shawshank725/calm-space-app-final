import React from 'react';
import { Modal, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MOOD_EMOJIS } from '@/hooks/useMoodTracking';

interface MoodCheckInModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMood: (mood: string) => void;
  studentName: string;
  currentPromptInfo: { timeLabel: string, scheduleKey: string } | null;
  todayMoodProgress: { completed: number, total: number };
  missedPromptsQueue: any[];
}

export const MoodCheckInModal = ({
  visible,
  onClose,
  onSelectMood,
  studentName,
  currentPromptInfo,
  todayMoodProgress,
  missedPromptsQueue
}: MoodCheckInModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primaryOverlay }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e: any) => e.stopPropagation()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              backgroundColor: Colors.white,
              borderRadius: 25,
              padding: 30,
              alignItems: 'center',
              width: 360,
              shadowColor: Colors.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
              borderWidth: 2,
              borderColor: Colors.accent
            }}
          >
            <Text style={{ fontSize: 28, marginBottom: 10, color: Colors.text, fontWeight: 'bold', textAlign: 'center' }}>
              🌟 Mood Check-In
            </Text>

            {currentPromptInfo && (
              <View style={{ width: '100%', marginBottom: 15 }}>
                <Text style={{ fontSize: 14, color: Colors.primary, textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
                  {currentPromptInfo.timeLabel}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <View
                      key={num}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: todayMoodProgress.completed >= num ? Colors.primary : Colors.backgroundLight,
                        marginHorizontal: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: currentPromptInfo.scheduleKey === `slot_${num}` ? Colors.accent : 'transparent'
                      }}
                    >
                      <Text style={{ color: todayMoodProgress.completed >= num ? Colors.white : Colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>
                        {num}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={{ fontSize: 12, color: Colors.textSecondary, textAlign: 'center' }}>
                  Check-in {todayMoodProgress.completed + 1} of 6 today
                </Text>
                {missedPromptsQueue.length > 1 && (
                  <Text style={{ fontSize: 11, color: '#ff9800', textAlign: 'center', marginTop: 5 }}>
                    ⏰ {missedPromptsQueue.length} pending check-ins
                  </Text>
                )}
              </View>
            )}

            <Text style={{ fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 15 }}>
              Hi {studentName}! How are you feeling right now?
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
              {MOOD_EMOJIS.map((mood) => (
                <TouchableOpacity
                  key={mood.emoji}
                  style={{
                    padding: 15,
                    margin: 8,
                    borderRadius: 15,
                    backgroundColor: Colors.white,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    shadowColor: Colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                    elevation: 2
                  }}
                  onPress={() => onSelectMood(mood.emoji)}
                >
                  <Text style={{ fontSize: 40 }}>{mood.emoji}</Text>
                  <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 5, color: Colors.primary }}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
