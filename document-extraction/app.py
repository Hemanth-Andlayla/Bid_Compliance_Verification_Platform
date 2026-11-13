from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from extractor import extract_text_from_pdf


app = FastAPI(
    title="Bid Compliance Document Extraction Service",
    version="1.0.0"
)


class ExtractionRequest(BaseModel):

    file_path: str


class ExtractionResponse(BaseModel):

    success: bool
    extracted_text: str


@app.get("/health")
def health():

    return {
        "status": "UP"
    }


@app.post(
    "/api/extract",
    response_model=ExtractionResponse
)
def extract_document(
        request: ExtractionRequest
):

    try:

        extracted_text = extract_text_from_pdf(
            request.file_path
        )

        return ExtractionResponse(
            success=True,
            extracted_text=extracted_text
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
