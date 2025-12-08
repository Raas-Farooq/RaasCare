// useToast.ts
import { useEffect, useRef } from 'react';
import {toast} from 'sonner';

export function useToast() {
    const toastIdsRef = useRef<Set<string | number>>(new Set());

    useEffect(() => {
        // Cleanup all toasts created by this component on unmount
        return () => {
            toastIdsRef.current.forEach(id => toast.dismiss(id));
            toastIdsRef.current.clear();
        };
    }, []);

    const showLoading = (message: string) => {
        const id = toast.loading(message);
        toastIdsRef.current.add(id);
        return id;
    };

    const showSuccess = (message: string, id?: string | number) => {
        if (id) {
            toastIdsRef.current.delete(id);
        }
        return toast.success(message, { id });
    };

    const showError = (message: string, id?: string | number) => {
        if (id) {
            toastIdsRef.current.delete(id);
        }
        return toast.error(message, { id });
    };

    return { showLoading, showSuccess, showError };
}