import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, PanResponder, Animated, TouchableWithoutFeedback } from "react-native";
import Button from "./ui/Button";
import {
  Point,
  SafetyEquipmentType, SafetyEquipmentTypeLength,
  Schedule,
  SchedulePoint,
  SchedulePointPointer,
} from "../db/schema";
import {GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { db } from "../db/client";
import { schedules } from "../db/schema";
import { eq } from "drizzle-orm";

type Props = {
  visible: boolean;
  onClose: () => void;
  schedulesPlanning: (Schedule&{pointer: SchedulePointPointer&{points: (SchedulePoint&{point: Point})[]}, safetyEquipmentTypeLength: SafetyEquipmentTypeLength&{safetyEquipmentType: SafetyEquipmentType}})[];
  onRefresh: () => void;
  onNavigateToSchedule: (schedule: Schedule&{pointer: SchedulePointPointer&{points: (SchedulePoint&{point: Point})[]}, safetyEquipmentTypeLength: SafetyEquipmentTypeLength&{safetyEquipmentType: SafetyEquipmentType}}) => void;
  onOpenDirections?: (schedule: Schedule&{pointer: SchedulePointPointer&{points: (SchedulePoint&{point: Point})[]}, safetyEquipmentTypeLength: SafetyEquipmentTypeLength&{safetyEquipmentType: SafetyEquipmentType}}) => void;
};

export const SecurityPointsModal: React.FC<Props> = ({ visible, onClose, schedulesPlanning, onRefresh, onNavigateToSchedule, onOpenDirections }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;

  // Réinitialiser l'état quand le modal se ferme
  useEffect(() => {
    if (!visible) {
      setIsExpanded(false);
      panY.setValue(0);
    }
  }, [visible, panY]);

  const handleCloseWithReset = () => {
    setIsExpanded(false);
    onClose();
  };

  /**
   * Marque un schedule comme traité dans la base de données
   * @param scheduleId - L'ID du schedule à traiter
   */
  const handleValidateSchedule = async (scheduleId: string) => {
    try {
      await db.update(schedules)
          .set({ isTreated: 1 })
          .where(eq(schedules.id, scheduleId));

      onRefresh();
    } catch (error) {
      console.error("Erreur lors de la validation du schedule:", error);
    }
  };

  /**
   * Render l'action de validation (icône verte) lors du swipe
   */
  const renderRightActions = (scheduleId: string) => {
    return (
        <TouchableOpacity
            style={styles.validateAction}
            onPress={() => handleValidateSchedule(scheduleId)}
        >
          <Text style={styles.validateIcon}>✓</Text>
          <Text style={styles.validateText}>Valider</Text>
        </TouchableOpacity>
    );
  };

  /**
   * Navigue vers l'emplacement du schedule sur la carte
   * @param schedule - Le schedule à localiser
   */
  const handleNavigateToSchedule = (schedule: Schedule&{pointer: SchedulePointPointer&{points: (SchedulePoint&{point: Point})[]}, safetyEquipmentTypeLength: SafetyEquipmentTypeLength&{safetyEquipmentType: SafetyEquipmentType}}) => {
    onNavigateToSchedule(schedule);
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
          // Glisser vers le haut depuis l'état normal → expand
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

  const filteredSchedules = schedulesPlanning.filter((schedule) => {
    return !schedule.isTreated;
  }).sort((a, b) => new Date(a.actionAt).getTime() - new Date(b.actionAt).getTime());

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => !isExpanded && onClose()}>
            <View style={styles.overlayBackground} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              isExpanded ? styles.modalExpanded : styles.modal,
              { transform: [{ translateY: panY }] }
            ]}
          >
            <View
              style={styles.dragHandle}
              {...panResponder.panHandlers}
            >
              <View style={styles.dragIndicator} />
            </View>
            <Text style={styles.title}>Planning</Text>



            <ScrollView contentContainerStyle={styles.scrollContent}>
              {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => (
                      <Swipeable
                          key={schedule.id}
                          renderRightActions={() => renderRightActions(schedule.id)}
                          overshootRight={false}
                          rightThreshold={40}
                      >
                        <TouchableOpacity
                            style={styles.securityItem}
                            onPress={() => handleNavigateToSchedule(schedule)}
                            activeOpacity={0.7}
                        >
                          <View style={styles.itemContent}>
                            <View style={styles.itemHeader}>
                              <Text style={styles.itemHour}>
                                {new Date(schedule.actionAt).toLocaleDateString()} {new Date(schedule.actionAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Text>
                              <Text style={styles.itemType}>{schedule.actionType === 'SET' ? 'Dépôt' : 'Récupération'}</Text>
                            </View>

                            <View style={styles.itemDetails}>
                              <Text style={styles.detailText}>
                                <Text style={styles.detailText}>{schedule.safetyEquipmentTypeLength.safetyEquipmentType.name}</Text> : <Text style={styles.detailValue}>{schedule.quantity} x {schedule.safetyEquipmentTypeLength.length}m</Text>
                              </Text>
                            </View>

                            {onOpenDirections && (
                              <Button
                                title="Itinéraire"
                                variant="primary"
                                size="small"
                                onPress={() => onOpenDirections(schedule)}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      </Swipeable>
                  ))
              ) : (
                  <Text style={styles.noPoints}>Aucun équipement à afficher.</Text>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  overlayBackground: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    width: "100%",
    maxHeight: "50%",
    backgroundColor: "black",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingTop: 12,
    marginBottom: 10,
  },
  modalExpanded: {
    width: "100%",
    flex: 1,
    backgroundColor: "black",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingTop: 12,
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
  title: {
    color: "white",
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 12,

  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#444",
  },
  categoryButtonActive: {
    backgroundColor: "#00C853",
    borderColor: "#00C853",
  },
  categoryButtonText: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  categoryButtonTextActive: {
    color: "white",
  },
  scrollContent: {
    paddingBottom: 16,
  },
  securityItem: {
    backgroundColor: "#1a1a1a",
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#00C853",
  },
  securityItemSelected: {
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#00C853",
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  itemHour: {
    color: "#00C853",
    fontSize: 16,
    fontWeight: "700",
  },
  itemType: {
    color: "#00C853",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(0, 200, 83, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemAction: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  itemDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 200, 83, 0.3)",
  },
  detailText: {
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: "#00C853",
    fontWeight: "600",
  },
  directionsButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#008537",
    borderRadius: 8,
    alignItems: "center",
  },
  directionsButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  noPoints: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  validateAction: {
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginBottom: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  validateIcon: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  validateText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
