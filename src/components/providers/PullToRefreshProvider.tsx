import React, { useCallback } from 'react';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import PullToRefreshIndicator from '../ui/PullToRefresh';

interface PullToRefreshProviderProps {
    children: React.ReactNode;
    onRefresh?: () => Promise<void>;
}

const PullToRefreshProvider: React.FC<PullToRefreshProviderProps> = ({ children, onRefresh }) => {
    const defaultRefresh = useCallback(async () => {
        // Default: just reload the page
        await new Promise(resolve => setTimeout(resolve, 800));
        window.location.reload();
    }, []);

    const { isRefreshing, pullDistance, progress } = usePullToRefresh({
        onRefresh: onRefresh || defaultRefresh,
        threshold: 80,
        resistance: 2.5,
        enabled: true,
    });

    return (
        <>
            <PullToRefreshIndicator
                pullDistance={pullDistance}
                isRefreshing={isRefreshing}
                progress={progress}
            />
            {children}
        </>
    );
};

export default PullToRefreshProvider;
