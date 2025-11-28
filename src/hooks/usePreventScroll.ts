import { useEffect, useRef } from 'react';

/**
 * Custom hook to prevent body scroll when a modal is open
 * Handles nested modals correctly by tracking the number of open modals
 */
export const usePreventScroll = (isOpen: boolean) => {
    const scrollPositionRef = useRef(0);

    useEffect(() => {
        if (isOpen) {
            // Get current modal count
            const currentCount = parseInt(document.body.getAttribute('data-modal-count') || '0');
            const newCount = currentCount + 1;
            document.body.setAttribute('data-modal-count', newCount.toString());

            // Only apply scroll prevention on first modal
            if (newCount === 1) {
                // Save current scroll position
                scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;

                // Calculate scrollbar width to prevent layout shift
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

                // Apply styles to prevent scroll
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollPositionRef.current}px`;
                document.body.style.width = '100%';
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }

            return () => {
                // Decrease modal count
                const currentCount = parseInt(document.body.getAttribute('data-modal-count') || '0');
                const newCount = Math.max(0, currentCount - 1);
                document.body.setAttribute('data-modal-count', newCount.toString());

                // Only restore scroll when all modals are closed
                if (newCount === 0) {
                    const scrollY = scrollPositionRef.current;

                    // Remove styles
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.style.paddingRight = '';

                    // Restore scroll position
                    window.scrollTo(0, scrollY);
                }
            };
        }
    }, [isOpen]);
};
