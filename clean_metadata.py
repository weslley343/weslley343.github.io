import os
from PIL import Image

def remove_metadata(filepath):
    try:
        with Image.open(filepath) as img:
            # Check for EXIF data
            exif = img.getexif()
            if not exif and 'exif' not in img.info:
                print(f"[-] No EXIF metadata found: {filepath}")
                return

            # Create a new image with the same mode and size to drop metadata
            clean_img = Image.new(img.mode, img.size)
            clean_img.paste(img)
            
            # Preserve color profile if it exists (important for colors not to look washed out)
            icc = img.info.get('icc_profile')
            
            # We save the file, replacing the original.
            # Using quality='keep' preserves the original JPEG quality if possible (pillow 9.4+).
            # Otherwise, use a high quality default.
            if icc:
                clean_img.save(filepath, icc_profile=icc, quality=95)
            else:
                clean_img.save(filepath, quality=95)

            print(f"[+] Cleaned metadata: {filepath}")
            
    except Exception as e:
        print(f"[x] Error processing {filepath}: {e}")

def process_assets_folder(folder_path):
    print(f"Scanning directory: {folder_path}\n")
    valid_exts = ('.jpg', '.jpeg', '.png', '.webp', '.tiff')
    
    count = 0
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(valid_exts):
                filepath = os.path.join(root, file)
                remove_metadata(filepath)
                count += 1
                
    print(f"\nDone. Processed {count} images.")

if __name__ == "__main__":
    # Pointing to the "assets" folder relative to this script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(current_dir, 'assets')
    
    if os.path.exists(assets_dir):
        process_assets_folder(assets_dir)
    else:
        print(f"Assets directory not found at: {assets_dir}")
