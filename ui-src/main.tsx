import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const rootEl = document.getElementById("root");

if (rootEl) {
  try {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect?.height) {
          parent?.postMessage(
            {
              pluginMessage: {
                type: "resize",
                height: entry.contentRect.height,
                width: entry.contentRect.width,
              },
            },
            "*"
          );
        }
      }
    });
    resizeObserver.observe(rootEl);
  } catch {}

  ReactDOM.render(<App />, rootEl);
}

ReactDOM.render(<App />, rootEl);
