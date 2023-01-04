import ccxt
import time
from datetime import datetime
from pytz import timezone
import traceback

class bitgetClass():
    def __init__(self, name):
        access = 
        secret = 
        print(access, secret)
        self.bitget = ccxt.bitget({
            'apiKey': access,
            'secret': secret,
            'password': ,
            'options': {
                'defaultType': 'swap'
                },
        })
        try:
            self.df = self.bitget.fetch_balance()
            print(self.df)
        except:
            time.sleep(1)
            with open("log.txt", "a") as f:
                self.now = datetime.now(timezone('Asia/Seoul'))
                now_time = self.now.strftime('===============%Y-%m-%d %H:%M:%S===============')
                f.write(f"{name}\n{now_time}\n{traceback.format_exc()}\n")
                raise Exception('API가 올바르지 않습니다.')
        print("API 정상")
        # self.bitget.set_margin_mode("fixed") # crossed = cross, fixed = isolated
        self.name = name
        self.ticker = "TRX/USDT"
        self.bong = "1m"
        self.interval = "minute1"
        self.liq_pos = None
        self.liq_neg = None
        self.stop_per = None
        self.longer = 0
        self.shorter = 0
        self.length = 0
        self.amount = 559.1125
        self.buy_flag = False
        self.sell_flag = False
        self.holding = False
        self.current_price = None
        self.margin_per = None
        self.wallet = []
        self.trail = {}
        self.water = []
        self.mool_per = 0
        self.mool_amount = 12000
        self.total_margin = 0.0

    def balance(self):
        for i in self.df:
            print(i)

    def buy(self):
        print(self.bitget.create_limit_buy_order(self.ticker, 100, 0.05508))
    
    def sell(self):
        print(self.bitget.create_limit_sell_order(self.ticker, self.amount, 0.05565))

