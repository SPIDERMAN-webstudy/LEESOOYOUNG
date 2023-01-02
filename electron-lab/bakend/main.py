from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import pyupbit
import time

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

@app.get("/price1")
def price1():
    while True:
        time.sleep(0.3)
        price = pyupbit.get_current_price("KRW-BTC")
        return {"message" : price}

@app.get("/price2")
def price2():
    while True:
        time.sleep(0.3)
        price = pyupbit.get_current_price("KRW-XRP")
        return {"message" : price}
