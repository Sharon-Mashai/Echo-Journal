import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatDuration } from "../utils/formatDuration";

type RecordingCardProps = {
  isRecording: boolean;
  isProcessing: boolean;
  durationMillis: number;
  onRecordingButtonPress: () => void;
};

export default function RecordingCard({
  isRecording,
  isProcessing,
  durationMillis,
  onRecordingButtonPress,
}: RecordingCardProps) {
  return (
    <View
      style={[styles.recordingCard, isRecording && styles.activeRecordingCard]}
    >
      <View style={styles.recordingCardTop}>
        <View style={styles.recordingTextContainer}>
          <Text style={styles.cardEyebrow}>
            {isRecording ? "RECORDING IN PROGRESS" : "READY WHEN YOU ARE"}
          </Text>

          <Text style={styles.recordingTitle}>
            {isRecording
              ? "Your moment is being captured"
              : "Start a new recording"}
          </Text>

          <Text style={styles.recordingDescription}>
            {isRecording
              ? "Speak freely. Take your time."
              : "Find your moment. Press record."}
          </Text>
        </View>

        <View style={styles.waveform}>
          {[18, 30, 22, 42, 26, 36, 17].map((height, index) => (
            <View
              key={index}
              style={[
                styles.waveBar,
                { height },
                isRecording && styles.activeWaveBar,
              ]}
            />
          ))}
        </View>
      </View>

      {isRecording && (
        <View style={styles.timerContainer}>
          <View style={styles.liveDot} />
          <Text style={styles.timerText}>{formatDuration(durationMillis)}</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.recordButton,
          isRecording && styles.stopButton,
          pressed && styles.recordButtonPressed,
          isProcessing && styles.disabledButton,
        ]}
        onPress={onRecordingButtonPress}
        disabled={isProcessing}
      >
        <View style={[styles.recordIcon, isRecording && styles.stopIcon]} />

        <Text style={styles.recordButtonText}>
          {isProcessing
            ? "Please wait..."
            : isRecording
              ? "Stop recording"
              : "Start recording"}
        </Text>
      </Pressable>

      <Text style={styles.recordingHint}>
        {isRecording
          ? "Your voice is being saved as you record."
          : "Take a breath. Your space is ready."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  recordingCard: {
    backgroundColor: "#EAE3F0",
    borderRadius: 25,
    padding: 22,
    marginBottom: 36,
  },
  activeRecordingCard: {
    backgroundColor: "#E4D9EC",
  },
  recordingCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  recordingTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardEyebrow: {
    fontSize: 9,
    fontWeight: "700",
    color: "#89769B",
    letterSpacing: 1.4,
    marginBottom: 9,
  },
  recordingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#44394F",
  },
  recordingDescription: {
    fontSize: 12,
    color: "#887D91",
    marginTop: 6,
  },
  waveform: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  waveBar: {
    width: 4,
    borderRadius: 5,
    backgroundColor: "#B09BC4",
  },
  activeWaveBar: {
    backgroundColor: "#80669B",
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  liveDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#C45F76",
  },
  timerText: {
    fontSize: 23,
    fontWeight: "700",
    color: "#51415F",
    fontVariant: ["tabular-nums"],
  },
  recordButton: {
    height: 54,
    backgroundColor: "#76618C",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  stopButton: {
    backgroundColor: "#B65E72",
  },
  recordButtonPressed: {
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  recordIcon: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  stopIcon: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  recordButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  recordingHint: {
    fontSize: 11,
    color: "#897D93",
    textAlign: "center",
    marginTop: 13,
  },
});
