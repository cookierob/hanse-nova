#!/usr/bin/env python3
"""
Hanse Nova - Goods Icons Generator
Generates all 5 MVP trade goods icons using Gemini API
"""

import os
from pathlib import Path
import time

# Load API key from nano-banana-pro .env
env_path = Path.home() / ".claude" / "skills" / "nano-banana-pro" / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if line.startswith("GEMINI_API_KEY="):
                os.environ["GEMINI_API_KEY"] = line.strip().split("=", 1)[1]

from google import genai
from google.genai import types

# Configure API
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found!")
    exit(1)

client = genai.Client(api_key=api_key)

# Output directory
output_dir = Path(__file__).parent.parent / "assets" / "goods"
output_dir.mkdir(parents=True, exist_ok=True)

# Goods definitions based on hanse-item-creator skill
GOODS = {
    "salt": {
        "name": "Salz",
        "description": "White crystalline salt pile in a simple wooden bowl",
        "details": "Coarse sea salt crystals heaped in a round wooden bowl, some crystals spilling over",
        "primary": "#e6e6fa",
        "secondary": "#d2b48c",
    },
    "grain": {
        "name": "Getreide",
        "description": "Golden wheat sheaves in a burlap sack",
        "details": "Open burlap sack with golden wheat grains spilling out, tied with rope",
        "primary": "#f4d03f",
        "secondary": "#8b5a2b",
    },
    "cloth": {
        "name": "Tuch",
        "description": "Folded colorful fabric bolts",
        "details": "Stack of folded fabric in red and blue colors, neatly arranged",
        "primary": "#8b0000",
        "secondary": "#1a3a5c",
    },
    "furs": {
        "name": "Pelze",
        "description": "Stacked brown animal pelts",
        "details": "Pile of luxurious brown fur pelts stacked together, soft and valuable",
        "primary": "#6b4423",
        "secondary": "#4a2c17",
    },
    "fish": {
        "name": "Fisch",
        "description": "Dried stockfish hanging or stacked",
        "details": "Dried cod fish (stockfish) typical of Hanseatic trade, silver-grey color",
        "primary": "#87ceeb",
        "secondary": "#c4a35a",
    },
}

def generate_prompt(good_id, good_data):
    return f"""
Generate a 128x128 pixel art icon for a medieval Hanseatic trading game.

IMPORTANT: Do NOT include any text, letters, words, labels, or inscriptions in the image.

Style: 16-bit pixel art, clean pixels, NO anti-aliasing, limited color palette, pixel-perfect edges

Subject: {good_data['name']} ({good_id}) - {good_data['description']}

Visual Details:
- {good_data['details']}
- Medieval/Hanseatic trade good aesthetic
- Clear silhouette, recognizable as trade goods
- Professional game asset quality

Colors (limited palette, max 8 colors):
- Primary: {good_data['primary']}
- Secondary: {good_data['secondary']}
- Plus appropriate highlights and shadows

Technical Requirements:
- Dark solid background (not transparent) for visibility
- 128x128 pixels exactly
- NO gradients, NO anti-aliasing, NO blur
- Clean pixel-perfect edges
- Item should fill ~70% of canvas, centered
"""

def generate_icon(good_id, good_data):
    prompt = generate_prompt(good_id, good_data)

    print(f"\nGenerating: {good_data['name']} ({good_id})...")

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"]
            )
        )

        # Extract and save image
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                output_path = output_dir / f"{good_id}.png"
                with open(output_path, "wb") as f:
                    f.write(image_data)
                print(f"  SUCCESS! Saved to: {output_path}")
                return True

        print(f"  No image in response")
        return False

    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def main():
    print("=" * 60)
    print("Hanse Nova - Goods Icons Generator")
    print("=" * 60)
    print(f"Output directory: {output_dir}")
    print(f"Generating {len(GOODS)} icons...")

    success_count = 0
    for good_id, good_data in GOODS.items():
        if generate_icon(good_id, good_data):
            success_count += 1
        # Small delay to avoid rate limiting
        time.sleep(1)

    print("\n" + "=" * 60)
    print(f"Complete! {success_count}/{len(GOODS)} icons generated successfully.")
    print("=" * 60)

if __name__ == "__main__":
    main()
