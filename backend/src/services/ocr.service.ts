import { createWorker, Worker, PSM } from "tesseract.js";

let workerPromise: Promise<Worker> | null = null;
let queue: Promise<unknown> = Promise.resolve();

/** One shared worker (loading the language data is slow). */
function getWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const w = await createWorker("eng"); // downloads eng.traineddata on first run
      await w.setParameters({
        // MRZ only contains A-Z, 0-9 and the filler "<"
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<",
        tessedit_pageseg_mode: PSM.SPARSE_TEXT,
        preserve_interword_spaces: "0",
      });
      return w;
    })();
  }
  return workerPromise;
}

/** Runs OCR jobs one at a time – a Tesseract worker is not re-entrant. */
export function recognize(image: Buffer): Promise<string> {
  const job = queue.then(async () => (await (await getWorker()).recognize(image)).data.text);
  queue = job.catch(() => undefined);
  return job;
}
