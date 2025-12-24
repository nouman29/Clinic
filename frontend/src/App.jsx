import { AppRoutes } from "./routes/AppRoutes";
import { AppToaster } from "./components/ui/toaster";

import "./main.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <AppToaster />
    </AuthProvider>
  );
}

export default App;
