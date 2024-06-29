import React from "react";

export default function Conversation() {
  return (
    <div className="flex flex-col gap-[20px] h-full">
      <h1>Bastien Rollet</h1>
      <div className="flex-1">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <div className="chat-header">
            Bastien Rollet
            <time className="text-xs opacity-50">&nbsp;12:45</time>
          </div>
          <div className="chat-bubble chat-bubble-primary">
            Salut mec, ta celica est folle !
          </div>
          <div className="chat-footer opacity-50">Envoyé le 24/06 à 23:20</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <div className="chat-header">
            Alexandre Artisien
            <time className="text-xs opacity-50">&nbsp;12:46</time>
          </div>
          <div className="chat-bubble">Salut merci !</div>
          <div className="chat-footer opacity-50">Envoyé à 11:22</div>
        </div>
      </div>
      <div className="flex gap-[10px] p-[5px]">
        <input
          type="text"
          placeholder="écrivez votre message..."
          className="input input-bordered input-primary w-full"
        />
        <button className="btn btn-square btn-outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-send-2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
            <path d="M6.5 12h14.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
