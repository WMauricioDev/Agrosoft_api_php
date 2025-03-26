import { addToast } from "@heroui/react";

interface ToastOptions {
  icon?: React.ReactNode; 
  title: string;
  description?: string;
  timeout?: number;
  hideIcon?: boolean;
}

export const Toast = ({icon, title, description, timeout = 3000, hideIcon = false }: ToastOptions) => {
  addToast({
    icon,
    title,
    description,
    timeout,
    hideIcon,
  });
};
