# from ton import TonlibClient
# OR
from ton.sync import TonlibClient

# Initiate module
client = TonlibClient()
TonlibClient.enable_unaudited_binaries()
client.init_tonlib()