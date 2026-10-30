export const AI_MODES = {
  auto: {
    id: "auto",
    label: "Auto Neural",
    description: "Automatically chooses the best Gemini route",
    icon: "✦",
    type: "adaptive",
  },

  fast: {
    id: "fast",
    label: "Fast Response",
    description: "Low-latency answers for everyday tasks",
    icon: "⚡",
    type: "text",
  },

  deep: {
    id: "deep",
    label: "Deep Reasoning",
    description: "Complex planning, coding, and analysis",
    icon: "◆",
    type: "reasoning",
  },

  vision: {
    id: "vision",
    label: "Vision Fusion",
    description: "Understands images, PDFs, and screenshots",
    icon: "◎",
    type: "multimodal",
  },
};
