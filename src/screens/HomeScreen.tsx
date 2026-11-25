import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import RecordingCard from "../components/RecordingCard";
import { useAudioRecording } from "../hooks/useAudioRecording";
import { formatDuration } from "../utils/formatDuration";

export default function HomeScreen() {
  const { recordings, isProcessing, recorderState, handleRecordingButton } =
    useAudioRecording();

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
            <Text style={styles.headerSubtitle}>Your voice, your moments.</Text>
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
        <RecordingCard
          isRecording={recorderState.isRecording}
          isProcessing={isProcessing}
          durationMillis={recorderState.durationMillis}
          onRecordingButtonPress={handleRecordingButton}
        />

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
              <Text style={styles.emptyIcon}>â™«</Text>
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
                  <Text style={styles.savedRecordingSymbol}>â™«</Text>
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
        <Text style={styles.footer}>Made for your moments â™¡</Text>
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
