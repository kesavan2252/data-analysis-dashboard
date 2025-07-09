import React, { createContext, useContext, useState, useCallback } from "react";

// Shape: { id, type, message }
const NotificationContext = createContext({
  showNotification: (/* { message, type } */) => {},
});

let counter = 0;
const generateId = () => {
  counter += 1;
  return counter;
};

const TOAST_DURATION = 3500; // ms

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showNotification = useCallback(
    ({ message, type = "info", duration = TOAST_DURATION, closable = false }) => {
      const id = generateId();
      setToasts((prev) => [...prev, { id, type, message, duration, closable }]);

      if (duration && duration > 0) {
        // Auto-dismiss after duration (plus small buffer for exit anim)
        setTimeout(() => removeToast(id), duration + 300);
      }
    },
    [removeToast]
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-10 right-4 z-520 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} removeToast={removeToast} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useNotification() {
  return useContext(NotificationContext);
}

// Toast component with slide-in / slide-out animation
const Toast = ({ id, type, message, duration = TOAST_DURATION, closable, removeToast }) => {
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10); // allow mount before anim
    let exit;
    if (duration && duration > 0) {
      exit = setTimeout(() => setVisible(false), duration);
    }
    return () => {
      clearTimeout(enter);
      if (exit) clearTimeout(exit);
    };
  }, []);

  const base =
    "pointer-events-auto flex items-start gap-2 rounded-lg shadow-lg px-4 py-3 text-white transition transform duration-300 ease-out";
  const colorMap = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-600",
    info: "bg-blue-600",
  };
  const color = colorMap[type] || colorMap.info;

  return (
    <div
      className={`${base} ${color} ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      style={{ minWidth: "240px" }}
    >
      <span className="text-lg">
        {type === "success" && "✅"}
        {type === "error" && "❌"}
        {type === "warning" && "⚠️"}
        {type === "info" && "ℹ️"}
      </span>
      <span className="flex-1">{message}</span>
      {closable && (
        <button
          onClick={() => removeToast(id)}
          className="ml-3 text-white hover:text-gray-200 focus:outline-none pointer-events-auto"
        >
          ✖
        </button>
      )}
    </div>
  );
}; 