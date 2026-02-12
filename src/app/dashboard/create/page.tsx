"use client";

import { useState } from "react";

const steps = ["Basics", "AI Model", "Task", "Scoring", "Review"];

export default function CreateTestPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    description: "",
    model: "gpt-4o",
    taskDescription: "",
    expectedOutcome: "",
    maxAttempts: 5,
    timeLimitMinutes: 15,
    tokenBudget: 2000,
  });

  const update = (field: string, value: string | number) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Test</h1>
        <p className="text-gray-600 text-sm mt-1">Build an AI prompting assessment in five steps</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                i === step ? "text-[#1B5B7D]" : i < step ? "text-[#10B981]" : "text-gray-400"
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i === step ? "bg-[#1B5B7D] text-white" : i < step ? "bg-[#10B981] text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-[#10B981]" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {/* Step 1: Basics */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Test Basics</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5B7D] focus:border-transparent"
                placeholder="e.g., Write a Marketing Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5B7D] focus:border-transparent resize-none"
                placeholder="Brief description of what this test evaluates..."
              />
            </div>
          </div>
        )}

        {/* Step 2: AI Model */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Choose AI Model</h2>
            <p className="text-sm text-gray-600">Select which AI model candidates will interact with during the assessment.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "gpt-4o", name: "GPT-4o", provider: "OpenAI", desc: "Best for general-purpose tasks" },
                { value: "claude", name: "Claude", provider: "Anthropic", desc: "Strong at analysis and writing" },
                { value: "gemini", name: "Gemini", provider: "Google", desc: "Great for multimodal tasks" },
              ].map((model) => (
                <button
                  key={model.value}
                  onClick={() => update("model", model.value)}
                  className={`p-5 rounded-xl border-2 text-left transition-colors ${
                    form.model === model.value
                      ? "border-[#1B5B7D] bg-[#1B5B7D]/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-0.5">{model.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{model.provider}</div>
                  <div className="text-sm text-gray-600">{model.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Task */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Define the Task</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
              <p className="text-xs text-gray-500 mb-2">This is what candidates will see. Be specific about what they need to accomplish.</p>
              <textarea
                value={form.taskDescription}
                onChange={(e) => update("taskDescription", e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5B7D] focus:border-transparent resize-none"
                placeholder="Describe the task in detail. What should the candidate achieve using AI?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Outcome</label>
              <p className="text-xs text-gray-500 mb-2">Describe what a successful result looks like. Used for scoring accuracy.</p>
              <textarea
                value={form.expectedOutcome}
                onChange={(e) => update("expectedOutcome", e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5B7D] focus:border-transparent resize-none"
                placeholder="What does a high-quality output look like?"
              />
            </div>
          </div>
        )}

        {/* Step 4: Scoring */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Scoring Criteria</h2>
            <p className="text-sm text-gray-600">Set the constraints that determine how candidates are evaluated.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
                <input
                  type="number"
                  value={form.maxAttempts}
                  onChange={(e) => update("maxAttempts", parseInt(e.target.value) || 1)}
                  min={1}
                  max={20}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5B7D] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Number of prompts allowed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={form.timeLimitMinutes}
                  onChange={(e) => update("timeLimitMinutes", parseInt(e.target.value) || 5)}
                  min={5}
                  max={120}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5B7D] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Total time to complete</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token Budget</label>
                <input
                  type="number"
                  value={form.tokenBudget}
                  onChange={(e) => update("tokenBudget", parseInt(e.target.value) || 500)}
                  min={500}
                  max={10000}
                  step={500}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5B7D] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Max tokens across all prompts</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Review &amp; Publish</h2>
            <p className="text-sm text-gray-600">Review your assessment details before publishing.</p>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Test Name</span>
                  <p className="font-medium text-gray-900 mt-0.5">{form.name || "Untitled Test"}</p>
                </div>
                <div>
                  <span className="text-gray-500">AI Model</span>
                  <p className="font-medium text-gray-900 mt-0.5">{form.model === "gpt-4o" ? "GPT-4o" : form.model === "claude" ? "Claude" : "Gemini"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Max Attempts</span>
                  <p className="font-medium text-gray-900 mt-0.5">{form.maxAttempts}</p>
                </div>
                <div>
                  <span className="text-gray-500">Time Limit</span>
                  <p className="font-medium text-gray-900 mt-0.5">{form.timeLimitMinutes} minutes</p>
                </div>
                <div>
                  <span className="text-gray-500">Token Budget</span>
                  <p className="font-medium text-gray-900 mt-0.5">{form.tokenBudget.toLocaleString()} tokens</p>
                </div>
              </div>
              {form.description && (
                <div className="text-sm">
                  <span className="text-gray-500">Description</span>
                  <p className="text-gray-900 mt-0.5">{form.description}</p>
                </div>
              )}
              {form.taskDescription && (
                <div className="text-sm">
                  <span className="text-gray-500">Task</span>
                  <p className="text-gray-900 mt-0.5">{form.taskDescription}</p>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="border border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Candidate Preview</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{form.name || "Untitled Test"}</h3>
              <p className="text-sm text-gray-600 mb-4">{form.description || "No description provided."}</p>
              <div className="flex gap-6 text-sm text-gray-500">
                <span>Model: {form.model === "gpt-4o" ? "GPT-4o" : form.model === "claude" ? "Claude" : "Gemini"}</span>
                <span>Time: {form.timeLimitMinutes}m</span>
                <span>Attempts: {form.maxAttempts}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              step === 0 ? "invisible" : "text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-[#1B5B7D] hover:bg-[#14455E] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Continue
            </button>
          ) : (
            <button className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm font-medium transition-colors">
              Publish Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
