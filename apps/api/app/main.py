from fastapi import FastAPI


app = FastAPI(
    title="Surang Saathi API",
    version="0.1.0",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "surang-saathi-api",
    }
