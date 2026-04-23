import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """
    Establishes and returns a connection to the local MySQL database.
    Remember to update the password string below to match your local MySQL root password!
    """
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='reviewguard_db',
            user='root',
            password='Nitesh@123'
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None
