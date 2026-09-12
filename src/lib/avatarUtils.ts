/**
 * Avatar Processing & Upload Utilities
 * Provides square center-cropping, canvas compression, and progress tracking.
 */

export interface ProcessedAvatar {
  dataUrl: string;
  blob: Blob;
  sizeBytes: number;
}

/**
 * Center-crops any image to 1:1 square aspect ratio and compresses to JPEG
 */
export async function processAndCropAvatar(
  file: File,
  targetDimension: number = 256
): Promise<ProcessedAvatar> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (JPG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetDimension;
          canvas.height = targetDimension;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas 2D context unavailable.'));
            return;
          }

          // Center crop calculation
          const minSide = Math.min(img.width, img.height);
          const startX = (img.width - minSide) / 2;
          const startY = (img.height - minSide) / 2;

          // Clear background and draw smoothed image
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(
            img,
            startX,
            startY,
            minSide,
            minSide,
            0,
            0,
            targetDimension,
            targetDimension
          );

          // Export as compressed JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  dataUrl,
                  blob,
                  sizeBytes: blob.size,
                });
              } else {
                reject(new Error('Failed to compress avatar.'));
              }
            },
            'image/jpeg',
            0.85
          );
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads processed avatar to backend storage with simulated progress feedback
 */
export async function uploadAvatarToServer(
  uid: string,
  dataUrl: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (onProgress) onProgress(15);

  // Short progress step for optical feedback
  await new Promise((r) => setTimeout(r, 120));
  if (onProgress) onProgress(45);

  const res = await fetch('/api/upload/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid,
      image: dataUrl,
    }),
  });

  if (onProgress) onProgress(80);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload avatar image.');
  }

  const result = await res.json();
  if (onProgress) onProgress(100);

  return result.url;
}
