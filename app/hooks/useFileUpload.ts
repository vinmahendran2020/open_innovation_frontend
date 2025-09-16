import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UploadResponse {
  success: boolean;
  message: string;
  recordsProcessed?: number;
  fileName?: string;
}

interface UploadError {
  message: string;
  status?: number;
}

const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:3001/air-quality/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message?.message || errorData.message || `Upload failed with status ${response.status}`);
  }

  return response.json();
};

export const useFileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadResponse, UploadError, File>({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['airQualityData'] });
      
      console.log('File uploaded successfully:', data);
    },
    onError: (error) => {
      console.error('Upload error:', error);
    }
  });
};

export default useFileUpload;