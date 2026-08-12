export type MediaType = 'image' | 'video';

export interface CommunityPost {
  id: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_profile_pic: number;
  author_type: string;
  content: string | null;
  media_url: string | null;
  media_type: MediaType | null;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_profile_pic: number;
  author_type: string;
  content: string;
  created_at: string;
  isExpert?: boolean;
}
