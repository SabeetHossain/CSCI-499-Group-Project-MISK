import { SetStateAction } from "react";

// EventBus.tsx
export type EventBusType = {
  unsubscribe(arg0: string, handleTextFieldValueChanged: (newValue: import("react").SetStateAction<string>) => void): unknown;
  listeners: { [key: string]: Function[] };
  subscribe(eventType: string, callback: Function): void;
  publish(eventType: string, data?: any): void;
};

export const EventBus: EventBusType = {
  listeners: {},
  subscribe(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  },
  publish(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => callback(data));
    }
  },
  unsubscribe: function (arg0: string, handleTextFieldValueChanged: (newValue: SetStateAction<string>) => void): unknown {
    throw new Error("Function not implemented.");
  }
};
