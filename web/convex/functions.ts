import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveDecision = mutation({
  args: { dilemma: v.string(), options: v.array(v.object({ name: v.string(), prosScore: v.number(), consScore: v.number(), pros: v.array(v.string()), cons: v.array(v.string()) })), recommendation: v.string(), reasoning: v.string(), framework: v.string() },
  handler: async (ctx, args) => await ctx.db.insert("decisions", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("decisions").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
