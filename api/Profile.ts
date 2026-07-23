import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/Profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";


export const useGetProfileList = (user_type: string) => {
  return useQuery({
    queryKey: ["profiles", user_type], // Better key based on user type
    queryFn: async() => {
      console.log(`📋 Fetching profiles with type: ${user_type}`);
      const {data, error} = await supabase.from("profiles").select("*").eq("type",user_type);
      if (error){
        console.log("❌ Error fetching profiles:", error);
        throw new Error("Error fetching profiles");
      }
      console.log(`✅ Found ${data?.length || 0} ${user_type} profiles`);
      return data;
    }
  })
}

export const useProfile = (userId: string | null | undefined) => {
  return useQuery<Profile | null>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // Safer than .single()

      if (error) {
        console.error('Error fetching profile:', error);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!userId, // only runs if userId is available
  });
};

export const useSaveProfileChanges = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; username: string; name: string }) => {
      const { error, data: updatedProfile } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          full_name: data.name, 
        })
        .eq("id", data.id)
        .select()
        .maybeSingle();

      if (error) throw new Error(error.message);
      return updatedProfile;
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['profile', variables.id], 
      });
      Toast.show({
        type: 'success',
        text1: 'Changes saved',
        text2: 'Your profile was updated successfully.',
        position: 'bottom',
      });
    },
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; profilePictureIndex: number }) => {
      const { error, data: updatedProfile } = await supabase
        .from("profiles")
        .update({
          profile_picture_index: data.profilePictureIndex,
        })
        .eq("id", data.id)
        .select()
        .maybeSingle();

      if (error) throw new Error(error.message);
      return updatedProfile;
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['profile', variables.id], 
      });
      console.log('✅ Profile picture updated in Supabase');
    },
    
    onError: (error) => {
      console.error('❌ Error updating profile picture:', error);
    },
  });
};

export const getAllUsernames = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("username");
    
    if (error) {
      console.error('Error fetching usernames:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.warn('No usernames data returned');
      return [];
    }
    
    const usernames = data
      .map((user) => user?.username)
      .filter(Boolean); // Remove null/undefined values
    
    return usernames;
  } catch (err) {
    console.error('Exception fetching usernames:', err);
    return [];
  }
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log(`🧹 Comprehensive data wipe for user: ${userId}`);

      // 1. Delete Student Locations
      await supabase.from("student_locations").delete().eq("profile_id", userId);

      // 2. Delete Messages
      await supabase.from("messages").delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      // 3. Delete Community Data
      await supabase.from("community_post").delete().eq("user_id", userId);
      await supabase.from("post_comment").delete().eq("user_id", userId);

      // 4. Delete Booking Requests
      await supabase.from("book_request").delete().eq("student_id", userId);

      // 5. Clear Expert/Peer slots if this user was an expert/peer
      await supabase.from("expert_schedule").delete().eq("expert_id", userId);
      await supabase.from("student_schedule").delete().eq("peer_id", userId);

      // 6. Delete Profile
      const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);
      if (profileError) throw new Error(profileError.message);

      // 7. Sign out locally
      await supabase.auth.signOut();

      return { success: true };
    },
    onSuccess: () => {
      queryClient.clear();
      Toast.show({
        type: 'success',
        text1: 'Account Deleted',
        text2: 'All your data has been permanently removed.',
        position: 'bottom',
      });
      router.replace("/");
    },
    onError: (error: any) => {
      console.error('❌ Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account data. Please contact support.');
    }
  });
};


export const getAllRegistrationNumbers = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("registration_number");
    
    if (error) {
      console.error('Error fetching registration numbers:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.warn('No registration numbers data returned');
      return [];
    }
    
    const registrationNumbers = data
      .map((user) => user?.registration_number)
      .filter(Boolean); // Remove null/undefined values
    
    return registrationNumbers;
  } catch (err) {
    console.error('Exception fetching registration numbers:', err);
    return [];
  }
};