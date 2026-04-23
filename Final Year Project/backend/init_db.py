import mysql.connector
import os

def initialize_database():
    print("Initializing Database...")
    try:
        # Connect to MySQL server without specifying a database
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='Nitesh@123'
        )
        cursor = conn.cursor()
        
        # Read the schema.sql file
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as f:
            sql_file = f.read()
            
        print("Executing schema.sql...")
        # Execute each statement
        for statement in sql_file.split(';'):
            if statement.strip():
                cursor.execute(statement)
                
        conn.commit()
        print("Database schema 'reviewguard_db' successfully created!")
        
    except Exception as e:
        print("Error initializing database:", e)
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == '__main__':
    initialize_database()
