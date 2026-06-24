import React, { useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
    PanResponder,
    Animated,
} from "react-native";
import MapView from "react-native-maps";
import {PoiDetailsModal} from "../../../components/PoiDetailsModal";
import {useRouter} from "expo-router";
import {db} from "../../../db/client";
import {Point, pointsToSecure, PointToSecure, SafetyEquipmentType} from "../../../db/schema";
import {eq} from "drizzle-orm";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function PoiDetailsScreen({ visible, onClose }: Props) {
  const [pois, setPois] = useState<(PointToSecure&{safetyEquipmentType: SafetyEquipmentType|null})[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      panY.setValue(0);
      setIsExpanded(false);
    }
  }, [visible, panY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const dy = gestureState.dy;

        if (!isExpanded && dy < -30) {
          setIsExpanded(true);
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        } else if (isExpanded && dy > 150) {
          setIsExpanded(false);
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        } else if (!isExpanded && dy > 30) {
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

  useEffect(() => {
    (async () => {
      const data = await db.query.pointsToSecure.findMany({
        with: {
          safetyEquipmentType: true,
        }
      });
      setPois(data);
    })();
  }, []);
  
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleOpenPoiModal = () => {
    setPoiModalVisible(true);
  };
  const [poiModalVisible, setPoiModalVisible] = useState(false);


  const openPoiDetails = (id: number) => {
    setSelectedPoiId(id);
  };

  const handleDelete = () => {
    if (!selectedPoiId) return;
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedPoiId) {
      await db.delete(pointsToSecure).where(eq(pointsToSecure.id, Number(selectedPoiId)));
      setSelectedPoiId(null);
      setShowConfirm(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose} style={StyleSheet.absoluteFillObject}>
        <View style={[StyleSheet.absoluteFillObject, { justifyContent: "flex-end" }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          isExpanded ? styles.bottomContainerExpanded : styles.bottomContainer,
          { transform: [{ translateY: panY }] }
        ]}
      >
        <View
          style={styles.dragHandle}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragIndicator} />
        </View>

        <Text style={styles.bottomTitle}>Liste des points à sécuriser</Text>

        <ScrollView style={{ marginTop: 8, paddingBottom: 50 }}>
          {pois.map((poi) => (
            <TouchableOpacity
              key={poi.id}
              style={styles.listItem}
              activeOpacity={0.8}
              onPress={() => openPoiDetails(poi.id)}
            >
              <View style={styles.listLeft}>
                <View>
                  {poi.safetyEquipmentTypeId ? (
                    <Text style={styles.itemSubtitle}>{poi.safetyEquipmentType?.name!}</Text>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.deleteButton, !selectedPoiId && { opacity: 0.5 }]}
          onPress={handleDelete}
          disabled={!selectedPoiId}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </Animated.View>

      {showConfirm && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>
              Êtes-vous sûr de vouloir supprimer ce point à sécuriser ?
            </Text>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmDeleteText}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.confirmCancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {selectedPoiId && (
        <PoiDetailsModal
          visible={!!selectedPoiId}
          onClose={() => setSelectedPoiId(null)}
          poiId={selectedPoiId}
        />
      )}
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
  },
  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 10,
    maxHeight: "50%",
  },
  bottomContainerExpanded: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 10,
    maxHeight: "95%",
    marginTop: 30,
  },
  bottomTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listItem: {
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "700",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  confirmOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  confirmButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#D32F2F",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: "white",
    fontWeight: "600",
  },
  confirmCancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D32F2F",
  },
  confirmCancelText: {
    color: "#D32F2F",
    fontWeight: "600",
  },

  closeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
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
