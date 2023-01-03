from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import pyupbit
import time
from soo_module import soomain, xrp_price
from pydantic import BaseModel
# uvicorn main:app --reload

class Item(BaseModel):
    signal: bool = True

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://172.30.1.87:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
def hello():
    return {"message": "안녕하세요 애플"}

@app.post("/price1")
def price1(item: Item):
    while item.signal:
        time.sleep(0.3)
        price = pyupbit.get_current_price("KRW-BTC")
        print(price)
    return price

@app.get("/price2")
def price2():
    for i in range(5):
        time.sleep(0.3)
        price = pyupbit.get_current_price("KRW-XRP")
        print(price)
