import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { AdminUser } from '@/types/Admin';

interface UserTypeModalProps {
  visible: boolean;
  user: AdminUser | null;
  changingType: boolean;
  onClose: () => void;
  onTypeSelect: (type: string) => void;
}

export const UserTypeModal: React.FC<UserTypeModalProps> = ({
  visible,
  user,
  changingType,
  onClose,
  onTypeSelect
}) => {
  if (!user) return null;

  const userTypes = ['STUDENT', 'PEER', 'EXPERT', 'ADMIN'];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>🔄 Change User Type</Text>

          <Text style={styles.subtitle}>
            Change type for: <Text style={styles.highlight}>{user.name}</Text>
            {'\n'}
            Current type: <Text style={styles.highlightType}>{user.type}</Text>
          </Text>

          <View style={styles.optionsContainer}>
            {userTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionBtn,
                  user.type === type && styles.activeOptionBtn
                ]}
                onPress={() => onTypeSelect(type)}
                disabled={changingType || user.type === type}
              >
                <View style={styles.optionRow}>
                  <Text style={styles.optionEmoji}>
                    {type === 'STUDENT' ? '🎓' : type === 'PEER' ? '👥' : type === 'EXPERT' ? '🩺' : '👑'}
                  </Text>
                  <Text style={styles.optionText}>{type}</Text>
                </View>
                {user.type === type && (
                  <Text style={styles.currentLabel}>✓ Current</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {changingType && (
            <Text style={styles.loadingText}>Updating user type...</Text>
          )}

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            disabled={changingType}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#9b59b6',
  },
  title: {
    color: '#FFB347',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  highlight: {
    color: 'white',
    fontWeight: 'bold',
  },
  highlightType: {
    color: '#9b59b6',
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionBtn: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeOptionBtn: {
    backgroundColor: '#9b59b6',
    borderColor: '#FFB347',
    elevation: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentLabel: {
    color: '#FFB347',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#f39c12',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  cancelBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
  },
  cancelBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
