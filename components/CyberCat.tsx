"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PanelAlignment = 'left' | 'center' | 'right';

function getReplyDuration(text: string) {
  return Math.min(30000, Math.max(10000, text.length * 70));
}

export default function CyberCat() {
  const [isPetted, setIsPetted] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [panelAlignment, setPanelAlignment] = useState<PanelAlignment>('right');

  const chatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  const updatePanelAlignment = (pointerX: number) => {
    const edgeThreshold = 280;

    if (pointerX < edgeThreshold) {
      setPanelAlignment('left');
    } else if (pointerX > window.innerWidth - edgeThreshold) {
      setPanelAlignment('right');
    } else {
      setPanelAlignment('center');
    }
  };

  // --- 💬 说话功能 ---
  const speak = (text: string, duration = 6000) => {
    setSpeech(text);
    if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    chatTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
    }, duration);
  };

  // --- 🖱️ 交互事件：摸猫猫 ---
  const handlePetCat = () => {
    if (isPetted) return;
    setIsPetted(true);
    speak("呼噜噜... 摸得本喵很舒服喵~", 2000);
    setTimeout(() => {
      setIsPetted(false);
    }, 2000);
  };

  // --- 🐟 交互事件：喂小鱼干 ---
  const handleFeed = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止触发摸猫或拖拽
    if (isThinking) return;

    setShowInput(false); // 喂食时关掉输入框
    setIsThinking(true);
    speak("嗷呜！真好吃喵！本喵吃饱了要说两句...", 6000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "我刚刚喂了你一条美味的小鱼干！你有什么表示？" }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      const reply = String(data.reply || '本喵一时不知道说什么喵。');
      speak(reply, getReplyDuration(reply));
    } catch (error) {
      speak("吧唧吧唧... 鱼干好吃，但本喵卡壳了喵...", 4000);
    } finally {
      setIsThinking(false);
    }
  };

  // --- 💬 交互事件：发送聊天 ---
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const userMessage = inputValue;
    setInputValue('');
    setShowInput(false);
    setIsThinking(true);
    speak("让本喵想想喵...", 10000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      const reply = String(data.reply || '本喵一时不知道说什么喵。');
      speak(reply, getReplyDuration(reply));
    } catch (error) {
      speak("铲屎官的网线被老鼠咬断了吧？喵！", 4000);
    } finally {
      setIsThinking(false);
    }
  };

  // --- ⏳ 随机挂机语录 ---
  useEffect(() => {
    const randomBarks = [
      "喵呜~ 今天天气真不错喵~",
      "好困哦，想睡觉喵...",
      "铲屎官，快去敲代码！",
      "我的小鱼干藏哪里去了？",
      "怎么没人理本喵...",
    ];
    const randomTalkInterval = setInterval(() => {
      if (!speech && !showInput && !isThinking && Math.random() > 0.8) {
        const randomMsg = randomBarks[Math.floor(Math.random() * randomBarks.length)];
        speak(randomMsg, 4000);
      }
    }, 20000);

    return () => clearInterval(randomTalkInterval);
  }, [speech, showInput, isThinking]);


  return (
    <>
      <div ref={dragConstraintsRef} className="pointer-events-none fixed inset-4 z-[9998]" aria-hidden="true" />
      <motion.div
        drag
        dragConstraints={dragConstraintsRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDrag={(_, info) => updatePanelAlignment(info.point.x)}
        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        className="group fixed bottom-20 right-20 z-[9999] flex touch-none cursor-grab flex-col items-center active:cursor-grabbing"
      >
      {/* 💬 聊天气泡 */}
      <div className="relative w-full flex justify-center mb-6">
        <AnimatePresence>
          {speech && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              onPointerDown={(event) => event.stopPropagation()}
              className={`absolute bottom-0 w-[360px] max-w-[calc(100vw-2rem)] text-slate-700 dark:text-gray-200 ${
                panelAlignment === 'left' ? 'left-0' : panelAlignment === 'right' ? 'right-0' : '-left-[120px]'
              }`}
              style={{ transformOrigin: 'bottom center' }}
            >
              <div className="max-h-[45vh] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl border border-gray-100 bg-white px-5 py-4 text-left text-xs leading-5 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                {speech}
              </div>
              <div className={`absolute -bottom-[6px] h-3 w-3 rotate-45 border-b border-r border-gray-100 bg-white dark:border-slate-700 dark:bg-slate-800 ${
                panelAlignment === 'left' ? 'left-[54px]' : panelAlignment === 'right' ? 'right-[54px]' : 'left-1/2 -translate-x-1/2'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🐈 猫咪本体 & 交互按钮区 */}
      <div className="relative">

        {/* 🌟 核心修改区：去掉了 opacity-0 和 group-hover，让按钮常驻显示 */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">

            {/* 💬 聊天按钮 */}
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(e) => {
                 e.stopPropagation();
                 setShowInput(!showInput);
              }}
              // 稍微加了一点半透明背景，让常驻按钮在深色背景下也好看
              className="bg-white/90 dark:bg-slate-700/90 p-2.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform border border-gray-100 dark:border-slate-600 text-blue-500 hover:text-blue-600 flex items-center justify-center backdrop-blur-sm"
              title="聊天"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
              </svg>
            </button>

            {/* 🐟 喂食按钮 */}
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={handleFeed}
              disabled={isThinking}
              className={`bg-white/90 dark:bg-slate-700/90 p-2.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform border border-gray-100 dark:border-slate-600 flex items-center justify-center backdrop-blur-sm ${isThinking ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="喂小鱼干"
            >
              <span className="text-xl leading-none">🐟</span>
            </button>
        </div>

        {/* 猫咪图片容器 */}
        <div
          className="w-[120px] h-[120px] relative cursor-pointer"
          onClick={handlePetCat}
        >
          <style>{`
            .cat-sprite {
              width: 100%;
              height: 100%;
              background-image: url('/siamese-cat.png');
              background-size: 300% 300%;
              background-repeat: no-repeat;
              image-rendering: pixelated;
            }
            .cat-idle {
              animation: idle-frames 1.2s infinite;
              background-position-y: 0%;
            }
            .cat-petted {
              animation: pet-frames 0.8s infinite;
              background-position-y: 50%;
            }
            .cat-thinking {
              animation: idle-frames 0.6s infinite;
              background-position-y: 0%;
            }
            @keyframes idle-frames {
              0%, 33.32% { background-position-x: 0%; }
              33.33%, 66.65% { background-position-x: 50%; }
              66.66%, 100% { background-position-x: 100%; }
            }
            @keyframes pet-frames {
              0%, 49.99% { background-position-x: 0%; }
              50%, 100% { background-position-x: 50%; }
            }
          `}</style>
          <div className={`cat-sprite drop-shadow-2xl ${isPetted ? 'cat-petted' : isThinking ? 'cat-thinking' : 'cat-idle'}`} />
        </div>
      </div>

      {/* ⌨️ 互动输入框 */}
      <AnimatePresence>
        {showInput && (
          <motion.form
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            onSubmit={handleChatSubmit}
            onPointerDown={(event) => event.stopPropagation()}
            className={`absolute -bottom-14 z-20 flex w-72 items-center rounded-full border border-gray-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800 ${
              panelAlignment === 'left' ? 'left-0' : panelAlignment === 'right' ? 'right-0' : '-left-[84px]'
            }`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="跟煤球说点啥喵..."
              className="w-full border-none bg-transparent px-3 py-1 text-xs outline-none placeholder-gray-400 dark:text-white"
              disabled={isThinking}
              autoFocus
            />
            <button
              type="submit"
              disabled={isThinking || !inputValue.trim()}
              className={`rounded-full p-1.5 ml-1 flex items-center justify-center transition-colors ${
                isThinking || !inputValue.trim() ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      </motion.div>
    </>
  );
}
