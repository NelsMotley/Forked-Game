import pandas as pd
import sqlite3

df_csv = pd.read_csv("Final-scores.csv")

conn = sqlite3.connect("C:\\forkle2\\PitchforkData\\database.sqlite")

df_sqlite = pd.read_sql_query("SELECT * FROM artists", conn)


merged_df = pd.merge(
    df_sqlite,
    df_csv,
    on="artist",
    how="inner"
)
print(merged_df.head())

merged_df.to_sql("Merged_artist", conn, index=False)

conn.close()

