import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
    onRefresh?: () => Promise<void>;
    threshold?: number;
    resistance?: number;
    enabled?: boolean;
}

const defaultRefresh = async () => {
    // Default refresh: just reload the page
    await new Promise(resolve => setTimeout(resolve, 800));
    window.location.reload();
};

export const usePullToRefresh = ({
    onRefresh,
    threshold = 80,
    resistance = 2.5,
    enabled = true,
}: UsePullToRefreshOptions = {}) => {
    const refreshHandler = onRefresh || defaultRefresh;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const startY = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);

    useEffect(() => {
        if (!enabled) return;

        const handleTouchStart = (e: TouchEvent) => {
            // Only trigger if at the top of the page
            if (window.scrollY === 0) {
                startY.current = e.touches[0].clientY;
                isDragging.current = true;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging.current || isRefreshing) return;

            currentY.current = e.touches[0].clientY;
            const distance = currentY.current - startY.current;

            if (distance > 0) {
                // Apply resistance to make it feel natural
                const adjustedDistance = distance / resistance;
                setPullDistance(adjustedDistance);

                // Prevent default scroll behavior when pulling down
                if (distance > 10) {
                    e.preventDefault();
                }
            }
        };

        const handleTouchEnd = async () => {
            if (!isDragging.current) return;

            isDragging.current = false;

            if (pullDistance >= threshold && !isRefreshing) {
                setIsRefreshing(true);
                setPullDistance(threshold);

                try {
                    await refreshHandler();
                } catch (error) {
                    console.error('Refresh failed:', error);
                } finally {
                    setIsRefreshing(false);
                    setPullDistance(0);
                }
            } else {
                setPullDistance(0);
            }
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [enabled, isRefreshing, pullDistance, threshold, resistance, refreshHandler]);

    const progress = Math.min(pullDistance / threshold, 1);

    return {
        isRefreshing,
        pullDistance,
        progress,
    };
};
