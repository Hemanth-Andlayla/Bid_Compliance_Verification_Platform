import fitz
import pytesseract

from PIL import Image
from io import BytesIO


def extract_text_from_pdf(file_path: str) -> str:

    document = fitz.open(file_path)

    extracted_text = []

    try:

        for page in document:

            # First try normal PDF text extraction
            text = page.get_text().strip()

            if text:
                extracted_text.append(text)
                continue

            # If no text exists, treat the page as scanned/image PDF
            pixmap = page.get_pixmap(dpi=200)

            image_bytes = pixmap.tobytes("png")

            image = Image.open(
                BytesIO(image_bytes)
            )

            ocr_text = pytesseract.image_to_string(
                image
            )

            if ocr_text.strip():
                extracted_text.append(
                    ocr_text
                )

    finally:

        document.close()

    return "\n".join(extracted_text)
