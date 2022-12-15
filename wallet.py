from .init import client

# Wallet generation
wallet =  client.create_wallet()

# Get a word list (for tonkeeper, tonhub etc)
seed =  wallet.export()

# Importing wallet
wallet =  client.import_wallet(seed)

# Get saved wallet from Keystore
path = wallet.path
wallet =  client.find_wallet(path)

# Getting an address
wallet.address