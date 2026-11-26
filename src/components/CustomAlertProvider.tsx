
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CustomAlertContextType = {
  showAlert: (title: string, message: string) => void;
};

const CustomAlertContext =
  createContext<CustomAlertContextType | undefined>(undefined);

type CustomAlertProviderProps = {
  children: ReactNode;
};

export function CustomAlertProvider({
  children,
}: CustomAlertProviderProps) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const showAlert = useCallback(
    (alertTitle: string, alertMessage: string) => {
      setTitle(alertTitle);
      setMessage(alertMessage);
      setVisible(true);
    },
    [],
  );

  const closeAlert = () => {
    setVisible(false);
  };

  return (
    <CustomAlertContext.Provider value={{ showAlert }}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeAlert}
      >
        <View style={styles.overlay}>
          <View style={styles.alertCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>♡</Text>
            </View>

            <Text style={styles.title}>{title}</Text>

            <Text style={styles.message}>{message}</Text>

            <Pressable
              style={styles.button}
              onPress={closeAlert}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </CustomAlertContext.Provider>
  );
}

export function useCustomAlert() {
  const context = useContext(CustomAlertContext);

  if (!context) {
    throw new Error(
      "useCustomAlert must be used inside CustomAlertProvider",
    );
  }

  return context;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(40, 32, 48, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  alertCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FAF8F5",
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingVertical: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAE3F0",
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#EAE3F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 17,
  },
  icon: {
    fontSize: 27,
    color: "#907BA6",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#40364D",
    textAlign: "center",
  },
  message: {
    fontSize: 13,
    lineHeight: 21,
    color: "#8C8490",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#76618C",
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 23,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
