import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import type { SavedRecording } from "../types/recording";
import { getWebAudio, saveWebAudio } from "../utils/webAudioStorage";

const RECORDINGS_STORAGE_KEY = "@echo_journal/recordings";

export function useAudioRecording() {
  const [recordings, setRecordings] = useState<SavedRecording[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(true);

  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    directory: "document",
  });

  const recorderState = useAudioRecorderState(audioRecorder);

  useEffect(() => {
    let isMounted = true;

    const loadRecordings = async () => {
      try {
        const savedRecordings = await AsyncStorage.getItem(
          RECORDINGS_STORAGE_KEY,
        );

        if (savedRecordings && isMounted) {
          const parsedRecordings: SavedRecording[] =
            JSON.parse(savedRecordings);

          if (Platform.OS === "web") {
            const recordingsWithFreshUris = await Promise.all(
              parsedRecordings.map(async (recording) => {
                try {
                  const audioBlob = await getWebAudio(recording.id);

                  if (audioBlob) {
                    return {
                      ...recording,
                      uri: URL.createObjectURL(audioBlob),
                    };
                  }

                  return recording;
                } catch (error) {
                  console.error("Could not restore recording audio:", error);

                  return recording;
                }
              }),
            );

            if (isMounted) {
              setRecordings(recordingsWithFreshUris);
            }
          } else {
            setRecordings(parsedRecordings);
          }
        }
      } catch (error) {
        console.error("Could not load saved recordings:", error);
      } finally {
        if (isMounted) {
          setIsLoadingRecordings(false);
        }
      }
    };

    loadRecordings();

    return () => {
      isMounted = false;
    };
  }, []);

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

      const recordingId = `${Date.now()}`;

      if (Platform.OS === "web") {
        const audioResponse = await fetch(uri);
        const audioBlob = await audioResponse.blob();

        await saveWebAudio(recordingId, audioBlob);
      }

      const newRecording: SavedRecording = {
        id: recordingId,
        uri,
        title: `Voice note ${recordings.length + 1}`,
        date: new Date().toLocaleString(),
        duration,
      };

      const updatedRecordings = [newRecording, ...recordings];

      await AsyncStorage.setItem(
        RECORDINGS_STORAGE_KEY,
        JSON.stringify(updatedRecordings),
      );

      setRecordings(updatedRecordings);

      Alert.alert(
        "Recording saved",
        "Your voice note has been saved successfully.",
      );
    } catch (error) {
      console.error("Could not save recording:", error);
      Alert.alert(
        "Saving error",
        "Something went wrong while saving your recording.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRenameRecording = async (
    recordingId: string,
    newTitle: string,
  ) => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      Alert.alert("Title required", "Please enter a name for your recording.");
      return;
    }

    try {
      const updatedRecordings = recordings.map((recording) =>
        recording.id === recordingId
          ? { ...recording, title: trimmedTitle }
          : recording,
      );

      await AsyncStorage.setItem(
        RECORDINGS_STORAGE_KEY,
        JSON.stringify(updatedRecordings),
      );

      setRecordings(updatedRecordings);

      Alert.alert(
        "Recording renamed",
        "Your voice note name has been updated.",
      );
    } catch (error) {
      console.error("Could not rename recording:", error);
      Alert.alert(
        "Rename error",
        "We couldn't rename your recording. Please try again.",
      );
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
    isProcessing: isProcessing || isLoadingRecordings,
    recorderState,
    handleRecordingButton,
    handleRenameRecording,
  };
}
