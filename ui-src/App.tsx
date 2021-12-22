import * as React from "react";
import { useState, useRef, useEffect } from "react";
import "./App.css";
import Pikaday from "pikaday";

function App() {
  const containerEl = useRef<HTMLDivElement>(null);
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

    const winAny = window as any;
    if (winAny.defaultDateFrom) {
      fromPicker.setDate(winAny.defaultDateFrom);
    }
    if (winAny.defaultDateTo) {
      toPicker.setDate(winAny.defaultDateTo);
    }
    if (containerEl.current) {
      containerEl.current.appendChild(fromPicker.el);
      containerEl.current.appendChild(toPicker.el);
    }
  }, []);

  return <div className="App" ref={containerEl}></div>;
}

export default App;
