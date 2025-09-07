import React, { createContext, useContext, useState } from "react";
import { NotificationInterface } from "@/lib/FrontendTypes";

interface NotificationsContextTypes {
  notifications: NotificationInterface | null;
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationInterface | null>
  >;
}
const NotificationsContext = createContext<
  NotificationsContextTypes | undefined
>(undefined);

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] =
    useState<NotificationInterface | null>(null);
  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationsContext);

  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  return context;
};

export default NotificationsProvider;
