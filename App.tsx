
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

type SavedRecording = {
  id: string;
  uri: string;
  title: string;
  date: string;
  duration: number;
};

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function App() {
  const [recordings, setRecordings] = useState<SavedRecording[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    directory: "document",
  });

  const recorderState = useAudioRecorderState(audioRecorder);

  const handleStartRecording = async () => {
    try {
      setIsProcessing(true);

      const permission =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Microphone permission required",
          "Please allow Echo Journal to access your microphone before recording."
        );
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error("Could not start recording:", error);
      Alert.alert(
        "Recording error",
        "We couldn't start your recording. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsProcessing(true);

      const duration = recorderState.durationMillis;

      await audioRecorder.stop();

      const uri = audioRecorder.uri;

      if (!uri) {
        Alert.alert(
          "Recording not saved",
          "We couldn't find the saved audio file. Please try again."
        );
        return;
      }

      const newRecording: SavedRecording = {
        id: `${Date.now()}`,
        uri,
        title: `Voice note ${recordings.length + 1}`,
        date: new Date().toLocaleString(),
        duration,
      };

      setRecordings((previousRecordings) => [
        newRecording,
        ...previousRecordings,
      ]);

      Alert.alert(
        "Recording saved",
        "Your voice note has been saved successfully."
      );
    } catch (error) {
      console.error("Could not stop recording:", error);
      Alert.alert(
        "Saving error",
        "Something went wrong while saving your recording."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordingButton = () => {
    if (recorderState.isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>echo journal</Text>
            <Text style={styles.headerSubtitle}>
              Your voice, your moments.
            </Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>E</Text>
          </View>
        </View>

        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>A little space for you</Text>
          <Text style={styles.welcomeTitle}>
            Capture the moments{"\n"}worth remembering.
          </Text>
          <Text style={styles.welcomeDescription}>
            Your thoughts, stories and memories,{"\n"}one recording at a time.
          </Text>
        </View>

        {/* Recording card */}
        <View
          style={[
            styles.recordingCard,
            recorderState.isRecording && styles.activeRecordingCard,
          ]}
        >
          <View style={styles.recordingCardTop}>
            <View style={styles.recordingTextContainer}>
              <Text style={styles.cardEyebrow}>
                {recorderState.isRecording
                  ? "RECORDING IN PROGRESS"
                  : "READY WHEN YOU ARE"}
              </Text>

              <Text style={styles.recordingTitle}>
                {recorderState.isRecording
                  ? "Your moment is being captured"
                  : "Start a new recording"}
              </Text>

              <Text style={styles.recordingDescription}>
                {recorderState.isRecording
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
                    recorderState.isRecording && styles.activeWaveBar,
                  ]}
                />
              ))}
            </View>
          </View>

          {recorderState.isRecording && (
            <View style={styles.timerContainer}>
              <View style={styles.liveDot} />
              <Text style={styles.timerText}>
                {formatDuration(recorderState.durationMillis)}
              </Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.recordButton,
              recorderState.isRecording && styles.stopButton,
              pressed && styles.recordButtonPressed,
              isProcessing && styles.disabledButton,
            ]}
            onPress={handleRecordingButton}
            disabled={isProcessing}
          >
            <View
              style={[
                styles.recordIcon,
                recorderState.isRecording && styles.stopIcon,
              ]}
            />

            <Text style={styles.recordButtonText}>
              {isProcessing
                ? "Please wait..."
                : recorderState.isRecording
                  ? "Stop recording"
                  : "Start recording"}
            </Text>
          </Pressable>

          <Text style={styles.recordingHint}>
            {recorderState.isRecording
              ? "Your voice is being saved as you record."
              : "Take a breath. Your space is ready."}
          </Text>
        </View>

        {/* Library heading */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your recordings</Text>
            <Text style={styles.sectionSubtitle}>
              All your favourite moments in one place.
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>{recordings.length}</Text>
          </View>
        </View>

        {/* Recording list */}
        {recordings.length === 0 ? (
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
        ) : (
          <View style={styles.recordingList}>
            {recordings.map((recording) => (
              <View key={recording.id} style={styles.savedRecordingCard}>
                <View style={styles.savedRecordingIcon}>
                  <Text style={styles.savedRecordingSymbol}>♫</Text>
                </View>

                <View style={styles.savedRecordingDetails}>
                  <Text style={styles.savedRecordingTitle}>
                    {recording.title}
                  </Text>
                  <Text style={styles.savedRecordingDate}>
                    {recording.date}
                  </Text>
                </View>

                <Text style={styles.savedRecordingDuration}>
                  {formatDuration(recording.duration)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Made for your moments ♡</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 36,
    maxWidth: 650,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42,
  },
  appName: {
    fontSize: 23,
    fontWeight: "800",
    color: "#40364D",
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#938B98",
    marginTop: 3,
    letterSpacing: 0.3,
  },
  profileCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#E9E2F0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 17,
    fontWeight: "700",
    color: "#76628B",
  },
  welcomeSection: {
    marginBottom: 28,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "600",
    color: "#907BA6",
    letterSpacing: 1,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 31,
    lineHeight: 39,
    fontWeight: "700",
    color: "#40364D",
    letterSpacing: -0.9,
  },
  welcomeDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#8C8490",
    marginTop: 12,
  },
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#40364D",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#98909A",
    marginTop: 5,
  },
  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0EBF3",
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#76618C",
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
  footer: {
    fontSize: 11,
    color: "#B0A7B1",
    textAlign: "center",
    marginTop: 30,
  },
});
