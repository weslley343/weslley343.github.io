import os
import json
import re
import sys

ARTICLES_DIR = 'content/content/articles'
OUTPUT_FILE = 'js/articles.json'

def parse_markdown(filepath, filename):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    metadata = {
        'filename': filename
    }

    # Strict: Extract id
    id_match = re.search(r'^id:\s*(\d+)$', content, re.MULTILINE)
    if not id_match:
        raise ValueError(f"Missing or invalid 'id:' in {filename}")
    metadata['id'] = int(id_match.group(1))

    # Strict: Extract data (date)
    data_match = re.search(r'^data:\s*(.+)$', content, re.MULTILINE)
    if not data_match:
        raise ValueError(f"Missing or invalid 'data:' in {filename}")
    metadata['date'] = data_match.group(1).strip()
        
    # Strict: Extract tags
    tags_match = re.search(r'^tags:\s*(.+)$', content, re.MULTILINE)
    if not tags_match:
        raise ValueError(f"Missing or invalid 'tags:' in {filename}")
    
    tags_str = tags_match.group(1)
    if '#' not in tags_str:
        raise ValueError(f"Tags must contain at least one '#' in {filename}")
    
    metadata['tags'] = [t.strip().replace('#', '') for t in tags_str.split() if t.startswith('#')]
            
    # Strict: Extract title from first H1
    h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if not h1_match:
        raise ValueError(f"Missing H1 title ('# Title') in {filename}")
    metadata['title'] = h1_match.group(1).strip()
            
    return metadata

def main():
    if not os.path.exists('js'):
        os.makedirs('js')

    articles = []
    
    if os.path.exists(ARTICLES_DIR):
        for filename in os.listdir(ARTICLES_DIR):
            if filename.endswith('.md'):
                filepath = os.path.join(ARTICLES_DIR, filename)
                try:
                    metadata = parse_markdown(filepath, filename)
                    articles.append(metadata)
                except Exception as e:
                    print(f"ERROR: {e}")
                    sys.exit(1)
    else:
        print(f"Directory not found: {ARTICLES_DIR}")
        sys.exit(1)
    
    # Sort by date descending
    articles.sort(key=lambda x: x['date'], reverse=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
        
    print(f"Index built successfully. {len(articles)} articles found.")

if __name__ == '__main__':
    main()
