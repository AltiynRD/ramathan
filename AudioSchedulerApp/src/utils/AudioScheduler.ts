import { useEffect, useRef } from 'react';
import Sound from 'react-native-sound';

declare module 'react-native-sound';

export interface ScheduleEntry {
  id: string;
  label: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
}

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

export const useAudioScheduler = (schedule: ScheduleEntry[]): void => {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    console.log('[AudioScheduler] Scheduling all events on launch...');

    // Clear any previously registered timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const now = new Date();

    schedule.forEach((entry: ScheduleEntry) => {
      // Build a Date object from the entry's date + time
      const scheduledAt = new Date(`${entry.date}T${entry.time}`);
      const delay = scheduledAt.getTime() - now.getTime();

      if (delay < 0) {
        // Event is in the past, skip it
        console.log(`[AudioScheduler] Skipping past event: "${entry.label}" was at ${entry.date} ${entry.time}`);
        return;
      }

      const hours = Math.floor(delay / 1000 / 60 / 60);
      const minutes = Math.floor((delay / 1000 / 60) % 60);
      const seconds = Math.floor((delay / 1000) % 60);
      console.log(
        `[AudioScheduler] "${entry.label}" scheduled in ${hours}h ${minutes}m ${seconds}s`
      );

      const timeout = setTimeout(() => {
        console.log(`[AudioScheduler] Triggering: "${entry.label}"`);
        playAudio();
      }, delay);

      timeoutsRef.current.push(timeout);
    });

    console.log(`[AudioScheduler] ${timeoutsRef.current.length} event(s) armed.`);

    // Cleanup all timeouts if the component unmounts
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      console.log('[AudioScheduler] All scheduled events cleared.');
    };
  }, [schedule]);
};