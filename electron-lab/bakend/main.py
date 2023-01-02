from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import pyupbit
import time
from soo_module import soomain, xrp_price
from pydantic import BaseModel
# uvicorn main:app --reload

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
    # return {"message": soomain()}
    soomain()

@app.get("/price2")
def price2():
    # return {"message": xrp_price()}
    xrp_price()
    # while True:
    #     time.sleep(0.3)
    #     price = pyupbit.get_current_price("KRW-XRP")
    #     return {"message" : price}
