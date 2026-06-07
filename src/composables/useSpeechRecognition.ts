import { ref, onBeforeUnmount } from 'vue';

type SpeechResultCallback = (transcript: string, isFinal: boolean, confidence: number) => void;

export function useSpeechRecognition({
  lang = 'ja-JP',
  continuous = true,
  interimResults = false,
} = {}) {
  const supported = typeof (window as any).webkitSpeechRecognition !== 'undefined' || typeof (window as any).SpeechRecognition !== 'undefined';
  const recognizing = ref(false);
  const lastTranscript = ref('');
  let recognizer: any = null;

  const createRecognizer = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return null;
    const instance = new SpeechRecognition();
    instance.lang = lang;
    instance.continuous = continuous;
    instance.interimResults = interimResults;
    instance.maxAlternatives = 1;
    return instance;
  };

  const stop = () => {
    if (recognizer) {
      try {
        recognizer.stop();
      } catch {
        // ignore stop errors from browser
      }
    }
    recognizing.value = false;
  };

  const start = (onResult: SpeechResultCallback) => {
    if (!supported) {
      return Promise.reject(new Error('SpeechRecognition is not supported by this browser.'));
    }

    if (!recognizer) {
      recognizer = createRecognizer();
    }

    if (!recognizer) {
      return Promise.reject(new Error('Could not create SpeechRecognition instance.'));
    }

    recognizer.onstart = () => {
      recognizing.value = true;
    };

    recognizer.onend = () => {
      recognizing.value = false;
    };

    recognizer.onerror = (event: any) => {
      console.warn('SpeechRecognition error', event);
    };

    recognizer.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();
        const confidence = result[0].confidence || 0;
        const isFinal = result.isFinal;
        lastTranscript.value = transcript;
        onResult(transcript, isFinal, confidence);
      }
    };

    return new Promise<void>((resolve, reject) => {
      try {
        recognizer.start();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  onBeforeUnmount(stop);

  return {
    supported,
    recognizing,
    lastTranscript,
    start,
    stop,
  };
}
