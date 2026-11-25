import { StyleSheet, Text, View } from "react-native";

import type { SavedRecording } from "../types/recording";
import { formatDuration } from "../utils/formatDuration";

type RecordingListProps = {
  recordings: SavedRecording[];
};

export default function RecordingList({ recordings }: RecordingListProps) {
  if (recordings.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconCircle}>
          <Text style={styles.emptyIcon}>â™«</Text>
        </View>

        <Text style={styles.emptyTitle}>Your story starts here</Text>
        <Text style={styles.emptyDescription}>
          You haven't saved any recordings yet.
          {"\n"}Your voice notes will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.recordingList}>
      {recordings.map((recording) => (
        <View key={recording.id} style={styles.savedRecordingCard}>
          <View style={styles.savedRecordingIcon}>
            <Text style={styles.savedRecordingSymbol}>â™«</Text>
          </View>

          <View style={styles.savedRecordingDetails}>
            <Text style={styles.savedRecordingTitle}>{recording.title}</Text>

            <Text style={styles.savedRecordingDate}>{recording.date}</Text>
          </View>

          <Text style={styles.savedRecordingDuration}>
            {formatDuration(recording.duration)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 34,
    paddingHorizontal: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0ECEF",
  },
  emptyIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F2EDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 27,
    color: "#907BA6",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#50465A",
  },
  emptyDescription: {
    fontSize: 12,
    lineHeight: 20,
    color: "#99919B",
    textAlign: "center",
    marginTop: 8,
  },
  recordingList: {
    gap: 12,
  },
  savedRecordingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0ECEF",
  },
  savedRecordingIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#F2EDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  savedRecordingSymbol: {
    fontSize: 21,
    color: "#907BA6",
  },
  savedRecordingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  savedRecordingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#50465A",
  },
  savedRecordingDate: {
    fontSize: 10,
    color: "#99919B",
    marginTop: 5,
  },
  savedRecordingDuration: {
    fontSize: 12,
    fontWeight: "600",
    color: "#76618C",
    marginLeft: 8,
  },
});
