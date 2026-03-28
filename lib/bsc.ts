import { delay } from './utils';

const BSC_API_URL = process.env.BSC_API_URL!;
const BSC_API_KEY = process.env.BSC_API_KEY!;

const authHeaders = {
  'x-bsc-api-key': BSC_API_KEY,
};

export interface BSCConvertJob {
  job_id: string;
  status: string;
  message: string;
  filename: string;
  polling: {
    status_url: string;
    result_url: string;
    recommended_interval: string;
  };
}

export interface BSCJobStatus {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  error?: string;
}

export async function uploadAndConvert(file: ArrayBuffer, filename: string, mimeType?: string): Promise<BSCConvertJob> {
  const ext = filename.split('.').pop()?.toLowerCase();
  const type = mimeType || {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    csv: 'text/csv',
    txt: 'text/plain',
  }[ext || ''] || 'application/octet-stream';

  const formData = new FormData();
  formData.append('file', new Blob([file], { type }), filename);

  const res = await fetch(`${BSC_API_URL}/api/v1/convert`, {
    method: 'POST',
    headers: authHeaders,
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BSC upload failed: ${res.status} ${res.statusText} — ${body}`);
  }
  return res.json();
}

export async function checkStatus(jobId: string): Promise<BSCJobStatus> {
  const res = await fetch(`${BSC_API_URL}/api/v1/status/${jobId}`, {
    headers: authHeaders,
  });

  if (!res.ok) throw new Error(`BSC status check failed: ${res.status}`);
  return res.json();
}

export async function getResult(jobId: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${BSC_API_URL}/api/v1/result/${jobId}`, {
    headers: authHeaders,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BSC result fetch failed: ${res.status} — ${body}`);
  }
  return res.json();
}

export async function waitUntilComplete(jobId: string, maxAttempts = 15): Promise<Record<string, unknown>> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkStatus(jobId);

    if (status.status === 'completed') {
      return getResult(jobId);
    }

    if (status.status === 'failed') {
      throw new Error(status.error || status.message || 'BSC processing failed');
    }

    // Poll every 5 seconds to stay well within rate limits
    await delay(5000);
  }
  throw new Error('Statement processing timed out');
}
