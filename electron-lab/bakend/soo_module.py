import time
import pyupbit
def soomain(item):
    # while True:
    for i in range(5):
        time.sleep(0.3)
        price = pyupbit.get_current_price("KRW-BTC")
        print(price)
        print(item.signal)

def xrp_price():
    # while True:
    for i in range(5):
        time.sleep(0.3)
        price = pyupbit.get_current_price("KRW-XRP")
        print(price)
