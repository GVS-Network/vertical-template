import axios from 'axios';

import api from '../../../services/api';
import type {
  AssetRef,
  MediaUploadPurpose,
  MediaUploadResponse,
} from '../../../types/asset-ref';

function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : 'Upload failed';
}

export async function uploadMediaAsset(
  file: File,
  purpose: MediaUploadPurpose,
  context?: string
): Promise<AssetRef> {
  const form = new FormData();
  form.append('file', file);
  form.append('purpose', purpose);
  if (context?.trim()) {
    form.append('context', context.trim());
  }

  try {
    const { data } = await api.post<MediaUploadResponse>('/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  } catch (err) {
    throw new Error(apiErrorMessage(err));
  }
}

export type { MediaUploadPurpose } from '../../../types/asset-ref';
