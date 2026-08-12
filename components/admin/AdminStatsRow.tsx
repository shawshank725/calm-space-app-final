import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserStatistics } from '@/types/Admin';

interface AdminStatsRowProps {
  stats: UserStatistics;
  userTypeFilter: string | null;
  onFilterPress: (filter: string | null) => void;
}

export const AdminStatsRow: React.FC<AdminStatsRowProps> = ({ stats, userTypeFilter, onFilterPress }) => {
  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity
        style={[styles.statBox, userTypeFilter === 'STUDENT' && styles.activeStatBox]}
        onPress={() => onFilterPress(userTypeFilter === 'STUDENT' ? null : 'STUDENT')}
      >
        <Text style={[styles.statValue, { color: '#1e90ff' }]}>{stats.studentCount}</Text>
        <Text style={styles.statLabel}>Students</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.statBox, userTypeFilter === 'EXPERT' && styles.activeStatBox]}
        onPress={() => onFilterPress(userTypeFilter === 'EXPERT' ? null : 'EXPERT')}
      >
        <Text style={[styles.statValue, { color: '#7965AF' }]}>{stats.expertCount}</Text>
        <Text style={styles.statLabel}>Experts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.statBox, userTypeFilter === 'PEER' && styles.activeStatBox]}
        onPress={() => onFilterPress(userTypeFilter === 'PEER' ? null : 'PEER')}
      >
        <Text style={[styles.statValue, { color: '#8b5cf6' }]}>{stats.peerCount}</Text>
        <Text style={styles.statLabel}>Peers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.statBox, userTypeFilter === null && styles.activeStatBox]}
        onPress={() => onFilterPress(null)}
      >
        <Text style={[styles.statValue, { color: '#2ecc71' }]}>{stats.totalCount}</Text>
        <Text style={styles.statLabel}>All Users</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  statBox: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeStatBox: {
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    borderWidth: 2,
    borderColor: '#FFB347',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 12,
  },
});
