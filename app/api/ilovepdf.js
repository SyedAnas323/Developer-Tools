import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function sanitizeFilename(name, fallbackName) {
  return String(name || fallbackName)
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .trim() || fallbackName;
}

export function getILovePdfKeys() {
  const publicKey = process.env.ILOVEPDF_PUBLIC_KEY?.trim();
  const secretKey = process.env.ILOVEPDF_SECRET_KEY?.trim();

  if (!publicKey || !secretKey) {
    throw new Error('Service is temporarily unavailable. Please try again.');
  }

  return { publicKey, secretKey };
}

export async function runILovePdfTask(taskType, files, processOptions = {}) {
  const { publicKey, secretKey } = getILovePdfKeys();
  const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
  const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `ilovepdf-${taskType}-`));

  try {
    const instance = new ILovePDFApi(publicKey, secretKey);
    const task = instance.newTask(taskType);

    await task.start();

    for (const [index, file] of files.entries()) {
      const tempPath = path.join(
        tempDir,
        sanitizeFilename(file.name, `${taskType}-${index + 1}`)
      );

      await fs.writeFile(tempPath, Buffer.from(await file.arrayBuffer()));
      await task.addFile(new ILovePDFFile(tempPath));
    }

    await task.process(processOptions);
    const output = await task.download();
    return Buffer.from(output);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
