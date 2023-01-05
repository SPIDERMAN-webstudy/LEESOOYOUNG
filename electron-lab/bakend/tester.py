import time
from threading import Thread
from soo_module import bitgetClass
# uvicorn main:app --reload

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

bitget = bitgetClass("SOOYOUNG")
# bitget.balance()
# bitget.buy()
# bitget.sell()
