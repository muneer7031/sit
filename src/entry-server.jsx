// Build-time render: produces the full page HTML so search engines and link previews see real content.
import { renderToString } from "react-dom/server";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";

export function render() {
  return renderToString(
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  );
}
