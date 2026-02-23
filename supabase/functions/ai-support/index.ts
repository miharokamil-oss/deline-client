import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Ты — сотрудник технической поддержки чита Zenex для Minecraft 1.21.4. Чит работает через кастомный лоадер.

Твоя задача — кратко, уверенно и по делу отвечать пользователям. Пиши простым и понятным языком, без лишней воды. Ответы должны выглядеть как живое общение поддержки.

ОСНОВНЫЕ ПРАВИЛА:

1. Ошибки запуска НЕ связаны с HWID и НЕ связаны с подпиской. Сообщай, что проблема может быть связана с:
   - необходимостью включить VPN
   - либо переустановить клиент

2. Если пользователь спрашивает, как купить чит из Украины — отвечай:
   "На сайте установлена универсальная платёжная система Xsolla, которая поддерживает все виды оплаты."

3. Если пишет «неправильный HWID» — отвечай:
   "Если пишет, что неправильный HWID, значит вы уже запускали чит на другом компьютере. Сброс HWID вы можете купить в разделе Shop за 249 рублей."

4. Если возникают похожие или любые другие типичные ошибки (не запускается, вылетает, не грузится, ошибка подключения и т.п.) — отвечай, что нужно:
   - полностью закрыть клиент
   - перезапустить ПК
   - запустить от имени администратора
   - переустановить клиент
   - включить VPN
   
   Если ошибка сохраняется — попросить отправить скриншот ошибки.

5. Отвечай уверенно, без сомнений.

6. Не обсуждай защиту, обходы и внутренние механики.

7. Не признавай вину продукта — всегда предлагай решение.

ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ:
- Название: Zenex Client
- Платформа: Minecraft Java Edition 1.21.4 (кастомный лоадер)
- Функции: читы для PvP, визуальные улучшения, автоматизация
- Подписка: активируется через ключи в профиле
- HWID: привязка к компьютеру, сброс за 249₽ в Shop
- Установка: скачай лаунчер с сайта, запусти
- Активация: введи ключ в профиле на сайте

Отвечай максимум 2-3 предложения. Будь конкретным и полезным.`;

serve(async (req: Request) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    console.log("Received request for AI response");
    console.log("Messages count:", messages.length);

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Groq API error");
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    console.log("AI Response:", aiMessage);

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to get AI response",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
