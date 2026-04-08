/**
 * Pre-processes a receipt image before OCR to improve accuracy.
 * Steps: grayscale → auto-contrast → sharpen → output as base64 PNG
 */
export const preprocessImage = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // 1. Resize image to prevent OOM (Aw Snap) and speed up OCR
      const MAX_DIMENSION = 1500;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));

      // 2. Draw original image resized
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 2. Convert to Grayscale
      for (let i = 0; i < data.length; i += 4) {
        // Luminance formula (perceived brightness)
        const gray =
          0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      // 3. Auto-Contrast (stretch histogram to 0–255 range)
      let min = 255;
      let max = 0;

      for (let i = 0; i < data.length; i += 4) {
        const v = data[i];
        if (v < min) min = v;
        if (v > max) max = v;
      }

      const range = max - min || 1;

      for (let i = 0; i < data.length; i += 4) {
        const adjusted = Math.round(((data[i] - min) / range) * 255);
        data[i] = adjusted;
        data[i + 1] = adjusted;
        data[i + 2] = adjusted;
      }

      ctx.putImageData(imageData, 0, 0);

      // 4. Sharpen using a convolution kernel
      const sharpened = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const src2 = new Uint8ClampedArray(sharpened.data);
      const w = canvas.width;
      const h = canvas.height;

      // Sharpen kernel: amplifies center, subtracts neighbors
      const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;

          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const sIdx = ((y + ky) * w + (x + kx)) * 4;
              const k = kernel[(ky + 1) * 3 + (kx + 1)];
              sum += src2[sIdx] * k;
            }
          }

          const val = Math.min(255, Math.max(0, sum));
          sharpened.data[idx] = val;
          sharpened.data[idx + 1] = val;
          sharpened.data[idx + 2] = val;
        }
      }

      ctx.putImageData(sharpened, 0, 0);

      // 5. Return as high-quality PNG Base64
      resolve(canvas.toDataURL("image/png", 1.0));
    };

    img.onerror = reject;
    img.src = src;
  });
};
