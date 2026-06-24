import React, {useState, useRef, useEffect} from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  PanResponder,
  Animated,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Button from "../../../components/ui/Button";
import * as ImagePicker from "expo-image-picker";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {db} from "../../../db/client";
import {
  Point,
  points,
  pointsToSecure,
  PointToSecure,
  pointToSecurePhotos,
  SafetyEquipmentType,
} from "../../../db/schema";
import {blobToUint8Array} from "../../../lib/utils";


async function uriToBlob(uri: string) {
  const response = await fetch(uri);
  return await response.blob();
}

type AddProps = {
  visible: boolean;
  onClose: () => void;
  mapRegion?: { latitude: number; longitude: number; latitudeDelta?: number; longitudeDelta?: number } | null;
  userLocation?: { latitude: number; longitude: number } | null;
  onCreated?: (poi: PointToSecure&{ point: Point, safetyEquipmentType: SafetyEquipmentType|null }) => void;
};

export default function Add({ visible, onClose, mapRegion, onCreated, userLocation }: AddProps) {
  const [safetyEquipmentTypeSelected, setSafetyEquipmentTypeSelected] = useState<SafetyEquipmentType|null>(null);
  const [allSafetyEquipmentTypes, setAllSafetyEquipmentTypes] = useState<SafetyEquipmentType[]>([]);
  const [comment, setComment] = useState("");
  const [showTypeList, setShowTypeList] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      panY.setValue(0);
      setSafetyEquipmentTypeSelected(null);
      setComment("");
      setShowTypeList(false);
      setPhotos([]);
    }
  }, [visible, panY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const getFirstProjectQuery = useQuery({
    queryKey: ['getFirstProject'],
    queryFn: async () => {
        try {
          return await db.query.projects.findFirst() || null;
        } catch (_) {
            Alert.alert('Erreur', "Impossible de charger le projet.");
            return null;
        }
    },
  });

  const getSafetyEquipmentTypesQuery = useQuery({
    queryKey: ['getSafetyEquipmentTypes'],
    queryFn: async () => {
      try {
        const allSafetyEquipmentTypes = await db.query.safetyEquipmentTypes.findMany();
        setAllSafetyEquipmentTypes(allSafetyEquipmentTypes);
        return allSafetyEquipmentTypes;
      } catch (_) {
        Alert.alert('Erreur', "Impossible de charger les types de blocage.");
        return null;
      }
    }
  });

  if (!visible || getFirstProjectQuery.isPending) {
    return null;
  }

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "La permission d’utiliser la caméra est nécessaire. Veuillez l’autoriser dans les paramètres de l’application."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos((prevPhotos) => [...prevPhotos, result.assets[0].uri]);
    }
  };

  const handleCreate = async () => {
    try {
      const lat = userLocation?.latitude ?? mapRegion?.latitude ?? 48.5734;
      const lon = userLocation?.longitude ?? mapRegion?.longitude ?? 7.7521;

      const photosData: Blob[] = [];
      for (const uri of photos) {
        photosData.push(await uriToBlob(uri));
      }

      const dbPoi = await db.transaction(async (tx) => {
        const [pointCreated] = await tx.insert(points).values({
          latitude: lat,
          longitude: lon,
        }).returning();
        const [pointToSecureCreated] = await tx.insert(pointsToSecure).values({
          projectId: getFirstProjectQuery.data?.id!,
          safetyEquipmentTypeId: safetyEquipmentTypeSelected?.id,
          comment,
          pointId: pointCreated.id,
        }).returning();
        if (photosData.length > 0) {
          await tx.insert(pointToSecurePhotos).values(await Promise.all(photosData.map(async (blob) => {
            return {
              data: await blobToUint8Array(blob),
              mimeType: blob.type || "image/jpeg",
              pointToSecureId: pointToSecureCreated.id,
            };
          })));
        }

        return {
          ...pointToSecureCreated,
          point: pointCreated,
          safetyEquipmentType: safetyEquipmentTypeSelected,
        };
      });

      await queryClient.invalidateQueries({ queryKey: ['getFirstProject', 'getInterestPoints', 'getZones', 'getTraces'] });
      await queryClient.refetchQueries({ queryKey: ['getFirstProject', 'getInterestPoints', 'getZones', 'getTraces'] });
      await new Promise(resolve => setTimeout(resolve, 100));

      if (onCreated) {
        try {
          onCreated(dbPoi);
        } catch (e) {
          console.warn("onCreated handler error", e);
        }
      }

      setSafetyEquipmentTypeSelected(null);
      setComment("");
      setShowTypeList(false);
      setPhotos([]);
      onClose();
    } catch (_) {
      Alert.alert('Erreur', "Impossible de créer le point à sécuriser.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "flex-end" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <Animated.View
          style={[
            styles.bottomContainer,
            { transform: [{ translateY: panY }] }
          ]}
        >
          <View
            style={styles.dragHandle}
            {...panResponder.panHandlers}
          >
            <View style={styles.dragIndicator} />
          </View>

          <ScrollView
            contentContainerStyle={styles.bottomContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.label, { marginTop: 12 }]}>
              Type de blocage
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTypeList((prev) => !prev)}
            >
              <Text style={styles.dropdownText}>
                {safetyEquipmentTypeSelected?.name ?? "Choisir un type de blocage"}
              </Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </TouchableOpacity>

            {showTypeList && (
              <View style={styles.dropdownList}>
                {allSafetyEquipmentTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSafetyEquipmentTypeSelected(type);
                      setShowTypeList(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{type.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={[styles.label, { marginTop: 12 }]}>Commentaire</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Ajouter un commentaire"
              placeholderTextColor="#ccc"
              style={styles.textArea}
              multiline
              numberOfLines={4}
            />

            {photos.length > 0 ? (
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: "white", marginBottom: 8 }}>Photos :</Text>
                <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 4 }}>
                  {photos.map((uri, idx) => (
                    <View key={uri + idx} style={styles.photoWrapper}>
                      <Image source={{ uri }} style={styles.photoThumbnail} />
                      <TouchableOpacity
                        style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#0008', borderRadius: 12, padding: 2 }}
                        onPress={() => setPhotos((prev) => prev.filter((p, i) => i !== idx))}
                      >
                        <Text style={{ color: 'white', fontSize: 12 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
              <LinearGradient
                colors={['#34ea8c', '#00C853']}
                style={styles.photoButtonGradient}
              >
                <Text style={styles.photoButtonText}>📷</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Button
              title="Créer"
              variant="primary"
              onPress={handleCreate}
              fullWidth
              style={{ marginTop: 12 }}
            />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  bottomContainer: {
    backgroundColor: "black",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 10,
    minHeight: 220,
  },
  bottomContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 50,
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 80,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownArrow: {
    fontSize: 16,
    color: "#555",
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: "white",
    borderRadius: 6,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  photoContainer: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  photoWrapper: {
    marginRight: 8,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  photoButton: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
  },
  photoButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photoButtonText: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: -2,
  },
  createButton: {
    marginTop: 12,
    backgroundColor: "#00C853",
    borderRadius: 24,
    alignItems: "center",
    paddingVertical: 12,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  dragHandle: {
    width: "100%",
    height: 24,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
  },
});
