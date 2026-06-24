import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Animated, PanResponder } from "react-native";
import {db} from "../db/client";
import {eq} from "drizzle-orm";
import {
  pointsToSecure,
  PointToSecure,
  PointToSecurePhoto,
  pointToSecurePhotos,
  SafetyEquipmentType
} from "../db/schema";
import {Buffer} from "buffer";

type Props = {
  visible: boolean;
  onClose: () => void;
  poiId: string | number;
};

export const PoiDetailsModal: React.FC<Props> = ({ visible, onClose, poiId }) => {
  const [poi, setPoi] = useState<(PointToSecure&{photos:PointToSecurePhoto[],safetyEquipmentType:SafetyEquipmentType|null})|undefined>(undefined);
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      panY.setValue(0);
      return;
    }
    (async () => {
      const data = await db.query.pointsToSecure.findFirst({
        where: eq(pointsToSecure.id, Number(poiId)),
        with: {
          safetyEquipmentType: true,
        },
      });

      if (data) {
        const photos = await db
            .select()
            .from(pointToSecurePhotos)
            .where(eq(pointToSecurePhotos.pointToSecureId, data.id));

        const fullData = {
          ...data,
          photos,
        };

        setPoi(fullData);
      }
    })();
  }, [visible, poiId, panY]);

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

  if (!visible || !poi) return null;

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
              {poi.photos.length === 0 && (!poi.comment || poi.comment?.trim() === "") && !poi.safetyEquipmentTypeId ? (
                  <Text style={styles.subtitle}>Aucune information disponible.</Text>
              ) : (
                  <View>
                    {poi.photos && poi.photos.length > 0 ? (
                        <ScrollView horizontal style={styles.photoContainer}>
                          {poi.photos.map((photo, index) => (
                              <View key={index} style={styles.photoWrapper}>
                                <Image
                                    source={{ uri: `data:${photo.mimeType};base64,${Buffer.from(photo.data).toString('base64')}` }}
                                    style={styles.photoThumbnail}
                                />
                              </View>
                          ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.photoPlaceholderText}>Aucune photo</Text>
                    )}

                    <Text style={styles.subtitle}>Type de blocage: {poi.safetyEquipmentType?.name}</Text>
                    <Text style={styles.comment}>Commentaire: {poi.comment}</Text>
                  </View>
              )}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
  );
};

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
    minHeight: 200,
    marginBottom: 10,
  },
  bottomContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#00C853",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 12,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  closeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    marginBottom: 12,
  },
  photoContainer: {
    marginBottom: 12,
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
  photoPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 12,
  },
  photoPlaceholderText: {
    color: "#999",
    fontSize: 16,
  },
  comment: {
    fontSize: 14,
    color: "white",
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: "#00C853",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
