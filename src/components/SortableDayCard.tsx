'use client';

import { useState, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DayPlan, Place } from '@/lib/types';
import { haversineDistance, estimatedDrivingMinutes } from '@/lib/distance';
import StopCard from './StopCard';

interface SortableDayCardProps {
  dayPlan: DayPlan;
  variant?: 'compact' | 'editorial';
  onReorder?: (dayNumber: number, newStops: Place[]) => void;
  baseAnimationDelay?: number;
}

function SortableStop({
  stop,
  index,
  nextStop,
  variant,
  isLast,
  animationDelay,
}: {
  stop: Place;
  index: number;
  nextStop?: Place;
  variant: 'compact' | 'editorial';
  isLast: boolean;
  animationDelay: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${stop.name}-${stop.lat}-${stop.lng}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let drivingMin = 0;
  if (nextStop) {
    const dist = haversineDistance(stop, nextStop);
    drivingMin = Math.round(estimatedDrivingMinutes(dist));
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <StopCard
        place={stop}
        index={index}
        dayColor="#9d3d2e"
        variant={variant}
        drivingMinutes={drivingMin}
        isLast={isLast}
        animationDelay={animationDelay}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

function recalcDayPlan(day: DayPlan, newStops: Place[]): DayPlan {
  let totalKm = 0;
  for (let i = 0; i < newStops.length - 1; i++) {
    totalKm += haversineDistance(newStops[i], newStops[i + 1]);
  }
  return {
    ...day,
    stops: newStops,
    totalDrivingKm: Math.round(totalKm),
    estimatedDrivingMinutes: Math.round(estimatedDrivingMinutes(totalKm)),
  };
}

export default function SortableDayCard({
  dayPlan,
  variant = 'editorial',
  onReorder,
  baseAnimationDelay = 0,
}: SortableDayCardProps) {
  const [stops, setStops] = useState(dayPlan.stops);
  const [plan, setPlan] = useState(dayPlan);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const regionCounts: Record<string, number> = {};
  stops.forEach((s) => {
    regionCounts[s.region] = (regionCounts[s.region] || 0) + 1;
  });
  const primaryRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setStops((items) => {
      const oldIndex = items.findIndex((s) => `${s.name}-${s.lat}-${s.lng}` === active.id);
      const newIndex = items.findIndex((s) => `${s.name}-${s.lat}-${s.lng}` === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      const newPlan = recalcDayPlan(plan, newItems);
      setPlan(newPlan);
      onReorder?.(dayPlan.day, newItems);
      return newItems;
    });
  }, [plan, dayPlan.day, onReorder]);

  const sortableIds = stops.map((s) => `${s.name}-${s.lat}-${s.lng}`);

  return (
    <div className="space-y-4 day-card-animate" style={{ animationDelay: `${baseAnimationDelay}ms` }}>
      {/* Day header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-bold text-on-surface leading-tight -mr-1">
          יום {dayPlan.day}: {primaryRegion}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="material-symbols-outlined text-secondary text-lg">schedule</span>
          <span className="text-secondary font-medium text-sm">
            {plan.estimatedDrivingMinutes} דק׳ נסיעה סה״כ
          </span>
        </div>
      </div>

      {/* Sortable stops */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          <div className={variant === 'editorial' ? 'flex flex-col' : 'space-y-6'}>
            {stops.map((stop, i) => (
              <SortableStop
                key={`${stop.name}-${stop.lat}-${stop.lng}`}
                stop={stop}
                index={i}
                nextStop={i < stops.length - 1 ? stops[i + 1] : undefined}
                variant={variant}
                isLast={i === stops.length - 1}
                animationDelay={baseAnimationDelay + (i + 1) * 150}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
