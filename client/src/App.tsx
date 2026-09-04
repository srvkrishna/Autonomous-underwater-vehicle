// Tidal Instrument style: route-level composition keeps each console section focused while preserving the shared AUV SONAR shell.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import Waveforms from "./pages/Waveforms";
import Conditions from "./pages/Conditions";
import Telemetry from "./pages/Telemetry";
import Workflow from "./pages/Workflow";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return <Switch>
    <Route path="/login" component={AuthPage} />
    <Route path="/" component={Home} />
    <Route path="/waveforms" component={Waveforms} />
    <Route path="/conditions" component={Conditions} />
    <Route path="/telemetry" component={Telemetry} />
    <Route path="/workflow" component={Workflow} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
