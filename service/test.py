import time
import sys

print("before sleep")

cnt = 0
for i in range(3):
    time.sleep(1)
    cnt += 1

print("after sleep. value: {0}".format(cnt))

sys.stdout.flush()
sys.exit()