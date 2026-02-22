import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, Play, Pause, X } from 'lucide-react';
import axios from 'axios';

interface VoiceRecorderProps {
  value: string;
  onChange: (url: string) => void;
  token?: string;
}

export function VoiceRecorder({ value, onChange, token }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-note.webm');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-audio`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onChange(response.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || error.message;
        alert(`Failed to upload audio: ${errorMsg}`);
      } else {
        alert('Failed to upload audio. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(value);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const removeAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    onChange('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isUploading) {
    return (
      <div className="border-2 border-dashed rounded-xl p-6 text-center border-primary bg-secondary/50">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Uploading voice note...</p>
      </div>
    );
  }

  if (value) {
    return (
      <div className="bg-secondary/50 rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div>
              <p className="text-sm font-medium">Voice Note Recorded</p>
              <p className="text-xs text-muted-foreground">Tap to play</p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="rounded-full w-8 h-8 p-0"
            onClick={removeAudio}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-500 rounded-xl p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-red-500 rounded-full animate-ping opacity-20" />
          </div>
          <p className="text-lg font-bold text-red-700 dark:text-red-400">
            Recording: {formatTime(recordingTime)}
          </p>
          <Button
            type="button"
            variant="destructive"
            onClick={stopRecording}
            className="rounded-full gap-2"
          >
            <Square className="w-4 h-4" />
            Stop Recording
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/50 transition-colors">
      <Mic className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground mb-3">Record voice note (optional)</p>
      <Button
        type="button"
        variant="outline"
        onClick={startRecording}
        className="rounded-full gap-2"
      >
        <Mic className="w-4 h-4" />
        Start Recording
      </Button>
      <p className="text-xs text-muted-foreground mt-2">For those who can't type</p>
    </div>
  );
}
