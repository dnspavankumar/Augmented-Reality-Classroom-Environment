import { useAITeacher } from "@/hooks/useAITeacher";
import { useEffect, useRef } from "react";

export const MessagesList = () => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const stopMessage = useAITeacher((state) => state.stopMessage);
  const { currentMessage } = useAITeacher();
  const classroom = useAITeacher((state) => state.classroom);

  const container = useRef();

  useEffect(() => {
    container.current.scrollTo({
      top: container.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div
      className={`${
        classroom === "default"
          ? "w-[1288px] h-[676px]"
          : "w-[2528px] h-[856px]"
      } p-8 overflow-y-auto flex flex-col space-y-8 bg-transparent opacity-80`}
      ref={container}
    >
      {messages.length === 0 && (
        <div className="h-full w-full grid place-content-center text-center">
          <h2 className="text-8xl font-bold text-white/90 italic">
            AI Teacher
            <br />
            Science & Math Tutor
          </h2>
          <p className="text-4xl text-blue-400/90 mt-4">
            Ask me anything about science or mathematics!
          </p>
        </div>
      )}
      {messages.map((message, i) => (
        <div key={i}>
          <div className="flex">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white/70 text-2xl font-semibold">
                  Q:
                </span>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-yellow-300/90 to-orange-400/90">
                  {message.question}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-white/70 text-2xl font-semibold">
                  A:
                </span>
                <p className="text-3xl font-bold text-white/90">
                  {message.answer.answer}
                </p>
              </div>
            </div>
            {currentMessage === message ? (
              <button
                className="text-white/65"
                onClick={() => stopMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="text-white/65"
                onClick={() => playMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="p-5 mt-5 bg-gradient-to-br from-blue-200/20 to-purple-500/20 rounded-xl">
            <span className="pr-4 italic bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/70 text-3xl font-bold uppercase inline-block mb-4">
              Detailed Explanation
            </span>
            {message.answer.explanation && message.answer.explanation.map((step, i) => (
              <div key={i} className="mt-4 p-4 bg-black/20 rounded-lg">
                <h3 className="text-2xl font-bold text-cyan-300/90 mb-2">
                  {step.step}
                </h3>
                <p className="text-xl text-white/80 mb-3">
                  {step.description}
                </p>
                {step.keyPoints && step.keyPoints.length > 0 && (
                  <ul className="list-disc list-inside space-y-1">
                    {step.keyPoints.map((point, j) => (
                      <li key={j} className="text-lg text-green-300/80">
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {message.answer.formula && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <span className="text-xl font-bold text-purple-300/90 block mb-2">
                  Formula:
                </span>
                <p className="text-2xl font-mono text-white/90">
                  {message.answer.formula}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
