#!/usr/bin/env python3
"""
Hanse Nova - Test Image Generation
Generates a test asset using Gemini/Imagen API
"""

import os
from pathlib import Path

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

# Test prompt: Amber/Bernstein icon for Hanse Nova
prompt = """
Generate a 32x32 pixel art icon for a medieval trading game.

Style: 16-bit pixel art, clean pixels, NO anti-aliasing, limited color palette

Subject: Amber (Bernstein) - 3-4 orange translucent lumps of fossilized resin grouped together, resting on a small dark surface

Visual Requirements:
- Clear silhouette recognizable at small size
- Medieval Hanseatic trade good aesthetic
- Precious, valuable appearance
- Internal glow effect via pixel dithering

Colors (strict palette):
- Primary: #ff8c00 (orange amber)
- Secondary: #c9a227 (golden tint)
- Highlight: #ffd700 (bright spots)
- Shadow: #8b4513 (dark amber)
- Base: #2f2f2f (surface shadow)

Technical:
- Dark background
- 32x32 pixels exactly
- Pixel-perfect edges
- NO gradients, NO anti-aliasing
- Maximum 8 colors
"""

print("Generating Hanse Nova test asset: Amber/Bernstein icon...")
print("-" * 50)

# Try different models
models_to_try = [
    "gemini-2.5-flash-image",
    "gemini-3-pro-image-preview",
    "imagen-4.0-generate-001"
]

output_dir = Path(__file__).parent.parent / "assets" / "test"
output_dir.mkdir(parents=True, exist_ok=True)

for model_name in models_to_try:
    print(f"\nTrying model: {model_name}")
    try:
        if model_name.startswith("imagen"):
            # Imagen uses different API
            response = client.models.generate_images(
                model=model_name,
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                )
            )
            # Save Imagen result
            if response.generated_images:
                image_data = response.generated_images[0].image.image_bytes
                output_path = output_dir / f"bernstein_icon_{model_name.replace('.', '_')}.png"
                with open(output_path, "wb") as f:
                    f.write(image_data)
                print(f"SUCCESS! Image saved to: {output_path}")
                break
        else:
            # Gemini uses generate_content
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"]
                )
            )

            # Extract and save image
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    image_data = part.inline_data.data
                    output_path = output_dir / f"bernstein_icon_{model_name.replace('.', '_')}.png"
                    with open(output_path, "wb") as f:
                        f.write(image_data)
                    print(f"SUCCESS! Image saved to: {output_path}")
                    break
            else:
                print(f"No image in response from {model_name}")
                continue
            break

    except Exception as e:
        print(f"  Error with {model_name}: {e}")
        continue

print("\nDone!")
