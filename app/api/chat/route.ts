import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

interface ChatRequest {
  message?: unknown;
  history?: unknown;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recentRequests = (requestLog.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS
  );

  if (recentRequests.length >= RATE_LIMIT) {
    requestLog.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return false;
}

function parseHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item): item is { role: string; content: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { role?: unknown }).role === "string" &&
        typeof (item as { content?: unknown }).content === "string"
    )
    .filter((item) => item.role === "user" || item.role === "assistant")
    .slice(-12)
    .map((item) => ({ role: item.role as ChatMessage["role"], content: item.content.slice(0, 4000) }));
}

function serviceUnavailable(message: string) {
  return Response.json(
    { error: "service_unavailable", message },
    { status: 503 }
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    console.log(`[chat] Rate limited: ${ip}`);
    return Response.json(
      { error: "rate_limited", message: "Slow down a bit - try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  console.log("[chat] GROQ_API_KEY present:", Boolean(apiKey));

  if (!apiKey) {
    console.error("[chat] GROQ_API_KEY is missing from environment. Check .env.local and confirm the dev server was restarted after adding it.");
    return serviceUnavailable("MapBot is temporarily unavailable. Please try again later.");
  }

  let body: ChatRequest;
  try {
    body = await request.json();
  } catch (err) {
    console.error("[chat] Failed to parse request body:", err);
    return Response.json({ error: "invalid_request", message: "Please send a valid message." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";
  if (!message) {
    return Response.json({ error: "invalid_request", message: "Please enter a message." }, { status: 400 });
  }

  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data: notices, error: noticesError } = await supabase
    .from("notices")
    .select("title, body, created_at, expires_at, categories(name)")
    .eq("status", "published")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false })
    .limit(15);

  if (noticesError) {
    console.error("[chat] Supabase notices query failed:", noticesError);
    return serviceUnavailable("MapBot could not load the latest notices. Please try again later.");
  }

  const noticeContext = (notices ?? []).map((notice) => ({
    title: notice.title,
    body: notice.body,
    category: (notice.categories as unknown as { name: string } | null)?.name ?? null,
    created_at: notice.created_at,
    expires_at: notice.expires_at,
  }));

  const history = parseHistory(body.history);
  const groq = new Groq({ apiKey });

  const systemPrompt = `You are MapBot, the friendly assistant for the Moshood Abiola Polytechnic Computer Science department notice board.
Answer using only the notice data below for current notices and notice-specific facts. Never invent titles, dates, venues, deadlines, categories, or other notice details. If the answer is not in the notices, say that you do not see it in the current published notices and suggest checking the notice board or contacting the department. You may answer general questions about how this website works from common sense, but do not claim features that are not evident. Keep replies concise, warm, and useful.

CURRENT PUBLISHED NOTICES:
${JSON.stringify(noticeContext, null, 2)}`;

  try {
    const stream = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      max_tokens: 700,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
    });

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("[chat] Groq stream failed mid-response:", error);
          controller.enqueue(encoder.encode("MapBot is temporarily unavailable. Please try again later."));
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch (error) {
    console.error("[chat] Groq request failed before streaming started:", error);
    return serviceUnavailable("MapBot is temporarily unavailable. Please try again later.");
  }
}