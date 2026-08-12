import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

interface ToolkitModalProps {
  visible: boolean;
  onClose: () => void;
  registration: string | undefined;
}

export const ToolkitModal = ({ visible, onClose, registration }: ToolkitModalProps) => {
  const router = useRouter();

  const toolkitItems = [
    { name: 'Grounding', icon: require('@/assets/images/grounding.png'), route: `./toolkit-grounding` },
    { name: 'Breathing', icon: require('@/assets/images/breathing.png'), route: `./toolkit-breathing` },
    { name: 'Mandala', icon: require('@/assets/images/mandala.png'), route: `./mandala-editor` },
    { name: 'Movement', icon: require('@/assets/images/movement.png'), route: `./toolkit-movement` },
    { name: 'Focus', icon: require('@/assets/images/focus.png'), route: `./toolkit-focus` },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Self-help Toolkit</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {toolkitItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.item}
                onPress={() => {
                  onClose();
                  router.push(`${item.route}?registration=${registration}` as any);
                }}
              >
                <Image source={item.icon} style={styles.icon} />
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  container: { backgroundColor: Colors.background, borderRadius: 25, padding: 20, width: '90%', maxWidth: 400 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  closeButton: { padding: 10, backgroundColor: Colors.white, borderRadius: 15, borderWidth: 1, borderColor: Colors.border },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  item: { width: '45%', height: 100, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: 5, backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.primary },
  icon: { width: 50, height: 50, marginBottom: 5, resizeMode: 'contain' },
  itemText: { fontSize: 12, fontWeight: 'bold', color: Colors.primary }
});
