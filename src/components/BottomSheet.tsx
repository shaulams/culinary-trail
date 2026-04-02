'use client';

import { useRef, useState, useCallback, useEffect, ReactNode } from 'react';

type SheetState = 'collapsed' | 'half' | 'expanded';

interface BottomSheetProps {
  children: ReactNode;
  tabs?: ReactNode;
  initialState?: SheetState;
}

const SNAP_POINTS: Record<SheetState, number> = {
  collapsed: 100,
  half: 50, // percentage from bottom
  expanded: 90, // percentage from bottom
};

export default function BottomSheet({ children, tabs, initialState = 'collapsed' }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SheetState>(initialState);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const currentHeight = useRef(SNAP_POINTS.collapsed);

  const getHeightPx = useCallback((s: SheetState) => {
    if (s === 'collapsed') return SNAP_POINTS.collapsed;
    const vh = window.innerHeight;
    return (SNAP_POINTS[s] / 100) * vh;
  }, []);

  const snapTo = useCallback((s: SheetState) => {
    setState(s);
    const targetHeight = getHeightPx(s);
    currentHeight.current = targetHeight;
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'height 0.35s cubic-bezier(0.2, 0.9, 0.3, 1)';
      sheetRef.current.style.height = `${targetHeight}px`;
    }
  }, [getHeightPx]);

  useEffect(() => {
    snapTo(initialState);
  }, [initialState, snapTo]);

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY;
    dragStartHeight.current = currentHeight.current;
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
    }
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const delta = dragStartY.current - clientY;
    const newHeight = Math.max(80, Math.min(window.innerHeight * 0.95, dragStartHeight.current + delta));
    currentHeight.current = newHeight;
    if (sheetRef.current) {
      sheetRef.current.style.height = `${newHeight}px`;
    }
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const vh = window.innerHeight;
    const heightPercent = (currentHeight.current / vh) * 100;
    
    // Snap to nearest point
    if (heightPercent < 20) {
      snapTo('collapsed');
    } else if (heightPercent < 70) {
      snapTo('half');
    } else {
      snapTo('expanded');
    }
  }, [isDragging, snapTo]);

  // Touch handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  }, [handleDragStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  }, [handleDragMove]);

  const onTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const handleMouseUp = () => handleDragEnd();
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 inset-x-0 z-40 bg-surface rounded-t-[2rem] flex flex-col"
      style={{
        height: SNAP_POINTS.collapsed,
        boxShadow: '0px -12px 32px rgba(160,63,48,0.06)',
        borderTop: '1px solid rgba(221,192,187,0.1)',
        willChange: 'height',
      }}
    >
      {/* Drag handle */}
      <div
        className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={(e) => handleDragStart(e.clientY)}
      >
        <div className={`w-12 h-1.5 rounded-full transition-colors ${isDragging ? 'bg-primary/60' : 'bg-outline-variant/40'}`} />
      </div>

      {/* Tabs */}
      {tabs}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-24">
        {children}
      </div>
    </div>
  );
}
