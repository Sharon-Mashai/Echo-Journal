import { useState } from "react";
import { Alert } from "react-native";
import { AudioModule, RecordingPresets,setAudioModeAsync, useAudioRecorder, useAudioRecorderState,} from "expo-audio";

import type { SavedRecording } from "../types/recording";

export function useAudioRecording() {
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

      const permission = await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Microphone permission required",
          "Please allow Echo Journal to access your microphone before recording.",
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
        "We couldn't start your recording. Please try again.",
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
          "We couldn't find the saved audio file. Please try again.",
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
        "Your voice note has been saved successfully.",
      );
    } catch (error) {
      console.error("Could not stop recording:", error);
      Alert.alert(
        "Saving error",
        "Something went wrong while saving your recording.",
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

  return {
    recordings,
    isProcessing,
    recorderState,
    handleRecordingButton,
  };
}
