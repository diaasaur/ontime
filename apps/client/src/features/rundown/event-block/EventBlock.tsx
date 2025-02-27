import { MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IoCopyOutline } from '@react-icons/all-files/io5/IoCopyOutline';
import { IoPeopleOutline } from '@react-icons/all-files/io5/IoPeopleOutline';
import { IoReorderTwo } from '@react-icons/all-files/io5/IoReorderTwo';
import { EndAction, OntimeEvent, Playback, TimerType } from 'ontime-types';

import { useContextMenu } from '../../../common/hooks/useContextMenu';
import { useEventAction } from '../../../common/hooks/useEventAction';
import { useAppMode } from '../../../common/stores/appModeStore';
import copyToClipboard from '../../../common/utils/copyToClipboard';
import { cx, getAccessibleColour } from '../../../common/utils/styleUtils';
import type { EventItemActions } from '../RundownEntry';

import EventBlockInner from './EventBlockInner';

import style from './EventBlock.module.scss';

interface EventBlockProps {
  timeStart: number;
  timeEnd: number;
  duration: number;
  eventIndex: number;
  eventId: string;
  isPublic: boolean;
  endAction: EndAction;
  timerType: TimerType;
  title: string;
  note: string;
  delay: number;
  previousEnd: number;
  colour: string;
  isPast: boolean;
  next: boolean;
  skip: boolean;
  selected: boolean;
  hasCursor: boolean;
  playback?: Playback;
  isRolling: boolean;
  actionHandler: (
    action: EventItemActions,
    payload?:
      | number
      | {
          field: keyof Omit<OntimeEvent, 'duration'> | 'durationOverride';
          value: unknown;
        },
  ) => void;
  disableEdit: boolean;
}

export default function EventBlock(props: EventBlockProps) {
  const {
    timeStart,
    timeEnd,
    duration,
    eventIndex,
    eventId,
    isPublic = true,
    endAction,
    timerType,
    title,
    note,
    delay,
    previousEnd,
    colour,
    isPast,
    next,
    skip = false,
    selected,
    hasCursor,
    playback,
    isRolling,
    actionHandler,
    disableEdit,
  } = props;
  const { updateEvent } = useEventAction();
  const moveCursorTo = useAppMode((state) => state.setCursor);
  const handleRef = useRef<null | HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const openId = useAppMode((state) => state.editId);
  const [onContextMenu] = useContextMenu<HTMLDivElement>([
    { label: `Copy ID: ${eventId}}`, icon: IoCopyOutline, onClick: () => copyToClipboard(eventId) },
    {
      label: 'Toggle public',
      icon: IoPeopleOutline,
      onClick: () =>
        updateEvent({
          id: eventId,
          isPublic: !isPublic,
        }),
    },
  ]);

  const {
    isDragging,
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: eventId,
    animateLayoutChanges: () => false,
  });

  const dragStyle = {
    zIndex: isDragging ? 2 : 'inherit',
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const binderColours = colour && getAccessibleColour(colour);

  useEffect(() => {
    if (hasCursor) {
      handleRef?.current?.focus();
    }
  }, [hasCursor]);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        threshold: 1,
      },
    );

    const handleRefCurrent = handleRef.current;
    if (handleRefCurrent) {
      observer.observe(handleRefCurrent);
    }

    return () => {
      if (handleRefCurrent) {
        observer.unobserve(handleRefCurrent);
      }
    };
  }, [handleRef]);

  const blockClasses = cx([
    style.eventBlock,
    skip ? style.skip : null,
    isPast ? style.past : null,
    selected ? style.selected : null,
    playback ? style[playback] : null,
    hasCursor ? style.hasCursor : null,
  ]);

  const handleFocusClick = (event: MouseEvent) => {
    event.stopPropagation();
    moveCursorTo(eventId, true);
  };

  return (
    <div
      className={blockClasses}
      ref={setNodeRef}
      style={dragStyle}
      onClick={handleFocusClick}
      onContextMenu={onContextMenu}
    >
      <div className={style.binder} style={{ ...binderColours }} tabIndex={-1}>
        <span className={style.drag} ref={handleRef} {...dragAttributes} {...dragListeners}>
          <IoReorderTwo />
        </span>
        {eventIndex}
      </div>
      {isVisible && (
        <EventBlockInner
          isOpen={openId === eventId}
          timeStart={timeStart}
          timeEnd={timeEnd}
          duration={duration}
          eventId={eventId}
          isPublic={isPublic}
          endAction={endAction}
          timerType={timerType}
          title={title}
          note={note}
          delay={delay}
          previousEnd={previousEnd}
          next={next}
          skip={skip}
          selected={selected}
          playback={playback}
          isRolling={isRolling}
          actionHandler={actionHandler}
          disableEdit={disableEdit}
        />
      )}
    </div>
  );
}
