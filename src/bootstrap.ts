// Keep startup independent of application imports so their failures can be shown.
export {};

try {
    await import("./main");
} catch (error) {
    console.error("Application startup failed", error);
    const loading = document.querySelector<HTMLElement>("#startup-loading");
    const errorPanel = document.querySelector<HTMLElement>("#startup-error");
    if (loading) loading.hidden = true;
    if (errorPanel) errorPanel.hidden = false;
}
