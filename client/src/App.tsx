import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import NotFound from "./pages/not-found";

function App() {
    return (
        <Switch>
            <Route path="/" component={Home} />
            <Route component={NotFound} />
        </Switch>
    );
}

export default App;
