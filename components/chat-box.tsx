"use client";
import { supabase } from "@/lib/supabase/client";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
export default function ChatBoxComp() {
  const [prompt, setPrompt] = useState("");

  const [message, setMessage] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "أهلاً بك! سأساعدك على وضع خطة لحفظ القرآن الكريم.",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  // const handleSend = async () => {
  //   setLoading(true);
  //   try {
  //     setMessage(draft => [...draft, {role:"user", content:prompt}])
  //     const res = await fetch("/api/assistant", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt }),
  //     });
  //     const data = await res.json();

  //     // setReply(data.message);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSend = async () => {
  //   if (!prompt) return;

  //   setLoading(true);
  //   try {
  //     // أضف رسالة المستخدم
  //     setMessage((prev) => [...prev, { role: "user", content: prompt }]);

  //     const res = await fetch("/api/assistant", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt }),
  //     });

  //     const data = await res.json();

  //     let assistantMessage: string;

  //     try {
  //       // جرّب تفكيك message إذا كان JSON string
  //       const parsed = JSON.parse(data.message);
  //       assistantMessage = parsed.content || data.message;
  //     } catch {
  //       assistantMessage = data.message;
  //     }

  //     // أضف رسالة المساعد
  //     setMessage((prev) => [
  //       ...prev,
  //       { role: "assistant", content: assistantMessage },
  //     ]);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSend = async () => {
    setLoading(true);

    try {
      if (!prompt) return;

      setMessage((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
        },
      ]);

      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Contact-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(response.json());
        return setMessage((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      }
      let assistantMessage: string;
      try {
        const convert = JSON.parse(data.message);
        assistantMessage = convert.message || data.message;
      } catch {
        assistantMessage = data.message;
      }
      setMessage((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error(error);
      return setMessage((prev) => [
        ...prev,
        { role: "assistant", content: String(error) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetUser = async () => {
      try {
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
      <div className="flex flex-col h-[84vh] border border-gray-400 dark:border-purple-900/40 bg-transparent max-w-screen-xl mx-auto w-full rounded overflow-hidden shadow-lg">
        <div className="flex-1 overflow-auto p-4 text-black space-y-2">
          <div className="chat-box">
            {message.map((item, index) => (
              <div
                className={`relative w-fit space-y-2 my-3 ${
                  item.role === "user" ? "ml-auto" : "mr-auto"
                }`}
                key={index}
              >
                <strong className="flex items-center justify-center bg-gradient-to-tr via-indigo-700 from-blue-800 to-purple-700 rounded-full w-10 h-10 mr-auto text-white">
                  {item.role === "user" ? (
                    userName?.charAt(0)
                  ) : (
                    <Bot className="" />
                  )}
                </strong>
                <p
                  className={`w-fit px-6 py-2 rounded-lg text-white 
                    ${item.role === "user" ? "bg-black/10" : "bg-white/10"}
                  `}
                >
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="rounded whitespace-pre-wrap flex items-center justify-end gap-4">
              <div className="animate-pulse backdrop-blur-sm text-white bg-white/10 rounded-lg px-4 py-1.5">
                ...
              </div>
            </div>
          ) : null}
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
