import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  GestureResponderEvent,
  PanResponder,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { PoiDetailsModal } from "./PoiDetailsModal";
import Button from "./ui/Button";
import {db} from "../db/client";
import {eq} from "drizzle-orm";
import {
  pointsToSecure,
} from "../db/schema";
import {PoiWithRelations} from "../app/(app)/(map)";
import {useQueryClient} from "@tanstack/react-query";

type Props = {
  visible: boolean;
  onClose: () => void;
  onGenerateRoute?: (ids: number[]) => void;
  onRefresh?: () => void;
  onNavigateToPoi?: (poi: PoiWithRelations) => void;
  pois: PoiWithRelations[];
};

export const PointsModal: React.FC<Props> = ({ visible, onClose, onGenerateRoute, onRefresh, onNavigateToPoi, pois }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!visible) {
      panY.setValue(0);
      setIsExpanded(false);
    }
  }, [visible, panY]);

  const handleCloseWithReset = () => {
    setSelectedIds([]);
    setShowDetailsModal(null);
    setIsExpanded(false);
    onClose();
  };

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
          handleCloseWithReset();
        } else if (isExpanded && dy > 30) {
          setIsExpanded(false);
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        } else if (!isExpanded && dy > 30) {
          handleCloseWithReset();
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
    if (visible) {
      onRefresh?.();
    }
  }, [visible]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      setIsExpanded(true);
    }
  }, [selectedIds.length]);

  if (!visible) return null;

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const moveSelectedUp = (index: number) => {
    if (index <= 0) return;
    setSelectedIds((prev) => {
      const next = [...prev];
      const tmp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = tmp;
      return next;
    });
  };

  const moveSelectedDown = (index: number) => {
    setSelectedIds((prev) => {
      if (index < 0 || index >= prev.length - 1) return prev;
      const next = [...prev];
      const tmp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = tmp;
      return next;
    });
  };

  const removeFromSelected = (id: number) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleDelete = async () => {
    Alert.alert(
        `Supprimer ${selectedIds.length > 1 ? 'les points sélectionnés' : 'le point sélectionné'}`,
        `Êtes-vous sûr de vouloir supprimer ${selectedIds.length > 1 ? 'ces points' : 'ce point'} ? Cette action est irréversible.`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              try {
                for (const id of selectedIds) {
                  await db.delete(pointsToSecure).where(eq(pointsToSecure.id, id));
                }
                await queryClient.invalidateQueries({ queryKey: ['getFirstProject', 'getInterestPoints', 'getZones', 'getTraces'] });
                await queryClient.refetchQueries({ queryKey: ['getFirstProject', 'getInterestPoints', 'getZones', 'getTraces'] });
              } catch (error) {
                Alert.alert("Erreur", 'Une erreur est survenue lors de la suppression.');
              }
            },
          },
        ]
    );
    setSelectedIds([]);
    try {
      if (onRefresh) onRefresh();
    } catch (e) {
      console.warn('PointsModal: onRefresh failed', e);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(null);
  };

  const handleCheckboxClick = (e: GestureResponderEvent) => {
    e.stopPropagation();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseWithReset}
    >
      <TouchableWithoutFeedback onPress={handleCloseWithReset}>
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
          <Text style={styles.title}>Liste des points à sécuriser</Text>

          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {pois.length > 0 ? (
            pois.map((poi, index) => {
              const selected = poi.id ? selectedIds.includes(poi.id) : false;
              return (
                <View key={poi.id} style={styles.poiItemContainer}>
                  <TouchableOpacity style={styles.poiItem} onPress={() => {
                    if (onNavigateToPoi) {
                      onNavigateToPoi(poi);
                      onClose();
                    }
                  }}>
                    <Text style={styles.poiSubtitle}>Point {index + 1}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.checkbox, selected && styles.checkboxSelected]} onPress={(e) => { poi.id && toggleSelection(poi.id); handleCheckboxClick(e); }}>
                    {selected && <Text style={styles.checkboxTick}>✓</Text>}
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.noPoi}>Aucun point d’intérêt disponible.</Text>
          )}
        </ScrollView>

        {/* Selected ordered list with reorder controls */}
        {selectedIds.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>Ordre de passage</Text>
            <ScrollView style={styles.selectedListScroll} scrollEnabled={selectedIds.length > 2}>
              {selectedIds.map((id, idx) => {
                const poi = pois.find((p) => p.id === id);
                const originalIndex = pois.findIndex((p) => p.id === id);
                if (!poi) return null;
                return (
                  <View key={id} style={styles.selectedItem}>
                    <Text style={styles.selectedText}>{idx + 1}. Point {originalIndex + 1}</Text>
                    <View style={styles.reorderButtons}>
                      <TouchableOpacity onPress={() => moveSelectedUp(idx)} style={styles.reorderButton}>
                        <Text style={styles.reorderButtonText}>▲</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => moveSelectedDown(idx)} style={styles.reorderButton}>
                        <Text style={styles.reorderButtonText}>▼</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeFromSelected(id)} style={[styles.reorderButton, { backgroundColor: '#D32F2F' }]}>
                        <Text style={styles.reorderButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            title="Supprimer"
            variant="danger"
            onPress={handleDelete}
            disabled={selectedIds.length === 0}
          />

          <Button
            title="Créer itinéraire"
            variant="primary"
            onPress={() => {
              if (selectedIds.length === 0) return;
              if (onGenerateRoute) onGenerateRoute(selectedIds);
              onClose();
            }}
            disabled={selectedIds.length === 0}
            style={{ marginLeft: 12 }}
          />
        </View>
      </Animated.View>
      </KeyboardAvoidingView>

      {showDetailsModal !== null && (
        <PoiDetailsModal visible={showDetailsModal !== null} onClose={closeDetailsModal} poiId={showDetailsModal!} />
      )}
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
    minHeight: 220,
    marginBottom: 10,
  },
  modal: {
    width: "100%",
    maxHeight: "50%",
    backgroundColor: "black",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 10,
  },
  modalExpanded: {
    width: "100%",
    maxHeight: "95%",
    backgroundColor: "black",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 10,
    marginTop: 30,
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
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#00C853",
    padding: 8,
    borderRadius: 12,
    zIndex: 25,
  },
  closeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  poiItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  poiItem: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  poiTitle: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  poiSubtitle: {
    color: "#666",
    fontSize: 14,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#00C853",
  },
  checkboxTick: {
    color: "white",
    fontSize: 18,
  },
   deleteButton: {
    marginTop: 12,
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  routeButton: {
    marginTop: 12,
    marginLeft: 12,
    backgroundColor: "#00C853",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: 'center',
  },
  selectedContainer: {
    marginBottom: 10,
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 8,
    maxHeight: 240,
  },
  selectedListScroll: {
    maxHeight: 200,
  },
  selectedTitle: {
    color: '#00C853',
    fontWeight: '700',
    marginBottom: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  selectedText: {
    color: 'white',
    flex: 1,
    marginRight: 8,
  },
  reorderButtons: {
    flexDirection: 'row',
  },
  reorderButton: {
    width: 34,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  reorderButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  noPoi: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },

  /* ===== Modal de confirmation ===== */
  confirmOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  confirmBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  confirmButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmDeleteButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#B71C1C",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmCancelButton: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#B71C1C",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "white",
  },
  confirmCancelText: {
    color: "#B71C1C",
    fontSize: 16,
    fontWeight: "600",
  },
});
