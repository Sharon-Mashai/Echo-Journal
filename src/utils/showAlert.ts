import { useCustomAlert } from "../components/CustomAlertProvider";

export function useShowAlert() {
  const { showAlert } = useCustomAlert();

  return showAlert;
}
