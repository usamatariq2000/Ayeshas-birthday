"use client";
import React, { useEffect, useState } from "react";
import pic from "./assets/back1.jpg";
import Image from "next/image";

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
      <Image
        src={pic}
        alt="Background Image"
        // layout="fill"
        // objectFit="cover"

        className="absolute w-full h-full"
        quality={100}
      />
      <div
        onClick={addCandle}
        className="relative h-full w-full flex justify-center items-center "
      >
        <div className=" flex flex-col items-center justify-center w-full">
          <div className="relative w-[50%] md:w-auto">
            {candles.map((candle) => (
              <div
                key={candle.id}
                style={{
                  top: `-40px`,
                  right: `${candle.right}%`,
                  background: candle.color,
                }}
                className={`h-10 w-2 bg-black flex flex-col absolute ml-10`}
              ></div>
            ))}
            <div className="h-[10rem] w-[full] md:w-[20rem] bg-[#f7a5a4] rounded-t-[32px] flex justify-center px-7">
              {" "}
              <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
              <div className="w-10 h-10 rounded-b-[82px] bg-[#4d4d4d]"></div>
              <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
              <div className="w-10 h-10 rounded-b-[82px] bg-[#4d4d4d]"></div>
              <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
              <div className="w-10 h-10 rounded-b-[82px] bg-[#4d4d4d]"></div>
              <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
            </div>
          </div>
          <div className="h-[10rem] w-[70%] md:w-[30rem] bg-[#fac2c2] rounded-t-[32px] flex justify-center px-7">
            <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
            <div className="w-10 h-10 rounded-b-[82px] bg-[#4d4d4d]"></div>
            <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
            <div className="w-10 h-10 rounded-b-[82px] bg-[#4d4d4d]"></div>
            <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
            <div className="w-10 h-10 rounded-b-[82px] bg-[#4d4d4d]"></div>
            <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
            <div className="w-10 h-10 rounded-b-[82px]  bg-[#4d4d4d]"></div>
            <div className="w-10 h-10 rounded-b-[82px] bg-[#cfae59]"></div>
          </div>
          <div className="h-[2rem] w-[85%] md:w-[40rem] bg-[#3d2d01] rounded-full flex justify-center px-7"></div>
        </div>
        <p className="absolute top-10 md:top-4 left-4 font-semibold text-xl">
          Years: {candleCount}
        </p>
        <p className="absolute top-40 md:top-28 font-bold text-2xl md:text-5xl ">
          {blownOut ? (
            <span className=" bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text p-4">
              Happy Birthday Ayeshaa!!!!
            </span>
          ) : (
            <span className=""></span>
          )}
        </p>
      </div>
    </div>
  );
};

export default BirthdayApp;
