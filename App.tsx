
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

export default function App() {
  const handleStartRecording = () => {
    Alert.alert(
      "Coming soon",
      "Audio recording will be available in the next development step."
    );
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
        <View style={styles.recordingCard}>
          <View style={styles.recordingCardTop}>
            <View>
              <Text style={styles.cardEyebrow}>READY WHEN YOU ARE</Text>
              <Text style={styles.recordingTitle}>Start a new recording</Text>
              <Text style={styles.recordingDescription}>
                Find your moment. Press record.
              </Text>
            </View>

            <View style={styles.waveform}>
              {[18, 30, 22, 42, 26, 36, 17].map((height, index) => (
                <View
                  key={index}
                  style={[styles.waveBar, { height }]}
                />
              ))}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.recordButton,
              pressed && styles.recordButtonPressed,
            ]}
            onPress={handleStartRecording}
          >
            <View style={styles.recordIcon} />
            <Text style={styles.recordButtonText}>Start recording</Text>
          </Pressable>

          <Text style={styles.recordingHint}>
            Take a breath. Your space is ready.
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
            <Text style={styles.countText}>0</Text>
          </View>
        </View>

        {/* Empty library state */}
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

        {/* Footer */}
        <Text style={styles.footer}>
          Made for your moments ♡
        </Text>
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
  recordingCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
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
  recordButton: {
    height: 54,
    backgroundColor: "#76618C",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  recordButtonPressed: {
    opacity: 0.8,
  },
  recordIcon: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
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
  footer: {
    fontSize: 11,
    color: "#B0A7B1",
    textAlign: "center",
    marginTop: 30,
  },
});
