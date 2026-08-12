import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface SessionHistoryItemProps {
  session: any;
  onDelete: (id: string) => void;
}

export const SessionHistoryItem: React.FC<SessionHistoryItemProps> = ({ session, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return Colors.success;
      case 'pending': return Colors.warning;
      default: return Colors.error;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.expertName}>{session.expert_name || 'Unknown Expert'}</Text>
          <Text style={styles.type}>
            {session.session_type === 'peer_listener' ? '👥 Peer Listener Session' : '🩺 Expert Consultation'}
          </Text>
          <Text style={styles.detail}>Date: {new Date(session.session_date).toLocaleDateString()}</Text>
          <Text style={styles.detail}>Time: {session.session_time}</Text>
          <Text style={[styles.status, { color: getStatusColor(session.status) }]}>
            Status: {session.status?.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(session.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  deleteBtn: {
    backgroundColor: Colors.error,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
