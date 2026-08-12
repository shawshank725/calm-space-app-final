import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile, useGetProfileList } from '@/api/Profile';
import { useSessionHistory } from '@/hooks/student/useSessionHistory';
import { useStudentBooking } from '@/hooks/student/useStudentBooking';
import { SessionHistoryItem } from '@/components/student/SessionHistoryItem';
import { BookingModal } from '@/components/student/modals/BookingModal';

export default function StudentCalm() {
  const router = useRouter();
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);
  const { data: experts, isLoading: loadingExperts } = useGetProfileList("EXPERT");
  const { data: peers, isLoading: loadingPeers } = useGetProfileList("PEER");

  const { sessionHistory, loadingHistory, deleteSession } = useSessionHistory(profile?.id);
  const { loadingSlots, availableSlots, loadSlots, bookSession } = useStudentBooking(profile);

  const [psychologistModal, setPsychologistModal] = useState(false);
  const [peerModal, setPeerModal] = useState(false);

  const handleDeleteSession = (id: string) => {
    Alert.alert('Delete Session', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSession(id) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}> ← </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Calm Space</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Support Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional Support</Text>
          <Text style={styles.cardSubtitle}>Connect with health professionals</Text>
          <View style={styles.row}>
            <SupportButton
              label="Connect with Psychologist"
              onPress={() => setPsychologistModal(true)}
            />
            <SupportButton
              label="Connect with Peer Listener"
              onPress={() => setPeerModal(true)}
            />
          </View>
        </View>

        {/* History Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session History</Text>
          <Text style={styles.cardSubtitle}>Your booked sessions</Text>
          {loadingHistory ? (
            <Text style={styles.infoText}>Loading...</Text>
          ) : sessionHistory.length === 0 ? (
            <Text style={styles.infoText}>No sessions yet.</Text>
          ) : (
            sessionHistory.map(session => (
              <SessionHistoryItem
                key={session.id}
                session={session}
                onDelete={handleDeleteSession}
              />
            ))
          )}
        </View>
      </ScrollView>

      <BookingModal
        visible={psychologistModal}
        type="EXPERT"
        experts={experts || []}
        loadingExperts={loadingExperts}
        onClose={() => setPsychologistModal(false)}
        onBook={bookSession}
        loadSlots={loadSlots}
        availableSlots={availableSlots}
        loadingSlots={loadingSlots}
      />

      <BookingModal
        visible={peerModal}
        type="PEER"
        experts={peers || []}
        loadingExperts={loadingPeers}
        onClose={() => setPeerModal(false)}
        onBook={bookSession}
        loadSlots={loadSlots}
        availableSlots={availableSlots}
        loadingSlots={loadingSlots}
      />
    </View>
  );
}

const SupportButton = ({ label, onPress }: { label: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.supportBtn} onPress={onPress}>
    <Image source={require('@/assets/images/connect.png')} style={styles.supportIcon} />
    <Text style={styles.supportLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20 },
  backButton: { backgroundColor: Colors.white, borderRadius: 20, padding: 8, elevation: 3 },
  backButtonText: { color: Colors.primary, fontWeight: 'bold' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  scrollContent: { paddingBottom: 40 },
  card: { backgroundColor: Colors.white, borderRadius: 25, padding: 25, margin: 20, elevation: 8 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, textAlign: 'center' },
  cardSubtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  supportBtn: { width: '45%', height: 100, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, elevation: 4 },
  supportIcon: { width: 50, height: 50, marginBottom: 8, resizeMode: 'contain' },
  supportLabel: { color: Colors.primary, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  infoText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 10 }
});
