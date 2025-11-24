import sqlite3

import os

DB_PATH = os.path.join(os.path.dirname(__file__), "oceanai.db")

def show_users():
    """View all users"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("=" * 80)
    print("Registered Users")
    print("=" * 80)
    print()

    # Get all rows
    try:
        cursor.execute("SELECT id, email, full_name, is_active FROM users")
        rows = cursor.fetchall()

        if not rows:
            print("No users found.")
        else:
            # Print column headers
            print(" | ".join(f"{col:20}" for col in ["ID", "Email", "Full Name", "Is Active"]))
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
    except sqlite3.OperationalError as e:
        print(f"Error: {e}")
        print("The 'users' table may not exist yet.")


    conn.close()

if __name__ == "__main__":
    show_users()
