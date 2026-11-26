
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import { CustomAlertProvider } from "./src/components/CustomAlertProvider";

export default function App() {
  return (
    <CustomAlertProvider>
      <StatusBar style="dark" />
      <HomeScreen />
    </CustomAlertProvider>
  );
}
