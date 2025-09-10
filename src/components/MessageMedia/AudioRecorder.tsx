import { Notifications, Actions } from "@twilio/flex-ui";
import AudioReactRecorder, {
  RecordState,
  AudioData,
} from "audio-react-recorder";
import React, { useState, useEffect, useRef } from "react";
import { MainWrapper } from "./styles";
import { CircularProgress } from "@mui/material";
import { Mp3Encoder } from "lamejs";
import { Clear, KeyboardVoice, Pause, PlayArrow, Send } from "@mui/icons-material";

interface Mp3Content {
  blobUrl: string;
  file: File | {};
}

interface Counter {
  minutes: number;
  seconds: number;
}

export const AudioRecorder = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [recordStatus, setRecordStatus] = useState<RecordState | "">("");
  const [microphoneAccess, setMicrophoneAccess] = useState<boolean>(true);
  const [mp3Content, setMp3Content] = useState<Mp3Content>({
    blobUrl: "",
    file: {},
  });
  const [counter, setCounter] = useState<Counter>({ minutes: 0, seconds: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayFinalizedRef = useRef<boolean>(false);

  useEffect(() => {
    async function getMicPermission() {
      const micPermission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      micPermission.onchange = (ev: any) => {
        setMicrophoneAccess(ev.target.state === "granted");
      };

      setMicrophoneAccess(micPermission.state === "granted");
    }

    getMicPermission();
  }, []);

  function playAudio() {
    if (audioPlayFinalizedRef.current) return;

    const audio = new Audio(mp3Content.blobUrl as string);
    audioPlayFinalizedRef.current = true;
    audio.play();

    audio.onended = () => {
      audioPlayFinalizedRef.current = false;
    };
  }

  async function sendAudio() {
    setLoading(true);

    try {
      await Actions.invokeAction("SendMessage", {
        attachedFiles: [mp3Content.file as File],
        conversationSid: props.conversationSid,
      });

      setMp3Content({ blobUrl: "", file: {} });
      setRecordStatus("");
    } catch (err) {
      console.error(`Error when sending media message`, err);
    } finally {
      setLoading(false);
    }
  }

  function startCounter() {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter.seconds >= 59) {
          return { minutes: prevCounter.minutes + 1, seconds: 0 };
        } else {
          return {
            minutes: prevCounter.minutes,
            seconds: prevCounter.seconds + 1,
          };
        }
      });
    }, 1000);
  }

  function stopCounter() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  const convertPCMToMP3 = (audioBlob: Blob) => {
    const reader = new FileReader();
    reader.onload = function () {
      const pcmData = new Int32Array(reader.result as ArrayBuffer);

      const encoder = new Mp3Encoder(1, 44100, 128);
      const mp3Buffer: Int8Array[] = [];
      const sampleBlockSize = 1152;
      
      const samples = new Int16Array(pcmData as ArrayBuffer);
  
      for (let i = 0; i < samples.length; i += sampleBlockSize) {
        const sampleChunk = samples.subarray(i, i + sampleBlockSize);
        const mp3Data = encoder.encodeBuffer(sampleChunk);
        if (mp3Data.length > 0) {
          mp3Buffer.push(mp3Data);
        }
      }
  
      const mp3Data = encoder.flush();
      if (mp3Data.length > 0) {
        mp3Buffer.push(mp3Data);
      }
  
      const mp3Blob = new Blob(mp3Buffer, { type: 'audio/mp3' });
      const url = URL.createObjectURL(mp3Blob);
  
      setMp3Content({
        blobUrl: url,
        file: new File([mp3Blob], `${new Date().getTime()}-workerAudioFile.mp3`, { type: 'audio/mpeg' }),
      });
    };
  
    reader.readAsArrayBuffer(audioBlob);
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <MainWrapper>
      <AudioReactRecorder
        state={recordStatus}
        onStop={(audioData: AudioData) => {
          convertPCMToMP3(audioData.blob);
        }}
        backgroundColor="none"
        foregroundColor="none"
        canvasWidth={0}
        canvasHeight={0}
        type="audio/mpeg"
      />
      {(recordStatus === "stop" || !recordStatus) && !mp3Content.blobUrl && (
        <button
          aria-label="Gravar áudio"
          title="Gravar áudio"
          onClick={() => {
            if (!microphoneAccess) {
              return Notifications.showNotification("recordAudioError");
            }
            setRecordStatus("start");
            startCounter();
          }}
        >
          <KeyboardVoice color="primary" />
        </button>
      )}
      <div className="flex-justify-center">
        {recordStatus === "start" && (
          <>
            <button
              aria-label="Pausar gravação"
              title="Pausar gravação"
              onClick={() => {
                setRecordStatus("stop");
                stopCounter();
              }}
            >
              <Pause color="primary" />
            </button>
            <span className="counter-span recording-on">
              {counter.minutes.toString().padStart(2, "0")}:
              {counter.seconds.toString().padStart(2, "0")}
            </span>
          </>
        )}
        {mp3Content.blobUrl && (
          <>
            <button
              aria-label="Cancelar áudio gravado"
              title="Cancelar áudio gravado"
              onClick={() => {
                setMp3Content({ blobUrl: "", file: {} });
                setRecordStatus("");
                setCounter({ minutes: 0, seconds: 0 });
              }}
            >
              <Clear color="primary" />
            </button>
            <button
              aria-label="Escutar áudio gravado"
              title="Escutar áudio gravado"
              onClick={() => playAudio()}
            >
              <PlayArrow color="primary" />
            </button>
          </>
        )}
        {mp3Content.file && (mp3Content.file as File).name && (
          <>
            <button
              aria-label="Enviar áudio"
              title="Enviar áudio"
              onClick={() => {
                sendAudio();
                setCounter({ minutes: 0, seconds: 0 });
              }}
            >
              <Send color="primary" />
            </button>
            <span className="counter-span">
              Tamanho: {counter.minutes.toString().padStart(2, "0")}:
              {counter.seconds.toString().padStart(2, "0")}
            </span>
          </>
        )}
      </div>
    </MainWrapper>
  );
};
