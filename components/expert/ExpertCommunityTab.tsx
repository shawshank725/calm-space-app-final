import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { profilePics } from '@/constants/ProfilePhotos';
import { formatRelativeTime } from '@/lib/utils';

interface ExpertCommunityTabProps {
  posts: any[];
  loadingPosts: boolean;
  onAddPost: () => void;
  onDeletePost: (post: any) => void;
  onOpenComments: (post: any) => void;
}

export const ExpertCommunityTab = ({
  posts,
  loadingPosts,
  onAddPost,
  onDeletePost,
  onOpenComments
}: ExpertCommunityTabProps) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expert Community</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddPost}>
          <Ionicons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={profilePics[item.profilePicIndex || 0]} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.userLabel}>{item.userLabel}</Text>
                <Text style={styles.time}>{formatRelativeTime(item.created_at)}</Text>
              </View>
              <TouchableOpacity onPress={() => onDeletePost(item)}>
                <Ionicons name="trash" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>

            <Text style={styles.content}>{item.content}</Text>

            {item.media_url && (
              <Image source={{ uri: item.media_url }} style={styles.media} resizeMode="cover" />
            )}

            <TouchableOpacity style={styles.commentButton} onPress={() => onOpenComments(item)}>
              <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
              <Text style={styles.commentText}>Comments</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{loadingPosts ? 'Loading...' : 'No posts yet'}</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: Colors.primary },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.white },
  addButton: { padding: 8 },
  postCard: { backgroundColor: Colors.surface, margin: 10, borderRadius: 15, padding: 15, elevation: 3 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10, borderWidth: 2, borderColor: Colors.primary },
  username: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
  userLabel: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  time: { fontSize: 12, color: Colors.textSecondary },
  content: { fontSize: 16, color: Colors.text, marginBottom: 10 },
  media: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  commentButton: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: Colors.background, borderRadius: 8, alignSelf: 'flex-start' },
  commentText: { marginLeft: 5, color: Colors.primary, fontSize: 14, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 50, color: Colors.textSecondary }
});
