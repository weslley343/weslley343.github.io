import os
import json
import re
import sys

ARTICLES_DIR = 'content/content/articles'
ARTICLES_OUTPUT = 'js/articles.json'

PROJECTS_DIR = 'content/content/projects'
PROJECTS_OUTPUT = 'js/projects.json'

THEME_FILE = 'content/config/theme.json'
THEME_OUTPUT = 'css/common/theme.css'

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
            
    # Extract title from frontmatter, fallback to H1
    title_match = re.search(r'^title:\s*(.+)$', content, re.MULTILINE)
    if title_match:
        title_raw = title_match.group(1).strip()
        # Remove surrounding quotes and leading #
        title_raw = title_raw.strip('"\'')
        if title_raw.startswith('# '):
            title_raw = title_raw[2:]
        metadata['title'] = title_raw.strip()
    else:
        # Strict: Extract title from first H1
        h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if not h1_match:
            raise ValueError(f"Missing H1 title ('# Title') in {filename}")
        metadata['title'] = h1_match.group(1).strip()
            
    return metadata

def process_directory(directory, output_file, name_label):
    items = []
    
    if os.path.exists(directory):
        for filename in os.listdir(directory):
            if filename.endswith('.md'):
                filepath = os.path.join(directory, filename)
                try:
                    metadata = parse_markdown(filepath, filename)
                    items.append(metadata)
                except Exception as e:
                    print(f"ERROR in {name_label} ({filename}): {e}")
                    # Allow building others even if one fails or decide to exit? 
                    # Existing logic exited, we will exit to be safe
                    sys.exit(1)
    else:
        print(f"Directory not found: {directory}")
        # Not fatal, just return empty? The existing logic was fatal.
        # But projects might be empty, let's just warn.
        pass
    
    # Sort by date descending
    items.sort(key=lambda x: x['date'], reverse=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        
    print(f"Index built successfully. {len(items)} {name_label} found.")

def build_theme_css(theme_file, output_file):
    if os.path.exists(theme_file):
        with open(theme_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        primary = data.get('primaryColor', '#38bdf8')
        secondary = data.get('secondaryColor', '#10b981')
        bg = data.get('backgroundColor', '#0d0f12')
        surface = data.get('surfaceColor', '#15181c')
        text_primary = data.get('textPrimary', '#e0e4eb')
        text_secondary = data.get('textSecondary', '#9aa0a6')

        css_content = f"""/* Gerado automaticamente por build_index.py a partir de content/config/theme.json */
:root {{
  --primary-color: {primary};
  --secondary-color: {secondary};
  --bg-color: {bg};
  --surface-color: {surface};
  --text-primary: {text_primary};
  --text-secondary: {text_secondary};
  --info-blue: var(--primary-color);
  --growth-green: var(--secondary-color);
}}
"""
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(css_content)
            
        print(f"Theme CSS generated successfully at {output_file}.")
    else:
        print(f"Theme file not found: {theme_file}")

def main():
    if not os.path.exists('js'):
        os.makedirs('js')

    process_directory(ARTICLES_DIR, ARTICLES_OUTPUT, "articles")
    process_directory(PROJECTS_DIR, PROJECTS_OUTPUT, "projects")
    build_theme_css(THEME_FILE, THEME_OUTPUT)

if __name__ == '__main__':
    main()
