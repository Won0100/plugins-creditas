declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "audio-react-recorder" {
  export type RecordState = "start" | "stop" | "pause" | "";

  export interface AudioData {
    url: string;
    blob: Blob;
  }

  interface AudioReactRecorderProps {
    state: RecordState;
    onStop: (audioData: AudioData) => void;
    backgroundColor?: string;
    foregroundColor?: string;
    canvasWidth?: number;
    canvasHeight?: number;
    type?: string;
  }

  const AudioReactRecorder: React.FC<AudioReactRecorderProps>;

  export default AudioReactRecorder;
}

declare module 'lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }

  export class WavHeader {
    static readHeader(dataView: DataView): WavHeader;
    channels: number;
    sampleRate: number;
    numSamples: number;
  }
}
