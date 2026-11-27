import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type CustomAlertContextType = {
  showAlert: (title: string, message: string) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
  ) => void;
};

const CustomAlertContext = createContext<CustomAlertContextType | undefined>(
  undefined,
);

type CustomAlertProviderProps = {
  children: ReactNode;
};

export function CustomAlertProvider({ children }: CustomAlertProviderProps) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<
    (() => void | Promise<void>) | null
  >(null);

  const showAlert = useCallback((alertTitle: string, alertMessage: string) => {
    setTitle(alertTitle);
    setMessage(alertMessage);
    setConfirmAction(null);
    setVisible(true);
  }, []);

  const showConfirm = useCallback(
    (
      confirmTitle: string,
      confirmMessage: string,
      onConfirm: () => void | Promise<void>,
    ) => {
      setTitle(confirmTitle);
      setMessage(confirmMessage);
      setConfirmAction(() => onConfirm);
      setVisible(true);
    },
    [],
  );

  const closeAlert = () => {
    setVisible(false);
    setConfirmAction(null);
  };

  const handleConfirm = async () => {
    const action = confirmAction;
    closeAlert();

    if (action) {
      await action();
    }
  };

  return (
    <CustomAlertContext.Provider value={{ showAlert, showConfirm }}>
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

            {confirmAction ? (
              <View style={styles.confirmActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={closeAlert}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={handleConfirm}
                  accessibilityRole="button"
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.button}
                onPress={closeAlert}
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </CustomAlertContext.Provider>
  );
}

export function useCustomAlert() {
  const context = useContext(CustomAlertContext);

  if (!context) {
    throw new Error("useCustomAlert must be used inside CustomAlertProvider");
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
  confirmActions: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: 23,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#EAE3F0",
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#76618C",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#B65E72",
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
