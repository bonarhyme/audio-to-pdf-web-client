import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";

const SpeechToText = () => {
  const speechRecognitionSupported =
    SpeechRecognition.browserSupportsSpeechRecognition();

  const [isSupported, setIsSupported] = useState(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [listening, setListening] = useState(false);
  const [response, setResponse] = useState({
    loading: false,
    message: "",
    error: false,
    success: false,
  });
  const textBodyRef = useRef(null);

  const startListening = () => {
    setListening(true);
    SpeechRecognition.startListening({
      continuous: true,
    });
  };

  const stopListening = () => {
    setListening(false);
    SpeechRecognition.stopListening();
  };

  const resetText = () => {
    stopListening();
    resetTranscript();
    textBodyRef.current.innerText = "";
  };

  const handleConversion = async () => {
    if (typeof window !== "undefined") {
      const userText = textBodyRef.current.innerText;
      // console.log(textBodyRef.current.innerText);

      if (!userText) {
        alert("Please speak or write some text.");
        return;
      }

      try {
        setResponse({
          ...response,
          loading: true,
          message: "",
          error: false,
          success: false,
        });
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        };

        const res = await axios.post(
          "http://localhost:4000",
          {
            text: textBodyRef.current.innerText,
          },
          config
        );
        setResponse({
          ...response,
          loading: false,
          error: false,
          message:
            "Conversion was successful. Your download will start soon...",
          success: true,
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "yourfile.pdf");
        document.body.appendChild(link);
        link.click();

        console.log(res);
      } catch (error) {
        setResponse({
          ...response,
          loading: false,
          error: true,
          message:
            "An unexpected error occured. Text not converted. Please try again",
          success: false,
        });
      }
    }
  };

  useEffect(() => {
    setIsSupported(speechRecognitionSupported);
  }, []);

  if (!isSupported) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  return (
    <>
      <section>
        <div className="button-container">
          <button
            type="button"
            onClick={startListening}
            style={{ "--bgColor": "blue" }}
            disabled={listening}
          >
            Start
          </button>
          <button
            type="button"
            onClick={stopListening}
            style={{ "--bgColor": "orange" }}
            disabled={listening === false}
          >
            Stop
          </button>
        </div>
        <div
          className="words"
          contentEditable
          ref={textBodyRef}
          suppressContentEditableWarning={true}
        >
          {transcript}
        </div>
        <div>
          {response.success && <i className="success">{response.message}</i>}
          {response.error && <i className="error">{response.message}</i>}
        </div>
        <div className="button-container">
          <button
            type="button"
            onClick={resetText}
            style={{ "--bgColor": "red" }}
          >
            Reset
          </button>
          <button
            type="button"
            style={{ "--bgColor": "green" }}
            onClick={handleConversion}
          >
            {response.loading ? "Converting..." : "Convert to pdf"}
          </button>
        </div>
      </section>
    </>
  );
};

export default SpeechToText;
