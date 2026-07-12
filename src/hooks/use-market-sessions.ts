import { useState, useEffect } from "react";

export type SessionId = "tokyo" | "london" | "new_york" | "sydney";

export type MarketSession = {
  id: SessionId;
  label: string;
  open: number;
  close: number;
};

const SESSIONS: MarketSession[] = [
  { id: "sydney", label: "Sydney", open: 21, close: 6 },
  { id: "tokyo", label: "Tokyo", open: 0, close: 9 },
  { id: "london", label: "London", open: 8, close: 17 },
  { id: "new_york", label: "New York", open: 13, close: 22 },
];

function isSessionOpen(session: MarketSession, utcHour: number): boolean {
  if (session.open < session.close) {
    return utcHour >= session.open && utcHour < session.close;
  }
  return utcHour >= session.open || utcHour < session.close;
}

export type SessionStatus = MarketSession & { isOpen: boolean };

export function useMarketSessions() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const utcHour = now.getUTCHours();

  const sessions: SessionStatus[] = SESSIONS.map((s) => ({
    ...s,
    isOpen: isSessionOpen(s, utcHour),
  }));

  return { now, sessions };
}
