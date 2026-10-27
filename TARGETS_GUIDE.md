# MIARIS — AR Image Target Preparation Guide

This guide explains how to prepare medicine-package reference images and compile them into a MindAR-compatible `.mind` target file for use in the MIARIS scanner.

---

## What Is a `.mind` File?

A `.mind` file is MindAR's proprietary binary format that stores pre-computed image feature descriptors. It is **not** a plain image file. MindAR cannot track arbitrary images at runtime — images must be compiled into a `.mind` file first, and the compiled file placed at `public/targets/targets.mind` before the scanner will work.

---

## Target Index → Medicine Mapping

The order you upload images to the compiler determines each image's `targetIndex`. This must match the mapping in [`src/features/ar/targetMappings.ts`](src/features/ar/targetMappings.ts):

| Target Index | Medicine ID | Medicine Name         |
|:---:|---|---|
| 0 | med-001 | Paracetamol (Biogesic) |
| 1 | med-002 | Amoxicillin (Amoxil)   |
| 2 | med-003 | Losartan (Cozaar)      |
| 3 | med-004 | Metformin (Glucophage) |
| 4 | med-005 | Cetirizine (Zyrtec)    |
| 5 | med-006 | Omeprazole (Prilosec)  |

> **Important:** Upload images in the exact order above. If you reorder them, you must update `targetMappings.ts` to match.

---

## Step 1 — Prepare Reference Images

Good reference images produce reliable tracking. Follow these guidelines:

### Image Requirements
- **Format:** JPEG or PNG
- **Minimum resolution:** 500 × 500 px (higher is better — 1000 × 1000 px recommended)
- **Content:** Front face of the medicine package (box, blister pack, or bottle label)
- **Lighting:** Even, diffuse lighting — avoid strong shadows or glare
- **Angle:** Flat/orthographic — photograph straight-on, not at an angle
- **Background:** Avoid busy backgrounds; neutral or white is best

### What Makes a Good Target
- Rich texture with many distinct features (text, logos, graphics, barcodes)
- High contrast between different regions
- No large uniform-color areas (plain white boxes with no printing track poorly)
- Avoid reflective surfaces (foil, glossy plastic) — they cause inconsistent features

### What to Photograph
For each of the 6 demo medicines, photograph the **front panel** of the actual package (or a high-quality printed/screen image of the packaging). Name your files clearly:

```
0_paracetamol_biogesic.jpg
1_amoxicillin_amoxil.jpg
2_losartan_cozaar.jpg
3_metformin_glucophage.jpg
4_cetirizine_zyrtec.jpg
5_omeprazole_prilosec.jpg
```

---

## Step 2 — Compile with the MindAR Online Compiler

No local installation is required for compilation.

1. Open the **MindAR Image Target Compiler**:  
   👉 **https://hiukim.github.io/mind-ar-js-doc/tools/compile**

2. Click **"Upload Images"** and select all 6 images **in index order** (0 through 5).

3. Wait for the compiler to finish processing (may take 30–120 seconds depending on image count and size).

4. Click **"Export"** or **"Download"** to save the compiled file.  
   The downloaded file will be named `targets.mind`.

5. Place the file at:
   ```
   public/targets/targets.mind
   ```

---

## Step 3 — Verify the File Is in Place

After placing the file, confirm:

```powershell
Test-Path "public\targets\targets.mind"
# Should print: True
```

The scanner checks for this file when you press **Start Scan**. If it is missing or corrupted, you will see:

> _"AR target file not found at /targets/targets.mind. Compile targets first (see TARGETS_GUIDE.md)."_

---

## Step 4 — Run the App Locally

### Desktop (localhost — no HTTPS needed)

```powershell
npm.cmd run dev
```

Open **http://localhost:5173** in Chrome or Edge. Camera access works on `localhost` without HTTPS.

Navigate to **Scanner** → click **Start Scan** → point your camera at one of the reference images.

### Phone Testing (LAN — requires the `--host` flag)

`getUserMedia` requires a secure context (`https://`) on non-localhost origins. Use one of these options:

#### Option A — Vite `--host` on the same Wi-Fi network

```powershell
npm.cmd run dev -- --host
```

Vite will print your local network IP, e.g.:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.42:5173/
```

Open the **Network** URL in Chrome on your phone. Note that plain `http://` over LAN **will not** grant camera access on modern Android/iOS — you need HTTPS.

#### Option B — Use a local HTTPS proxy (recommended for phone testing)

Install and run **Caddy** or **mkcert + local-ssl-proxy** to proxy the Vite dev server over HTTPS:

```powershell
# Install mkcert (one-time)
winget install FiloSottile.mkcert
mkcert -install

# Create a local cert for your LAN IP
mkcert 192.168.1.42   # replace with your actual LAN IP

# Install local-ssl-proxy
npm.cmd install -g local-ssl-proxy

# Start Vite (no --host needed)
npm.cmd run dev

# In a second terminal, start the HTTPS proxy
local-ssl-proxy --source 5174 --target 5173 --cert 192.168.1.42.pem --key 192.168.1.42-key.pem
```

Open **https://192.168.1.42:5174** on your phone. Accept the certificate warning (it is self-signed for LAN use only).

#### Option C — Deploy to a public HTTPS host

Deploy the production build to Netlify, Vercel, or Firebase Hosting. Camera access works automatically over HTTPS.

```powershell
npm.cmd run build
# Then deploy the dist/ folder
```

---

## Testing Checklist

### ✅ Test: Successful Recognition

1. Print out (or display on a second screen) the **same reference image** you uploaded to the compiler.
2. Open Scanner → Start Scan.
3. Point the camera at the reference image.
4. The AR overlay card should appear with the medicine's name and information.
5. Tap **Full Info** to confirm navigation to the correct Medicine Details page.

### ✅ Test: Unregistered Target

1. Point the camera at any **other** image (a different medicine box, a book cover, etc.).
2. MindAR may detect motion but should **not** show any medicine overlay.
3. If a registered image is detected first, then you show a non-registered target, the overlay stays visible until you dismiss it (expected behaviour — `onTargetLost` fires but the card persists intentionally).

### ✅ Test: Permission Denied

1. Deny camera access when prompted (or block camera in browser site settings).
2. The scanner should show:  
   _"Camera permission denied. Please allow camera access in your browser and reload."_
3. A **Manual Search** fallback should remain visible.

### ✅ Test: No Target File

1. Temporarily rename `public/targets/targets.mind` to `targets.mind.bak`.
2. Click Start Scan.
3. The error message should mention the missing target file and reference this guide.
4. Restore the file.

### ✅ Test: Stop / Cleanup

1. Click **Start Scan**, wait for it to start.
2. Click **Stop Scan**.
3. Confirm the camera indicator in your browser's address bar disappears (camera released).
4. Navigate away from the Scanner page — confirm the camera is released.

---

## Updating the Target Mappings

If you add more medicines or want to test with a smaller set:

1. Edit [`src/data/medicines.ts`](src/data/medicines.ts) to add new medicine records.
2. Edit [`src/features/ar/targetMappings.ts`](src/features/ar/targetMappings.ts) to add entries:
   ```ts
   { targetIndex: 6, medicineId: 'med-007' },
   ```
3. Add the corresponding reference image at index position 6 in a new `.mind` compilation run.
4. Replace `public/targets/targets.mind` with the new compiled file.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Scanner shows "AR target file not found" | Place compiled `targets.mind` at `public/targets/targets.mind` |
| Camera not starting on phone | Ensure you are using HTTPS (not plain HTTP over LAN) |
| Target detected but wrong medicine shown | Check that image upload order matches `targetMappings.ts` |
| Very slow or no detection | Improve reference image quality (more texture, better lighting, higher resolution) |
| Build error about MindAR | Ensure `three` is pinned to `^0.150.1` in `package.json` — newer Three.js breaks MindAR 1.2.5 |
| `canvas` npm install error | Install with `npm.cmd install mind-ar --ignore-scripts` — `canvas` is not needed for browser use |

---

## Important Disclaimer

MIARIS image recognition **only identifies registered medicine package images** — it does not verify that a scanned package contains the correct medicine, check for counterfeits, or assess the safety of any actual medication. Always consult a licensed healthcare professional or pharmacist before taking any medicine.

