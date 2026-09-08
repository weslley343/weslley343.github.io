#!/usr/bin/env python3
"""
Script to create binarized (black & white) copies of all images in the assets folder while preserving original files.
"""

import os
from PIL import Image

VALID_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP')

def get_otsu_threshold(gray_img):
    """
    Computes optimal threshold using Otsu's binarization method.
    """
    histogram = gray_img.histogram()
    total_pixels = sum(histogram)
    
    current_max = 0.0
    threshold = 128
    sum_total = sum(i * count for i, count in enumerate(histogram))
    sum_background = 0
    weight_background = 0
    
    for i in range(256):
        weight_background += histogram[i]
        if weight_background == 0:
            continue
        weight_foreground = total_pixels - weight_background
        if weight_foreground == 0:
            break
            
        sum_background += i * histogram[i]
        mean_background = sum_background / weight_background
        mean_foreground = (sum_total - sum_background) / weight_foreground
        
        between_variance = weight_background * weight_foreground * ((mean_background - mean_foreground) ** 2)
        if between_variance > current_max:
            current_max = between_variance
            threshold = i
            
    return threshold

def process_assets_folder(assets_dir):
    if not os.path.exists(assets_dir):
        print(f"Error: Assets directory not found at {assets_dir}")
        return

    files = sorted(os.listdir(assets_dir))
    processed_count = 0

    for filename in files:
        if not filename.endswith(VALID_EXTENSIONS):
            continue
        
        # Skip files that are already binarized copies
        if '_bin' in filename:
            continue

        file_path = os.path.join(assets_dir, filename)
        if not os.path.isfile(file_path):
            continue

        name, ext = os.path.splitext(filename)
        output_filename = f"{name}_bin{ext}"
        output_path = os.path.join(assets_dir, output_filename)

        try:
            with Image.open(file_path) as img:
                gray = img.convert('L')
                threshold = get_otsu_threshold(gray)
                bin_img = gray.point(lambda p: 255 if p > threshold else 0, mode='1').convert('L')
                
                # Save binarized image
                if ext.lower() == '.webp':
                    bin_img.save(output_path, 'WEBP', quality=85)
                elif ext.lower() in ('.jpg', '.jpeg'):
                    bin_img.save(output_path, 'JPEG', quality=85)
                else:
                    bin_img.save(output_path)

                print(f"[SUCCESS] Processed: {filename} -> {output_filename} (Threshold: {threshold})")
                processed_count += 1
        except Exception as e:
            print(f"[ERROR] Failed to binarize {filename}: {e}")

    print(f"\nCompleted: {processed_count} images binarized. Originals preserved.")

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_directory = os.path.join(current_dir, 'assets')
    process_assets_folder(assets_directory)
