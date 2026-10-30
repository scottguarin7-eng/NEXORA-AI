export function routeMode({ selectedMode, message, hasFile, hasImage }) {
  if (selectedMode === "fast") {
    return "fast";
  }

  if (selectedMode === "deep") {
    return "deep";
  }

  if (selectedMode === "vision") {
    return "vision";
  }

  if (hasFile || hasImage) {
    return "vision";
  }

  if (
    message.length > 500 ||
    /research|analyze|compare|code|build|plan|explain deeply/i.test(message)
  ) {
    return "deep";
  }

  return "fast";
}
