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

ticker = "BTC/USDT:USDT"
# id = "996726286262640643"
# id = "996727778377900036"
# id = "996729745569390593"
# id = "996729955125207041"
# id = 996731075457359882
id = 996738107866521601 # 성립
bitget = bitgetClass("SOOYOUNG")
orderlist = []
# bitget.long()
#### trade 불러오기 (내꺼 아닌듯)
# print(bitget.bitget.fetch_trades(ticker))
#### id로 trade 불러오기
# print(float(bitget.bitget.fetch_order_trades(id, ticker)[0]['info']['price']))
#### open_order 불러오기
# df = bitget.bitget.fetch_open_orders(ticker)
# for i in df:
#     if i['side'] == 'buy':
#         orderlist.append({'id': i['id'], 'price':i['price']})
#     orderlist = sorted(orderlist, key=(lambda x: x['price'])) # 롱기준 정렬
# orderlist = sorted(orderlist, key=(lambda x: x['price']), reverse=True) # 숏기준 정렬
# print(orderlist)
print(bitget.bitget.fetch_position(ticker))
print(bitget.bitget.fetch_position(ticker)['info']['available'])
# bitget.balance()
# bitget.buy()
# bitget.sell()
