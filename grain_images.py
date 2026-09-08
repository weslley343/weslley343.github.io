#!/usr/bin/env python3
"""
Script to create heavy-grain grayscale copies of all original images in the assets folder using pure Python & PIL while preserving original files.
"""

import os
import random
from PIL import Image

VALID_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP')

def add_heavy_film_grain(gray_img, intensity=38):
    """
    Applies authentic heavy film grain noise to a grayscale image using Gaussian noise.
    """
    gray_img = gray_img.convert('L')
    pixels = list(gray_img.getdata())
    
    grained_pixels = []
    for p in pixels:
        noise = random.gauss(0, intensity)
        val = int(p + noise)
        grained_pixels.append(max(0, min(255, val)))
        
    grained_img = Image.new('L', gray_img.size)
    grained_img.putdata(grained_pixels)
    return grained_img

def process_assets_folder(assets_dir, intensity=38):
    if not os.path.exists(assets_dir):
        print(f"Error: Assets directory not found at {assets_dir}")
        return

    files = sorted(os.listdir(assets_dir))
    processed_count = 0

    for filename in files:
        if not filename.endswith(VALID_EXTENSIONS):
            continue
        
        # Skip derivative files (already binarized or already grained)
        if '_bin' in filename or '_grain' in filename:
            continue

        file_path = os.path.join(assets_dir, filename)
        if not os.path.isfile(file_path):
            continue

        name, ext = os.path.splitext(filename)
        output_filename = f"{name}_grain{ext}"
        output_path = os.path.join(assets_dir, output_filename)

        try:
            with Image.open(file_path) as img:
                gray = img.convert('L')
                grained_img = add_heavy_film_grain(gray, intensity=intensity)
                
                # Save grained grayscale image
                if ext.lower() == '.webp':
                    grained_img.save(output_path, 'WEBP', quality=90)
                elif ext.lower() in ('.jpg', '.jpeg'):
                    grained_img.save(output_path, 'JPEG', quality=90)
                else:
                    grained_img.save(output_path)

                print(f"[SUCCESS] Processed: {filename} -> {output_filename} (Grain Intensity: {intensity})")
                processed_count += 1
        except Exception as e:
            print(f"[ERROR] Failed to process {filename}: {e}")

    print(f"\nCompleted: {processed_count} grainy grayscale images created. Originals preserved.")

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_directory = os.path.join(current_dir, 'assets')
    process_assets_folder(assets_directory, intensity=38)
