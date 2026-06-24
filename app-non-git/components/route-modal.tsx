import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useEffect } from "react";
import {db} from "../db/client";
import {Point, PointToSecure, SafetyEquipmentType} from "../db/schema";

type Props = {
  visible: boolean;
  onClose: () => void;
  mapRegion?: { latitude: number; longitude: number } | null;
  onGenerate: (coords: { latitude: number; longitude: number }[]) => void;
};

export default function RouteModal({ visible, onClose, mapRegion, onGenerate }: Props) {
  const [pois, setPois] = useState<(PointToSecure&{ point: Point|null, safetyEquipmentType: SafetyEquipmentType|null })[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (!visible) return;
    
    (async () => {
      const data = await db.query.pointsToSecure.findMany({
        with: {
          point: true,
          safetyEquipmentType: true,
        }
      });
      setPois(data);
    })();
  }, [visible]);

  const selectedPois = useMemo(() => selected.map((id) => pois.find((p) => p.id === id)).filter(Boolean), [selected, pois]);

  if (!visible) return null;

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const move = (index: number, dir: "up" | "down") => {
    setSelected((prev) => {
      const arr = [...prev];
      const newIdx = dir === "up" ? index - 1 : index + 1;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      const tmp = arr[newIdx];
      arr[newIdx] = arr[index];
      arr[index] = tmp;
      return arr;
    });
  };

  const handleGenerate = async () => {
    if (!mapRegion) {
      Alert.alert("Position inconnue", "Impossible de connaître votre position actuelle.");
      return;
    }
    if (selected.length === 0) {
      Alert.alert("Aucun point sélectionné", "Veuillez sélectionner au moins un point d&apos;intérêt.");
      return;
    }

    const coords = [
      { latitude: mapRegion.latitude, longitude: mapRegion.longitude },
      ...selectedPois.map((p) => ({ latitude: p?.point?.latitude!, longitude: p?.point?.longitude! })),
    ];
    
    await onGenerate(coords);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Créer un itinéraire</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sub}>1. Sélectionnez des points à inclure (toucher pour ajouter)</Text>
        <ScrollView style={styles.list}>
          {pois.map((p) => {
            const isSelected = selected.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.item, isSelected && styles.itemSelected]}
                onPress={() => toggleSelect(p.id)}
              >
                <Text style={styles.itemSub}>{p.safetyEquipmentType?.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sub}>2. Ordre sélectionné (déplacez si besoin)</Text>
        <View style={styles.selectedList}>
          {selectedPois.map((p, i) => (
            <View key={p?.id} style={styles.selectedRow}>
              <View style={styles.selectedTextContainer}>
                <Text style={styles.selectedNumber}>Point {i + 1}</Text>
                <Text style={styles.selectedText}>{p?.safetyEquipmentType?.name || 'Sans type'}</Text>
              </View>
              <View style={styles.rowBtns}>
                <TouchableOpacity onPress={() => move(i, "up")} style={styles.smallBtn}><Text>↑</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => move(i, "down")} style={styles.smallBtn}><Text>↓</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => toggleSelect(p?.id!)} style={styles.smallBtn}><Text>✕</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
            <Text style={styles.generateTxt}>Générer l&apos;itinéraire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 60,
  },
  container: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "black",
    borderRadius: 12,
    padding: 12,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  title: { color: "white", fontSize: 18, fontWeight: "700" },
  closeBtn: { position: "absolute", right: 8, top: 0 },
  closeTxt: { color: "white", fontSize: 20 },
  sub: { color: "#ccc", marginTop: 8, marginBottom: 6 },
  list: { maxHeight: 180, marginBottom: 8 },
  item: { padding: 8, borderBottomWidth: 1, borderBottomColor: "#222" },
  itemSelected: { backgroundColor: "#0a0a0a" },
  itemText: { color: "white" },
  itemSub: { color: "#999", fontSize: 12 },
  selectedList: { maxHeight: 160, marginBottom: 8 },
  selectedRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8, borderBottomWidth: 1, borderBottomColor: "#222" },
  selectedTextContainer: { flex: 1 },
  selectedNumber: { color: "#00C853", fontSize: 14, fontWeight: "700" },
  selectedText: { color: "white", fontSize: 12, marginTop: 2 },
  rowBtns: { flexDirection: "row", gap: 6 },
  smallBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#222", borderRadius: 6, marginLeft: 6 },
  footer: { marginTop: 8, alignItems: "center" },
  generateBtn: { backgroundColor: "#00C853", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  generateTxt: { color: "white", fontWeight: "700" },
});
