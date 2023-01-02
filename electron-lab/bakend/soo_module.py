import time
import pyupbit
def soomain():
    while True:
        time.sleep(0.3)
        price = pyupbit.get_current_price("KRW-BTC")
        print(price)
def xrp_price():
    while True:
        time.sleep(0.3)
        price = pyupbit.get_current_price("KRW-XRP")
        print(price)
