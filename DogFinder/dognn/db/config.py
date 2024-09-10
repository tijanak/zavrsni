import os
DATABASE_CONFIG = {
    'dbname': os.environ.get('NX_POSTGRES_DB'),
    'user':  os.environ.get('NX_POSTGRES_USER'),
    'password':  os.environ.get('NX_POSTGRES_PASSWORD'),
    'host':  'db',
    'port':  os.environ.get('NX_POSTGRES_PORT')
}

DATABASE_URI=f"postgresql://{DATABASE_CONFIG['user']}:{DATABASE_CONFIG['password']}@{DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}/{DATABASE_CONFIG['dbname']}"
