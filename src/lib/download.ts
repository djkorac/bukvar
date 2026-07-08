/**
 * Trigger a browser download of an in-memory text payload. Browser-only view
 * helper: the blob/anchor/revoke dance for "save this string as a file", kept
 * in one place so the backup export and the backup nudge share it.
 */
export const downloadTextFile = (
  filename: string,
  contents: string,
  type = "application/json",
): void => {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  // Attach before clicking: older Firefox and some embedded WebViews ignore a
  // programmatic click on an anchor that isn't in the document. Append/click/
  // remove all run synchronously, so nothing paints between them.
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Defer revocation: revoking synchronously can win the race against the
  // browser's async blob read and abort the download (notably Safari/iOS
  // WebKit). The exact delay isn't critical. Any later task fixes the
  // ordering; the object URL is GC'd on document unload regardless.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
