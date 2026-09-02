import os
from PIL import Image

images_to_compress = [
    "assets/20191109_112944.jpg",
    "assets/20210711_163112.jpg",
    "assets/IMG_6301.JPG"
]

def compress_image(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
        
    try:
        with Image.open(path) as img:
            # Convert to RGB if it's not
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Generate new filename
            name, ext = os.path.splitext(path)
            new_path = f"{name}_min{ext}"
            
            # Resize if it's too large (e.g. limit width to 1920)
            max_size = (1920, 1920)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save with reduced quality
            img.save(new_path, "JPEG", optimize=True, quality=60)
            print(f"Successfully compressed {path} -> {new_path}")
            
            orig_size = os.path.getsize(path)
            new_size = os.path.getsize(new_path)
            print(f"Size reduction: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({(1 - new_size/orig_size)*100:.1f}%)")
            
    except Exception as e:
        print(f"Error compressing {path}: {e}")

for img_path in images_to_compress:
    compress_image(img_path)
