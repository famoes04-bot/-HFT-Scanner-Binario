import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

// Grava um lote de sinais obtidos a partir de um scan
export const recordSignals = mutation({
  args: {
    signals: v.array(
      v.object({
        assetId: v.string(),
        direction: v.string(), // "CALL" | "PUT"
        score: v.number(),     // 0 - 9
        timestamp: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const signal of args.signals) {
      await ctx.db.insert("signals", {
        assetId: signal.assetId,
        direction: signal.direction,
        score: signal.score,
        timestamp: signal.timestamp,
      });
    }
    return { success: true, count: args.signals.length };
  },
});
