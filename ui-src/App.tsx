import * as React from "react";
import { useState, useRef, useEffect } from "react";
import "./App.css";
import Pikaday from "pikaday";

function App() {
  const containerEl = useRef(null);
  useEffect(() => {
    var picker = new Pikaday({
      onSelect: function (date) {
        parent?.postMessage(
          {
            pluginMessage: {
              type: window.propertyName,
              dateStr: picker.toString(),
            },
          },
          "*"
        );
      },
    });
    if (window.defaultDate) {
      picker.setDate(window.defaultDate);
    }
    containerEl.current.appendChild(picker.el);
  }, []);

  return <div className="App" ref={containerEl}></div>;
}

export default App;
