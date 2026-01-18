#!/usr/bin/env python3
"""
Hanse Nova - City Graphics Test
Tests both Gemini 2.5 (no text) and Gemini 3 Pro (with text)
"""

import os
from pathlib import Path

# Load API key
env_path = Path.home() / ".claude" / "skills" / "nano-banana-pro" / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if line.startswith("GEMINI_API_KEY="):
                os.environ["GEMINI_API_KEY"] = line.strip().split("=", 1)[1]

from google import genai
from google.genai import types

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found!")
    exit(1)

client = genai.Client(api_key=api_key)

output_dir = Path(__file__).parent.parent / "assets" / "test"
output_dir.mkdir(parents=True, exist_ok=True)

# Test 1: Gemini 2.5 - explicitly NO TEXT
prompt_no_text = """
Create a WIDE HORIZONTAL PANORAMA image in 16:9 widescreen aspect ratio.

Style: 16-bit pixel art, clean pixels, limited 32-color palette

Subject: Medieval Hanseatic city of LÜBECK harbor panorama

COMPOSITION (horizontal layout):
- LEFT: Harbor with wooden docks, cargo barrels, merchants
- CENTER: The iconic HOLSTENTOR double brick gate with two round towers
- RIGHT: More harbor, ships (Koggen) with sails
- BACKGROUND: City skyline with seven church spires

IMPORTANT: Do NOT include any text, letters, words, or inscriptions in the image.
The Holstentor gate should have plain brick walls without any writing.

COLORS: Brick Red #8b4513, Baltic Blue #2d5a87, Sky #87ceeb
TIME: Golden hour, warm afternoon light

The image MUST be wide 16:9 panoramic format.
"""

# Test 2: Gemini 3 Pro - WITH text
prompt_with_text = """
Create a WIDE HORIZONTAL PANORAMA image in 16:9 widescreen aspect ratio.

Style: 16-bit pixel art, clean pixels, limited 32-color palette

Subject: Medieval Hanseatic city of LÜBECK harbor panorama

COMPOSITION (horizontal layout):
- LEFT: Harbor with wooden docks, cargo barrels, merchants
- CENTER: The iconic HOLSTENTOR double brick gate with two round towers
- RIGHT: More harbor, ships (Koggen) with sails
- BACKGROUND: City skyline with seven church spires

TEXT REQUIREMENT: The Holstentor gate must have the Latin inscription "CONCORDIA DOMI FORIS PAX" clearly readable on its facade.

COLORS: Brick Red #8b4513, Baltic Blue #2d5a87, Sky #87ceeb
TIME: Golden hour, warm afternoon light

The image MUST be wide 16:9 panoramic format.
"""

tests = [
    ("gemini-2.5-flash-image", prompt_no_text, "luebeck_no_text.png"),
    ("gemini-3-pro-image-preview", prompt_with_text, "luebeck_with_text.png"),
]

for model, prompt, filename in tests:
    print(f"\n{'='*50}")
    print(f"Testing: {model}")
    print(f"Output: {filename}")
    print("="*50)

    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"]
            )
        )

        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                output_path = output_dir / filename
                with open(output_path, "wb") as f:
                    f.write(image_data)
                print(f"SUCCESS! Saved to: {output_path}")
                break
            elif part.text is not None:
                print(f"Note: {part.text[:150]}...")
        else:
            print("No image generated")

    except Exception as e:
        print(f"ERROR: {e}")

print("\n" + "="*50)
print("Tests complete!")
