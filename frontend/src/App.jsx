import { AppRoutes } from "./routes/AppRoutes";
import { AppToaster } from "./components/ui/toaster";

import "./main.css";
function App() {
  return (
    <>
      <AppRoutes />
      <AppToaster />
    </>
  );
}

export default App;
