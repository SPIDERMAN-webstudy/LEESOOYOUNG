from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import pyupbit
import time
from pydantic import BaseModel
from threading import Thread
from soo_module import bitgetClass
# uvicorn main:app --reload

class Item(BaseModel):
    signal: bool = True
    ticker: str

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

class Thread1(Thread):
    def __init__(self):
        Thread.__init__(self)
        self.signal = True
        self.stopSignal = False
    def run(self):
        self.bitget = bitgetClass("SOOYOUNG")
        while True:
            if self.stopSignal == True:
                time.sleep(1)
                pass
            else:
                #### 실행내용 ####
                time.sleep(1)
    def stop(self):
        self.stopSignal = True
th1 = Thread1()

class Thread2(Thread):
    def __init__(self):
        Thread.__init__(self)
        self.signal = True
        self.stopSignal = False
    def run(self):
        while True:
            if self.stopSignal:
                time.sleep(1)
                pass
            else:
                price = pyupbit.get_current_price("KRW-XRP")
                print(price)
                time.sleep(1)
    def stop(self):
        self.stopSignal = True
th2 = Thread2()

@app.get("/hello")
def hello():
    return {"message": "안녕하세요 애플"}

@app.post("/price1")
def price1(item: Item):
    print(item.signal)
    if item.signal:
        if th1.stopSignal:
            th1.stopSignal = False
        else:
            th1.start()
    else:
        th1.stop()
        print("th1 종료")

@app.post("/price2")
def price2(item: Item):
    print(item.signal)
    if item.signal:
        if th2.stopSignal:
            th2.stopSignal = False
        else:
            th2.start()
    else:
        th2.stop()
        print("th2 종료")
