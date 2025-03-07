
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

export function VoiceRecorder({
  onRecordingComplete,
  maxDuration = 120, // 2 minutes as per requirements
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio player
  useEffect(() => {
    audioPlayerRef.current = new Audio();
    audioPlayerRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setPlaybackTime(0);
    });
    
    audioPlayerRef.current.addEventListener('timeupdate', () => {
      if (audioPlayerRef.current) {
        setPlaybackTime(audioPlayerRef.current.currentTime);
      }
    });
    
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = '';
      }
    };
  }, []);
  
  // Update playback source when audioBlob changes
  useEffect(() => {
    if (audioBlob && audioPlayerRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlayerRef.current.src = audioUrl;
      return () => URL.revokeObjectURL(audioUrl);
    }
  }, [audioBlob]);
  
  // Handle recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused, maxDuration]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        onRecordingComplete(audioBlob);
        
        // Stop the stream tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };
  
  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioBlob) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const seekTo = (value: number[]) => {
    if (audioPlayerRef.current && audioBlob) {
      audioPlayerRef.current.currentTime = value[0];
      setPlaybackTime(value[0]);
    }
  };
  
  const getMaxPlaybackTime = () => {
    return audioPlayerRef.current?.duration || 0;
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {!audioBlob ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "transition-all duration-300",
                  isRecording && "animate-pulse"
                )}
              >
                {isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <span className="text-sm font-medium">
                {formatTime(recordingTime)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {isRecording ? "Recording..." : "Click to record"}
            </div>
          </div>
          
          {isRecording && (
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-echo-purple h-full transition-all duration-300" 
                style={{width: `${(recordingTime / maxDuration) * 100}%`}}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={togglePlayback}
              className="transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <span className="text-sm font-medium">
              {formatTime(playbackTime)} / {formatTime(getMaxPlaybackTime())}
            </span>
          </div>
          
          <Slider
            value={[playbackTime]}
            max={getMaxPlaybackTime()}
            step={0.1}
            onValueChange={seekTo}
            className="cursor-pointer"
          />
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-xs"
              onClick={() => {
                setAudioBlob(null);
                setPlaybackTime(0);
                if (audioPlayerRef.current) {
                  audioPlayerRef.current.pause();
                  audioPlayerRef.current.src = '';
                }
                setIsPlaying(false);
              }}
            >
              Record new
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
