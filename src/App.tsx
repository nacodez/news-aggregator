import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewsFeed from "./components/NewsFeed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewsFeed />} />
      </Routes>
    </Router>
  );
}

export default App;
