import { useEffect, useRef } from 'react';
import Sound from 'react-native-sound';

// Fix: declare the module types inline since @types/react-native-sound may not be installed
declare module 'react-native-sound';

export interface ScheduleEntry {
  id: string;
  label: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
}

export const useAudioScheduler = (schedule: ScheduleEntry[]): void => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playedRef = useRef<Set<string>>(new Set());

  const playAudio = (): void => {
    Sound.setCategory('Playback');

    const sound = new Sound('audio.mp3', Sound.MAIN_BUNDLE, (error: Error | null) => {
      if (error) {
        console.error('[AudioScheduler] Failed to load audio:', error);
        return;
      }
      sound.play((success: boolean) => {
        if (!success) {
          console.error('[AudioScheduler] Playback failed');
        }
        sound.release();
      });
    });
  };

  useEffect(() => {
    console.log('[AudioScheduler] Starting scheduler...');

    intervalRef.current = setInterval(() => {
      const now = new Date();

      const currentDate = now.toISOString().split('T')[0];

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}:${seconds}`;

      schedule.forEach((entry: ScheduleEntry) => {
        const key = `${entry.id}-${entry.date}-${entry.time}`;

        if (
          entry.date === currentDate &&
          entry.time === currentTime &&
          !playedRef.current.has(key)
        ) {
          console.log(`[AudioScheduler] Triggering: ${entry.label}`);
          playedRef.current.add(key);
          playAudio();
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('[AudioScheduler] Scheduler stopped.');
      }
    };
  }, [schedule]);
};