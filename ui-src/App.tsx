import * as React from "react";
import { useState, useRef, useEffect } from "react";
import "./App.css";
import Pikaday from "pikaday";

function App() {
  const containerEl = useRef(null);
  useEffect(() => {
    var fromPicker = new Pikaday({
      onSelect: function (date) {
        parent?.postMessage(
          {
            pluginMessage: {
              type: "from",
              dateStr: new Date(fromPicker.toString()).toString(),
            },
          },
          "*"
        );
      },
    });
    var toPicker = new Pikaday({
      onSelect: function (date) {
        parent?.postMessage(
          {
            pluginMessage: {
              type: "to",
              dateStr: new Date(toPicker.toString()).toString(),
            },
          },
          "*"
        );
      },
    });

    if (window.defaultDateFrom) {
      fromPicker.setDate(window.defaultDateFrom);
    }
    if (window.defaultDateTo) {
      toPicker.setDate(window.defaultDateTo);
    }


    containerEl.current.appendChild(fromPicker.el);
    containerEl.current.appendChild(toPicker.el);
  }, []);

  return <div className="App" ref={containerEl}></div>;
}

export default App;
