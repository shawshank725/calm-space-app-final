import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommunityPost } from '@/types/Community';

interface PostModalProps {
  visible: boolean;
  isEdit?: boolean;
  postText: string;
  selectedMedia: { uri: string; type: 'image' | 'video' } | null;
  isPosting: boolean;
  onClose: () => void;
  onPostTextChange: (text: string) => void;
  onPickMedia: () => void;
  onRemoveMedia: () => void;
  onSubmit: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({
  visible,
  isEdit = false,
  postText,
  selectedMedia,
  isPosting,
  onClose,
  onPostTextChange,
  onPickMedia,
  onRemoveMedia,
  onSubmit
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Share your thoughts..."
            placeholderTextColor="#666"
            multiline
            value={postText}
            onChangeText={onPostTextChange}
          />

          {selectedMedia && (
            <View style={styles.mediaPreview}>
              <Text style={styles.mediaLabel}>
                Selected {selectedMedia.type}:
              </Text>
              <Text style={styles.mediaName}>
                {selectedMedia.uri.split('/').pop()}
              </Text>
              <TouchableOpacity
                style={styles.removeMediaBtn}
                onPress={onRemoveMedia}
              >
                <Ionicons name="close" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.pickMediaBtn}
            onPress={onPickMedia}
          >
            <Ionicons name="images" size={24} color="#FFB347" />
            <Text style={styles.pickMediaText}>
              {isEdit ? 'Change Image/Video' : 'Select Image/Video'}
            </Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isPosting && styles.disabledBtn]}
              onPress={onSubmit}
              disabled={isPosting}
            >
              <Text style={styles.submitBtnText}>
                {isPosting ? (isEdit ? 'Updating...' : 'Posting...') : (isEdit ? 'Update' : 'Post')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB347',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: '#111',
  },
  mediaPreview: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#111',
    borderRadius: 10,
    alignItems: 'center',
  },
  mediaLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  mediaName: {
    color: '#888',
    fontSize: 12,
  },
  removeMediaBtn: {
    marginTop: 10,
    padding: 5,
  },
  pickMediaBtn: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#111',
    borderRadius: 15,
    marginBottom: 20,
  },
  pickMediaText: {
    color: 'white',
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#FFB347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#666',
  },
  submitBtnText: {
    color: '#222',
    fontWeight: 'bold',
  },
});
