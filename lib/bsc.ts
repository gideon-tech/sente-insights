import { BSCUploadResponse, BSCConvertResponse } from '@/types';
import { delay } from './utils';

const BSC_API_URL = process.env.BSC_API_URL!;
const BSC_API_KEY = process.env.BSC_API_KEY!;

const headers = {
  Authorization: BSC_API_KEY,
};

export async function uploadStatement(file: ArrayBuffer, filename: string): Promise<BSCUploadResponse[]> {
  const formData = new FormData();
  formData.append('file', new Blob([file]), filename);

  const res = await fetch(`${BSC_API_URL}/BankStatement`, {
    method: 'POST',
    headers: { Authorization: BSC_API_KEY },
    body: formData,
  });

  if (!res.ok) throw new Error(`BSC upload failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function setPassword(uuid: string, password: string): Promise<void> {
  const res = await fetch(`${BSC_API_URL}/BankStatement/setPassword`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ passwords: [{ uuid, password }] }),
  });

  if (!res.ok) throw new Error(`BSC setPassword failed: ${res.status}`);
}

export async function checkStatus(uuid: string): Promise<string> {
  const res = await fetch(`${BSC_API_URL}/BankStatement/status`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify([uuid]),
  });

  if (!res.ok) throw new Error(`BSC status check failed: ${res.status}`);
  const data = await res.json();
  return data[0]?.state || 'PROCESSING';
}

export async function waitUntilReady(uuid: string, maxAttempts = 12): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const state = await checkStatus(uuid);
    if (state === 'READY') return;
    await delay(10000);
  }
  throw new Error('Statement processing timed out after 2 minutes');
}

export async function convertStatement(uuid: string, format = 'JSON'): Promise<BSCConvertResponse[]> {
  const res = await fetch(`${BSC_API_URL}/BankStatement/convert?format=${format}&raw=false`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify([uuid]),
  });

  if (!res.ok) throw new Error(`BSC convert failed: ${res.status}`);
  return res.json();
}

export async function checkCredits(): Promise<{ paidCredits: number; freeCredits: number }> {
  const res = await fetch(`${BSC_API_URL}/user`, { headers });

  if (!res.ok) throw new Error(`BSC credits check failed: ${res.status}`);
  const data = await res.json();
  return data.credits;
}
