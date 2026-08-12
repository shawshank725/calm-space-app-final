import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommunityPost } from '@/types/Community';
import { formatRelativeTime } from '@/lib/utils';
import { profilePics } from '@/constants/ProfilePhotos';

interface CommunityPostCardProps {
  post: CommunityPost;
  onCommentsPress: (post: CommunityPost) => void;
  onDeletePress: (post: CommunityPost) => void;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  onCommentsPress,
  onDeletePress
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={profilePics[post.profilePicIndex || 0]}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.time}>{formatRelativeTime(post.created_at)}</Text>
        </View>
        <TouchableOpacity onPress={() => onDeletePress(post)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {post.content && (
        <Text style={styles.content}>{post.content}</Text>
      )}

      {post.media_url && (
        <View style={styles.mediaContainer}>
          {post.media_type === 'image' ? (
            <Image
              source={{ uri: post.media_url }}
              style={styles.media}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="videocam" size={48} color="white" />
              <Text style={styles.videoText}>Video</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.commentsBtn}
        onPress={() => onCommentsPress(post)}
      >
        <Ionicons name="chatbubble-outline" size={16} color="#FFB347" />
        <Text style={styles.commentsText}>Comments</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222',
    margin: 10,
    borderRadius: 15,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFB347',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  deleteBtn: {
    padding: 8,
  },
  content: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    lineHeight: 22,
  },
  mediaContainer: {
    marginBottom: 10,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    color: 'white',
    marginTop: 10,
    fontSize: 14,
  },
  commentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#111',
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  commentsText: {
    marginLeft: 5,
    color: '#FFB347',
    fontSize: 14,
    fontWeight: '600',
  },
});
