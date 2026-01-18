#!/usr/bin/env python3
"""
Hanse Nova - City Panorama Generator
Generates city panorama images using Gemini API
"""

import os
import sys
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
output_dir = Path(__file__).parent.parent / "assets" / "cities"

# City definitions based on hanse-city-artist skill
CITIES = {
    "luebeck": {
        "name": "Lübeck",
        "title": "Königin der Hanse",
        "key_elements": [
            "Holstentor (iconic red brick double gate) as central focus",
            "Seven church spires (Sieben Türme) in background skyline",
            "Red brick Gothic architecture (Backsteingotik)",
            "Busy harbor with medieval trading ships in foreground",
        ],
        "color_accent": "#8b4513",  # Brick Red
        "mood": "Powerful, prosperous, orderly",
        "unique_props": ["Salt warehouses", "Merchant carts", "Trading activity"],
    },
    "hamburg": {
        "name": "Hamburg",
        "title": "Tor zur Welt",
        "key_elements": [
            "Large busy harbor with many ships",
            "Timber warehouse buildings along the water",
            "Alster river canals",
            "Heavy crane equipment on docks",
        ],
        "color_accent": "#4a2c17",  # Dark Timber
        "mood": "Busy, cosmopolitan, foggy atmosphere",
        "unique_props": ["Nikolai church spire", "Storage houses", "Cranes"],
    },
    "danzig": {
        "name": "Danzig",
        "title": "Gold der Ostsee",
        "key_elements": [
            "Krantor (large medieval crane gate) as central focus",
            "Long Market with ornate merchant houses",
            "Amber traders with golden wares",
            "Wealthy Gothic architecture",
        ],
        "color_accent": "#c9a227",  # Coin Gold
        "mood": "Rich, magnificent, international",
        "unique_props": ["Artus Court", "Neptune fountain area", "Golden accents"],
    },
}

def generate_prompt(city_id, city_data, time_of_day="day"):
    time_desc = {
        "day": "Midday, bright sunny weather, clear blue sky",
        "night": "Night time, moonlight, torches and lanterns glowing",
        "storm": "Stormy weather, dark dramatic clouds, rough seas",
    }

    elements_text = "\n- ".join(city_data["key_elements"])
    props_text = ", ".join(city_data["unique_props"])

    return f"""
Generate a panoramic view of the medieval Hanseatic city of {city_data['name']}.

IMPORTANT: Do NOT include any text, letters, words, signs, labels, or inscriptions in the image.

Style: 16-bit pixel art style with rich details, painterly quality
Resolution: Wide panoramic view (16:9 aspect ratio)

Scene: {city_data['name']} - {city_data['title']}
Time: {time_desc.get(time_of_day, time_desc['day'])}

Required elements (MUST be clearly visible):
- {elements_text}

Additional details:
- {props_text}
- Medieval citizens and merchants
- Historical accuracy for 14th century Hanseatic period

Color emphasis: {city_data['color_accent']} as dominant architectural accent
Mood: {city_data['mood']}

Technical:
- Rich, detailed scene
- Atmospheric perspective
- Professional game art quality
- NO text or inscriptions anywhere
"""

def generate_panorama(city_id, city_data, time_of_day="day"):
    prompt = generate_prompt(city_id, city_data, time_of_day)

    print(f"\nGenerating: {city_data['name']} ({time_of_day})...")

    try:
        # Use gemini-3-pro for detailed scenes
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"]
            )
        )

        # Create city output directory
        city_dir = output_dir / city_id
        city_dir.mkdir(parents=True, exist_ok=True)

        # Extract and save image
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                output_path = city_dir / f"panorama_{time_of_day}.png"
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
    # Parse command line arguments
    city_id = sys.argv[1] if len(sys.argv) > 1 else "luebeck"
    time_of_day = sys.argv[2] if len(sys.argv) > 2 else "day"

    if city_id not in CITIES:
        print(f"Unknown city: {city_id}")
        print(f"Available cities: {', '.join(CITIES.keys())}")
        exit(1)

    print("=" * 60)
    print(f"Hanse Nova - City Panorama Generator")
    print("=" * 60)
    print(f"City: {CITIES[city_id]['name']}")
    print(f"Time: {time_of_day}")

    generate_panorama(city_id, CITIES[city_id], time_of_day)

    print("\nDone!")

if __name__ == "__main__":
    main()
