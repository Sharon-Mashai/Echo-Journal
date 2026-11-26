import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import type { SavedRecording } from "../types/recording";
import { formatDuration } from "../utils/formatDuration";

type RecordingListProps = {
  recordings: SavedRecording[];
};

type RecordingCardProps = {
  recording: SavedRecording;
};

function RecordingItem({ recording }: RecordingCardProps) {
  const player = useAudioPlayer(recording.uri);
  const playerStatus = useAudioPlayerStatus(player);

  const isPlaying = playerStatus.playing;
  const currentTime = playerStatus.currentTime ?? 0;
  const duration = playerStatus.duration || recording.duration / 1000;

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const handlePlayback = () => {
    if (isPlaying) {
      player.pause();
    } else {
      if (playerStatus.didJustFinish) {
        player.seekTo(0);
      }

      player.play();
    }
  };

  return (
    <View style={styles.savedRecordingCard}>
      <Pressable
        style={styles.playButton}
        onPress={handlePlayback}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause recording" : "Play recording"}
      >
        <Text style={styles.playButtonSymbol}>{isPlaying ? "Ⅱ" : "▶"}</Text>
      </Pressable>

      <View style={styles.savedRecordingDetails}>
        <Text style={styles.savedRecordingTitle}>{recording.title}</Text>

        <Text style={styles.savedRecordingDate}>{recording.date}</Text>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      <Text style={styles.savedRecordingDuration}>
        {formatDuration(recording.duration)}
      </Text>
    </View>
  );
}

export default function RecordingList({ recordings }: RecordingListProps) {
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(
    null,
  );

  if (recordings.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconCircle}>
          <Text style={styles.emptyIcon}>♫</Text>
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
        <RecordingItem key={recording.id} recording={recording} />
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
  playButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#F2EDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonSymbol: {
    fontSize: 18,
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
  progressTrack: {
    height: 4,
    backgroundColor: "#F0ECEF",
    borderRadius: 4,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: "#907BA6",
    borderRadius: 4,
  },
  savedRecordingDuration: {
    fontSize: 12,
    fontWeight: "600",
    color: "#76618C",
    marginLeft: 8,
  },
});
