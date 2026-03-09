import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  decisions: defineTable({
    dilemma: v.string(),
    options: v.array(v.object({
      name: v.string(), prosScore: v.number(), consScore: v.number(),
      pros: v.array(v.string()), cons: v.array(v.string()),
    })),
    recommendation: v.string(), reasoning: v.string(),
    framework: v.string(), // "pros-cons", "weighted", "regret-minimization"
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
