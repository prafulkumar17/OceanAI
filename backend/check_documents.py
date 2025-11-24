import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "oceanai.db")

def show_documents():
    print(f"Checking database at: {DB_PATH}")
    if not os.path.exists(DB_PATH):
        print("Database file not found!")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, filename, file_path, status FROM documents")
        rows = cursor.fetchall()
        if not rows:
            print("No documents found in database.")
        else:
            print(f"Found {len(rows)} documents:")
            print("-" * 60)
            print(f"{'ID':<5} | {'Filename':<30} | {'Status':<10}")
            print("-" * 60)
            for row in rows:
                # id, filename, file_path, status
                print(f"{row[0]:<5} | {row[1][:28]:<30} | {row[3]:<10}")
                print(f"Path: {row[2]}")
                print("-" * 60)
    except sqlite3.OperationalError as e:
        print(f"Error querying database: {e}")
        print("Table 'documents' might not exist.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    show_documents()
