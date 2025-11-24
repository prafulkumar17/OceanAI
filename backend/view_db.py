"""
Simple script to view database contents
Usage: python view_db.py
"""
import sqlite3
from datetime import datetime

DB_PATH = "oceanai.db"

def format_datetime(dt_str):
    """Format datetime string for display"""
    if dt_str:
        try:
            dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except:
            return dt_str
    return "N/A"

def view_database():
    """View all tables and their contents"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("=" * 80)
    print("OCEANAI DATABASE VIEWER")
    print("=" * 80)
    print()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    if not tables:
        print("No tables found in database.")
        conn.close()
        return
    
    for (table_name,) in tables:
        print(f"\n{'=' * 80}")
        print(f"TABLE: {table_name.upper()}")
        print(f"{'=' * 80}")
        
        # Get table schema
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        # Get row count
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"Total rows: {count}\n")
        
        if count == 0:
            print("(No data)")
            continue
        
        # Get all rows
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        # Print column headers
        print(" | ".join(f"{col:20}" for col in column_names))
        print("-" * 80)
        
        # Print rows
        for row in rows:
            formatted_row = []
            for i, val in enumerate(row):
                if val is None:
                    formatted_val = "NULL"
                elif isinstance(val, str) and len(val) > 30:
                    formatted_val = val[:27] + "..."
                else:
                    formatted_val = str(val)
                formatted_row.append(f"{formatted_val:20}")
            print(" | ".join(formatted_row))
    
    conn.close()
    print("\n" + "=" * 80)
    print("End of database view")
    print("=" * 80)

if __name__ == "__main__":
    try:
        view_database()
    except FileNotFoundError:
        print(f"❌ Error: Database file '{DB_PATH}' not found!")
        print("Make sure you're running this from the backend directory.")
    except Exception as e:
        print(f"❌ Error: {e}")

