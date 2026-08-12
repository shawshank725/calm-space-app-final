import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LearningResource } from "@/types/LearningResource";
import { Alert, Linking } from "react-native";
import { logger } from "@/lib/logger";


interface PreviewHandlers {
  setSelectedResource: React.Dispatch<React.SetStateAction<LearningResource | null>>;
  setShowPreviewModal: React.Dispatch<React.SetStateAction<boolean>>;
}


export const useLibraryResources = () => {
  return useQuery<LearningResource[]>({
    queryKey: ["libraryResources"],
    queryFn: async () => {
      const { data: libraryData, error } = await supabase
        .from("library")
        .select("*");

      if (error) {
        if (error.code === "42P01") {
          logger.info("Library table not found (Expected if schema is restricted)");
          return [];
        }
        throw new Error(`Failed to load library resources: ${error.message}`);
      }

      const mappedResources: LearningResource[] = (libraryData || []).map(item => ({
        id: item.id || String(Math.random()),
        resource_title: item.resource_title || item.title || item.name || "Untitled Resource",
        description: item.description || "No description available",
        file_url: item.file_url || item.url || "",
        file_type: item.file_type || item.type || "unknown",
        category: item.category || "REMEMBER BETTER",
      }));

      logger.debug(`Loaded ${mappedResources.length} resources from library`);
      return mappedResources;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const downloadResource = async (
  resource: LearningResource
) => {
  try {
    Alert.alert(
      "Open Resource",
      `Open "${resource.resource_title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open",
          onPress: async () => {
            try {
              let fileUrl = resource.file_url;

              if (!fileUrl.startsWith("http")) {
                const { data } = supabase.storage
                  .from("library_pdfs")
                  .getPublicUrl(fileUrl);

                fileUrl = data.publicUrl;
              }

              const supported = await Linking.canOpenURL(fileUrl);
              if (supported) {
                await Linking.openURL(fileUrl);
              } else {
                Alert.alert("Error", "Unable to open this file type.");
              }
            } catch (err) {
              logger.error("Failed to open resource URL", err);
              Alert.alert("Error", "Failed to open the file. Please try again.");
            }
          },
        },
      ]
    );
  } catch (error) {
    logger.error("Download resource error", error);
    Alert.alert("Error", "Failed to open resource");
  }
};



export const previewResource = async (
  resource: LearningResource,
  { setSelectedResource, setShowPreviewModal }: PreviewHandlers
) => {
  try {
    let fileUrl = resource.file_url;

    if (!fileUrl.startsWith("http")) {
      const { data } = supabase.storage
        .from("library_pdfs")
        .getPublicUrl(fileUrl);

      fileUrl = data.publicUrl;
    }

    if (resource.file_type === "application/pdf") {
      await Linking.openURL(fileUrl);
    }
    else if (resource.file_type.startsWith("image/")) {
      setSelectedResource({ ...resource, file_url: fileUrl });
      setShowPreviewModal(true);
    }
    else if (resource.file_type.startsWith("video/")) {
      await Linking.openURL(fileUrl);
    }
    else {
      await Linking.openURL(fileUrl);
    }
  } catch (error) {
    logger.error("Resource preview failed", error);
    Alert.alert(
      "Preview Error",
      "Unable to preview this file. You can try downloading it instead."
    );
  }
};
