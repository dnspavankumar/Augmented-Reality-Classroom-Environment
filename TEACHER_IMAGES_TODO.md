# Teacher Images Update Required

## Current Status
The application has been converted from a Japanese language teacher to a general science/math teacher. However, the teacher images still need to be updated.

## Required Actions

### 1. Replace Teacher Images
You need to replace the following image files in the `public/images/` directory:

- **Nanami.jpg** → Rename or replace with **Emma.jpg**
- **Naoki.jpg** → Rename or replace with **James.jpg**

### 2. Image Requirements
- **Dimensions**: 400x400 pixels (or similar square aspect ratio)
- **Format**: JPG or PNG
- **Content**: Professional-looking teacher avatars or profile pictures

### 3. Quick Fix Options

#### Option A: Rename existing files (temporary solution)
```bash
cd public/images
ren Nanami.jpg Emma.jpg
ren Naoki.jpg James.jpg
```

#### Option B: Use placeholder images
You can use free avatar services like:
- UI Avatars: `https://ui-avatars.com/api/?name=Emma&size=400`
- DiceBear: `https://api.dicebear.com/7.x/avataaars/svg?seed=Emma`

#### Option C: Add your own images
Place your custom teacher images in `public/images/` with the names:
- Emma.jpg
- James.jpg

## Testing
After updating the images, refresh your browser to see the new teacher avatars in the bottom-right corner of the application.
