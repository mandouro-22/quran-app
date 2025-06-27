"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function ChatBoxComp() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [me, setMe] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setMe(prompt);
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
  };

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error(error.message);
          return;
        }

        setUserName(data.user.user_metadata.full_name);
      } catch (error) {
        console.error(error);
      }
    };
    handleGetUser();
  }, []);

  return (
    <main className="p-6 space-y-4 relative">
      <div className="flex flex-col h-[84vh] border border-gary-400 dark:border-purple-900/40 bg-transparent max-w-screen-xl mx-auto w-full rounded overflow-hidden shadow-lg">
        <div className="flex-1 overflow-auto p-4 text-black space-y-2">
          <div className=" p-4 rounded whitespace-pre-wrap flex items-center justify-start gap-4">
            <div className="border w-10 h-10 flex items-center justify-center rounded-full shadow">
              <strong className="dark:text-white text-gray-800">
                {userName?.charAt(0)}
              </strong>
            </div>
            <div className="bg-purple-600 text-white rounded-lg px-4 py-1.5">
              {me}
            </div>
          </div>

          <div className=" p-4 rounded whitespace-pre-wrap flex items-center justify-end gap-4">
            <div className="backdrop-blur-sm text-white bg-black/40 rounded-lg px-4 py-1.5">
              {reply}
            </div>
            <div className="border w-10 h-10 flex items-center justify-center rounded-full shadow">
              <strong className="dark:text-white text-gray-800">AI</strong>
            </div>
          </div>
        </div>

        <div className=" p-4 border-t">
          <h1 className="text-xl font-bold mb-2">مساعد خطة الحفظ</h1>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="مثال: أريد حفظ سورة القرأن الكريم خلال سنه"
            className="w-full p-3 rounded resize-none backdrop-blur-lg border outline-none dark:bg-black/30 "
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "جاري التحميل..." : "أرسل للمساعد"}
          </button>
        </div>
      </div>
    </main>
  );
}
