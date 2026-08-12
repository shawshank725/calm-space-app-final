import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Toast from 'react-native-toast-message';

interface NotificationSenderProps {
  onSend: (data: any) => Promise<void>;
  isSending: boolean;
}

export const NotificationSender = ({ onSend, isSending }: NotificationSenderProps) => {
  const [form, setForm] = useState({
    title: '',
    message: '',
    receiver_type: 'ALL',
    priority: 'MEDIUM',
  });

  const handleSend = () => {
    if (!form.title.trim() || !form.message.trim()) {
      Toast.show({ type: 'error', text1: 'Title and Message are required' });
      return;
    }
    onSend(form).then(() => {
      setForm({ title: '', message: '', receiver_type: 'ALL', priority: 'MEDIUM' });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Send Announcement</Text>
      <TextInput style={styles.input} placeholder="Title" value={form.title} onChangeText={t => setForm({...form, title: t})} />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Message" value={form.message} onChangeText={m => setForm({...form, message: m})} multiline />

      <View style={styles.row}>
        <TouchableOpacity style={styles.chip} onPress={() => {
          Alert.alert('Recipient', 'Choose audience', [
            { text: 'All', onPress: () => setForm({...form, receiver_type: 'ALL'}) },
            { text: 'Students', onPress: () => setForm({...form, receiver_type: 'STUDENTS'}) },
            { text: 'Experts', onPress: () => setForm({...form, receiver_type: 'EXPERTS'}) },
          ]);
        }}>
          <Text>{form.receiver_type}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isSending}>
          {isSending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Send</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.backgroundLight, padding: 15, borderRadius: 15, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { padding: 10, backgroundColor: '#eee', borderRadius: 10 },
  sendButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  sendText: { color: '#fff', fontWeight: 'bold' }
});
