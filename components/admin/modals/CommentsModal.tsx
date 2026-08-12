import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PostComment, CommunityPost } from '@/types/Community';
import { formatRelativeTime } from '@/lib/utils';

interface CommentsModalProps {
  visible: boolean;
  post: CommunityPost | null;
  comments: PostComment[];
  newComment: string;
  onClose: () => void;
  onNewCommentChange: (text: string) => void;
  onAddComment: () => void;
  onDeleteComment: (id: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  post,
  comments,
  newComment,
  onClose,
  onNewCommentChange,
  onAddComment,
  onDeleteComment
}) => {
  if (!post) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFB347" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {comments.length === 0 ? (
              <Text style={styles.emptyText}>No comments yet</Text>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.commentUser}>{comment.username}</Text>
                      <Text style={styles.commentLabel}>{comment.userLabel}</Text>
                      <Text style={styles.commentTime}>{formatRelativeTime(comment.created_at)}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => onDeleteComment(comment.id)}
                      style={styles.trashBtn}
                    >
                      <Ionicons name="trash" size={16} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={newComment}
              onChangeText={onNewCommentChange}
              multiline
            />
            <TouchableOpacity
              onPress={onAddComment}
              disabled={!newComment.trim()}
              style={[
                styles.sendBtn,
                !newComment.trim() && styles.disabledSendBtn
              ]}
            >
              <Ionicons name="send" size={20} color="#222" />
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    backgroundColor: '#222',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB347',
  },
  scroll: {
    maxHeight: 400,
    marginBottom: 15,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
  },
  commentItem: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  commentUser: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentLabel: {
    color: '#FFB347',
    fontSize: 11,
    fontWeight: '600',
  },
  commentTime: {
    color: '#888',
    fontSize: 11,
  },
  trashBtn: {
    padding: 5,
  },
  commentContent: {
    color: 'white',
    marginTop: 8,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    padding: 10,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: '#FFB347',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  disabledSendBtn: {
    backgroundColor: '#444',
  },
  trashIcon: {
    padding: 5,
  }
});
