import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import type { SavedRecording } from "../types/recording";
import { formatDuration } from "../utils/formatDuration";
import { useShowAlert, useShowConfirm } from "../utils/showAlert";

type RecordingListProps = {
  recordings: SavedRecording[];
  onRenameRecording: (recordingId: string, newTitle: string) => Promise<void>;
  onDeleteRecording: (recordingId: string) => Promise<void>;
};

type RecordingItemProps = {
  recording: SavedRecording;
  onRenameRecording: (recordingId: string, newTitle: string) => Promise<void>;
  onDeleteRecording: (recordingId: string) => Promise<void>;
};

function RecordingItem({
  recording,
  onRenameRecording,
  onDeleteRecording,
}: RecordingItemProps) {
  const showAlert = useShowAlert();
  const showConfirm = useShowConfirm();

  const player = useAudioPlayer(recording.uri);
  const playerStatus = useAudioPlayerStatus(player);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(recording.title);

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

  const handleSaveRename = async () => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      showAlert("Title required", "Please enter a name for your recording.");
      return;
    }

    if (trimmedTitle === recording.title) {
      setIsEditing(false);
      return;
    }

    await onRenameRecording(recording.id, trimmedTitle);
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditedTitle(recording.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    showConfirm(
      "Delete recording?",
      `Are you sure you want to delete "${recording.title}"? This cannot be undone.`,
      async () => {
        if (isPlaying) {
          player.pause();
        }

        await onDeleteRecording(recording.id);
      },
    );
  };

  return (
    <View style={styles.savedRecordingCard}>
      <Pressable
        style={styles.playButton}
        onPress={handlePlayback}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause recording" : "Play recording"}
      >
        <Text style={styles.playButtonSymbol}>
          {isPlaying ? "ÃƒÂ¢Ã¢â‚¬Â¦Ã‚Â¡" : "ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¶"}
        </Text>
      </Pressable>

      <View style={styles.savedRecordingDetails}>
        {isEditing ? (
          <TextInput
            style={styles.titleInput}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Enter recording name"
            placeholderTextColor="#AAA1AE"
            maxLength={50}
            autoFocus
          />
        ) : (
          <Text style={styles.savedRecordingTitle}>{recording.title}</Text>
        )}

        <Text style={styles.savedRecordingDate}>{recording.date}</Text>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        {isEditing ? (
          <View style={styles.editActions}>
            <Pressable onPress={handleSaveRename}>
              <Text style={styles.saveButton}>Save</Text>
            </Pressable>

            <Pressable onPress={handleCancelRename}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.recordingActions}>
            <Pressable
              onPress={() => {
                setEditedTitle(recording.title);
                setIsEditing(true);
              }}
            >
              <Text style={styles.editButton}>Edit name</Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${recording.title}`}
            >
              <Text style={styles.deleteButton}>Delete</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Text style={styles.savedRecordingDuration}>
        {formatDuration(recording.duration)}
      </Text>
    </View>
  );
}

export default function RecordingList({
  recordings,
  onRenameRecording,
  onDeleteRecording,
}: RecordingListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecordings = recordings.filter((recording) =>
    recording.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  if (recordings.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconCircle}>
          <Text style={styles.emptyIcon}>ÃƒÂ¢Ã¢â€žÂ¢Ã‚Â«</Text>
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
    <View>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search recordings..."
        placeholderTextColor="#AAA1AE"
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {filteredRecordings.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No recordings found</Text>
          <Text style={styles.emptyDescription}>
            Try searching with a different name.
          </Text>
        </View>
      ) : (
        <View style={styles.recordingList}>
          {filteredRecordings.map((recording) => (
            <RecordingItem
              key={recording.id}
              recording={recording}
              onRenameRecording={onRenameRecording}
              onDeleteRecording={onDeleteRecording}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0ECEF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: "#50465A",
    marginBottom: 12,
  },
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
  titleInput: {
    borderWidth: 1,
    borderColor: "#DCD2E5",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
    fontSize: 13,
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
  editActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 9,
  },
  recordingActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  editButton: {
    fontSize: 11,
    fontWeight: "600",
    color: "#907BA6",
  },
  deleteButton: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B65E72",
  },
  saveButton: {
    fontSize: 11,
    fontWeight: "700",
    color: "#76618C",
  },
  cancelButton: {
    fontSize: 11,
    color: "#99919B",
  },
  savedRecordingDuration: {
    fontSize: 12,
    fontWeight: "600",
    color: "#76618C",
    marginLeft: 8,
  },
});
