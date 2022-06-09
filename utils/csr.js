export const runOnClient = (func) => {
  if (typeof window !== "undefined") {
    if (window.document.readyState == "loading") {
      window.addEventListener("load", func);
    } else {
      func();
    }
  }
};
