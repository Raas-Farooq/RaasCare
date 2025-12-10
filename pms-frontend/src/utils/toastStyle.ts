// lib/toast.ts
import { toast } from 'sonner';

export const successToast = (message: string, options = {}) => {
  return toast.success(message, {
    style: {
      background: '#22c55e', // green-500
      color: '#ffffff',
      border: 'none',
    },
    duration: 3000,
    ...options,
  });
};

export const errorToast = (message: string, options = {}) => {
  return toast.error(message, {
    style: {
      background: '#ef4444', // red-500
      color: '#ffffff',
      border: 'none',
    },
    duration: 5000,
    ...options,
  });
};

export const warningToast = (message: string, options = {}) => {
  return toast.warning(message, {
    style: {
      background: '#eab308', // yellow-500
      color: '#ffffff',
      border: 'none',
    },
    duration: 4000,
    ...options,
  });
};

export const infoToast = (message: string, options = {}) => {
  return toast.info(message, {
    style: {
      background: '#3b82f6', // blue-500
      color: '#ffffff',
      border: 'none',
    },
    duration: 3000,
    ...options,
  });
};