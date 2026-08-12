import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AdminUser } from '@/types/Admin';

interface AdminUserCardProps {
  user: AdminUser;
  onChangeTypePress: (user: AdminUser) => void;
}

export const AdminUserCard: React.FC<AdminUserCardProps> = ({ user, onChangeTypePress }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'STUDENT': return '#1e90ff';
      case 'EXPERT': return '#7965AF';
      case 'PEER': return '#8b5cf6';
      default: return '#FFB347';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#2ecc71';
      case 'pending': return '#f39c12';
      default: return '#e74c3c';
    }
  };

  return (
    <View style={[styles.card, { borderLeftColor: getStatusColor(user.request_status) }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userId}>User ID: {user.id}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={[styles.badge, { backgroundColor: getTypeColor(user.type) }]}>
            <Text style={styles.badgeText}>{user.type}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.request_status) }]}>
            <Text style={styles.statusText}>{user.request_status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>📋 Registration Details</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>REGISTRATION NUMBER</Text>
            <Text style={styles.value}>{user.reg_no || 'N/A'}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <Text style={styles.value}>{user.phone || 'N/A'}</Text>
          </View>
        </View>

        {user.type === 'STUDENT' && (
          <View style={{ marginTop: 12 }}>
            <Text style={[styles.sectionTitle, { color: '#1e90ff' }]}>🎓 Student Information</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>COURSE/PROGRAM</Text>
                <Text style={styles.value}>{user.course}</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.changeTypeButton}
          onPress={() => onChangeTypePress(user)}
        >
          <Text style={styles.changeTypeText}>🔄 Change User Type</Text>
          <View style={styles.currentTypeBadge}>
            <Text style={styles.currentTypeText}>Current: {user.type}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: {
    color: '#FFB347',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
  },
  userId: {
    color: '#888',
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailsSection: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
  },
  sectionTitle: {
    color: '#FFB347',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  col: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    color: '#aaa',
    fontSize: 11,
    marginBottom: 2,
  },
  value: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  changeTypeButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeTypeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  currentTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
