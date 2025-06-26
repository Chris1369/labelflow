import { useImportStore } from "./useStore";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { router } from "expo-router";

export const importActions = {
  selectImages: async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin de votre permission pour accéder à la galerie photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUris = result.assets.map((asset) => asset.uri);
        useImportStore.getState().setSelectedImages(imageUris);
        useImportStore.getState().setImportType("images");
      }
    } catch (error) {
      console.error("Error selecting images:", error);
      useImportStore
        .getState()
        .setError("Erreur lors de la sélection des images");
    }
  },

  selectFile: async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "text/csv",
          "text/xml",
          "application/xml",
          "application/vnd.ms-excel",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (!["csv", "xml", "xmls"].includes(fileExtension || "")) {
          Alert.alert(
            "Format non supporté",
            "Veuillez sélectionner un fichier CSV, XML ou XMLS"
          );
          return;
        }

        useImportStore.getState().setSelectedFile(file.uri);
        useImportStore.getState().setImportType("file");

        // Log file info
        console.log("Selected file:", {
          name: file.name,
          size: file.size,
          type: file.mimeType,
          uri: file.uri,
        });
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      useImportStore
        .getState()
        .setError("Erreur lors de la sélection du fichier");
    }
  },

  processImport: async () => {
    const { importType, selectedImages, selectedFile } =
      useImportStore.getState();

    if (!importType) {
      Alert.alert("Erreur", "Veuillez sélectionner des images ou un fichier");
      return;
    }

    try {
      useImportStore.getState().setIsImporting(true);
      useImportStore.getState().setError(null);

      // Simulate import process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (importType === "images") {
        Alert.alert(
          "Succès",
          `${selectedImages.length} image(s) importée(s) avec succès`,
          [
            {
              text: "OK",
              onPress: () => {
                useImportStore.getState().resetImport();
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert("Succès", "Fichier importé avec succès", [
          {
            text: "OK",
            onPress: () => {
              useImportStore.getState().resetImport();
              router.back();
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing import:", error);
      useImportStore.getState().setError("Erreur lors de l'importation");
    } finally {
      useImportStore.getState().setIsImporting(false);
    }
  },

  removeImage: (uri: string) => {
    const currentImages = useImportStore.getState().selectedImages;
    const newImages = currentImages.filter((image) => image !== uri);
    useImportStore.getState().setSelectedImages(newImages);

    if (newImages.length === 0) {
      useImportStore.getState().setImportType(null);
    }
  },

  clearSelection: () => {
    useImportStore.getState().resetImport();
  },
};
