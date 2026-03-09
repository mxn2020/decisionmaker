import { action } from "./_generated/server";
import { v } from "convex/values";
export const analyze = action({
    args: { dilemma: v.string(), framework: v.optional(v.string()) },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const fw = args.framework || "pros-cons";
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    {
                        role: "system", content: `You are DecisionMaker, an expert decision analyst. Use the "${fw}" framework. Analyze dilemmas objectively. Output JSON:
{"dilemma":"<restated>","options":[{"name":"<option>","prosScore":<1-10>,"consScore":<1-10>,"pros":["..."],"cons":["..."]}],"recommendation":"<best option>","reasoning":"<2-3 sentences>","framework":"${fw}"}`
                    },
                    { role: "user", content: args.dilemma },
                ], temperature: 0.5, max_tokens: 2000, response_format: { type: "json_object" }
            }),
        });
        if (!response.ok) throw new Error(`API error: ${await response.text()}`);
        const data = (await response.json()) as any;
        return JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
    },
});
