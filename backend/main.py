from openai import OpenAI
from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

manual_path = Path(__file__).parent / "manual.txt"
manual_text = manual_path.read_text(encoding="utf-8")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {"message":"こんにちはFastAPIです"}
def search_manual(question: str) -> str | None:
    """質問に関係する項目をmanual.txtから検索する。"""

    keyword_group = {
        "現金会計": ["現金","お釣り","お札","小銭","現金払い"],
        "クレジットカード決済": [
            "クレジット",
            "カード",
            "クレカ",
            "カード決済",
        ],
        "返品・交換": ["返品","交換","返金"],
    }


    sections = manual_text.split("\n\n")

    for title, keywords in keyword_groups.items():
        if any(keyword in question for keyword in keywords):
            for section in sections:
                if f"[{title}]" in section:
                    return section

    return None
@app.post("/ask")
def ask_question(data: QuestionRequest):
   
    response = client.responses.create(
        model="gpt-5.6-luna",
        input=[
            {
                "role": "system",
                "content":f"""
あなたはアパレル店舗の新人教育を支援する教育AIです。分からないことは推測せず、責任者への確認を案内してください。
 マニュアルに書かれてないことは推測で断定しないでください。
 
 [店舗マニュアル]
 {manual_text}
 """              
            },
            {
                "role": "user",
                "content": data.question
            }
        ]
    )

    return {
        "answer": response.output_text
    }
    

from pathlib import Path

manual_path = Path(__file__).parent / "manual.txt"
manual_text = manual_path.read_text(encoding="utf-8")
