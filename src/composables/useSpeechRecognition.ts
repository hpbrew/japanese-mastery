import { ref, onBeforeUnmount } from "vue"

type SpeechResultCallback = (
  transcript: string,
  isFinal: boolean,
  confidence: number,
) => void

interface SpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
}

export function useSpeechRecognition({
  lang = "ja-JP",
  continuous = true,
  interimResults = false,
}: SpeechRecognitionOptions = {}) {
  const SpeechRecognition =
    (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
  const supported = typeof SpeechRecognition !== "undefined"

  const recognizing = ref(false)
  const lastTranscript = ref("")
  let recognizer: any = null
  let callback: SpeechResultCallback | null = null

  // 1. Initialize the recognizer once and bind persistent event listeners
  const initRecognizer = () => {
    if (!supported || recognizer) return

    recognizer = new SpeechRecognition()
    recognizer.lang = lang
    recognizer.continuous = continuous
    recognizer.interimResults = interimResults
    recognizer.maxAlternatives = 1

    recognizer.onstart = () => {
      recognizing.value = true
    }

    recognizer.onend = () => {
      recognizing.value = false
    }

    recognizer.onerror = (event: any) => {
      // Handle 'not-allowed' (permission denied) or 'no-speech' gracefully
      console.warn("SpeechRecognition error:", event.error, event.message)
      recognizing.value = false
    }

    recognizer.onresult = (event: any) => {
      if (!callback) return

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript.trim()
        const confidence = result[0].confidence || 0
        const isFinal = result.isFinal

        lastTranscript.value = transcript
        callback(transcript, isFinal, confidence)
      }
    }
  }

  const start = (onResult: SpeechResultCallback): Promise<void> => {
    if (!supported) {
      return Promise.reject(
        new Error("SpeechRecognition is not supported by this browser."),
      )
    }

    if (!recognizer) {
      initRecognizer()
    }

    // Update the active callback function safely
    callback = onResult

    // Prevent crashing if start() is called while already running
    if (recognizing.value) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      try {
        recognizer.start()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  const stop = () => {
    if (recognizer && recognizing.value) {
      try {
        recognizer.stop()
      } catch {
        // Ignore native stop conflicts
      }
    }
    recognizing.value = false
  }

  onBeforeUnmount(() => {
    stop()
    recognizer = null
    callback = null
  })

  return {
    supported,
    recognizing,
    lastTranscript,
    start,
    stop,
  }
}
