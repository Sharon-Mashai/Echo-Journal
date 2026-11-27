import { useCustomAlert } from "../components/CustomAlertProvider";

export function useShowAlert() {
  const { showAlert } = useCustomAlert();

  return showAlert;
}

export function useShowConfirm() {
  const { showConfirm } = useCustomAlert();

  return showConfirm;
}
