import QRCode from "qrcode";

/**
 * Converts a Blob to a base64 Data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert blob to data URL string"));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Safely fetches any remote image and converts it to a base64 Data URL.
 * Multi-layer fallback: Direct CORS fetch -> Next.js Image Proxy -> HTML5 Canvas draw.
 * Guarantee: Zero tainted canvas issues when passed to html2canvas.
 */
export async function fetchImageAsDataUrl(url: string): Promise<string> {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // Layer 1: Direct CORS fetch
  try {
    const res = await fetch(url, { mode: "cors", cache: "force-cache" });
    if (res.ok) {
      const blob = await res.blob();
      return await blobToDataUrl(blob);
    }
  } catch (directErr) {
    console.warn("Direct CORS fetch failed for badge image, falling back to proxy:", directErr);
  }

  // Layer 2: Next.js Server-side Image Proxy
  try {
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const blob = await res.blob();
      return await blobToDataUrl(blob);
    }
  } catch (proxyErr) {
    console.warn("Image proxy fetch failed, falling back to Canvas draw:", proxyErr);
  }

  // Layer 3: Image element crossOrigin draw fallback
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 300;
        canvas.height = img.naturalHeight || img.height || 300;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not acquire 2D context");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (canvasErr) {
        reject(canvasErr);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
    img.src = url;
  });
}

/**
 * Preprocesses all <img> elements inside a DOM element by replacing external URLs
 * with local base64 Data URLs so html2canvas never encounters CORS/tainted canvases.
 * Returns a restoration function to revert the DOM once rasterization is complete.
 */
export async function preprocessCardImages(container: HTMLElement): Promise<() => void> {
  const images = Array.from(container.querySelectorAll("img"));
  const originalSources = new Map<HTMLImageElement, string>();

  await Promise.all(
    images.map(async (img) => {
      const currentSrc = img.src;
      if (!currentSrc || currentSrc.startsWith("data:")) return;

      originalSources.set(img, currentSrc);

      try {
        const dataUrl = await fetchImageAsDataUrl(currentSrc);
        if (dataUrl) {
          img.src = dataUrl;
          // Ensure image is decoded before html2canvas inspects it
          if (img.decode) {
            await img.decode().catch(() => {});
          }
        }
      } catch (err) {
        console.error("Failed to inline image for ID card rasterization:", currentSrc, err);
      }
    })
  );

  // Return cleanup/restore callback
  return () => {
    originalSources.forEach((originalSrc, img) => {
      img.src = originalSrc;
    });
  };
}

/**
 * Generates an offline base64 Data URL for a QR Code
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 240,
      margin: 1,
      color: {
        dark: "#0B192C",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("Failed to generate offline QR code Data URL:", err);
    // Fallback to external qrserver if library fails
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  }
}

export interface BadgeDrawData {
  teacherName: string;
  teacherId: string;
  qualification?: string;
  institution?: string;
  locality?: string;
  subjectsDisplay?: string;
  classesDisplay?: string;
  isVerified?: boolean;
  validUntil: string;
  qrDataUrl: string;
  photoUrl?: string | null;
}

/**
 * Pure HTML5 Canvas 2D Rasterizer Fallback
 * Generates a pixel-perfect, crisp 640x980 official badge if html2canvas ever encounters errors.
 */
export async function drawBadgeCanvasFallback(data: BadgeDrawData): Promise<string> {
  const width = 640;
  const height = 980;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create 2D canvas context for ID card fallback");
  }

  // Enable crisp text rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Rounded rectangle helper
  function drawRoundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    fill?: string,
    stroke?: string,
    lineWidth: number = 1
  ) {
    ctx!.beginPath();
    ctx!.moveTo(x + radius, y);
    ctx!.lineTo(x + w - radius, y);
    ctx!.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx!.lineTo(x + w, y + h - radius);
    ctx!.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx!.lineTo(x + radius, y + h);
    ctx!.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx!.lineTo(x, y + radius);
    ctx!.quadraticCurveTo(x, y, x + radius, y);
    ctx!.closePath();
    if (fill) {
      ctx!.fillStyle = fill;
      ctx!.fill();
    }
    if (stroke) {
      ctx!.strokeStyle = stroke;
      ctx!.lineWidth = lineWidth;
      ctx!.stroke();
    }
  }

  // 1. Outer Badge Background & Border
  drawRoundedRect(0, 0, width, height, 32, "#FFFFFF", "#0B192C", 6);

  // 2. Top Security Strip (Gold & Navy)
  const gradStrip = ctx.createLinearGradient(0, 0, width, 0);
  gradStrip.addColorStop(0, "#E5A93C");
  gradStrip.addColorStop(0.5, "#1E3E62");
  gradStrip.addColorStop(1, "#E5A93C");
  ctx.fillStyle = gradStrip;
  ctx.fillRect(4, 4, width - 8, 10);

  // 3. Header Background (Deep Oxford Navy #0B192C)
  ctx.fillStyle = "#0B192C";
  ctx.fillRect(4, 14, width - 8, 140);

  // Header Logo Badge 'S'
  ctx.beginPath();
  ctx.arc(150, 60, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#E5A93C";
  ctx.fill();
  ctx.fillStyle = "#0B192C";
  ctx.font = "bold 20px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", 150, 60);

  // Header Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 22px serif";
  ctx.textAlign = "left";
  ctx.fillText("SWATI HOME TUITION BUREAU", 180, 62);

  // Subtitle
  ctx.fillStyle = "#FDE68A";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GOVERNMENT REGISTERED FACULTY ID · PATNA", width / 2, 98);

  // ESTD and REG tags
  drawRoundedRect(170, 114, 110, 26, 6, "rgba(255, 255, 255, 0.15)");
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("ESTD. 2014", 225, 131);

  drawRoundedRect(300, 114, 170, 26, 6, "rgba(229, 169, 60, 0.2)");
  ctx.fillStyle = "#E5A93C";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("BIHAR ACADEMIC REG.", 385, 131);

  // 4. Card Body Background
  ctx.fillStyle = "#FBFBF9";
  ctx.fillRect(4, 154, width - 8, height - 230);

  // 5. Profile Photo or Avatar
  const photoSize = 160;
  const photoX = (width - photoSize) / 2;
  const photoY = 175;

  let photoRendered = false;
  if (data.photoUrl) {
    try {
      const photoDataUrl = await fetchImageAsDataUrl(data.photoUrl);
      const img = new Image();
      img.src = photoDataUrl;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej();
      });

      // Photo frame with gold border
      drawRoundedRect(photoX - 4, photoY - 4, photoSize + 8, photoSize + 8, 20, "#FFFFFF", "#E5A93C", 4);

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoSize, photoSize, 16);
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
      ctx.restore();
      photoRendered = true;
    } catch {
      photoRendered = false;
    }
  }

  if (!photoRendered) {
    // Initials fallback
    drawRoundedRect(photoX - 4, photoY - 4, photoSize + 8, photoSize + 8, 20, "#FFFFFF", "#E5A93C", 4);
    drawRoundedRect(photoX, photoY, photoSize, photoSize, 16, "#0B192C");
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 64px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((data.teacherName || "T").charAt(0).toUpperCase(), width / 2, photoY + photoSize / 2);
  }

  // Verified Checkmark overlay
  if (data.isVerified) {
    const sealX = photoX + photoSize - 8;
    const sealY = photoY + photoSize - 8;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#059669";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✓", sealX, sealY + 1);
  }

  // 6. Identity Information
  ctx.fillStyle = "#0B192C";
  ctx.font = "bold 28px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(data.teacherName, width / 2, 385);

  // ID Badge Pill
  const idPillText = `ID: ${data.teacherId}`;
  drawRoundedRect(width / 2 - 80, 400, 160, 28, 6, "rgba(11, 25, 44, 0.08)", "rgba(11, 25, 44, 0.15)");
  ctx.fillStyle = "#1E3E62";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(idPillText, width / 2, 419);

  // Qualification
  const qualText = [data.qualification || "Faculty Member", data.institution].filter(Boolean).join(" · ");
  ctx.fillStyle = "#1E3E62";
  ctx.font = "600 15px sans-serif";
  ctx.fillText(qualText, width / 2, 452);

  // Verification Status Pill
  if (data.isVerified) {
    drawRoundedRect(width / 2 - 130, 468, 260, 30, 15, "#ECFDF5", "#6EE7B7", 1.5);
    ctx.fillStyle = "#065F46";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("🛡 AUTHORIZED VERIFIED FACULTY", width / 2, 488);
  } else {
    drawRoundedRect(width / 2 - 120, 468, 240, 30, 15, "#FFFBEB", "#FCD34D", 1.5);
    ctx.fillStyle = "#92400E";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("⚠ VERIFICATION IN REVIEW", width / 2, 488);
  }

  // 7. Teaching Matrix Box
  const boxX = 40;
  const boxY = 515;
  const boxW = width - 80;
  const boxH = 120;
  drawRoundedRect(boxX, boxY, boxW, boxH, 16, "#FFFFFF", "#E8E6DF", 1.5);

  const drawMatrixRow = (label: string, val: string, yPos: number) => {
    ctx.fillStyle = "#5A6578";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label.toUpperCase(), boxX + 16, yPos);

    ctx.fillStyle = "#0B192C";
    ctx.font = "600 13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(val, boxX + boxW - 16, yPos);
  };

  drawMatrixRow("Subjects:", data.subjectsDisplay || "All Subjects", boxY + 34);
  drawMatrixRow("Classes:", data.classesDisplay || "Classes 1-12", boxY + 68);
  drawMatrixRow("Patna Locality:", data.locality || "Patna", boxY + 102);

  // 8. Lower Security Row: Validity, Stamp, and QR
  const secY = 660;

  // Validity info
  ctx.fillStyle = "#5A6578";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("VALID THROUGH", 44, secY + 20);

  ctx.fillStyle = "#0B192C";
  ctx.font = "bold 18px monospace";
  ctx.fillText(data.validUntil, 44, secY + 45);

  ctx.fillStyle = "#5A6578";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`SEC: ${(data.teacherId || "SWATI2026").slice(0, 10).toUpperCase()}`, 44, secY + 70);

  // Bureau Stamp Circle
  const stampX = 310;
  const stampY = secY + 42;
  ctx.save();
  ctx.translate(stampX, stampY);
  ctx.rotate(-0.1);
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(254, 243, 199, 0.4)";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "rgba(30, 62, 98, 0.6)";
  ctx.stroke();

  ctx.fillStyle = "#1E3E62";
  ctx.font = "900 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SWATI HTB", 0, -16);

  ctx.fillStyle = "#E5A93C";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("★ AUTH STAMP ★", 0, 0);

  ctx.fillStyle = "#0B192C";
  ctx.font = "900 10px sans-serif";
  ctx.fillText("PATNA REG.", 0, 18);
  ctx.restore();

  // QR Code
  const qrSize = 100;
  const qrX = width - 44 - qrSize;
  const qrY = secY - 5;
  drawRoundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 12, "#FFFFFF", "rgba(11, 25, 44, 0.2)");

  try {
    const qrImg = new Image();
    qrImg.src = data.qrDataUrl;
    await new Promise<void>((res, rej) => {
      qrImg.onload = () => res();
      qrImg.onerror = () => rej();
    });
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  } catch (qrErr) {
    console.warn("Could not draw QR code onto fallback canvas:", qrErr);
  }

  // 9. Card Footer (Deep Oxford Navy #0B192C) with Social Badges
  const footerY = height - 90;
  ctx.fillStyle = "#0B192C";
  ctx.fillRect(4, footerY, width - 8, 86);

  // Gold separator line
  ctx.fillStyle = "#E5A93C";
  ctx.fillRect(4, footerY, width - 8, 2);

  // Social & GBP Badges Row
  ctx.fillStyle = "#FDE68A";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("★ GBP Verified · 4.9 Rating", 24, footerY + 28);

  ctx.textAlign = "right";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px monospace";
  ctx.fillText("IG: @swati_home_tuition", width - 24, footerY + 28);

  // Verification Prompt Text
  ctx.fillStyle = "#D1D5DB";
  ctx.font = "normal 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scan QR code or visit swatihometuition.in to verify faculty identity.", width / 2, footerY + 58);

  return canvas.toDataURL("image/png");
}
