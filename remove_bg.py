from PIL import Image

def remove_black_bg(input_path, output_path):
    # Open image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    # Threshold for dark background
    new_data = []
    for item in datas:
        # Check if the pixel is quite dark
        # The background in that wax seal looks black/very dark
        r, g, b, a = item
        if r < 30 and g < 30 and b < 30:
            new_data.append((255, 255, 255, 0)) # transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_black_bg("images/wax_seal.png", "images/wax_seal.png")
