"use client";
import React, { useEffect, useState } from "react";

const BirthdayApp = () => {
  const [candleCount, setCandleCount] = useState(0);
  const [blownOut, setBlownOut] = useState(false);
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    let stream;

    const handleAudio = (stream) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlow = () => {
        analyser.getByteFrequencyData(dataArray);
        const isBlowing = dataArray.some((value) => value > 254); // Adjust threshold as needed

        if (isBlowing) {
          handleBlow();
        }

        requestAnimationFrame(checkBlow);
      };

      checkBlow();
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((userStream) => {
        stream = userStream;
        handleAudio(stream);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    const handleBlow = () => {
      setBlownOut(true);
      setCandleCount((prevCount) => Math.max(0, prevCount - 1));
      setCandles((prevCandles) => prevCandles.slice(0, -1));
    };

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getRandomColor = () => {
    // Generate a random hex color code
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };
  const addCandle = () => {
    // Generate random top and right values
    const randomTop = Math.floor(Math.random() * 80) + 10; // Adjust the range as needed
    const randomRight = Math.floor(Math.random() * 80) + 10; // Adjust the range as needed

    // Add a new candle to the array
    setCandles((prevCandles) => [
      ...prevCandles,
      {
        id: candleCount + 1,
        top: randomTop,
        right: randomRight,
        color: getRandomColor(),
      },
    ]);

    // Update the candle count
    setCandleCount(candleCount + 1);
  };
  console.log(candles);

  return (
    <div className="w-full h-screen">
      <div
        onClick={addCandle}
        className="relative h-full w-full flex justify-center items-center"
      >
        <div className="relative">
          {candles.map((candle) => (
            <div
              key={candle.id}
              style={{
                top: `-20px`,
                right: `${candle.right}%`,
                background: candle.color,
              }}
              className={`h-10 w-2 bg-black flex flex-col absolute `}
            ></div>
          ))}
          <div className="h-[10rem] w-[25rem] bg-black rounded-t-[32px]"></div>
        </div>
        <p className="absolute top-4 left-4">Counter: {candleCount}</p>
        <p className="absolute top-4 right-4">
          Status:{" "}
          {blownOut
            ? "Candles blown out"
            : "Blow on the mic to extinguish candles"}
        </p>
      </div>
    </div>
  );
};

export default BirthdayApp;
