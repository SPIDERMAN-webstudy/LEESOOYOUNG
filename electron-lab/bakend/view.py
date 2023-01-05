from csv import excel_tab
from operator import index
import pandas as pd
import pandas_ta as ta
import numpy as np
import math
import ccxt
import os
import time
import datetime as dt
from pytz import timezone
import telegram  # pip install python-telegram-bot
import traceback
import sys
from PyQt5.QtWidgets import*
from PyQt5.QtCore import *
from PyQt5 import uic
from PyQt5.QtGui import *
import pprint
pp = pprint.PrettyPrinter(indent=4)

"""
This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
Credits go to the script https://www.tradingview.com/script/q23anHmP-VuManChu-Swing-Free/
and the original script Range Filter DonovanWall https://www.tradingview.com/script/lut7sBgG-Range-Filter-DW/
"""

# pyinstaller -F -w --icon=icon.ico RayBitget_221013_SK.py
# spec파일 두번째 줄에 ui = [ ('RayBitget_220930.ui', '.') ] 추가, datas = ui,로 수정
# pyinstaller RayBitget_221013_SK.spec

NAME = "RayBitget_221013_test"

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(
        os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

form = resource_path('RayBitget_220930.ui')
form_class = uic.loadUiType(form)[0]

class bitgetClass():
    def __init__(self, parent, ticker, leverage, interval, money, textBrowserAppend, bot, mc):
        self.textBrowserAppend = textBrowserAppend
        # with open("API.txt", 'r') as file:
        #     API_KEYS = file.read().splitlines()
        # bitget_access = API_KEYS[0].split('=')[1]
        # bitget_secret = API_KEYS[1].split('=')[1]

        # 동현
        access = 'bg_d789fcbeae7166877488b5f46594323b'
        secret = '4c25adffd01af645ea8e92876cc36a27ed71b67f48eb713eb7cf797c726ef2d0'
        passphrase = "258123456dd"
        
        self.bot = bot
        self.mc = mc

        self.bitget = ccxt.bitget({
            'apiKey': access,
            'secret': secret,
            'password' : passphrase,
            'options': {
                'defaultType': 'swap'
                }
            }
        )
        # print(bitget_access, bitget_secret)
        try:
            self.bitget.set_leverage(str(leverage), ticker + "USDT_UMCBL")
        except:
            self.textBrowserAppend.emit('log', f"API가 올바르지 않습니다. 프로그램이 정지됩니다.")
            time.sleep(5)
            with open("log.txt", "a") as f:
                self.now = dt.datetime.now(timezone('Asia/Seoul'))
                now_time = self.now.strftime('===============%Y-%m-%d %H:%M:%S===============')
                msg = f"{NAME}\n{now_time}\n{traceback.format_exc()}\n"
                f.write(msg)
            # if len(msg) > 4096:
            #     for x in range(0, len(msg), 4096):
            #         # self.bot.send_message(self.mc, msg[x:x+4096])
            # else:
            #     # self.bot.send_message(self.mc, msg)
            raise Exception('API가 올바르지 않습니다.')
        print("API 정상")
        self.parent = parent
        self.textBrowserAppend.emit('log', f"API 연결 성공")
        self.df = None
        self.ticker = ticker + "USDT_UMCBL"
        self.ticker_only = ticker

        self.leverage = leverage
        self.size = money
        self.buy_bool = False
        self.holding = False
        self.liq_pos = None
        self.liq_neg = None
        self.current_price = None
        self.df = None

        self.status = "not holding"

        self.interval = interval
        self.check_new_bong_bool = False
        self.last_bong_time = None

        self.stop_per = 0
        self.trail_per = 0
        self.minimum_per = 0
        self.offset_per = 0
        self.swing_period = 0
        self.swing_multiplier = 0

        self.stop_point = 0
        self.trail_point = 0
        self.minimum_point = 0
        self.offset = 0

        self.minimum_on = False
        self.trail_on = False

        self.reason = ""
        self.amount = 0


    def range_size(self, df: pd.DataFrame, range_period: float, range_multiplier: int):
        wper = range_period * 2 - 1
        # last candle is last index, not 0
        average_range = ta.ema(df.diff().abs(), range_period)
        AC = ta.ema(average_range, wper) * range_multiplier
        return AC

    def range_filter(self, x: pd.DataFrame, r: pd.DataFrame) -> pd.DataFrame:
        range_filt = x.copy()
        hi_band = x.copy()
        lo_band = x.copy()
        for i in range(x.size):
            if i < 1:
                continue
            if math.isnan(r[i]):
                continue
            if x[i] > self.nz(range_filt[i - 1]):
                if x[i] - r[i] < self.nz(range_filt[i - 1]):
                    range_filt[i] = self.nz(range_filt[i - 1])
                else:
                    range_filt[i] = x[i] - r[i]
            else:
                if x[i] + r[i] > self.nz(range_filt[i - 1]):
                    range_filt[i] = self.nz(range_filt[i - 1])
                else:
                    range_filt[i] = x[i] + r[i]
            hi_band[i] = range_filt[i] + r[i]
            lo_band[i] = range_filt[i] - r[i]
        return hi_band, lo_band, range_filt

    def nz(self, x) -> float:
        res = x
        if math.isnan(x):
            res = 0.0
        return res

    def update_df(self):
        # 설정 잘 해야함
        if self.interval == "1m":
            interval = 1
        elif self.interval == "3m":
            interval = 3
        elif self.interval == "5m":
            interval = 5
        elif self.interval == "15m":
            interval = 15
        elif self.interval == "30m":
            interval = 30
        elif self.interval == "1h":
            interval = 60 
        elif self.interval == "2h":
            interval = 120
        elif self.interval == "4h":
            interval = 240
        elif self.interval == "6h":
            interval = 360
        elif self.interval == "8h":
            interval = 480
        elif self.interval == "12h":
            interval = 720
        elif self.interval == "1d":
            interval = 1440

        time_ms = interval * 60000
        for i in range(1,5):
            try:
                data1 = self.bitget.fetch_ohlcv(self.ticker, self.interval)
                timestamp = data1[0][0]
                until = timestamp - time_ms 

                data2 = self.bitget.fetch_ohlcv(self.ticker, self.interval,params={'startTime': until - 100*time_ms, 'endTime': until}) #100개가 최대
                timestamp = data2[0][0]
                until = timestamp - time_ms 

                data3 = self.bitget.fetch_ohlcv(self.ticker, self.interval,params={'startTime': until - 100*time_ms, 'endTime': until})
                df1 = pd.DataFrame(data1, columns=['Time', 'Open', 'High', 'Low', 'Close', 'Volume'])
                df2 = pd.DataFrame(data2, columns=['Time', 'Open', 'High', 'Low', 'Close', 'Volume'])
                df3 = pd.DataFrame(data3, columns=['Time', 'Open', 'High', 'Low', 'Close', 'Volume'])
                df4 = pd.concat([df3, df2], ignore_index=True)
                self.df = pd.concat([df4, df1], ignore_index=True)
                break
            except:
                print(traceback.format_exc())
                time.sleep(2*i)
                if i >= 4:
                    with open("log.txt", "a") as f:
                        self.now = dt.datetime.now(timezone('Asia/Seoul'))
                        now_time = self.now.strftime('===============%Y-%m-%d %H:%M:%S===============')
                        f.write(f"{NAME}\n{now_time}\n[update_df] {traceback.format_exc()}\n")
                    raise Exception('서버가 불안정합니다.')
                

        # df = pd.DataFrame(data1, columns=['Time', 'Open', 'High', 'Low', 'Close', 'Volume'])
        self.df['Date_Time'] = pd.to_datetime(self.df['Time'], unit='ms')
        pd.set_option('display.max_rows', len(self.df))

        #  VumanChu Indicator params

        range_period =  self.swing_period
        range_multiplier = self.swing_multiplier
        smrng = self.range_size(self.df['Close'], range_period, range_multiplier)
        hi_band, lo_band, range_filt = self.range_filter(self.df['Close'], smrng)

        #  Add to df
        self.df['hi_band'] = hi_band
        self.df['lo_band'] = lo_band
        self.df['range_filter'] = range_filt

        #  Add conditions
        self.df['up_trend'] = np.where((self.df['range_filter'] > self.df['range_filter'].shift()), 1, 0)
        self.df['down_trend'] = np.where((self.df['range_filter'] < self.df['range_filter'].shift()), 1, 0)
        self.df['up_trend_price'] = np.where((self.df['range_filter'] > self.df['range_filter'].shift()), self.df['Close'], np.nan)
        self.df['down_trend_price'] = np.where((self.df['range_filter'] < self.df['range_filter'].shift()), self.df['Close'], np.nan)

        #  Signals
        # longCond
        self.df['long_entry'] = np.where(((self.df['Close'] > self.df['range_filter']) & (self.df['Close'] > self.df['Close'].shift()) & (self.df['up_trend'] > 0)) | \
                            ((self.df['Close'] > self.df['range_filter']) & (self.df['Close'] < self.df['Close'].shift()) & (self.df['up_trend'] > 0)), True, False)
        # shortCond
        self.df['short_entry'] = np.where(((self.df['Close'] < self.df['range_filter']) & (self.df['Close'] < self.df['Close'].shift()) & (self.df['down_trend'] > 0)) | \
                            ((self.df['Close'] < self.df['range_filter']) & (self.df['Close'] > self.df['Close'].shift()) & (self.df['down_trend'] > 0)), True, False)


        self.df['direction'] = np.where((self.df['long_entry'] == True) & (self.df['long_entry'].shift() == False), 'buy', np.where((self.df['short_entry'] == True) & (self.df['short_entry'].shift() == False), 'sell', None))
        self.df['direction'].fillna(method = 'ffill', inplace=True)

        self.df['signal'] = np.where((self.df['direction'] == 'buy') & (self.df['direction'].shift() == 'sell'), 'Long', np.where((self.df['direction'] == 'sell') & (self.df['direction'].shift() == 'buy'), 'Short', None))

        print(self.df.tail(3))
        # self.parent.label_trend.setText("상승" if str(self.df['direction'].iloc[-1]) == 'buy' else "하락")


    def check_new_bong(self):
        #봉 변경 확인
        if self.last_bong_time < self.df['Time'].iloc[-1]:
            self.last_bong_time = self.df['Time'].iloc[-1]
            self.check_new_bong_bool = True
            self.first_bong_bool = False
            print("YES new bong!")
        else:
            print("NOT new bong..")

    def buy(self, reduce_only=False):
        if reduce_only == False:
            orderbook = self.bitget.fetch_order_book(self.ticker)
            ask_price = float(orderbook['asks'][0][0])
            amount = round(self.size * self.leverage / ask_price, 3)
            self.amount = amount
        else:
            amount = self.amount

        for i in range(1,5):
            if i == 4:
                self.textBrowserAppend.emit('log', f"[매수 재시도 3회 실패]")
            try:
                b = self.bitget.create_order(symbol=self.ticker, type="market", side="buy", amount=amount, params={"reduceOnly": reduce_only})
                print(b)
                if reduce_only:
                    self.status = "not holding"
                else:
                    self.status = "long"
                self.first_bong_bool = True
                order_id = b['info']['orderId']
                self.holding = True
                self.df.tail(3).to_csv('history_df.csv', mode='a', index=False, header=False)
                break
            except Exception as e:
                with open("response.txt", "a") as f:
                    cur_time = dt.datetime.now(timezone('Asia/Seoul')).strftime('===============%Y-%m-%d %H:%M:%S===============')
                    msg = f"{NAME}{cur_time}{traceback.format_exc()}\n"
                    f.write(msg)
                self.textBrowserAppend.emit('log', f"매수 오류 {i*3}초 후 재시도 | {e}")
                time.sleep(i*3)

        for i in range(1,5):
            if i == 4:
                self.textBrowserAppend.emit('log', f"[주문 정보 재시도 3회 실패]")
            try:
                time.sleep(0.5)
                o = self.bitget.fetch_order(order_id, self.ticker)
                print(o)

                # {'info': {'symbol': 'BTCUSDT_UMCBL', 'size': '0.005', 'orderId': '958148425134268418', 'clientOid': 'CCXT#39e3aa6da78a08ffff35ef', 'filledQty': '0.005', 'fee': '-0.03778900', 'price': None, 'priceAvg': '18894.50', 'state': 'filled', 'side': 'open_long', 'timeInForce': 'normal', 'totalProfits': '0E-8', 'posSide': 'long', 'marginCoin': 'USDT', 'filledAmount': '94.4725', 'orderType': 'market', 'leverage': '10', 'marginMode': 'crossed', 'cTime': '1664166306775', 'uTime': '1664166306867'}, 'id': '958148425134268418', 'clientOrderId': 'CCXT#39e3aa6da78a08ffff35ef', 'timestamp': 1664166306775, 'datetime': '2022-09-26T04:25:06.775Z', 'lastTradeTimestamp': 1664166306867, 'symbol': 'BTC/USDT:USDT', 'type': 'market', 'timeInForce': 'IOC', 'postOnly': None, 'side': 'buy', 'price': 18894.5, 'stopPrice': None, 'average': 18894.5, 'cost': 94.4725, 'amount': 0.005, 'filled': 0.005, 'remaining': 0.0, 'status': 'closed', 'fee': None, 'trades': [], 'fees': []}
                fullpath = os.path.abspath('./history.xlsx')
                df = pd.read_excel(fullpath)

                df2 = pd.DataFrame(
                    [[
                        dt.datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S'),
                        o['info']['orderId'],
                        o['info']['symbol'],
                        float(o['info']['size']),
                        o['info']['side'],
                        float(o['info']['fee']),
                        float(o['info']['totalProfits']),
                        float(o['info']['priceAvg']),
                        self.reason
                    ]],
                    columns=["time", "order_id", "symbol", "size", "side", "fee", "profit", "price", "reason"])
                df = df.append(df2)
                df.to_excel('./history.xlsx', index=False)

                self.avg_price = float(o['info']['priceAvg'])

                self.stop_point = self.avg_price * self.stop_per / 100
                self.trail_point = self.avg_price * self.trail_per / 100
                self.minimum_point = self.avg_price * self.minimum_per / 100
                self.offset = self.avg_price * self.offset_per / 100

                if not reduce_only:
                    self.textBrowserAppend.emit('log', f"LONG 주문 완료 | {amount}개 @ {self.avg_price}")
                    #self.bot.send_message(self.mc,f"{NAME}\nLONG 주문 완료 | {amount}개 @ {self.avg_price}")
                    self.stop_price = self.avg_price - self.stop_point
                    self.trail_price = self.avg_price + self.trail_point
                    self.high = self.trail_price
                    self.minimum_on = False
                    self.trail_on = False
                    self.minimum_price = self.avg_price + self.minimum_point
                    self.minimum_price_2 = self.minimum_price + self.minimum_point
                    
                    return self.avg_price
                else:
                    self.textBrowserAppend.emit('log', f"SHORT 청산 주문 완료 | {amount}개 @ {self.avg_price}")
                    #self.bot.send_message(self.mc,f"{NAME}\n{self.reason} : SHORT 청산 주문 완료 | {amount}개 @ {self.avg_price}")
                    
                    self.amount = float(o['info']['size'])
                    return


            except Exception as e:
                self.textBrowserAppend.emit('log', f"주문 정보 오류 {i*3}초 후 재시도 | {e}")
                time.sleep(i*3)


    def sell(self, reduce_only=False):
        if reduce_only == False:
            orderbook = self.bitget.fetch_order_book(self.ticker)
            bid_price = float(orderbook['bids'][0][0])
            amount = round(self.size * self.leverage / bid_price, 3)
            self.amount = amount
        else:
            amount = self.amount


        for i in range(1,5):
            if i == 4:
                self.textBrowserAppend.emit('log', f"[매도 재시도 3회 실패]")
            try:
                s = self.bitget.create_order(symbol=self.ticker, type="market", side="sell", amount=amount, params={"reduceOnly": reduce_only})
                print(s)
                if reduce_only:
                    self.status = "not holding"
                else:
                    self.status = "short"
                self.first_bong_bool = True
                order_id = s['info']['orderId']
                self.holding = True
                self.df.tail(3).to_csv('history_df.csv', mode='a', index=False, header=False)
                break
            except Exception as e:
                with open("response.txt", "a") as f:
                    cur_time = dt.datetime.now(timezone('Asia/Seoul')).strftime('===============%Y-%m-%d %H:%M:%S===============')
                    msg = f"{NAME}{cur_time}{traceback.format_exc()}\n"
                    f.write(msg)
                self.textBrowserAppend.emit('log', f"매도 오류 {i*3}초 후 재시도 | {e}")
                time.sleep(i*3)

        for i in range(1,5):
            if i == 4:
                self.textBrowserAppend.emit('log', f"[매도 정보 재시도 3회 실패]")
            try:
                time.sleep(0.5)
                o = self.bitget.fetch_order(order_id, self.ticker)
                print(o)
                fullpath = os.path.abspath('./history.xlsx')
                df = pd.read_excel(fullpath)

                df2 = pd.DataFrame(
                    [[
                        dt.datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S'),
                        str(o['info']['orderId']),
                        o['info']['symbol'],
                        float(o['info']['size']),
                        o['info']['side'],
                        float(o['info']['fee']),
                        float(o['info']['totalProfits']),
                        float(o['info']['priceAvg']),
                        self.reason

                    ]],
                    columns=["time", "order_id", "symbol", "size", "side", "fee", "profit", "price", "reason"])

                df = df.append(df2)
                df.to_excel('./history.xlsx', index=False)

                self.avg_price = float(o['info']['priceAvg'])

                self.stop_point = self.avg_price * self.stop_per / 100
                self.trail_point = self.avg_price * self.trail_per / 100
                self.minimum_point = self.avg_price * self.minimum_per / 100
                self.offset = self.avg_price * self.offset_per / 100

                if not reduce_only:
                    self.textBrowserAppend.emit('log', f"SHORT 주문 완료 | {amount}개 @ {self.avg_price}")
                    #self.bot.send_message(self.mc,f"{NAME}\nSHORT 주문 완료 | {amount}개 @ {self.avg_price}")
                    self.stop_price = self.avg_price + self.stop_point
                    self.trail_price = self.avg_price - self.trail_point
                    self.low = self.trail_price
                    self.minimum_on = False
                    self.trail_on = False
                    self.minimum_price = self.avg_price - self.minimum_point
                    self.minimum_price_2 = self.minimum_price - self.minimum_point

                    return self.avg_price
                else:
                    self.textBrowserAppend.emit('log', f"LONG 청산 주문 완료 | {amount}개 @ {self.avg_price}")
                    #self.bot.send_message(self.mc,f"{NAME}\n{self.reason} : LONG 청산 주문 완료 | {amount}개 @ {self.avg_price}")
                    self.amount = float(o['info']['size'])
                    return
            except Exception as e:
                self.textBrowserAppend.emit('log', f"매도 정보 오류 {i*3}초 후 재시도 | {e}")
                time.sleep(i*3)


    def liquidate_all(self):
        self.now = dt.datetime.now(timezone('Asia/Seoul'))
        time_now = self.now.strftime('===============%Y-%m-%d %H:%M:%S===============')
        self.textBrowserAppend.emit('log', f"{time_now}")
        if self.status == "long":
            self.sell(reduce_only=True)
        elif self.status == "short":
            self.buy(reduce_only=True)
        self.holding = False

    def update_margin(self):
        self.avg_buy_price = float([i for i in self.bitget.fetch_balance()['info'] if i['currency'] == self.ticker_only][0]['avg_buy_price'])
        self.current_price = self.bitget.fetch_ticker(self.ticker)['last']
        self.margin_per = (self.current_price - self.avg_buy_price) / self.avg_buy_price * 100

    def take_profit(self):
        if self.status == "long":
            pass
        elif self.status == "short":
            pass
        self.update_margin()
        if self.liq_pos <= self.margin_per or self.margin_per <= self.liq_neg:
            self.sell()

    def check_liquidation(self, check_minimum):
        for i in range(1, 6):
            try:
                orderbook = self.bitget.fetch_order_book(self.ticker)
                break
            except:
                self.textBrowserAppend.emit('log', f"호가 정보 오류 {i*2}초 후 재시도")
                time.sleep(i*2)
            
        ask_price = orderbook['asks'][0][0]
        bid_price = orderbook['bids'][0][0]

        if self.status == "long":
            price = bid_price

            if price >= self.trail_price:
                self.trail_on = True
                self.high = max(self.high, price)

            self.trail_stop_price = self.high - self.offset

            if check_minimum:
                if price >= self.minimum_price:
                    self.minimum_on = True
                    self.minimum_price_2 = self.minimum_price + self.minimum_point

                if price >= self.minimum_price_2:
                    self.textBrowserAppend.emit('log', f"[최소익절값 갱신 {self.minimum_price_2}]")
                    self.minimum_price = self.minimum_price_2
                    self.minimum_price_2 = self.minimum_price + self.minimum_point
                
            if price <= self.stop_price:
                self.reason = "stop loss"
                self.textBrowserAppend.emit('log', f"[STOP LOSS] {self.stop_price} 이하로 내려감")
                self.liquidate_all()

            if self.trail_on and price <= self.trail_stop_price:
                self.reason = "trailing stop"
                self.textBrowserAppend.emit('log', f"[TRAILING STOP] {self.trail_stop_price} 이하로 내려감")
                self.liquidate_all()

            if self.minimum_on and price <= self.minimum_price:
                self.reason = "minimum profit"
                self.textBrowserAppend.emit('log', f"[MINIMUM PROFIT] {self.minimum_price} 이하로 내려감")
                self.liquidate_all()

        elif self.status == "short":
            price = ask_price

            if price <= self.trail_price:
                self.trail_on = True
                self.low = min(self.low, price)
            self.trail_stop_price = self.low + self.offset

            if check_minimum:
                if price <= self.minimum_price:
                    self.minimum_on = True
                    self.minimum_price_2 = self.minimum_price - self.minimum_point

                if price <= self.minimum_price_2:
                    self.textBrowserAppend.emit('log', f"[최소익절값 갱신 {self.minimum_price_2}]")
                    self.minimum_price = self.minimum_price_2
                    self.minimum_price_2 = self.minimum_price - self.minimum_point

            if price >= self.stop_price:
                self.reason = "stop loss"
                self.textBrowserAppend.emit('log', f"[STOP LOSS] {self.stop_price} 이상으로 올라감")
                self.liquidate_all()

            if self.trail_on and price >= self.trail_stop_price:
                self.reason = "trailing stop"
                self.textBrowserAppend.emit('log', f"[TRAILING STOP] {self.trail_stop_price} 이상으로 올라감")
                self.liquidate_all()

            if self.minimum_on and price >= self.minimum_price:
                self.reason = "minimum profit"
                self.textBrowserAppend.emit('log', f"[MINIMUM PROFIT] {self.minimum_price} 이상으로 올라감")
                self.liquidate_all()


class WindowClass(QMainWindow, form_class):
    def __init__(self):
        super().__init__()
        self.setupUi(self)
        self.th1 = Thread1(self)
        self.setWindowTitle(f"{NAME}")
        self.pushButton.clicked.connect(self.power)
        self.th1.textBrowserAppend.connect(self.appendText)

    def power(self, checked):
        print('power in')
        if checked:
            print('checked in')
            self.th1.start()
            self.th1.stop_signal = False
            self.lineEdit_ticker.setEnabled(False)
            self.comboBox_bong.setEnabled(False)
            self.spinBox_leverage.setEnabled(False)
            self.spinBox_size.setEnabled(False)
            self.doubleSpinBox_stop_per.setEnabled(False)
            self.doubleSpinBox_trail_per.setEnabled(False)
            self.doubleSpinBox_minimum_per.setEnabled(False)
            self.doubleSpinBox_offset_per.setEnabled(False)
            self.spinBox_period.setEnabled(False)
            self.doubleSpinBox_mul.setEnabled(False)


            self.pushButton.setText("STOP")
            # self.pushButton.setStyleSheet('''QPushButton{
            #                                         color: white;
            #                                         background-color: #dd5050;
            #                                         font: 750 12pt;
            #                                     }
            #                                     ''')
        else:
            print('else in')
            self.th1.stop_signal = True

            self.lineEdit_ticker.setEnabled(True)
            self.comboBox_bong.setEnabled(True)
            self.spinBox_leverage.setEnabled(True)
            self.spinBox_size.setEnabled(True)
            self.doubleSpinBox_stop_per.setEnabled(True)
            self.doubleSpinBox_trail_per.setEnabled(True)
            self.doubleSpinBox_minimum_per.setEnabled(True)
            self.doubleSpinBox_offset_per.setEnabled(True)
            self.spinBox_period.setEnabled(True)
            self.doubleSpinBox_mul.setEnabled(True)

            self.pushButton.setText("START")
            # self.pushButton.setStyleSheet('''QPushButton{
            #                                         color: white;
            #                                         background-color: rgb(131, 131, 131);
            #                                         font: 750 12pt;
            #                                     ''')

    @pyqtSlot(str, str)
    def appendText(self, browser_name, str):
        if browser_name == 'log':
            Browser = self.textBrowser_log
        Browser.append(str)

class Thread1(QThread): #Thread
    textBrowserAppend = pyqtSignal(str, str)
    def __init__(self, parent):
        try:
            super().__init__(parent)
            self.parent = parent
            self.stop_signal = False
            bot_token = '5466439395:AAGOWiypJ85dC66AvBmncvJeN2XW5NCHPus'
            self.mc = '-1001890873889'
            self.bot = telegram.Bot(bot_token)
            
        except:
            self.except_function()
            return

    def run(self):
        try:
            fullpath = os.path.abspath('./history.xlsx')
            if not os.path.exists(fullpath):
                df = pd.DataFrame()
                df.to_excel('./history.xlsx', index=False)


            ticker = self.parent.lineEdit_ticker.text()
            interval = self.parent.comboBox_bong.currentText()
            leverage = self.parent.spinBox_leverage.value() 
            size = self.parent.spinBox_size.value()
            stop_per = self.parent.doubleSpinBox_stop_per.value()
            trail_per = self.parent.doubleSpinBox_trail_per.value()
            minimum_per = self.parent.doubleSpinBox_minimum_per.value()
            offset_per = self.parent.doubleSpinBox_offset_per.value()
            swing_period = self.parent.spinBox_period.value()
            swing_multiplier = self.parent.doubleSpinBox_mul.value()



            self.bitget = bitgetClass(self.parent, ticker,leverage, interval, size, self.textBrowserAppend, self.bot, self.mc)
            self.bitget.stop_per = stop_per
            self.bitget.trail_per = trail_per
            self.bitget.minimum_per = minimum_per
            self.bitget.offset_per = offset_per
            self.bitget.swing_period = swing_period
            self.bitget.swing_multiplier = swing_multiplier

            self.bitget.update_df()
            fullpath = os.path.abspath('./history_df.csv')
            if not os.path.exists(fullpath):
                self.bitget.df.tail(1).to_csv('./history_df.csv', index=False)
            self.bitget.last_bong_time = self.bitget.df['Time'].iloc[-1]
            while True:
                if self.stop_signal:
                    return
                if not self.bitget.check_new_bong_bool:
                    print('=====프로그램 대기중=====')
                    self.bitget.update_df()
                    self.bitget.check_new_bong()
                else:
                    break
                time.sleep(0.5)
        except:
            self.except_function()
            return

        try:
            while True:
                if self.stop_signal:
                    return
                #check new bong
                #if new bong:
                    #update df
                    #if df['signal'].iloc[-2] == 'long':
                        #if holding:
                            #liquidate
                        #buy
                    #if df['signal'].iloc[-2] == 'short':
                        #if holding:
                            #liquidate
                        #sell
                #if holding:
                    #if new bong:
                        #check_minimum = True

                    #update_margin

                    ######################
                    #stop_price = avg_price - stop
                    #trail_price = avg_price + trail
                    #high = trail_price
                    #minimum_on = False
                    #minimum_price = avg_price - minimum

                    #if price > trail_price:
                        #high = max(high, price)
                        #trail_stop_price = high - offset

                    #if price <= stop_price or price <= trail_stop_price or (minimum_on and price <= minimum_price):
                        #liquidate

                    #if check_minimum:
                        #if price >= minimum_price:
                            #minimum_on = True

                self.bitget.update_df()
                self.bitget.check_new_bong()

                if self.bitget.check_new_bong_bool:
                    self.bitget.update_df()

                    ########### TEST 에용 ################
                    # if True:
                    #     if self.bitget.holding:
                    #         import pdb; pdb.set_trace()
                    #         self.bitget.liquidate_all() 
                    #     self.bitget.buy()

                    if self.bitget.df['signal'].iloc[-2] == "Long":
                        if self.bitget.status != 'long':
                            self.now = dt.datetime.now(timezone('Asia/Seoul'))
                            time_now = self.now.strftime('===============%Y-%m-%d %H:%M:%S===============')
                            self.textBrowserAppend.emit('log', f"{time_now}")
                            self.textBrowserAppend.emit('log', '[Long 시그널 발동]')
                            if self.bitget.holding and self.bitget.status == 'short':
                                self.textBrowserAppend.emit('log', '=보유 포지션 청산=')
                                self.bitget.reason = "change position"
                                self.bitget.liquidate_all() 
                        
                            self.textBrowserAppend.emit('log', '=OPEN LONG=')
                            self.bitget.reason = "new position"
                            self.bitget.buy()

                    if self.bitget.df['signal'].iloc[-2] == "Short":
                        if self.bitget.status != 'short':
                            self.now = dt.datetime.now(timezone('Asia/Seoul'))
                            time_now = self.now.strftime('===============%Y-%m-%d %H:%M:%S===============')
                            self.textBrowserAppend.emit('log', f"{time_now}")
                            self.textBrowserAppend.emit('log', '[Short 시그널 발동]')
                            if self.bitget.holding and self.bitget.status == 'long':
                                self.textBrowserAppend.emit('log', '=보유 포지션 청산=')
                                self.bitget.reason = "change position"
                                self.bitget.liquidate_all()
                                
                            self.textBrowserAppend.emit('log', '=OPEN SHORT=')
                            self.bitget.reason = "new position"
                            self.bitget.sell()

                    self.bitget.check_new_bong_bool = False

                if self.bitget.holding:
                    if self.bitget.first_bong_bool:
                        check_minimum = False

                    else:
                        check_minimum = True

                    self.bitget.check_liquidation(check_minimum)
                time.sleep(0.5)

        except:
            time.sleep(1)
            self.except_function()
            return

    def except_function(self):
        msg = f"{NAME} 애러 발생\n{traceback.format_exc()}\n프로그램을 종료합니다."
        with open("log.txt", "a") as f:
            self.now = dt.datetime.now(timezone('Asia/Seoul'))
            now_time = self.now.strftime('===============%Y-%m-%d %H:%M:%S===============')
            f.write(f"{NAME}\n{now_time}\n{traceback.format_exc()}\n")
        self.textBrowserAppend.emit('log', msg)
        # if len(msg) > 4096:
        #     for x in range(0, len(msg), 4096):
        #         self.bot.send_message(self.mc, msg[x:x+4096])
        # else:
        #     self.bot.send_message(self.mc, msg)

if __name__ == "__main__":
    # QApplication : 프로그램을 실행시켜주는 클래스
    app = QApplication(sys.argv)

    # WindowClass의 인스턴스 생성
    myWindow = WindowClass()

    # 프로그램 화면을 보여주는 코드
    myWindow.show()

    # 프로그램을 이벤트루프로 진입시키는(프로그램을 작동시키는) 코드
    app.exec_()