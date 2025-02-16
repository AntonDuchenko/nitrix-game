import { AppRouter } from "./router/AppRouter";
import { AppProviders } from "./router/AppProviders";

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
